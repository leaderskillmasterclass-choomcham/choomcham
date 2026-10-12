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
  // No real remote API or notification call. This checks the built frontend only.
  await page.route("https://**/*", (route) => route.abort());
  await page.goto(base + "/services");
  await page.locator("#rebirth-hero-title").waitFor();
  await page.evaluate(() => document.fonts.ready);
  const restored = [
    "hero",
    "zombie-signals",
    "pain",
    "belief",
    "rebirth-house",
    "model",
    "learning-framework",
    "why",
    "work",
  ];
  const retained = [
    "authentic-org",
    "levels",
    "programs",
    "experience",
    "clients",
    "faq",
    "about",
    "contact",
    "zombie-check",
  ];
  for (const id of [...restored, ...retained])
    assert.equal(await page.locator("#" + id).count(), 1, id);
  assert.equal(await page.locator("h1").count(), 1, "one main heading");
  for (const name of [
    "Zombie Workers",
    "Idea Graveyard",
    "Silo Division",
    "Talent Burnout",
  ])
    assert.equal(
      await page
        .locator("#pain")
        .getByRole("heading", { name, exact: true })
        .count(),
      1,
    );
  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  assert.deepEqual(duplicateIds, []);
  for (const stage of [
    "RESET",
    "RECONNECT",
    "RECHARGE",
    "REIMAGINE",
    "RECREATE",
  ]) {
    await page
      .getByRole("button", {
        name: new RegExp("^ขั้นตอน [1-5]: " + stage + "$"),
      })
      .click();
    assert.equal(
      (await page.locator("[data-model-stage]").innerText()).trim(),
      stage,
    );
  }
  const screenshotDir = process.env.QA_SCREENSHOT_DIR;
  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    for (const id of ["hero", "pain", "belief", "model"]) {
      await page
        .locator("#" + id)
        .screenshot({ path: resolve(screenshotDir, id + "-desktop.png") });
    }
  }
  const desktopLinks = await page
    .locator(".site-desktop-nav a")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  for (const href of desktopLinks.filter((href) => href.startsWith("#")))
    assert.equal(await page.locator(href).count(), 1, href);
  for (const width of [1440, 1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
      offenders: [...document.querySelectorAll("main *")]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 5)
        .map((el) => [el.tagName, el.className]),
    }));
    assert(
      dimensions.scroll <= dimensions.width,
      JSON.stringify({ width, ...dimensions }),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "เปิดเมนู", exact: true }).click();
  await page.locator("#site-mobile-nav").waitFor();
  const menuLinks = await page
    .locator("#site-mobile-nav a")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  for (const href of menuLinks.filter((h) => h.startsWith("#")))
    assert.equal(await page.locator(href).count(), 1, href);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#site-mobile-nav").count(), 0);
  await page.getByRole("button", { name: "เปิดเมนู", exact: true }).click();
  await page
    .locator("#site-mobile-nav")
    .getByRole("link", { name: "Reset → Recreate", exact: true })
    .click();
  assert.equal(new URL(page.url()).hash, "#model");
  assert.equal(await page.locator("#site-mobile-nav").count(), 0);
  if (screenshotDir) {
    await page
      .locator("#model")
      .screenshot({ path: resolve(screenshotDir, "model-mobile.png") });
    await page
      .locator("#pain")
      .screenshot({ path: resolve(screenshotDir, "pain-mobile.png") });
  }
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
    "PASS: restored/retained sections, one H1, unique IDs, five interactive stages, desktop/mobile navigation, 320–1440px overflow, and ten-question diagnostic without remote writes",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
