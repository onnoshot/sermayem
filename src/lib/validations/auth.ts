import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi gir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

export const signupSchema = z
  .object({
    full_name: z.string().min(2, "Ad en az 2 karakter olmalı").max(60),
    email: z.string().email("Geçerli bir e-posta adresi gir"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Şifreler eşleşmiyor",
    path: ["confirm_password"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi gir"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
