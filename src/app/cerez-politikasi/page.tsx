import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Çerez Politikası | Sermayem",
  description: "Sermayem çerez kullanımı hakkında bilgi.",
  robots: { index: false },
}

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen bg-[#08080C]">
      <header className="border-b border-white/[0.06] bg-[#08080C]/95 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">Sermayem</Link>
          <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition-colors">Ana Sayfa</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">Çerez Politikası</h1>
        <p className="text-xs text-white/30 mb-10">Son güncellenme: Mayıs 2026</p>

        <div className="prose-sm space-y-8 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Çerez Nedir?</h2>
            <p>
              Çerezler, web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturum bilgilerinizi ve tercihlerinizi hatırlamak için kullanılırlar.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Kullandığımız Çerezler</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-[12px] border border-white/[0.07] bg-white/[0.02]">
                <p className="text-xs font-semibold text-white/70 mb-1">Zorunlu Çerezler</p>
                <p className="text-xs">Oturum açma ve kimlik doğrulama için gereklidir. Bu çerezler devre dışı bırakılamaz; olmadan uygulama çalışmaz.</p>
              </div>
              <div className="p-4 rounded-[12px] border border-white/[0.07] bg-white/[0.02]">
                <p className="text-xs font-semibold text-white/70 mb-1">İşlevsel Çerezler</p>
                <p className="text-xs">Tema, dil gibi kullanıcı tercihlerini hatırlar. Reddedilirse tercihleriniz her ziyarette sıfırlanır.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Üçüncü Taraf Çerezler</h2>
            <p>
              Sermayem, reklam veya izleme amaçlı üçüncü taraf çerez kullanmaz. Oturum altyapısı Supabase tarafından sağlanmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Çerez Yönetimi</h2>
            <p>
              Tarayıcı ayarlarınızdan çerezleri silebilir veya engekleyebilirsiniz. Zorunlu çerezlerin engellenmesi halinde uygulamaya giriş yapamayabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">İletişim</h2>
            <p>
              Sorularınız için: <span className="text-white/50">sermayeminfo@gmail.com</span>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/[0.05] mt-16 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-[11px] text-white/20">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gizlilik" className="hover:text-white/40 transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="hover:text-white/40 transition-colors">Kullanım Koşulları</Link>
            <Link href="/cerez-politikasi" className="hover:text-white/40 transition-colors">Çerez Politikası</Link>
            <Link href="/kvkk" className="hover:text-white/40 transition-colors">KVKK</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
