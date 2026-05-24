-- NorthStar Complete Schema
-- Run in Supabase SQL Editor

-- ═══════════════════════════════════════════════════════════════════════════════
-- PROFILES & CORE
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  base_currency text not null default 'EUR' check (base_currency in ('EUR','USD','GBP','CHF','INR')),
  target_country text not null default 'Germany',
  migration_target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- WEALTH MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('checking','savings','investment','crypto','property','gold','other')),
  category text not null check (category in ('asset','liability')),
  currency text not null default 'EUR' check (currency in ('EUR','USD','GBP','CHF','INR')),
  balance numeric(15,2) not null default 0,
  institution text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.net_worth_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  snapshot_date date not null,
  total_assets numeric(15,2) not null,
  total_liabilities numeric(15,2) not null,
  net_worth numeric(15,2) not null,
  currency text not null default 'EUR',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION PLANNING
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.migration_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  target_country text not null,
  visa_type text not null default '',
  target_date date,
  status text not null default 'planning' check (status in ('planning','in_progress','submitted','approved','completed')),
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('visa','documents','finance','housing','healthcare','tax','other')),
  title text not null,
  description text default '',
  completed boolean not null default false,
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- HABITS & TRACKING
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  icon text not null,
  category text not null check (category in ('fitness','learning','career','life','finance')),
  frequency text not null check (frequency in ('daily','weekly')),
  target_count integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  count integer not null default 1,
  created_at timestamptz not null default now(),
  unique(habit_id, date)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GOALS & MILESTONES
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default '',
  category text not null check (category in ('financial','career','migration','fitness','learning')),
  deadline date,
  target_value numeric(15,2),
  current_value numeric(15,2),
  unit text,
  status text not null default 'active' check (status in ('active','completed','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DAILY TASKS
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  date date not null,
  category text not null check (category in ('work','learning','personal','migration')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- LEARNING & STUDY
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.study_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null,
  topic text not null,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  resources text[] default array[]::text[],
  estimated_hours numeric(10,2) not null default 0,
  completed_hours numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INTERVIEW PREP
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.interview_prep (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  dsa_solved integer not null default 0,
  dsa_target integer not null default 0,
  system_design_sessions integer not null default 0,
  mock_interviews integer not null default 0,
  resume_version text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company text not null,
  role text not null,
  status text not null default 'wishlist' check (status in ('wishlist','applied','screening','interview','offer','rejected')),
  applied_date date,
  notes text default '',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CAREER ROADMAP
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.career_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  current_phase integer not null default 1,
  current_role text default '',
  years_of_experience numeric(5,2) not null default 0,
  primary_focus text not null default 'platform-engineering' check (primary_focus in ('platform-engineering','sre','cloud-security','mlops')),
  target_salary_phase_3 numeric(15,2),
  notes text default '',
  target_countries_europe text[] default array[]::text[],
  completed_projects text[] default array[]::text[],
  in_progress_projects text[] default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  career_id uuid not null references public.career_goals(id) on delete cascade,
  phase integer not null check (phase in (1,2,3,4,5)),
  year integer not null,
  title text not null,
  description text default '',
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  career_id uuid not null references public.career_goals(id) on delete cascade,
  name text not null,
  category text not null check (category in ('core','specialization','soft')),
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced','expert')),
  years_experience numeric(5,2) not null default 0,
  last_updated date not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.target_companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  career_id uuid not null references public.career_goals(id) on delete cascade,
  name text not null,
  industry text not null,
  reason text default '',
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  target_phase integer,
  notes text default '',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.net_worth_snapshots enable row level security;
alter table public.migration_goals enable row level security;
alter table public.checklist_items enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.goal_milestones enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.study_topics enable row level security;
alter table public.interview_prep enable row level security;
alter table public.job_applications enable row level security;
alter table public.career_goals enable row level security;
alter table public.career_milestones enable row level security;
alter table public.skills enable row level security;
alter table public.target_companies enable row level security;

-- Policies: Users can only access their own data
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own accounts" on public.accounts for all using (auth.uid() = user_id);
create policy "Users manage own snapshots" on public.net_worth_snapshots for all using (auth.uid() = user_id);
create policy "Users manage own migration goals" on public.migration_goals for all using (auth.uid() = user_id);
create policy "Users manage own checklist" on public.checklist_items for all using (auth.uid() = user_id);
create policy "Users manage own habits" on public.habits for all using (auth.uid() = user_id);
create policy "Users manage own habit logs" on public.habit_logs for all using (auth.uid() = user_id);
create policy "Users manage own goals" on public.goals for all using (auth.uid() = user_id);
create policy "Users manage own goal milestones" on public.goal_milestones for all using (auth.uid() = user_id);
create policy "Users manage own daily tasks" on public.daily_tasks for all using (auth.uid() = user_id);
create policy "Users manage own study topics" on public.study_topics for all using (auth.uid() = user_id);
create policy "Users manage own interview prep" on public.interview_prep for all using (auth.uid() = user_id);
create policy "Users manage own job applications" on public.job_applications for all using (auth.uid() = user_id);
create policy "Users manage own career goals" on public.career_goals for all using (auth.uid() = user_id);
create policy "Users manage own career milestones" on public.career_milestones for all using (auth.uid() = user_id);
create policy "Users manage own skills" on public.skills for all using (auth.uid() = user_id);
create policy "Users manage own target companies" on public.target_companies for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════

create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_snapshots_user_id on public.net_worth_snapshots(user_id);
create index if not exists idx_migration_user_id on public.migration_goals(user_id);
create index if not exists idx_checklist_user_id on public.checklist_items(user_id);
create index if not exists idx_habits_user_id on public.habits(user_id);
create index if not exists idx_habit_logs_user_id on public.habit_logs(user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_goals_user_id on public.goals(user_id);
create index if not exists idx_goal_milestones_user_id on public.goal_milestones(user_id);
create index if not exists idx_daily_tasks_user_id on public.daily_tasks(user_id);
create index if not exists idx_study_topics_user_id on public.study_topics(user_id);
create index if not exists idx_job_apps_user_id on public.job_applications(user_id);
create index if not exists idx_career_user_id on public.career_goals(user_id);
create index if not exists idx_skills_user_id on public.skills(user_id);
create index if not exists idx_checklist_user_id on public.checklist_items(user_id);
