import { z } from "zod"

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  status: z.enum(["completed", "pending"]),
  amount: z.number().positive("Tutar sıfırdan büyük olmalı"),
  currency: z.enum(["TRY", "USD", "EUR", "GBP"]),
  source_id: z.string().uuid().nullable().optional(),
  description: z.string().max(200).nullable().optional(),
  occurred_on: z.string(),
  due_on: z.string().nullable().optional(),
  is_recurring: z.boolean(),
  recurrence_rule: z.enum(["daily", "weekly", "monthly", "yearly"]).nullable().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
