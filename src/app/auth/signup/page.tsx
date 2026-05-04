"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupInput } from "@/lib/validations/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassSurface } from "@/components/ui/glass-surface"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { GoogleButton } from "@/components/auth/google-button"

export default function SignupPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupInput) {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (error) {
      toast.error("Kayıt başarısız", { description: error.message })
      return
    }
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
        <GlassSurface className="p-8 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold text-white mb-2">E-postanı kontrol et</h2>
          <p className="text-sm text-white/50 mb-6">Onay bağlantısını gönderdik. Bağlantıya tıklayınca otomatik giriş yapacaksın.</p>
          <Button variant="ghost" size="md" onClick={() => router.push("/auth/login")}>Giriş sayfasına dön</Button>
        </GlassSurface>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
      <GlassSurface className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Hesap olustur</h1>
          <p className="text-sm text-white/50">Finansal yolculuguna basla</p>
        </div>

        <GoogleButton />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-white/25">ya da e-posta ile</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Ad Soyad" placeholder="Onur Vala" autoComplete="name" error={errors.full_name?.message} {...register("full_name")} />
          <Input label="E-posta" type="email" placeholder="onur@example.com" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <div className="relative">
            <Input label="Şifre" type={showPass ? "text" : "password"} placeholder="En az 8 karakter" autoComplete="new-password" hint="En az 8 karakter" error={errors.password?.message} {...register("password")} />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-8 text-white/40 hover:text-white/70 transition-colors" tabIndex={-1}>
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Input label="Şifre Tekrar" type={showPass ? "text" : "password"} placeholder="Şifreni tekrar gir" autoComplete="new-password" error={errors.confirm_password?.message} {...register("confirm_password")} />

          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
            Hesap Oluştur
          </Button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Zaten hesabın var mı?{" "}
          <Link href="/auth/login" className="text-[#E50001] hover:text-red-400 font-medium transition-colors">
            Giriş yap
          </Link>
        </p>
      </GlassSurface>
    </motion.div>
  )
}
