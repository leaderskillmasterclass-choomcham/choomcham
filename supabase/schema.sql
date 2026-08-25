-- Create leads table for Zombie Quiz submissions
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  position text not null,
  email_or_line text not null,
  team_size text,
  score integer not null,
  result_level text not null, -- 'ALIVE', 'TIRED', 'FADED', 'ZOMBIE'
  answers jsonb not null, -- stores array of answer scores per question
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Grant table access to Supabase roles
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant insert on public.leads to anon;
grant insert on public.leads to authenticated;
grant select on public.leads to authenticated;

-- NOTE: RLS is intentionally DISABLED on this table.
-- leads is a public landing page form (anonymous quiz submissions).
-- No user-identifiable data is tied to a session, so RLS is unnecessary.
-- Access is controlled at the application level via service_role in admin contexts.
-- Re-enable RLS only if auth-scoped lead management is added later.

-- Auto-update updated_at function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at_column();

