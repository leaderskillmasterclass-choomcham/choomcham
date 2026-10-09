import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const temp = await mkdtemp(join(tmpdir(), "course-design-test-"));
try {
  for (const [source, name] of [
    ["app/lib/programs.ts", "programs"],
    ["app/lib/course-design.ts", "course-design"],
    ["functions/api/course-designs.ts", "endpoint"],
    ["functions/lib/admin-auth.ts", "admin-auth"],
  ]) {
    let code = await readFile(new URL(`../${source}`, import.meta.url), "utf8");
    code = code
      .replace('"./programs"', '"./programs.mjs"')
      .replace('"../../app/lib/course-design"', '"./course-design.mjs"');
    code = code.replace('"../lib/admin-auth"', '"./admin-auth.mjs"');
    if (name === "endpoint" || name === "admin-auth")
      code = code.replace(
        /import \{ createClient \} from ['"]@supabase\/supabase-js['"];?/,
        "const createClient = () => globalThis.__courseDb;",
      );
    await writeFile(
      join(temp, `${name}.mjs`),
      ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    );
  }
  const { newCourseDesign, parseCourseDesign, designReadiness, designMinutes } =
    await import(pathToFileURL(join(temp, "course-design.mjs")));
  const { onRequestGet, onRequestPost } = await import(
    pathToFileURL(join(temp, "endpoint.mjs"))
  );
  for (const slug of [
    "reborn",
    "communication",
    "team",
    "leader",
    "culture",
    "from-zombie-to-living-organization",
  ]) {
    const design = newCourseDesign(slug);
    assert(parseCourseDesign(design));
    assert.equal(design.programSlug, slug);
    assert.equal(designMinutes(design), design.availableMinutes);
    assert(designReadiness(design).length);
  }
  const lead = {
    id: "test-lead",
    company: "องค์กรทดสอบ",
    dimensions_scores: {
      program_slug: "communication",
      proposal_brief: {
        participants: 30,
        audience: "หัวหน้างาน",
        challenge: "ส่งต่องานไม่ชัดเจน",
        outcomes: "มีข้อตกลงร่วมกัน",
        timeline: "เดือนหน้า",
        budget: "ให้ทีมแนะนำ",
      },
    },
  };
  const design = newCourseDesign("communication", lead);
  assert.equal(
    design.challenge,
    lead.dimensions_scores.proposal_brief.challenge,
  );
  assert.equal(design.leadId, lead.id);
  assert.equal(design.participants, 30);
  assert.equal(design.investment, "");
  const copy = (value) => JSON.parse(JSON.stringify(value));
  assert.equal(parseCourseDesign({ ...design, participants: -1 }), null);
  assert.equal(parseCourseDesign({ ...design, availableMinutes: 1.5 }), null);
  assert.equal(parseCourseDesign({ ...design, programSlug: "unknown" }), null);
  const dangling = copy(design);
  dangling.modules[0].objectiveIds = ["missing"];
  assert.equal(parseCourseDesign(dangling), null);
  const duplicate = copy(design);
  duplicate.objectives[1].id = duplicate.objectives[0].id;
  assert.equal(parseCourseDesign(duplicate), null);
  assert(!("secret" in parseCourseDesign({ ...design, secret: "ignore" })));
  const ready = copy(design);
  ready.objectives.forEach((o) => (o.evidence = "rubric จาก role-play"));
  ready.evaluation = {
    baseline: "สำรวจโจทย์",
    after: "ฝึกและสังเกต",
    followUp: "ติดตาม 30 วัน",
    owner: "HR และหัวหน้าทีม",
  };
  ready.deliverables = "แผนทีม";
  ready.organizationSupport = "เคสจริง";
  ready.scope = "1 วัน ไม่รวมค่าเดินทาง";
  ready.investment = "รอเสนอราคาหลังยืนยันสถานที่";
  assert.deepEqual(designReadiness(ready), []);
  assert(
    designReadiness({ ...ready, availableMinutes: 1 }).some((x) =>
      x.includes("เวลา"),
    ),
  );
  const unmapped = copy(ready);
  unmapped.modules.forEach((m) => (m.objectiveIds = []));
  assert(designReadiness(unmapped).some((x) => x.includes("รองรับ")));
  const env = {
    SUPABASE_URL: "https://test.invalid",
    SUPABASE_SERVICE_ROLE_KEY: "test-only",
    COURSE_ADMIN_EMAILS: " Admin@example.com ",
  };
  const actor = {
    id: "11111111-1111-4111-8111-111111111111",
    email: "admin@example.com",
    email_confirmed_at: "2026-10-09",
  };
  let authUser = actor,
    dbError = null,
    savedArgs;
  globalThis.__courseDb = {
    auth: {
      getUser: async (token) => {
        assert.equal(token, "test-token");
        return { data: { user: authUser }, error: null };
      },
    },
    rpc: async (_name, args) => {
      savedArgs = args;
      return {
        data: dbError
          ? null
          : {
              id: args.p_id,
              version: args.p_expected_version + 1,
              status: args.p_status,
              document: args.p_document,
            },
        error: dbError,
      };
    },
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        order: () => query,
        limit: async () => ({ data: [], error: null }),
      };
      return query;
    },
  };
  const id = "22222222-2222-4222-8222-222222222222";
  const request = (body, headers = {}) =>
    new Request("https://choomcham.pages.dev/api/course-designs", {
      method: "POST",
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
        Origin: "https://choomcham.pages.dev",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  const payload = { id, expectedVersion: 0, document: design, status: "DRAFT" };
  assert.equal(
    (await onRequestPost({ request: request(payload), env: {} })).status,
    503,
  );
  assert.equal(
    (
      await onRequestPost({
        request: request(payload, { Authorization: "" }),
        env,
      })
    ).status,
    401,
  );
  authUser = { ...actor, email: "unauthorized@example.com" };
  assert.equal(
    (await onRequestPost({ request: request(payload), env })).status,
    403,
  );
  authUser = { ...actor, email_confirmed_at: null };
  assert.equal(
    (await onRequestPost({ request: request(payload), env })).status,
    401,
  );
  authUser = actor;
  assert.equal(
    (
      await onRequestPost({
        request: request({ ...payload, status: "APPROVED" }),
        env,
      })
    ).status,
    422,
  );
  assert.equal(
    (
      await onRequestPost({
        request: request({ ...payload, expectedVersion: -1 }),
        env,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await onRequestPost({
        request: request(payload, { Origin: "https://other.invalid" }),
        env,
      })
    ).status,
    403,
  );
  const success = await onRequestPost({
    request: request({
      ...payload,
      document: ready,
      status: "REVIEW",
      actor: "spoofed",
    }),
    env,
  });
  assert.equal(success.status, 200);
  assert((await success.json()).success);
  assert.equal(savedArgs.p_actor, actor.id);
  dbError = { code: "40001", message: "private conflict" };
  assert.equal(
    (await onRequestPost({ request: request(payload), env })).status,
    409,
  );
  dbError = { code: "other", message: "private database error" };
  const failed = await onRequestPost({ request: request(payload), env });
  assert.equal(failed.status, 503);
  assert(!(await failed.text()).includes("private database error"));
  const get = (path) =>
    new Request("https://choomcham.pages.dev/api/course-designs" + path, {
      headers: { Authorization: "Bearer test-token" },
    });
  assert.equal((await onRequestGet({ request: get(""), env })).status, 200);
  assert.equal(
    (await onRequestGet({ request: get("?resource=leads"), env })).status,
    200,
  );
  assert.equal(
    (await onRequestGet({ request: get("?resource=history&id=bad"), env }))
      .status,
    400,
  );
  console.log(
    "PASS: six templates, brief mapping, import validation, objective mapping, readiness/time, verified admin access, approval gate, actor provenance and revision conflicts",
  );
} finally {
  delete globalThis.__courseDb;
  await rm(temp, { recursive: true, force: true });
}
