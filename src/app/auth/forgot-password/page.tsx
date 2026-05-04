"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassSurface } from "@/components/ui/glass-surface"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordInput) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/reset-password`,
    })
    if (error) { toast.error("Hata", { description: error.message }); return }
    setSent(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
      <GlassSurface className="p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-white mb-2">E-postanı kontrol et</h2>
            <p className="text-sm text-white/50 mb-6">Şifre sıfırlama bağlantısını gönderdik.</p>
            <Link href="/auth/login"><Button variant="ghost" size="md">Giriş sayfasına dön</Button></Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4">
                <ArrowLeft className="h-3 w-3" />Geri dön
              </Link>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Şifreni sıfırla</h1>
              <p className="text-sm text-white/50">E-posta adresine sıfırlama bağlantısı göndereceğiz.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="E-posta" type="email" placeholder="onur@example.com" error={errors.email?.message} {...register("email")} />
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">Bağlantı Gönder</Button>
            </form>
          </>
        )}
      </GlassSurface>
    </motion.div>
  )
}
