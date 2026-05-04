-- Supabase Dashboard > SQL Editor'da calistir
alter table public.profiles
  add column if not exists age integer,
  add column if not exists gender text check (gender in ('erkek', 'kadin', 'belirtmek_istemiyorum')),
  add column if not exists city text;
