-- ============================================================
-- AKIŞ — Supabase SQL Schema
-- Supabase Dashboard > SQL Editor'a bu dosyayı yapıştır ve çalıştır
-- ============================================================

-- 1. PROFILES
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  avatar_emoji text default '🎯',
  currency text not null default 'TRY' check (currency in ('TRY','USD','EUR','GBP')),
  monthly_income_goal numeric(14,2),
  monthly_savings_goal numeric(14,2),
  timezone text default 'Europe/Istanbul',
  locale text default 'tr',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. SOURCES
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  emoji text not null,
  color text not null default '#EAB308',
  type text not null check (type in ('income','expense','both')),
  is_default boolean default false,
  archived boolean default false,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- 3. TRANSACTIONS
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid references public.sources on delete set null,
  type text not null check (type in ('income','expense')),
  status text not null default 'completed' check (status in ('completed','pending')),
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'TRY',
  description text,
  occurred_on date not null default current_date,
  due_on date,
  is_recurring boolean default false,
  recurrence_rule text check (recurrence_rule in ('daily','weekly','monthly','yearly')),
  parent_id uuid references public.transactions,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on public.transactions (user_id, occurred_on desc);
create index on public.transactions (user_id, status, due_on);
create index on public.transactions (user_id, type);

-- 4. RLS
alter table public.profiles enable row level security;
alter table public.sources enable row level security;
alter table public.transactions enable row level security;

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users CRUD own sources" on public.sources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users CRUD own transactions" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. AUTO-CREATE PROFILE + DEFAULT SOURCES on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into public.sources (user_id, name, emoji, color, type, is_default) values
    (new.id, 'Retro Camera Land', '📷', '#FF6B35', 'income', true),
    (new.id, 'Uniqbee', '🐝', '#FFD60A', 'income', true),
    (new.id, 'Onnoshot', '🎯', '#007AFF', 'income', true),
    (new.id, 'Freelance', '💻', '#EAB308', 'income', true),
    (new.id, 'Maaş', '💼', '#22C55E', 'income', true),
    (new.id, 'Yatırım', '📈', '#3B82F6', 'income', true),
    (new.id, 'Kira', '🏠', '#8B5CF6', 'expense', true),
    (new.id, 'Market', '🛒', '#F97316', 'expense', true),
    (new.id, 'Ulaşım', '🚗', '#06B6D4', 'expense', true),
    (new.id, 'Yeme-İçme', '🍽️', '#EF4444', 'expense', true),
    (new.id, 'Abonelikler', '📺', '#14B8A6', 'expense', true),
    (new.id, 'Eğlence', '🎬', '#A855F7', 'expense', true);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. AUTO-UPDATE updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger touch_profiles before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger touch_transactions before update on public.transactions for each row execute procedure public.touch_updated_at();
