import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Sermayem — Finansal Özgürlüğün Adresi",
  description: "Gelir, gider ve birikimini tek panelde yönet. Sermaye oluştur, hedeflerine ulaş. Tamamen ücretsiz.",
}

export default function RootPage() {
  return <LandingPage />
}
