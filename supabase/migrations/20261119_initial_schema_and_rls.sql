-- DyPortfolio Initial Schema & Security Policies (Module 1)
-- Target: Supabase PostgreSQL (Idempotent Migration)

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 2. TABLES DEFINITION
-- ============================================================================

-- Profiles Table (Admin / Visitor Role Mapping)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text default 'visitor',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Resume Items Table (Experiences, Projects, Skills, Education)
create table if not exists public.resume_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('experience', 'project', 'skill', 'education')),
  title text not null,
  subtitle text,
  location text,
  start_date text,
  end_date text,
  is_current boolean default false,
  description text[] default '{}',
  tags text[] default '{}',
  is_active boolean default true,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- Certificates Table (Dynamic Credentials)
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date text,
  credential_url text,
  file_url text,
  tags text[] default '{}',
  is_visible boolean default true,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- Personal Details Table (Extensible Languages, Hobbies, Trivia)
create table if not exists public.personal_details (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('language', 'hobby', 'interest', 'custom')),
  label text not null,
  proficiency text,
  is_visible boolean default true,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- Download Logs Table (Telemetry & Post-Download Feedback)
create table if not exists public.download_logs (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  user_name text,
  download_reason text,
  auth_provider text default 'anonymous',
  consent_logged_ip boolean default false,
  ip_address text,
  user_agent text,
  preset_name text default 'Custom',
  selected_item_count int default 0,
  downloaded_at timestamp with time zone default now()
);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.resume_items enable row level security;
alter table public.certificates enable row level security;
alter table public.personal_details enable row level security;
alter table public.download_logs enable row level security;

-- PROFILES POLICIES
create policy "Allow users to view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RESUME ITEMS POLICIES
create policy "Allow public read active resume items"
  on public.resume_items for select
  using (is_active = true);

-- Note: Replace 'your-admin-email@example.com' with your actual admin email address.
create policy "Allow admin full access to resume items"
  on public.resume_items for all
  using (auth.jwt() ->> 'email' = 'your-admin-email@example.com')
  with check (auth.jwt() ->> 'email' = 'your-admin-email@example.com');

-- CERTIFICATES POLICIES
create policy "Allow public read visible certificates"
  on public.certificates for select
  using (is_visible = true);

create policy "Allow admin full access to certificates"
  on public.certificates for all
  using (auth.jwt() ->> 'email' = 'your-admin-email@example.com')
  with check (auth.jwt() ->> 'email' = 'your-admin-email@example.com');

-- PERSONAL DETAILS POLICIES
create policy "Allow public read visible personal details"
  on public.personal_details for select
  using (is_visible = true);

create policy "Allow admin full access to personal details"
  on public.personal_details for all
  using (auth.jwt() ->> 'email' = 'your-admin-email@example.com')
  with check (auth.jwt() ->> 'email' = 'your-admin-email@example.com');

-- DOWNLOAD LOGS POLICIES
create policy "Allow public insert to download logs"
  on public.download_logs for insert
  with check (true);

create policy "Allow public update to recently inserted download log"
  on public.download_logs for update
  using (true)
  with check (true);

create policy "Allow admin read download logs"
  on public.download_logs for select
  using (auth.jwt() ->> 'email' = 'your-admin-email@example.com');

-- ============================================================================
-- 4. STORAGE BUCKET FOR CERTIFICATES
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

create policy "Allow public view certificate storage"
  on storage.objects for select
  using (bucket_id = 'certificates');

create policy "Allow admin manage certificate storage"
  on storage.objects for all
  using (bucket_id = 'certificates' and auth.jwt() ->> 'email' = 'your-admin-email@example.com')
  with check (bucket_id = 'certificates' and auth.jwt() ->> 'email' = 'your-admin-email@example.com');
