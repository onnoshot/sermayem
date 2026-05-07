import type { Metadata } from "next"
import { ProPage } from "@/components/landing/pro-page"

export const metadata: Metadata = {
  title: "Sermayem Pro — AI Koç, Fiş Tarama ve PDF Raporlar",
  description: "Sermayem Pro ile AI finansal koç, akıllı fiş tarama, PDF aylık raporlar, KDV özeti ve çok daha fazlası. Finansal verilerinizi bir üst seviyeye taşıyın.",
  alternates: { canonical: "https://sermayem.com/pro" },
  openGraph: {
    title: "Sermayem Pro — Finansal Özgürlüğün Bir Üst Seviyesi",
    description: "AI finansal koç, fiş tarama, PDF raporlar ve KDV özeti ile tüm finanslarınızı profesyonel düzeyde yönetin.",
    url: "https://sermayem.com/pro",
    type: "website",
    images: [{ url: "https://sermayem.com/og-image.png", width: 1200, height: 630, alt: "Sermayem Pro Özellikleri" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sermayem Pro — AI Koç, Fiş Tarama ve PDF Raporlar",
    description: "AI finansal koç, akıllı fiş tarama ve otomatik PDF raporlarla finansal yönetiminizi bir üst seviyeye taşıyın.",
    images: ["https://sermayem.com/og-image.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Sermayem Pro",
      description: "AI finansal koç, fiş tarama, PDF raporlar, KDV özeti ve gelişmiş analizlerle kişisel finanslarınızı profesyonel düzeyde yönetin.",
      url: "https://sermayem.com/pro",
      brand: { "@type": "Organization", name: "Sermayem" },
      offers: {
        "@type": "Offer",
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Sermayem" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://sermayem.com" },
        { "@type": "ListItem", position: 2, name: "Pro Özellikleri", item: "https://sermayem.com/pro" },
      ],
    },
  ],
}

export default function ProRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProPage />
    </>
  )
}
