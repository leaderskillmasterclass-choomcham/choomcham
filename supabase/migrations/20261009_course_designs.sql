-- New course workspace only. No client access; server verifies Supabase user + allowlist.
create table if not exists public.course_designs (
  id uuid primary key,
  version integer not null check (version > 0),
  status text not null check (status in ('DRAFT', 'REVIEW', 'APPROVED')),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  updated_at timestamptz not null default now(),
  updated_by uuid not null references auth.users(id)
);
create table if not exists public.course_design_versions (
  course_id uuid not null references public.course_designs(id),
  version integer not null,
  status text not null check (status in ('DRAFT', 'REVIEW', 'APPROVED')),
  document jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  primary key (course_id, version)
);
alter table public.course_designs enable row level security;
alter table public.course_design_versions enable row level security;
revoke all on public.course_designs, public.course_design_versions from anon, authenticated;
grant select, insert, update on public.course_designs to service_role;
grant select, insert on public.course_design_versions to service_role;

create or replace function public.save_course_design(
  p_id uuid, p_expected_version integer, p_document jsonb, p_status text, p_actor uuid
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_row public.course_designs; saved public.course_designs;
begin
  if p_status not in ('DRAFT','REVIEW','APPROVED') or p_expected_version < 0 or p_actor is null or jsonb_typeof(p_document) <> 'object' then
    raise exception 'invalid course design' using errcode = '22023';
  end if;
  -- Serialize edits even when the row is being created concurrently.
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 0));
  select * into current_row from public.course_designs where id = p_id for update;
  if (found and current_row.version <> p_expected_version) or (not found and p_expected_version <> 0) then
    raise exception 'course revision conflict' using errcode = '40001';
  end if;
  insert into public.course_designs(id, version, status, document, updated_at, updated_by)
    values (p_id, p_expected_version + 1, p_status, p_document, now(), p_actor)
    on conflict(id) do update set version = excluded.version, status = excluded.status,
      document = excluded.document, updated_at = excluded.updated_at, updated_by = excluded.updated_by
    returning * into saved;
  insert into public.course_design_versions(course_id, version, status, document, created_by)
    values (saved.id, saved.version, saved.status, saved.document, p_actor);
  return to_jsonb(saved);
end;
$$;
revoke all on function public.save_course_design(uuid, integer, jsonb, text, uuid) from public, anon, authenticated;
grant execute on function public.save_course_design(uuid, integer, jsonb, text, uuid) to service_role;
