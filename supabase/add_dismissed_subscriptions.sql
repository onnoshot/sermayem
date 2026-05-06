-- Abonelik Dedektörü: kullanıcının gizlediği abonelikler
-- Supabase Dashboard > SQL Editor'da çalıştır

create table if not exists public.dismissed_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  sub_key text not null,
  dismissed_at timestamptz not null default now(),
  unique(user_id, sub_key)
);

alter table public.dismissed_subscriptions enable row level security;

create policy "Users CRUD own dismissed subscriptions"
  on public.dismissed_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index on public.dismissed_subscriptions (user_id);
