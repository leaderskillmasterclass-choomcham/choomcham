import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const port = Number(process.env.QA_PAGES_PORT || 8798),
  base = `http://127.0.0.1:${port}`;
let logs = "";
const server = spawn(
  "npx",
  [
    "wrangler",
    "pages",
    "dev",
    "build/client",
    "--port",
    String(port),
    "--ip",
    "127.0.0.1",
  ],
  { stdio: ["ignore", "pipe", "pipe"], detached: true },
);
server.stdout.on("data", (chunk) => {
  logs = (logs + chunk).slice(-8000);
});
server.stderr.on("data", (chunk) => {
  logs = (logs + chunk).slice(-8000);
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 45; attempt++) {
    try {
      const res = await fetch(base + "/", {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {}
    if (server.exitCode !== null)
      throw new Error("Pages runtime failed to start: " + logs);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert(ready, "Pages runtime did not become ready: " + logs);
  const get = async (path) => {
    const response = await fetch(base + path, { redirect: "manual" });
    const body = await response.text();
    assert.equal(response.status, 200, path);
    return { response, body };
  };
  const sales = await get("/");
  assert(sales.body.includes("องค์กรมี"));
  assert(!sales.body.includes('id="zombie-check"'));
  const services = await get("/services");
  assert(services.body.includes('id="zombie-check"'));
  for (const path of [
    "/admin/login",
    "/admin/dashboard",
    "/proposal/request",
    "/topics/team-transformation",
    "/programs/missing",
  ]) {
    const result = await get(path);
    assert(
      !result.body.includes('id="sales-main"'),
      path + " returned the sales page instead of SPA fallback",
    );
    assert(result.body.includes("__reactRouterContext"), path);
    if (path.startsWith("/admin/"))
      assert.equal(result.response.headers.get("Cache-Control"), "no-store");
  }
  const course = await get("/programs/reborn");
  assert(course.body.includes("ตัวจริงของตัวเอง"));
  for (const path of ["/api/leads", "/api/users", "/api/course-designs"]) {
    const response = await fetch(base + path);
    assert([401, 503].includes(response.status), path);
    assert.equal(response.headers.get("Content-Type"), "application/json");
  }
  console.log(
    "PASS: actual local Cloudflare Pages runtime, sales/services prerender, direct SPA routes, course HTML, private Admin headers and unauthenticated API rejection; no deployed changes or database writes",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    server.kill("SIGTERM");
  }
}
