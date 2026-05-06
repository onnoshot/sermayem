"use client"

import { useState } from "react"
import { AlertTriangle, Copy, Check, ExternalLink } from "lucide-react"

const MIGRATION_SQL = `-- Supabase Dashboard > SQL Editor > New query > Yapıştır ve çalıştır

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
create index if not exists budgets_user_id_idx on public.budgets (user_id);

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
create index if not exists savings_goals_user_id_idx on public.savings_goals (user_id);

create or replace trigger touch_budgets before update on public.budgets
  for each row execute procedure public.touch_updated_at();
create or replace trigger touch_savings_goals before update on public.savings_goals
  for each row execute procedure public.touch_updated_at();`

export function SchemaSetupBanner() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(MIGRATION_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-[20px] border border-orange-500/20 bg-orange-500/[0.05] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-[10px] bg-orange-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-4.5 w-4.5 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-300">Veritabanı kurulumu gerekiyor</p>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Bu özellik için gerekli tablolar henüz oluşturulmamış. Aşağıdaki SQL&apos;i Supabase SQL Editor&apos;da çalıştır, ardından sayfayı yenile.
          </p>
        </div>
      </div>

      <div className="relative">
        <pre className="text-[11px] text-white/50 bg-white/[0.04] rounded-[12px] p-4 overflow-x-auto font-mono leading-relaxed max-h-48 overflow-y-auto border border-white/[0.06]">
          {MIGRATION_SQL}
        </pre>
        <button
          onClick={copy}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white/60 hover:text-white/90 transition-all border border-white/[0.08]"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>

      <a
        href="https://supabase.com/dashboard/project/omxbknlegoruwuaolcxy/sql/new"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Supabase SQL Editor&apos;ı aç
      </a>
    </div>
  )
}
