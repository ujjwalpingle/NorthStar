-- NorthStar initial schema
-- Run in Supabase SQL Editor

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  base_currency text not null default 'EUR' check (base_currency in ('EUR','USD','GBP','CHF')),
  target_country text not null default 'Germany',
  migration_target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('checking','savings','investment','crypto','property','other')),
  category text not null check (category in ('asset','liability')),
  currency text not null default 'EUR' check (currency in ('EUR','USD','GBP','CHF')),
  balance numeric(15,2) not null default 0,
  institution text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Net worth snapshots
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

-- Migration goals
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

-- Checklist items
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

-- RLS
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.net_worth_snapshots enable row level security;
alter table public.migration_goals enable row level security;
alter table public.checklist_items enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own accounts" on public.accounts for all using (auth.uid() = user_id);
create policy "Users manage own snapshots" on public.net_worth_snapshots for all using (auth.uid() = user_id);
create policy "Users manage own migration goals" on public.migration_goals for all using (auth.uid() = user_id);
create policy "Users manage own checklist" on public.checklist_items for all using (auth.uid() = user_id);

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

-- Indexes
create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_snapshots_user_id on public.net_worth_snapshots(user_id);
create index if not exists idx_checklist_user_id on public.checklist_items(user_id);
