import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 30

const client = new Anthropic()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Vision not configured" }, { status: 503 })
  }

  const today = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }).split(" ")[0]
    .split(".").reverse().join("-")

  let imageBase64: string
  let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"

  try {
    const body = await request.json() as { imageBase64: string; mimeType?: string }
    const raw = body.imageBase64
    const match = raw.match(/^data:(image\/[a-z+]+);base64,(.+)$/)
    if (match) {
      const rawType = match[1]
      // Normalize heic → jpeg (browser should have converted it already)
      mediaType = (rawType === "image/heic" || rawType === "image/heif")
        ? "image/jpeg"
        : rawType as typeof mediaType
      imageBase64 = match[2]
    } else {
      imageBase64 = raw
      mediaType = (body.mimeType as typeof mediaType) || "image/jpeg"
    }
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
  }

  const systemPrompt = `Sen Türkiye'deki market, restoran, kafe, eczane ve diğer işletme fişlerini analiz eden bir asistansın.

TÜRK FİŞ FORMATI BİLGİSİ:
- Toplam tutar: "TOPLAM", "GENEL TOPLAM", "ÖD. TUTARI", "TAHSİL EDİLEN", "TUTAR" anahtar kelimeleriyle gösterilir
- KDV dahil toplam her zaman en alta yakın, en büyük tutardır
- Tarih formatları: "30.04.2026", "30/04/2026", "2026-04-30", "30.04.26"
- Tutar formatı: Binlik ayraç nokta, ondalık ayraç virgüldür → "1.234,56 TL" = 1234.56 lira
- Para birimi: TL, TRY, ₺ hepsi Türk Lirası demektir
- Saat + tarih birlikte olabilir: "30.04.2026 14:35"

ÇIKARILAMASI GEREKEN BİLGİLER:
1. İşletme/marka adı (fişin en üstündeki büyük yazı): Migros, BİM, A101, ŞOK, Carrefour, Getir, D&R, Mavi, LC Waikiki, Zara, Starbucks, McDonald's vb.
2. Toplam tutar (KDV dahil)
3. İşlem tarihi
4. Kategori tahmini

KATEGORİ SEÇENEKLERI (yalnızca bunlardan birini seç):
- "Market" → bakkal, süpermarket, manav
- "Restoran/Kafe" → restoran, kafe, fast food, yemek
- "Fatura" → elektrik, su, doğalgaz, internet, telefon faturası
- "Ulaşım" → akaryakıt, otopark, taksi, toplu taşıma
- "Sağlık" → eczane, hastane, klinik, optik
- "Giyim" → kıyafet, ayakkabı, aksesuar mağazaları
- "Eğlence" → sinema, konser, oyun, spor salonu
- "Elektronik" → teknoloji, telefon, bilgisayar
- "Kişisel Bakım" → kuaför, güzellik, parfümeri
- "Diğer" → yukarıdakiler dışında her şey

ÇIKTI KURALLARI:
- SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma
- Türkçe tutar formatını (1.234,56) standart sayıya (1234.56) çevir
- Tutar bulunamazsa amount alanını null bırak
- Tarih bulunamazsa bugünün tarihini kullan: ${today}

{
  "amount": <sayı veya null>,
  "description": <string, işletme/marka adı, bulunamazsa fiş türü>,
  "date": <string, YYYY-MM-DD>,
  "type": "expense",
  "category": <string, yukarıdaki listeden biri>,
  "currency": "TRY",
  "notes": <string, varsa önemli not, yoksa boş string>
}`

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Bu Türk fişini/faturasını analiz et. Tüm metni dikkatlice oku, özellikle TOPLAM ve tarih satırlarına odaklan. Belirtilen JSON formatında yanıt ver.",
            },
          ],
        },
      ],
      system: systemPrompt,
    })

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : ""

    // Try to extract JSON — handle markdown code blocks too
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/)
    const jsonStr = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : text

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      // Last-ditch: try to extract just the JSON object
      const objMatch = text.match(/\{[\s\S]*\}/)
      if (!objMatch) {
        console.error("scan-receipt: no JSON in response:", text)
        return NextResponse.json({ error: "Fiş okunamadı — JSON bulunamadı" }, { status: 422 })
      }
      parsed = JSON.parse(objMatch[0])
    }

    // Normalize amount: handle Turkish number format just in case model didn't
    if (typeof parsed.amount === "string") {
      const amtStr = (parsed.amount as string).replace(/\./g, "").replace(",", ".")
      parsed.amount = parseFloat(amtStr) || null
    }

    // Validate and clamp
    if (typeof parsed.amount === "number" && (isNaN(parsed.amount) || parsed.amount <= 0)) {
      parsed.amount = null
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("scan-receipt error:", err)
    const message = err instanceof Error ? err.message : "Bilinmeyen hata"
    return NextResponse.json({ error: `Tarama başarısız: ${message}` }, { status: 500 })
  }
}
