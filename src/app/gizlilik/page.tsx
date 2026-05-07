import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Sermayem",
  description: "Sermayem gizlilik politikası ve kişisel veri kullanımı hakkında bilgi.",
  robots: { index: false },
}

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#08080C]">
      <header className="border-b border-white/[0.06] bg-[#08080C]/95 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">Sermayem</Link>
          <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition-colors">Ana Sayfa</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">Gizlilik Politikası</h1>
        <p className="text-xs text-white/30 mb-10">Son güncellenme: Mayıs 2026</p>

        <div className="prose-sm space-y-8 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Toplanan Veriler</h2>
            <p>
              Sermayem, hizmet sunabilmek için yalnızca gerekli olan verileri toplar: hesap bilgileri (ad, e-posta), sizin girdiğiniz finansal işlem verileri ve teknik kullanım bilgileri. Hiçbir finansal veriniz pazarlama amacıyla kullanılmaz veya üçüncü taraflara satılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Verilerin Kullanımı</h2>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Hesabınızı oluşturmak ve giriş yapmanızı sağlamak",
                "Gelir, gider, bütçe ve hedef takibini çalıştırmak",
                "Fiş tarama ve AI koç özelliklerini sunmak",
                "Aylık özet ve raporları oluşturmak",
                "Hizmetin güvenli ve kararlı çalışmasını sağlamak",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Güvenlik</h2>
            <p>
              Verileriniz AES-256 şifreleme ile depolanır ve TLS 1.3 ile iletilir. Altyapı sağlayıcılarımız güvenlik standartlarına uygun hizmet sunmaktadır. Finansal verileriniz hiçbir reklam ağına veya analitik platformuna aktarılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Çerezler</h2>
            <p>
              Sermayem, oturum yönetimi ve teknik işlevler için zorunlu çerezler kullanır. Detaylar için <Link href="/cerez-politikasi" className="text-white/50 underline hover:text-white/70 transition-colors">Çerez Politikamızı</Link> inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">Yurt Dışı Aktarım</h2>
            <p>
              Teknik altyapımız yurt dışındaki sağlayıcılar üzerinde çalışmaktadır (Supabase, Vercel, Anthropic). Bu aktarım, kayıt sırasında verdiğiniz açık rızaya dayanmaktadır. Ayrıntılar için <Link href="/kvkk" className="text-white/50 underline hover:text-white/70 transition-colors">KVKK Aydınlatma Metnimizi</Link> inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">İletişim</h2>
            <p>
              Gizlilik konusundaki sorularınız için: <span className="text-white/50">sermayeminfo@gmail.com</span>
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
