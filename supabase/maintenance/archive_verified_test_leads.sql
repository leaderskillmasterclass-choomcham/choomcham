-- OPTIONAL production cleanup. NOT automatically run by deployment.
-- Observed in live Admin on 2026-10-09; matches exact fixture identities, never generic name LIKE 'test'.
-- 1. Export a database backup. Run only the preview query below first and review IDs/counts.
with fixtures(name,company,score,expected) as (values
 ('คุณทดสอบ ระบบชุ่มฉ่ำ','Choomcham Test Corp Ltd.',18,2),
 ('Test Script Lead','CAP Vision Institute',10,1),
 ('Anon Role Test','TestCo',5,1),
 ('RLS Test','Test Co',10,1),
 ('เด่น ทดสอบ 2','เด่น',10,1)
)
select f.name,f.company,f.expected,count(l.id) actual,array_agg(l.id) ids
from fixtures f left join public.leads l on l.name=f.name and l.company=f.company and l.score=f.score
  and not l.archived and l.result_level in ('FADED','ZOMBIE')
group by f.name,f.company,f.expected;

-- 2. Execute this separate block after the preview matches 2+1+1+1+1 = 6.
-- Changed counts, downstream real projects, or modified records abort the entire operation.
do $$
declare
  v_mismatches integer;
  v_linked integer;
  v_archived integer;
begin
  -- Check fixture counts
  with fixtures(name,company,score,expected) as (values
    ('คุณทดสอบ ระบบชุ่มฉ่ำ','Choomcham Test Corp Ltd.',18,2),
    ('Test Script Lead','CAP Vision Institute',10,1),
    ('Anon Role Test','TestCo',5,1),
    ('RLS Test','Test Co',10,1),
    ('เด่น ทดสอบ 2','เด่น',10,1)
  )
  select count(*) into v_mismatches
  from fixtures f
  where f.expected <> (
    select count(*)
    from public.leads l
    where l.name = f.name and l.company = f.company and l.score = f.score
      and not l.archived and l.result_level in ('FADED','ZOMBIE')
  );

  if v_mismatches > 0 then
    raise exception 'Cleanup stopped: fixture counts differ; review exact IDs first';
  end if;

  -- Check if linked to projects or course designs
  with target_leads as (
    select l.id
    from public.leads l
    where not l.archived and l.result_level in ('FADED','ZOMBIE')
      and (
        (l.name = 'คุณทดสอบ ระบบชุ่มฉ่ำ' and l.company = 'Choomcham Test Corp Ltd.' and l.score = 18) or
        (l.name = 'Test Script Lead' and l.company = 'CAP Vision Institute' and l.score = 10) or
        (l.name = 'Anon Role Test' and l.company = 'TestCo' and l.score = 5) or
        (l.name = 'RLS Test' and l.company = 'Test Co' and l.score = 10) or
        (l.name = 'เด่น ทดสอบ 2' and l.company = 'เด่น' and l.score = 10)
      )
  )
  select count(*) into v_linked
  from (
    select 1 from public.transformation_projects p join target_leads t on t.id = p.lead_id
    union all
    select 1 from public.course_designs c join target_leads t on c.document->>'leadId' = t.id::text
  ) links;

  if v_linked > 0 then
    raise exception 'Cleanup stopped: test lead linked to project or course; review before archiving';
  end if;

  -- Insert audit snapshot
  insert into public.test_cleanup_audit(batch_id, lead_id, snapshot)
  select 'verified-test-leads-20261009', l.id, to_jsonb(l)
  from public.leads l
  where not l.archived and l.result_level in ('FADED','ZOMBIE')
    and (
      (l.name = 'คุณทดสอบ ระบบชุ่มฉ่ำ' and l.company = 'Choomcham Test Corp Ltd.' and l.score = 18) or
      (l.name = 'Test Script Lead' and l.company = 'CAP Vision Institute' and l.score = 10) or
      (l.name = 'Anon Role Test' and l.company = 'TestCo' and l.score = 5) or
      (l.name = 'RLS Test' and l.company = 'Test Co' and l.score = 10) or
      (l.name = 'เด่น ทดสอบ 2' and l.company = 'เด่น' and l.score = 10)
    );

  -- Archive target leads
  update public.leads
  set is_test = true, archived = true, archived_at = now()
  where not archived and result_level in ('FADED','ZOMBIE')
    and (
      (name = 'คุณทดสอบ ระบบชุ่มฉ่ำ' and company = 'Choomcham Test Corp Ltd.' and score = 18) or
      (name = 'Test Script Lead' and company = 'CAP Vision Institute' and score = 10) or
      (name = 'Anon Role Test' and company = 'TestCo' and score = 5) or
      (name = 'RLS Test' and company = 'Test Co' and score = 10) or
      (name = 'เด่น ทดสอบ 2' and company = 'เด่น' and score = 10)
    );

  get diagnostics v_archived = row_count;
  raise notice 'Archived % test leads successfully.', v_archived;
end $$;

-- Recovery after review:
-- update public.leads set archived=false,archived_at=null where id in
-- (select lead_id from public.test_cleanup_audit where batch_id='verified-test-leads-20261009');
-- audit snapshots remain intact. No auth users, real clients or media deleted.

