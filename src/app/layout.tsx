import type { Metadata } from "next"
import Script from "next/script"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://sermayem.com"),
  title: {
    default: "Sermayem — Gelir Gider Takip ve Para Yönetimi Uygulaması",
    template: "%s | Sermayem",
  },
  description: "Gelir, gider ve birikimini tek panelde yönet. Sermaye oluştur, finansal hedeflerine ulaş. Türkiye'nin en kapsamlı kişisel finans uygulaması. Ücretsiz başla.",
  keywords: [
    "gelir gider takibi", "kişisel finans uygulaması", "bütçe yönetimi", "tasarruf uygulaması",
    "para yönetimi", "sermaye yönetimi", "harcama takibi", "finansal özgürlük",
    "gelir takibi", "gider takibi", "bütçe planlama", "finans uygulaması türkiye",
    "aylık bütçe", "tasarruf hedefi", "gelir gider tablosu",
  ],
  authors: [{ name: "Sermayem", url: "https://sermayem.com" }],
  creator: "Sermayem",
  publisher: "Sermayem",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://sermayem.com",
    siteName: "Sermayem",
    title: "Sermayem — Gelir Gider Takip ve Para Yönetimi",
    description: "Gelir, gider ve birikimini tek panelde yönet. Türkiye'nin en kapsamlı kişisel finans uygulaması.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sermayem — Kişisel Finans Uygulaması" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sermayem — Gelir Gider Takip ve Para Yönetimi",
    description: "Gelir, gider ve birikimini tek panelde yönet. Ücretsiz başla.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: { canonical: "https://sermayem.com" },
  verification: { google: "n8WmTwZ39tbjnenjrDDZaQ-Dzm2fMAGUmvZWDa-v6bM" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before hydration */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('sermayem-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
      </head>
      <body className="h-full antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J7KB4CV8E7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J7KB4CV8E7');`,
        }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
