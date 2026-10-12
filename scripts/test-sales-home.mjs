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
      path = resolve(root, "__spa-fallback.html");
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
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    }),
    page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // Only local static assets and mocked APIs; no live forms or notification writes.
  await page.route("https://**/*", (route) => route.abort());
  await page.goto(base + "/");
  await page.locator(".authentic-page h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  const rootHtml = await (await fetch(base + "/")).text();
  assert(rootHtml.includes("องค์กรมี"));
  assert(!rootHtml.includes('id="zombie-check"'));
  const servicesHtml = await (await fetch(base + "/services")).text();
  assert(servicesHtml.includes('id="zombie-check"'));
  assert(servicesHtml.includes('id="rebirth-hero-title"'));
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator(".home-page").count(), 0);
  assert.equal(
    await page.locator("form").count(),
    0,
    "sale page links to service forms",
  );
  for (const id of [
    "hero",
    "authentic-org",
    "clients",
    "framework",
    "levels",
    "meaning",
    "programs",
    "fit",
    "outcomes",
    "experience",
    "about",
    "contact",
  ])
    assert.equal(await page.locator("#" + id).count(), 1, id);
  for (const slug of ["reborn", "communication", "team", "leader", "culture"])
    assert.equal(await page.locator("#level-" + slug).count(), 1);
  assert.equal(
    await page.locator("link[rel=canonical]").getAttribute("href"),
    "https://choomcham.pages.dev/",
  );
  const ids = await page
    .locator("[id]")
    .evaluateAll((els) => els.map((e) => e.id));
  assert.equal(ids.length, new Set(ids).size);
  const localAnchors = await page
    .locator('.authentic-page a[href^="#"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  for (const hash of localAnchors)
    assert.equal(await page.locator(hash).count(), 1, hash);
  const missingImages = await page
    .locator('.authentic-page img[src^="/"]')
    .evaluateAll((els) =>
      els.filter((e) => e.complete && e.naturalWidth === 0).map((e) => e.src),
    );
  assert.deepEqual(missingImages, []);
  const screenshotDir = process.env.QA_SCREENSHOT_DIR;
  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    await page.screenshot({
      path: resolve(screenshotDir, "sales-desktop.png"),
      fullPage: false,
    });
    await page
      .locator("#levels")
      .screenshot({ path: resolve(screenshotDir, "sales-levels.png") });
  }
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const measure = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll(".authentic-page *")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 5)
        .map((e) => [e.tagName, e.className]),
    }));
    assert(measure.scroll <= width, JSON.stringify(measure));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "เปิดเมนู", exact: true }).click();
  await page.locator("#auth-mobile-nav").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#auth-mobile-nav").count(), 0);
  await page.getByRole("button", { name: "เปิดเมนู", exact: true }).click();
  await page
    .locator("#auth-mobile-nav")
    .getByRole("link", { name: "5 ระดับ", exact: true })
    .click();
  assert.equal(new URL(page.url()).hash, "#levels");
  assert.equal(await page.locator("#auth-mobile-nav").count(), 0);
  await page.goto(base + "/");
  await page.locator(".authentic-page h1").waitFor();
  if (screenshotDir)
    await page.screenshot({
      path: resolve(screenshotDir, "sales-mobile.png"),
      fullPage: false,
    });
  for (const slug of ["reborn", "communication", "team", "leader", "culture"]) {
    await page.goto(base + "/");
    await page.locator("#level-" + slug + " .auth-level-action").click();
    await page.waitForURL("**/proposal/request?program=" + slug);
    await page.locator('select[name="program_slug"]').waitFor();
    assert.equal(
      await page.locator('select[name="program_slug"]').inputValue(),
      slug,
    );
  }
  await page.goto(base + "/");
  await page.locator(".auth-header .auth-brand").waitFor();
  await page
    .locator("#contact")
    .getByRole("link", { name: "ปรึกษาโจทย์องค์กร", exact: false })
    .click();
  await page.waitForURL("**/services?inquiry=consultation#contact");
  await page
    .locator('#contact input[name="result_level"]')
    .waitFor({ state: "attached" });
  assert.equal(
    await page.locator('#contact input[name="result_level"]').inputValue(),
    "CONSULTATION",
  );
  await page.goto(base + "/services?inquiry=program#contact");
  await page
    .locator('#contact input[name="result_level"]')
    .waitFor({ state: "attached" });
  await page.waitForFunction(
    () =>
      document.querySelector('#contact input[name="result_level"]')?.value ===
      "PROGRAM_INQUIRY",
  );
  assert.equal(
    await page.locator("link[rel=canonical]").getAttribute("href"),
    "https://choomcham.pages.dev/services",
  );
  await page.goto(base + "/#zombie-check");
  await page.waitForURL("**/services#zombie-check");
  await page
    .getByRole("button", {
      name: "🧟 เริ่มทำแบบประเมิน Zombie Check™",
      exact: true,
    })
    .waitFor();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/programs/communication");
  await page.getByRole("link", { name: "เช็กพลังองค์กร", exact: true }).click();
  await page.waitForURL("**/services#zombie-check");
  await page.goto(base + "/admin/login");
  await page.getByRole("heading", { name: "เข้าสู่ระบบผู้ดูแล" }).waitFor();
  assert.equal(await page.locator(".authentic-page").count(), 0);
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "PASS: separate sales/services HTML, complete sections and five mappings, consultation/detail/proposal flows, canonical metadata, local imagery, mobile menu, 320–1440px layout, legacy anchors and direct Admin fallback; no production writes",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
