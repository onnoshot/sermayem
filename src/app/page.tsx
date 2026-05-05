import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Sermayem — Gelir Gider Takip ve Kişisel Finans Uygulaması",
  description: "Gelir, gider ve birikimini tek panelde yönet. Bütçe planla, tasarruf hedefi belirle, finansal özgürlüğe ulaş. Türkiye'nin en kolay kişisel finans uygulaması. Ücretsiz başla.",
  alternates: { canonical: "https://sermayem.com" },
  openGraph: {
    title: "Sermayem — Gelir Gider Takip ve Kişisel Finans Uygulaması",
    description: "Gelir, gider ve birikimini tek panelde yönet. Bütçe planla, tasarruf hedefi belirle, finansal özgürlüğe ulaş.",
    url: "https://sermayem.com",
    type: "website",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sermayem.com/#website",
      url: "https://sermayem.com",
      name: "Sermayem",
      description: "Gelir, gider ve birikimini tek panelde yönet. Kişisel finans uygulaması.",
      inLanguage: "tr-TR",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://sermayem.com/blog?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://sermayem.com/#organization",
      name: "Sermayem",
      url: "https://sermayem.com",
      logo: {
        "@type": "ImageObject",
        url: "https://sermayem.com/favicon.svg",
        width: 512,
        height: 512,
      },
      sameAs: [],
      description: "Türkiye'nin kişisel finans ve gelir-gider takip platformu.",
    },
    {
      "@type": "SoftwareApplication",
      name: "Sermayem",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, iOS, Android",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      description: "Gelir ve giderleri kolayca takip edin, bütçe oluşturun, tasarruf hedefleri belirleyin.",
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "124" },
      inLanguage: "tr-TR",
      url: "https://sermayem.com",
      publisher: { "@id": "https://sermayem.com/#organization" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Sermayem ücretsiz mi?",
          acceptedAnswer: { "@type": "Answer", text: "Evet, Sermayem temel özellikleriyle tamamen ücretsizdir. Hemen hesap oluşturarak gelir ve giderlerinizi takip etmeye başlayabilirsiniz." },
        },
        {
          "@type": "Question",
          name: "Sermayem ile gelir gider takibi nasıl yapılır?",
          acceptedAnswer: { "@type": "Answer", text: "Hesap oluşturduktan sonra gelir ve gider kaynaklarınızı tanımlayın, işlemlerinizi ekleyin ve anlık raporlarla finansal durumunuzu görün. Çok kolay ve hızlıdır." },
        },
        {
          "@type": "Question",
          name: "Verilerimi güvende mi?",
          acceptedAnswer: { "@type": "Answer", text: "Evet, tüm verileriniz şifrelenmiş olarak güvenli sunucularda saklanır. Kişisel finansal bilgileriniz kesinlikle üçüncü taraflarla paylaşılmaz." },
        },
      ],
    },
  ],
}

export default function RootPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </>
  )
}
