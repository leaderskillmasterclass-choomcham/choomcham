import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const db = new PGlite();
try {
  await db.exec(
    "create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('11111111-1111-4111-8111-111111111111');",
  );
  const sql = (file) =>
    readFile(new URL("../" + file, import.meta.url), "utf8");
  await db.exec(await sql("supabase/schema.sql"));
  // Simulate the original overly broad grants and policies before migration.
  await db.exec(
    "grant all on public.leads to anon,authenticated;create policy old_open_access on public.leads for all to authenticated using(true) with check(true);",
  );
  await db.exec(await sql("supabase/migrations/20261009_course_designs.sql"));
  await db.exec(await sql("supabase/migrations/20261010_admin_security.sql"));
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(
      db.query("select * from public.leads"),
      (e) => e.code === "42501",
    );
    await assert.rejects(
      db.query("select * from public.course_designs"),
      (e) => e.code === "42501",
    );
    await db.exec("reset role");
  }
  const id = "22222222-2222-4222-8222-222222222222",
    actor = "11111111-1111-4111-8111-111111111111";
  await db.exec("set role service_role");
  const save = (version) =>
    db.query("select public.save_course_design($1,$2,$3::jsonb,$4,$5)", [
      id,
      version,
      JSON.stringify({ title: "Isolated fixture" }),
      "DRAFT",
      actor,
    ]);
  await save(0);
  await save(1);
  await assert.rejects(save(0), (e) => e.code === "40001");
  assert.equal(
    (
      await db.query(
        "select count(*)::int n from public.course_design_versions",
      )
    ).rows[0].n,
    2,
  );
  await assert.rejects(
    db.query("update public.course_design_versions set status='APPROVED'"),
    (e) => e.code === "42501",
  );
  await db.exec("reset role");
  // Audit insert failure must roll back both revision and current document.
  await db.exec(
    "create function public.reject_audit() returns trigger language plpgsql as $$begin raise exception 'isolated audit failure';end$$;create trigger reject_audit before insert on public.course_design_versions for each row execute function public.reject_audit();",
  );
  await assert.rejects(save(2));
  assert.equal(
    (
      await db.query("select version from public.course_designs where id=$1", [
        id,
      ])
    ).rows[0].version,
    2,
  );
  await db.exec("drop trigger reject_audit on public.course_design_versions;");
  const fixtures = [
    ["คุณทดสอบ ระบบชุ่มฉ่ำ", "Choomcham Test Corp Ltd.", 18, "FADED"],
    ["คุณทดสอบ ระบบชุ่มฉ่ำ", "Choomcham Test Corp Ltd.", 18, "FADED"],
    ["Test Script Lead", "CAP Vision Institute", 10, "ZOMBIE"],
    ["Anon Role Test", "TestCo", 5, "ZOMBIE"],
    ["RLS Test", "Test Co", 10, "ZOMBIE"],
    ["เด่น ทดสอบ 2", "เด่น", 10, "ZOMBIE"],
    ["Real fixture", "Real organization", 30, "TIRED"],
  ];
  for (const [name, company, score, level] of fixtures)
    await db.query(
      "insert into public.leads(name,company,position,email_or_line,score,result_level,answers) values($1,$2,'HR','fixture@example.com',$3,$4,'[]')",
      [name, company, score, level],
    );
  const cleanup = await sql(
    "supabase/maintenance/archive_verified_test_leads.sql",
  );
  const testId = (
    await db.query("select id from public.leads where name='RLS Test'")
  ).rows[0].id;
  await db.query(
    "insert into public.transformation_projects(lead_id,client_name,program_name,lead_consultant) values($1,'fixture','ALIVE TEAM','fixture')",
    [testId],
  );
  await assert.rejects(db.exec(cleanup), (e) => e.message.includes("linked"));
  await db.exec("rollback");
  assert.equal(
    (await db.query("select count(*)::int n from public.leads where archived"))
      .rows[0].n,
    0,
  );
  await db.exec("delete from public.transformation_projects");
  await db.exec(cleanup);
  assert.equal(
    (await db.query("select count(*)::int n from public.leads where archived"))
      .rows[0].n,
    6,
  );
  assert.equal(
    (await db.query("select count(*)::int n from public.test_cleanup_audit"))
      .rows[0].n,
    6,
  );
  assert.equal(
    (await db.query("select name from public.leads where not archived")).rows[0]
      .name,
    "Real fixture",
  );
  await assert.rejects(db.exec(cleanup), (e) =>
    e.message.includes("counts differ"),
  );
  await db.exec("rollback");
  await db.exec(
    "update public.leads set archived=false,archived_at=null where id in(select lead_id from public.test_cleanup_audit where batch_id='verified-test-leads-20261009');",
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::int n from public.leads where not archived",
      )
    ).rows[0].n,
    7,
  );
  console.log(
    "PASS: real PostgreSQL schema/migrations, private RLS grants, immutable revisions, version conflicts, atomic rollback, six exact fixtures archived with backup, dependent project blocks cleanup, count guard and recovery; isolated database only",
  );
} finally {
  await db.close();
}
