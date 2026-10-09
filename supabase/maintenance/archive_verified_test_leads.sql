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

-- 2. Execute this separate transaction after the preview matches 2+1+1+1+1 = 6.
-- Changed counts, downstream real projects, or modified records abort the entire transaction.
begin;
lock table public.leads in share row exclusive mode;
lock table public.transformation_projects,public.course_designs in share mode;
create temporary table verified_fixtures(name text,company text,score integer,expected integer) on commit drop;
insert into verified_fixtures values
 ('คุณทดสอบ ระบบชุ่มฉ่ำ','Choomcham Test Corp Ltd.',18,2),
 ('Test Script Lead','CAP Vision Institute',10,1),
 ('Anon Role Test','TestCo',5,1),
 ('RLS Test','Test Co',10,1),
 ('เด่น ทดสอบ 2','เด่น',10,1);
create temporary table verified_test_ids on commit drop as
select l.id from public.leads l join verified_fixtures f on l.name=f.name and l.company=f.company and l.score=f.score
where not l.archived and l.result_level in ('FADED','ZOMBIE');
do $$ begin
 if exists(select 1 from verified_fixtures f where f.expected<>(select count(*) from public.leads l where l.name=f.name and l.company=f.company and l.score=f.score and not l.archived and l.result_level in ('FADED','ZOMBIE')))
 then raise exception 'Cleanup stopped: fixture counts differ; review exact IDs first'; end if;
 if exists(select 1 from public.transformation_projects p join verified_test_ids t on t.id=p.lead_id)
 or exists(select 1 from public.course_designs c join verified_test_ids t on c.document->>'leadId'=t.id::text)
 then raise exception 'Cleanup stopped: test lead linked to project or course; review before archiving'; end if;
end $$;
insert into public.test_cleanup_audit(batch_id,lead_id,snapshot)
select 'verified-test-leads-20261009',l.id,to_jsonb(l) from public.leads l join verified_test_ids t on t.id=l.id;
update public.leads set is_test=true,archived=true,archived_at=now() where id in(select id from verified_test_ids)
returning id,name,company;
commit;

-- Recovery after review:
-- update public.leads set archived=false,archived_at=null where id in
-- (select lead_id from public.test_cleanup_audit where batch_id='verified-test-leads-20261009');
-- audit snapshots remain intact. No auth users, real clients or media deleted.
