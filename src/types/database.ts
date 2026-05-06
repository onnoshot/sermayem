export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = { public: Record<string, unknown> }

export type Currency = "TRY" | "USD" | "EUR" | "GBP"
export type TransactionType = "income" | "expense"
export type TransactionStatus = "completed" | "pending"
export type SourceType = "income" | "expense" | "both"
export type RecurrenceRule = "daily" | "weekly" | "monthly" | "yearly"

export interface Profile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  avatar_emoji: string | null
  currency: Currency
  monthly_income_goal: number | null
  monthly_savings_goal: number | null
  timezone: string
  locale: string
  onboarded_at: string | null
  age: number | null
  gender: "erkek" | "kadin" | "belirtmek_istemiyorum" | null
  city: string | null
  created_at: string
  updated_at: string
}

export interface Source {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  type: SourceType
  is_default: boolean
  archived: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  source_id: string | null
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  description: string | null
  occurred_on: string
  due_on: string | null
  is_recurring: boolean
  recurrence_rule: RecurrenceRule | null
  parent_id: string | null
  metadata: Json
  created_at: string
  updated_at: string
  source?: Source
}

export interface Budget {
  id: string
  user_id: string
  source_id: string | null
  monthly_limit: number
  currency: Currency
  created_at: string
  updated_at: string
  source?: Source
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  target_amount: number
  current_amount: number
  currency: Currency
  deadline: string | null
  created_at: string
  updated_at: string
}

export interface DismissedSubscription {
  id: string
  user_id: string
  sub_key: string
  dismissed_at: string
}

export interface MonthlySummary {
  year: number
  month: number
  total_income: number
  total_expense: number
  total_pending_income: number
  total_pending_expense: number
  net: number
}
