import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const temp = await mkdtemp(join(tmpdir(), "choomcham-proposal-test-"));
try {
  for (const [source, name] of [["app/lib/programs.ts", "programs"], ["app/lib/proposal-request.ts", "proposal-request"], ["functions/api/program-proposal.ts", "endpoint"]]) {
    let code = await readFile(new URL(`../${source}`, import.meta.url), "utf8");
    code = code.replace('"./programs"', '"./programs.mjs"').replace('"../../app/lib/proposal-request"', '"./proposal-request.mjs"');
    if (name === "endpoint") code = code.replace('import { createClient } from "@supabase/supabase-js";', 'const createClient = () => globalThis.__proposalDbClient;');
    await writeFile(join(temp, `${name}.mjs`), ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  }
  const { GROWTH_PROGRAMS } = await import(pathToFileURL(join(temp, "programs.mjs")));
  const { validateProposalBrief, proposalLead } = await import(pathToFileURL(join(temp, "proposal-request.mjs")));
  const { onRequestPost } = await import(pathToFileURL(join(temp, "endpoint.mjs")));
  const brief = { program_slug: "reborn", name: "ผู้ทดสอบ", company: "องค์กรทดสอบ", position: "HR", email: "test@example.com", phone: "", participants: "30", audience: "หัวหน้างาน", challenge: "ส่งต่องานไม่ชัดเจน", outcomes: "มีข้อตกลงการทำงานร่วมกัน", format: "onsite", duration: "1 วัน", timeline: "ไตรมาส 1", location: "กรุงเทพฯ", budget: "ให้ทีมงานแนะนำ", consent: true, website: "" };
  for (const program of GROWTH_PROGRAMS) {
    assert(program.modules.length >= 3 && program.objectives.length && program.measures.length);
    const parsed = validateProposalBrief({ ...brief, program_slug: program.slug });
    assert.deepEqual(parsed.errors, {});
    const lead = proposalLead(parsed.brief, "2026-10-09T00:00:00Z");
    assert.equal(lead.dimensions_scores.program_slug, program.slug);
    assert.equal(lead.dimensions_scores.program_interest, `${program.code} — ${program.title}`);
    assert.equal(lead.result_level, "PROPOSAL_REQUEST"); assert.equal(lead.score, 0);
    assert.equal(lead.dimensions_scores.proposal_brief.participants, 30);
    assert.equal(lead.dimensions_scores.proposal_brief.consent_recorded_at, "2026-10-09T00:00:00Z");
  }
  for (const [key, value] of [["program_slug", "unknown"], ["consent", false], ["email", "invalid"], ["participants", 0], ["participants", 1.2], ["participants", 10001], ["format", "fake"], ["duration", "fake"], ["challenge", "x".repeat(2001)], ["audience", ""]]) {
    assert(validateProposalBrief({ ...brief, [key]: value }).errors[key], `must reject ${key}: ${value}`);
  }
  const env = { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "test-only" };
  const request = (body = brief, headers = {}) => new Request("https://choomcham.pages.dev/api/program-proposal", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://choomcham.pages.dev", ...headers }, body: JSON.stringify(body) });
  assert.equal((await onRequestPost({ request: request(), env: {} })).status, 503);
  assert.equal((await onRequestPost({ request: request({ ...brief, consent: false }), env })).status, 400);
  assert.equal((await onRequestPost({ request: request({ ...brief, website: "spam" }), env })).status, 400);
  assert.equal((await onRequestPost({ request: request(brief, { Origin: "https://other.example" }), env })).status, 403);
  assert.equal((await onRequestPost({ request: request(brief, { "Content-Type": "text/plain" }), env })).status, 415);
  assert.equal((await onRequestPost({ request: request({ challenge: "x".repeat(17000) }), env })).status, 413);
  let inserted;
  globalThis.__proposalDbClient = { from: () => ({ insert: (lead) => { inserted = lead; return { select: () => ({ single: async () => ({ data: null, error: { message: "private database error" } }) }) }; } }) };
  const failure = await onRequestPost({ request: request(), env });
  assert.equal(failure.status, 503); assert(!(await failure.text()).includes("private database error"));
  globalThis.__proposalDbClient = { from: (table) => { assert.equal(table, "leads"); return { insert: (lead) => { inserted = lead; return { select: (columns) => { assert.equal(columns, "id"); return { single: async () => ({ data: { id: "test-persisted-id" }, error: null }) }; } }; } }; } };
  const success = await onRequestPost({ request: request({ ...brief, score: 40, result_level: "ALIVE", status: "WON" }), env });
  assert.equal(success.status, 201);
  assert.deepEqual(await success.json(), { success: true, request_id: "test-persisted-id" });
  assert.equal(inserted.status, "NEW"); assert.equal(inserted.score, 0); assert.equal(inserted.result_level, "PROPOSAL_REQUEST");
  assert.equal(inserted.dimensions_scores.proposal_brief.challenge, brief.challenge);
  console.log("PASS: 6 program mappings, validation boundaries, consent, origin, payload limits, persistence failure and persisted success");
} finally { delete globalThis.__proposalDbClient; await rm(temp, { recursive: true, force: true }); }
