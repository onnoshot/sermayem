/**
 * Run: node scripts/migrate.mjs
 * Supabase DB şifrenizi aşağıya girin.
 * Dashboard > Settings > Database > Connection string (URI format)
 */
import postgres from "postgres"

const DB_URL = process.env.DATABASE_URL

if (!DB_URL) {
  console.error("❌ DATABASE_URL ortam değişkeni ayarlanmamış.")
  console.error("   Örnek: DATABASE_URL='postgresql://postgres:SIFRE@db.omxbknlegoruwuaolcxy.supabase.co:5432/postgres' node scripts/migrate.mjs")
  process.exit(1)
}

const sql = postgres(DB_URL, { ssl: "require" })

console.log("🔄 Migration başlatılıyor...")

try {
  await sql`
    create table if not exists public.budgets (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users on delete cascade,
      source_id uuid references public.sources on delete cascade,
      monthly_limit numeric(14,2) not null check (monthly_limit > 0),
      currency text not null default 'TRY',
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      unique(user_id, source_id)
    )
  `
  console.log("✅ budgets tablosu oluşturuldu")

  await sql`alter table public.budgets enable row level security`

  await sql`
    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users CRUD own budgets'
      ) then
        create policy "Users CRUD own budgets" on public.budgets
          for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
      end if;
    end $$
  `
  console.log("✅ budgets RLS politikası oluşturuldu")

  await sql`create index if not exists budgets_user_id_idx on public.budgets (user_id)`

  await sql`
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
    )
  `
  console.log("✅ savings_goals tablosu oluşturuldu")

  await sql`alter table public.savings_goals enable row level security`

  await sql`
    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'savings_goals' and policyname = 'Users CRUD own savings_goals'
      ) then
        create policy "Users CRUD own savings_goals" on public.savings_goals
          for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
      end if;
    end $$
  `
  console.log("✅ savings_goals RLS politikası oluşturuldu")

  await sql`create index if not exists savings_goals_user_id_idx on public.savings_goals (user_id)`

  // Trigger for budgets (ignore if exists)
  try {
    await sql`create trigger touch_budgets before update on public.budgets for each row execute procedure public.touch_updated_at()`
    console.log("✅ budgets trigger oluşturuldu")
  } catch { console.log("ℹ️  budgets trigger zaten mevcut") }

  // Trigger for savings_goals (ignore if exists)
  try {
    await sql`create trigger touch_savings_goals before update on public.savings_goals for each row execute procedure public.touch_updated_at()`
    console.log("✅ savings_goals trigger oluşturuldu")
  } catch { console.log("ℹ️  savings_goals trigger zaten mevcut") }

  console.log("\n🎉 Migration tamamlandı! Bütçeler ve Hedefler artık çalışır.")
} catch (err) {
  console.error("❌ Migration hatası:", err.message)
} finally {
  await sql.end()
}
