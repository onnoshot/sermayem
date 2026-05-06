-- ============================================================
-- PREMIUM — user_plans + receipts tables
-- Supabase Dashboard > SQL Editor > New query > Yapıştır ve çalıştır
-- ============================================================

-- 1. USER PLANS (subscription/plan info)
create table if not exists public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  -- Stripe fields (populated when payment is set up)
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  -- Manual override (for admin gifting, etc.)
  pro_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_plans enable row level security;
create policy "Users read own plan" on public.user_plans
  for select using (auth.uid() = user_id);
create policy "Service role manages plans" on public.user_plans
  for all using (auth.role() = 'service_role');

create index if not exists user_plans_user_id_idx on public.user_plans (user_id);
create index if not exists user_plans_stripe_customer_idx on public.user_plans (stripe_customer_id);

-- Auto-create free plan on user signup
create or replace function public.handle_new_user_plan()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_plans (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_plan on auth.users;
create trigger on_auth_user_created_plan
  after insert on auth.users
  for each row execute procedure public.handle_new_user_plan();

-- 2. RECEIPTS (fiş storage metadata)
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  transaction_id uuid references public.transactions on delete set null,
  -- Supabase Storage path: receipts/{user_id}/{filename}
  storage_path text not null,
  file_size_bytes integer,
  mime_type text default 'image/jpeg',
  -- Scan result cache (avoid re-scanning)
  scan_data jsonb,
  created_at timestamptz default now()
);

alter table public.receipts enable row level security;
create policy "Users CRUD own receipts" on public.receipts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists receipts_user_id_idx on public.receipts (user_id);
create index if not exists receipts_transaction_id_idx on public.receipts (transaction_id);

-- updated_at trigger for user_plans
create or replace trigger touch_user_plans before update on public.user_plans
  for each row execute procedure public.touch_updated_at();

-- 3. STORAGE BUCKET for receipts
-- Run this separately in Supabase Dashboard > Storage if bucket doesn't exist:
-- insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);
-- create policy "Users upload own receipts" on storage.objects for insert
--   with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users read own receipts" on storage.objects for select
--   using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users delete own receipts" on storage.objects for delete
--   using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

-- 4. BACKFILL: create free plan for existing users
insert into public.user_plans (user_id)
select id from auth.users
on conflict (user_id) do nothing;
