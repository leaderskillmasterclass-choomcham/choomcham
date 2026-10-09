-- Run after schema.sql and 20261009_course_designs.sql. No rows deleted.
begin;
-- All private access is through server APIs with a verified user + explicit allowlist.
do $$
declare tab text; policy_record record;
begin
  foreach tab in array array['admin_profiles','leads','transformation_projects','partner_contributions','r2_media_assets','course_designs','course_design_versions'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('revoke all on public.%I from anon, authenticated',tab);
    for policy_record in select policyname from pg_policies where schemaname='public' and tablename=tab loop
      execute format('drop policy %I on public.%I',policy_record.policyname,tab);
    end loop;
  end loop;
  foreach tab in array array['leads','transformation_projects','partner_contributions','course_designs'] loop
    execute format('alter table public.%I add column if not exists is_test boolean not null default false',tab);
    execute format('alter table public.%I add column if not exists archived boolean not null default false',tab);
    execute format('alter table public.%I add column if not exists archived_at timestamptz',tab);
  end loop;
end $$;
-- Legacy intake types kept so existing records remain valid.
alter table public.leads drop constraint if exists leads_result_level_check;
alter table public.leads add constraint leads_result_level_check check(result_level in ('ALIVE','TIRED','FADED','ZOMBIE','CONSULTATION','PROGRAM_INQUIRY','PROPOSAL_REQUEST','INQUIRY','CONSULT_BRIEF','PROPOSAL')) not valid;
alter table public.leads validate constraint leads_result_level_check;
alter table public.transformation_projects drop constraint if exists transformation_projects_program_name_check;
alter table public.transformation_projects add constraint transformation_projects_program_name_check check(program_name in ('REBORN','COMMUNICATION','TEAM','LEADER','CULTURE','LIVING ORGANIZATION','REBORN PEOPLE','ALIVE TEAM','REBORN LEADER')) not valid;
alter table public.transformation_projects validate constraint transformation_projects_program_name_check;
grant select,insert,update on public.leads,public.transformation_projects,public.partner_contributions to service_role;
grant select on public.admin_profiles,public.r2_media_assets to service_role;
create table if not exists public.test_cleanup_audit (
  batch_id text not null,
  lead_id uuid not null,
  snapshot jsonb not null,
  archived_at timestamptz not null default now(),
  primary key(batch_id,lead_id)
);
alter table public.test_cleanup_audit enable row level security;
revoke all on public.test_cleanup_audit from anon,authenticated;
-- Audit snapshots are intentionally never returned by public/admin APIs.
commit;
