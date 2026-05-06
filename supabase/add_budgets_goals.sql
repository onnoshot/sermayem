-- Faz: Bütçe & Hedef Sistemi
-- Supabase Dashboard > SQL Editor'da çalıştır

-- BUDGETS
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid references public.sources on delete cascade,
  monthly_limit numeric(14,2) not null check (monthly_limit > 0),
  currency text not null default 'TRY',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, source_id)
);

alter table public.budgets enable row level security;
create policy "Users CRUD own budgets" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.budgets (user_id);

-- SAVINGS GOALS
create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  emoji text not null default '🎯',
  color text not null default '#EAB308',
  target_amount numeric(14,2) not null check (target_amount > 0),
  current_amount numeric(14,2) not null default 0 check (current_amount >= 0),
  currency text not null default 'TRY',
  deadline date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.savings_goals enable row level security;
create policy "Users CRUD own savings_goals" on public.savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.savings_goals (user_id);

create trigger touch_budgets before update on public.budgets for each row execute procedure public.touch_updated_at();
create trigger touch_savings_goals before update on public.savings_goals for each row execute procedure public.touch_updated_at();
