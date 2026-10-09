import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const temp = await mkdtemp(join(tmpdir(), "admin-test-"));
try {
  const sources = [
    ["functions/lib/admin-auth.ts", "auth"],
    ["functions/_middleware.ts", "middleware"],
    ["functions/api/leads.ts", "leads"],
    ["functions/api/lead.ts", "lead"],
    ["functions/api/operations.ts", "operations"],
    ["functions/api/users.ts", "users"],
    ["functions/api/media.ts", "media"],
    ["functions/api/r2.ts", "r2"],
    ["app/lib/diagnostic.ts", "diagnostic"],
  ];
  for (const [file, name] of sources) {
    let code = await readFile(new URL("../" + file, import.meta.url), "utf8");
    code = code
      .replace(
        /import \{ createClient \} from ['"]@supabase\/supabase-js['"];?/,
        "const createClient=()=>globalThis.__adminDb;",
      )
      .replace(
        /import \{ Resend \} from ['"]resend['"];?/,
        'class Resend { emails={send:async args=>{globalThis.__emails.push(args);return {data:{id:"mail"}}}}; }',
      )
      .replace(/['"](?:\.\/lib|\.\.\/lib)\/admin-auth['"]/g, '"./auth.mjs"')
      .replace('"../../app/lib/diagnostic"', '"./diagnostic.mjs"');
    await writeFile(
      join(temp, name + ".mjs"),
      ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    );
  }
  const load = (name) => import(pathToFileURL(join(temp, name + ".mjs")));
  const { onRequest: middleware } = await load("middleware"),
    lead = await load("lead"),
    leads = await load("leads"),
    operations = await load("operations"),
    users = await load("users");
  const actor = {
    id: "11111111-1111-4111-8111-111111111111",
    email: "admin@example.com",
    email_confirmed_at: "2026-10-09",
  };
  let user = actor,
    dbError = null,
    inserted,
    updates,
    calls = 0;
  const query = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    order() {
      return this;
    },
    single() {
      return this;
    },
    insert(v) {
      inserted = v;
      return this;
    },
    update(v) {
      updates = v;
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve({
        data: dbError ? null : [{ id: actor.id }],
        error: dbError,
      }).then(resolve, reject);
    },
  };
  globalThis.__adminDb = {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: () => {
      calls++;
      return query;
    },
  };
  globalThis.__emails = [];
  const env = {
    SUPABASE_URL: "https://mock.invalid",
    SUPABASE_SERVICE_ROLE_KEY: "fixture",
    ADMIN_EMAILS: "admin@example.com",
    SUPER_ADMIN_EMAILS: "admin@example.com",
  };
  const request = (path, method = "GET", body, headers = {}) =>
    new Request("https://site.invalid" + path, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const run = (req, environment = env) =>
    middleware({
      request: req,
      env: environment,
      next: async () => new Response("private next", { status: 200 }),
    });
  for (const path of [
    "/api/leads",
    "/api/users",
    "/api/media",
    "/api/course-designs",
    "/api/operations",
    "/api/admin-session",
  ])
    assert.equal((await run(request(path))).status, 401, path);
  assert.equal(calls, 0, "unauthenticated requests cannot touch private data");
  assert.equal((await run(request("/api/leads"), {})).status, 503);
  user = { ...actor, email: "stranger@example.com" };
  assert.equal(
    (
      await run(
        request("/api/leads", "GET", undefined, {
          Authorization: "Bearer token",
        }),
      )
    ).status,
    403,
  );
  user = { ...actor, email_confirmed_at: null };
  assert.equal(
    (
      await run(
        request("/api/leads", "GET", undefined, {
          Authorization: "Bearer token",
        }),
      )
    ).status,
    401,
  );
  user = actor;
  assert.equal(
    (
      await run(
        request("/api/users", "GET", undefined, {
          Authorization: "Bearer token",
        }),
        { ...env, SUPER_ADMIN_EMAILS: "" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await run(
        request("/api/leads", "DELETE", undefined, {
          Authorization: "Bearer token",
        }),
        { ...env, SUPER_ADMIN_EMAILS: "" },
      )
    ).status,
    403,
  );
  for (const path of ["/api/lead", "/api/program-proposal", "/api/r2?key=file"])
    assert.equal((await run(request(path))).status, 200);
  assert.equal(
    (
      await run(
        request("/api/lead", "POST", {}, { Origin: "https://evil.invalid" }),
      )
    ).status,
    403,
  );
  const guarded = await run(
    request("/api/leads", "GET", undefined, { Authorization: "Bearer token" }),
  );
  assert.equal(guarded.status, 200);
  assert.equal(guarded.headers.get("Cache-Control"), "no-store");
  assert.equal(guarded.headers.get("Access-Control-Allow-Origin"), null);
  const ctx = (req, e = env) => ({ request: req, env: e });
  assert.equal(
    (
      await leads.onRequestPut(
        ctx(request("/api/leads", "PUT", { id: actor.id, status: "BOGUS" })),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await leads.onRequestPut(
        ctx(
          request("/api/leads", "PUT", { id: actor.id, status: "CONTACTED" }),
        ),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await leads.onRequestDelete(
        ctx(request("/api/leads?id=" + actor.id, "DELETE")),
      )
    ).status,
    200,
  );
  assert.equal(updates.archived, true);
  assert(updates.archived_at);
  assert.equal(
    (await users.onRequestPost()).status,
    405,
    "no default password account creation",
  );
  assert.equal(
    (
      await operations.onRequestPost(
        ctx(
          request(
            "/api/operations",
            "POST",
            { resource: "projects", document: {} },
            { Authorization: "Bearer token" },
          ),
        ),
      )
    ).status,
    400,
  );
  const quiz = {
    name: "<b>tester</b>",
    company: "Isolated fixture",
    position: "HR",
    email_or_line: "test@example.com",
    score: 40,
    result_level: "ALIVE",
    answers: Array(10).fill(1),
  };
  assert.equal(
    (await lead.onRequestPost(ctx(request("/api/lead", "POST", quiz), {})))
      .status,
    503,
  );
  dbError = { message: "private DB message" };
  const failed = await lead.onRequestPost(
    ctx(request("/api/lead", "POST", quiz)),
  );
  assert.equal(failed.status, 503);
  assert(!(await failed.text()).includes("private DB message"));
  assert.equal(globalThis.__emails.length, 0);
  dbError = null;
  const saved = await lead.onRequestPost(
    ctx(request("/api/lead", "POST", quiz)),
  );
  assert.equal(saved.status, 200);
  assert.equal(inserted[0].score, 10);
  assert.equal(inserted[0].result_level, "ZOMBIE");
  assert.equal(
    (
      await lead.onRequestPost(
        ctx(request("/api/lead", "POST", { ...quiz, answers: [0] })),
      )
    ).status,
    400,
  );
  const consentNotification = await lead.onRequestPost(
    ctx(request("/api/lead", "POST", quiz), {
      ...env,
      RESEND_API_KEY: "fixture",
      NOTIFICATION_EMAIL: "fixture@example.com",
      SENDER_EMAIL: "fixture@example.com",
    }),
  );
  assert.equal(consentNotification.status, 200);
  assert(globalThis.__emails[0].html.includes("&lt;b&gt;tester&lt;/b&gt;"));
  assert(!globalThis.__emails[0].html.includes("<b>tester</b>"));
  const media = await load("media"),
    r2 = await load("r2");
  let backupSuccess = true,
    existing = false,
    deleted = false,
    lastPut;
  const bucket = {
    list: async () => ({
      objects: [
        {
          key: "Alive_Model/fixture.png",
          size: 8,
          uploaded: new Date("2026-10-09"),
        },
      ],
      truncated: false,
    }),
    get: async () => ({
      body: new Uint8Array([1]),
      httpMetadata: { contentType: "image/png" },
    }),
    put: async (key, body, options) => {
      lastPut = { key, options };
      return backupSuccess && !existing ? { key } : null;
    },
    delete: async () => {
      deleted = true;
    },
  };
  const mediaEnv = {
    ...env,
    CHOOMCHAM_R2_BUCKET: bucket,
    R2_PUBLIC_DOMAIN: "https://fixture.invalid",
  };
  assert.equal(
    (await media.onRequestGet(ctx(request("/api/media")))).status,
    503,
  );
  const listing = await media.onRequestGet(
    ctx(request("/api/media?prefix=Alive_Model/"), mediaEnv),
  );
  assert.equal(listing.status, 200);
  assert.equal((await listing.json()).items.length, 1);
  const uploadRequest = () => {
    const form = new FormData();
    form.set(
      "file",
      new File([new Uint8Array([1, 2])], "fixture.png", { type: "image/png" }),
    );
    form.set("folder", "Alive_Model/");
    return new Request("https://site.invalid/api/media", {
      method: "POST",
      body: form,
    });
  };
  assert.equal(
    (await media.onRequestPost(ctx(uploadRequest(), mediaEnv))).status,
    200,
  );
  assert.equal(lastPut.options.onlyIf.get("If-None-Match"), "*");
  existing = true;
  assert.equal(
    (await media.onRequestPost(ctx(uploadRequest(), mediaEnv))).status,
    409,
  );
  existing = false;
  backupSuccess = false;
  assert.equal(
    (
      await media.onRequestDelete(
        ctx(
          request("/api/media?key=Alive_Model/fixture.png", "DELETE"),
          mediaEnv,
        ),
      )
    ).status,
    503,
  );
  assert.equal(deleted, false);
  backupSuccess = true;
  assert.equal(
    (
      await media.onRequestDelete(
        ctx(
          request("/api/media?key=Alive_Model/fixture.png", "DELETE"),
          mediaEnv,
        ),
      )
    ).status,
    200,
  );
  assert(lastPut.key.startsWith("_archive/"));
  assert.equal(deleted, true);
  assert.equal(
    (
      await media.onRequestDelete(
        ctx(request("/api/media?key=../invalid", "DELETE"), mediaEnv),
      )
    ).status,
    400,
  );
  assert.equal(
    (await r2.onRequestPost(ctx(uploadRequest(), mediaEnv))).status,
    200,
  );
  assert.equal(lastPut.options.onlyIf.get("If-None-Match"), "*");
  console.log(
    "PASS: private API access, email confirmation, allowlist, roles, same-origin, no-store, payload validation, archive, persistence failures, server quiz scoring, notification escaping, R2 binding, collision guards and backup-before-archive; no real data or messages",
  );
} finally {
  delete globalThis.__adminDb;
  delete globalThis.__emails;
  await rm(temp, { recursive: true, force: true });
}
