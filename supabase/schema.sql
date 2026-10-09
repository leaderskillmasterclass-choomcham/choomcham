-- ==============================================================================
-- CHOOMCHAM HOUSE — SUPABASE MASTER DATABASE SCHEMA
-- Stack: Supabase (PostgreSQL) + Auth + RLS + Storage Metadata
-- ==============================================================================

-- 1. Profiles & Admin Roles (RBAC)
create table if not exists public.admin_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text default 'CONSULTANT' not null check (role in ('SUPERADMIN', 'ADMIN', 'CONSULTANT', 'PARTNER')),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Leads & Diagnostic Submissions (Zombie Organization Index™)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  position text not null,
  email_or_line text not null,
  team_size text,
  score integer not null,
  result_level text not null check (result_level in ('ALIVE', 'TIRED', 'FADED', 'ZOMBIE', 'CONSULTATION', 'PROGRAM_INQUIRY', 'PROPOSAL_REQUEST', 'INQUIRY', 'CONSULT_BRIEF', 'PROPOSAL')),
  answers jsonb not null, -- array of scores
  dimensions_scores jsonb, -- breakdown across 7 dimensions (energy, meaning, connection, etc.)
  status text default 'NEW' not null check (status in ('NEW', 'CONTACTED', 'CONSULTATION', 'PROPOSAL', 'WON', 'LOST')),
  assigned_to uuid references public.admin_profiles(id),
  notes text,
  report_sent boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Transformation Projects Delivery (Reset -> Recreate Milestones)
create table if not exists public.transformation_projects (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  client_name text not null,
  program_name text not null check (program_name in ('REBORN', 'COMMUNICATION', 'TEAM', 'LEADER', 'CULTURE', 'LIVING ORGANIZATION', 'REBORN PEOPLE', 'ALIVE TEAM', 'REBORN LEADER')),
  participants_count integer default 0,
  current_stage text default 'RESET' not null check (current_stage in ('RESET', 'RECONNECT', 'RECHARGE', 'REIMAGINE', 'RECREATE', 'COMPLETED')),
  stage_milestones jsonb default '{"reset": false, "reconnect": false, "recharge": false, "reimagine": false, "recreate": false}'::jsonb,
  lead_consultant text not null,
  status text default 'IN_PROGRESS' not null check (status in ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD')),
  start_date date default current_date,
  end_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. Partner Network & Contribution Ledger (Marketing, Sales, Solution, Operation)
create table if not exists public.partner_contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.transformation_projects(id) on delete cascade,
  partner_name text not null,
  partner_email text,
  contribution_type text not null check (contribution_type in ('MARKETING', 'SALES', 'SOLUTION', 'OPERATION')),
  percentage numeric(5,2) not null,
  amount numeric(12,2) default 0,
  status text default 'VERIFIED' not null check (status in ('PENDING', 'VERIFIED', 'PAID')),
  notes text,
  created_at timestamptz default now() not null
);

-- 5. Cloudflare R2 Media & Document Assets Metadata
create table if not exists public.r2_media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  r2_key text unique not null,
  public_url text not null,
  file_type text not null,
  file_size_bytes bigint,
  uploaded_by uuid references public.admin_profiles(id),
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.admin_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.transformation_projects enable row level security;
alter table public.partner_contributions enable row level security;
alter table public.r2_media_assets enable row level security;

-- No browser role may access private tables. Admin APIs authorize requests server-side.
revoke all on public.admin_profiles, public.leads, public.transformation_projects,
 public.partner_contributions, public.r2_media_assets from anon, authenticated;
grant select,insert,update on public.leads,public.transformation_projects,public.partner_contributions to service_role;
grant select on public.admin_profiles,public.r2_media_assets to service_role;

-- Auto updated_at Trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_leads_timestamp before update on public.leads for each row execute function public.update_updated_at_column();
create trigger update_projects_timestamp before update on public.transformation_projects for each row execute function public.update_updated_at_column();
create trigger update_profiles_timestamp before update on public.admin_profiles for each row execute function public.update_updated_at_column();
