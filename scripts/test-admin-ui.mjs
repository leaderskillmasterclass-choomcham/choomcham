import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";
const root = resolve("build/client");
const server = createServer(async (req, res) => {
  try {
    let path = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (!path.startsWith(root)) throw new Error("invalid");
    try {
      if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
      await stat(path);
    } catch {
      path = resolve(root, "index.html");
    }
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".jpg": "image/jpeg",
    };
    res.setHeader(
      "Content-Type",
      types[extname(path)] || "application/octet-stream",
    );
    res.end(await readFile(path));
  } catch {
    res.statusCode = 500;
    res.end("test server failure");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--single-process",
            "--no-zygote",
            "--use-gl=angle",
            "--use-angle=swiftshader",
          ],
        }
      : {}),
  });
  const context = await browser.newContext({
      viewport: { width: 1440, height: 1100 },
    }),
    page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (dialog) => dialog.accept());
  let role = "SUPERADMIN",
    fail = false,
    projects = [],
    partnerRows = [];
  const privateCalls = [];
  const email = "admin@example.com",
    id = "11111111-1111-4111-8111-111111111111";
  const user = {
    id,
    email,
    email_confirmed_at: "2026-10-09",
    app_metadata: { provider: "email" },
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-10-09",
  };
  const jwt =
    [
      { alg: "HS256", typ: "JWT" },
      {
        sub: id,
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        role: "authenticated",
        email,
      },
    ]
      .map((o) => Buffer.from(JSON.stringify(o)).toString("base64url"))
      .join(".") + ".fixture";
  await page.route("https://admin-test.invalid/**", async (route) => {
    const req = route.request();
    if (
      req.method() === "DELETE" ||
      new URL(req.url()).pathname.endsWith("/logout")
    )
      return route.fulfill({
        status: 204,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    return route.fulfill({
      json: {
        access_token: jwt,
        refresh_token: "fixture",
        expires_in: 3600,
        token_type: "bearer",
        user,
      },
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  });
  await page.route("**/api/**", async (route) => {
    const req = route.request(),
      path = new URL(req.url()).pathname;
    privateCalls.push(path);
    const publicApi = ["/api/lead", "/api/program-proposal"].includes(path);
    if (!publicApi && !req.headers().authorization)
      return route.fulfill({
        status: 401,
        json: { error: "กรุณาเข้าสู่ระบบ" },
      });
    if (fail)
      return route.fulfill({
        status: 503,
        json: { error: "Isolated database unavailable" },
      });
    if (path === "/api/admin-session")
      return route.fulfill({
        json: { success: true, data: { email, name: email, role } },
      });
    if (path === "/api/users")
      return route.fulfill({
        json: { success: true, data: [{ email, role }] },
      });
    if (path === "/api/leads")
      return route.fulfill({ json: { success: true, data: [] } });
    if (path === "/api/course-designs")
      return route.fulfill({ json: { success: true, data: [] } });
    if (path === "/api/media")
      return route.fulfill({
        json: { success: true, items: [], cursor: null },
      });
    if (path === "/api/operations") {
      const resource = new URL(req.url()).searchParams.get("resource");
      if (req.method() === "GET")
        return route.fulfill({
          json: {
            success: true,
            data: resource === "projects" ? projects : partnerRows,
          },
        });
      const body = req.postDataJSON(),
        record = { ...body.document, id: body.id || id };
      if (body.resource === "projects") projects = [record];
      else partnerRows = [record];
      return route.fulfill({ json: { success: true, data: record } });
    }
    return route.fulfill({
      json: { success: true, lead: { id }, data: { id } },
    });
  });
  const paths = [
    "dashboard",
    "crm",
    "proposals",
    "courses",
    "content-studio",
    "gallery",
    "projects",
    "partners",
    "users",
  ];
  // Forged legacy localStorage identity cannot mount any protected page or read APIs.
  await page.goto(base + "/admin/dashboard");
  await page.evaluate(() =>
    localStorage.setItem(
      "choomcham_admin_user",
      JSON.stringify({ role: "SUPERADMIN", email: "fake@example.com" }),
    ),
  );
  for (const path of paths) {
    await page.goto(base + "/admin/" + path);
    await page.getByRole("link", { name: "ไปหน้าเข้าสู่ระบบ" }).waitFor();
    assert.equal(await page.locator("#admin-navigation").count(), 0);
  }
  assert.equal(privateCalls.length, 0);
  await page.goto(base + "/admin/login");
  await page.getByLabel("อีเมล", { exact: true }).fill(email);
  await page
    .getByLabel("รหัสผ่าน", { exact: true })
    .fill("isolated-fixture-password");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();
  await page.waitForURL("**/admin/dashboard");
  await page
    .getByRole("heading", { name: "Executive Overview & Analytics" })
    .waitFor();
  for (const path of paths) {
    console.log("Checking admin route:", path);
    await page.goto(base + "/admin/" + path);
    await page.locator("#admin-navigation").waitFor({ state: "visible" });
    assert.equal(
      await page.getByText("Application Error!", { exact: true }).count(),
      0,
      path,
    );
  }
  await page.goto(base + "/admin/projects");
  await page
    .getByLabel("องค์กร", { exact: true })
    .fill("Isolated organization");
  await page
    .getByLabel("ผู้รับผิดชอบ", { exact: true })
    .fill("Fixture facilitator");
  await page.getByRole("button", { name: "บันทึก", exact: true }).click();
  await page
    .getByRole("cell", { name: "Isolated organization", exact: true })
    .waitFor();
  assert.equal(projects.length, 1);
  await page.getByRole("button", { name: "แก้ไข", exact: true }).click();
  await page
    .getByLabel("องค์กร", { exact: true })
    .fill("Updated isolated organization");
  await page.getByRole("button", { name: "บันทึก", exact: true }).click();
  await page
    .getByRole("cell", { name: "Updated isolated organization", exact: true })
    .waitFor();
  assert.equal(projects.length, 1);
  await page.goto(base + "/admin/partners");
  await page.getByLabel("พาร์ทเนอร์", { exact: true }).fill("Fixture partner");
  await page.getByLabel("รหัสโครงการ (UUID)", { exact: true }).fill(id);
  await page.getByRole("button", { name: "บันทึก", exact: true }).click();
  await page
    .getByRole("cell", { name: "Fixture partner", exact: true })
    .waitFor();
  // Visible failure is never counted as an empty successful database.
  fail = true;
  await page.goto(base + "/admin/dashboard");
  await page
    .getByRole("alert")
    .filter({ hasText: "Isolated database unavailable" })
    .waitFor();
  fail = false;
  await page.goto(base + "/admin/courses");
  await page.getByRole("button", { name: "โหลดหลักสูตร / คำขอองค์กร" }).click();
  await page.getByRole("status").filter({ hasText: "โหลดหลักสูตร" }).waitFor();
  const previewDir = process.env.QA_SCREENSHOT_DIR;
  if (previewDir) {
    await mkdir(previewDir, { recursive: true });
    await page.screenshot({
      path: resolve(previewDir, "admin-desktop.png"),
      fullPage: false,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of paths) {
    await page.goto(base + "/admin/" + path);
    await page.getByRole("button", { name: /เมนูจัดการ/ }).waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "mobile overflow " + path,
    );
  }
  await page.goto(base + "/admin/courses");
  await page.locator("#design-title").waitFor();
  await page.evaluate(() => document.fonts.ready);
  if (previewDir)
    await page.screenshot({
      path: resolve(previewDir, "admin-mobile.png"),
      fullPage: false,
    });
  await page.getByRole("button", { name: "ออกจากระบบ", exact: true }).click();
  await page.waitForURL("**/admin/login");
  await page.goto(base + "/admin/dashboard");
  await page.getByRole("link", { name: "ไปหน้าเข้าสู่ระบบ" }).waitFor();
  role = "ADMIN";
  await page.goto(base + "/admin/login");
  await page.getByLabel("อีเมล", { exact: true }).fill(email);
  await page
    .getByLabel("รหัสผ่าน", { exact: true })
    .fill("isolated-fixture-password");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();
  await page.waitForURL("**/admin/dashboard");
  for (const path of ["users", "partners"]) {
    await page.goto(base + "/admin/" + path);
    await page.getByRole("alert").filter({ hasText: "Super Admin" }).waitFor();
  }
  // Public sales pages and diagnostic do not require authentication.
  for (const slug of [
    "reborn",
    "communication",
    "team",
    "leader",
    "culture",
    "from-zombie-to-living-organization",
  ]) {
    await page.goto(base + "/programs/" + slug);
    assert(await page.locator("h1").count());
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "public overflow " + slug,
    );
  }
  await page.goto(base + "/proposal");
  assert.equal(await page.getByText("185,000").count(), 0);
  await page.goto(base + "/");
  await page
    .getByRole("button", {
      name: "🧟 เริ่มทำแบบประเมิน Zombie Check™",
      exact: true,
    })
    .click();
  for (let n = 0; n < 10; n++) {
    await page.locator("#zombie-check h3[aria-live]").waitFor();
    await page
      .locator("#zombie-check button")
      .filter({ hasText: /^A/ })
      .first()
      .click();
  }
  await page.locator("#quiz-result-title").waitFor();
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "PASS: nine Admin routes, forged identity blocked, login/logout, role guards, real-state empty/error screens, project create/edit, ledger create, course loading, mobile overflow, six public sales pages and ten-question diagnostic; mocked APIs only",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
