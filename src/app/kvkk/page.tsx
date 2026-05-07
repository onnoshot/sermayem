import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Sermayem",
  description: "Sermayem kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
  robots: { index: false },
}

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-[#08080C]">
      <header className="border-b border-white/[0.06] bg-[#08080C]/95 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
            Sermayem
          </Link>
          <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition-colors">Ana Sayfa</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">KVKK Aydınlatma Metni</h1>
        <p className="text-xs text-white/30 mb-10">Son güncellenme: Mayıs 2026</p>

        <div className="prose-sm space-y-8 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu Sermayem'dir.
              İletişim: <span className="text-white/50">sermayeminfo@gmail.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">2. İşlenen Kişisel Veriler</h2>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Ad soyad ve e-posta adresi (hesap oluşturma için)",
                "Gelir, gider ve işlem verileri (uygulama kullanımı için)",
                "Bütçe ve tasarruf hedefleri (kullanıcı tarafından girilen)",
                "Fiş/makbuz görselleri (tarama özelliği kullanılırsa)",
                "Cihaz ve oturum bilgileri (güvenlik ve teknik işleyiş için)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">3. İşleme Amaçları ve Hukuki Dayanaklar</h2>
            <div className="space-y-3">
              <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
              <ul className="space-y-1.5 list-none pl-0">
                {[
                  "Hizmetin sunulması ve kullanıcı hesabının yönetilmesi (sözleşmenin ifası)",
                  "Finansal takip, bütçeleme ve raporlama özelliklerinin çalıştırılması (sözleşmenin ifası)",
                  "Güvenlik, doğrulama ve hizmet kalitesinin iyileştirilmesi (meşru menfaat)",
                  "Yasal yükümlülüklerin yerine getirilmesi",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">4. Kişisel Verilerin Aktarımı</h2>
            <p className="mb-3">
              Verileriniz, hizmetin teknik altyapısını sağlayan üçüncü taraf hizmet sağlayıcılara aktarılmaktadır. Bu sağlayıcılar yurt dışında (Avrupa Birliği ve Amerika Birleşik Devletleri) yerleşik olup aşağıdakileri kapsamaktadır:
            </p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Supabase Inc. (veritabanı ve kimlik doğrulama altyapısı)",
                "Vercel Inc. (uygulama barındırma ve dağıtım)",
                "Anthropic PBC (yapay zeka işleme, yalnızca ilgili özellikler kullanıldığında)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Bu aktarımlar, KVKK'nın 9. maddesi uyarınca açık rızanıza dayanmaktadır. Kayıt formundaki ilgili onay kutusuyla rıza verebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">5. Veri Sahibi Hakları</h2>
            <p className="mb-3">KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "İşlenmişse buna ilişkin bilgi talep etme",
                "Verilerinizin düzeltilmesini ya da silinmesini talep etme",
                "İşlemenin kısıtlanmasını talep etme",
                "Verilerinize itiraz etme",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Haklarınızı kullanmak için <span className="text-white/50">sermayeminfo@gmail.com</span> adresine e-posta gönderebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-3">6. Veri Saklama Süreleri</h2>
            <p>
              Verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmeniz halinde kişisel verileriniz 30 gün içinde kalıcı olarak silinir. Yasal zorunluluk gerektiren durumlar saklıdır.
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
