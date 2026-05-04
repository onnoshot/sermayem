"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassSurface } from "@/components/ui/glass-surface"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (error) {
      toast.error("Giriş başarısız", { description: "E-posta veya şifren hatalı." })
      return
    }
    router.push("/app")
    router.refresh()
  }

  return (
    <div>
      <GlassSurface className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Tekrar hoş geldin</h1>
          <p className="text-sm text-white/50">Sermayem hesabına giriş yap</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="E-posta" type="email" placeholder="onur@example.com" autoComplete="email" error={errors.email?.message} {...register("email")} />

          <div className="relative">
            <Input
              label="Şifre"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-8 text-white/40 hover:text-white/70 transition-colors" tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs text-white/40 hover:text-yellow-400 transition-colors">
              Şifremi unuttum
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
            Giriş Yap
          </Button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Hesabın yok mu?{" "}
          <Link href="/auth/signup" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
            Kayıt ol
          </Link>
        </p>
      </GlassSurface>
    </div>
  )
}
