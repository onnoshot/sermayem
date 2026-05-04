import { z } from "zod"

export const sourceSchema = z.object({
  name: z.string().min(1, "Kaynak adı gerekli").max(40),
  emoji: z.string().min(1, "Emoji seç"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Geçerli bir renk gir"),
  type: z.enum(["income", "expense", "both"]),
})

export type SourceInput = z.infer<typeof sourceSchema>
