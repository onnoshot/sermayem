import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Sermayem",
  description: "Sermayem kullanım koşulları ve üyelik sözleşmesi.",
  robots: { index: false },
}

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-[#08080C]">
      <header className="border-b border-white/[0.06] bg-[#08080C]/95 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">Sermayem</Link>
          <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition-colors">Ana Sayfa</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">Kullanım Koşulları</h1>
        <p className="text-xs text-white/30 mb-10">Son güncellenme: Mayıs 2026</p>

        <div className="prose-sm space-y-8 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">1. Hizmet Kapsamı</h2>
            <p>
              Sermayem, kişisel gelir-gider takibi, bütçeleme, tasarruf hedefleri ve finansal analiz sunan bir web uygulamasıdır. Hizmet yalnızca kişisel kullanım amacıyla sunulmaktadır. Ticari amaçlı kullanım, yeniden satış veya veri kazıma yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">2. Hesap Oluşturma ve Güvenlik</h2>
            <p>
              Hesap oluşturmak için geçerli bir e-posta adresi gereklidir. Hesap güvenliğinizden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayınız. Hesabınızın yetkisiz kullanıma açıldığını fark ederseniz derhal <span className="text-white/50">sermayeminfo@gmail.com</span> adresine bildirin.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">3. Kullanıcı Yükümlülükleri</h2>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Uygulamayı yalnızca hukuka uygun amaçlarla kullanmak",
                "Başkalarının verilerini sisteme girmemek",
                "Sistemin güvenliğini tehdit eden girişimlerde bulunmamak",
                "Otomatik erişim araçları veya botlar kullanmamak",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">4. Finansal Tavsiye Reddi</h2>
            <p>
              Sermayem'deki içerikler ve AI koç önerileri bilgilendirme amaçlıdır; yatırım tavsiyesi niteliği taşımaz. Finansal kararlarınızı bir uzman ile görüşerek verin. Sermayem, yapılan finansal kararlardan doğan sonuçlardan sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">5. Fikri Mülkiyet</h2>
            <p>
              Sermayem markası, tasarımı, kaynak kodu ve içerikleri Sermayem'e aittir. Girdiğiniz kişisel finansal veriler size aittir ve yalnızca hizmetin sunulması amacıyla kullanılır.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">6. Hizmet Değişiklikleri ve Sona Erme</h2>
            <p>
              Sermayem, hizmeti önceden bildirmeksizin değiştirme veya sonlandırma hakkını saklı tutar. Hesabınızı dilediğiniz zaman silebilirsiniz; silme işlemi verilerinizin kalıcı kaldırılmasını tetikler.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">7. Uygulanacak Hukuk</h2>
            <p>
              Bu sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">8. İletişim</h2>
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
