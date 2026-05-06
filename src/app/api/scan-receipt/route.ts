import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Vision not configured" }, { status: 503 })
  }

  const today = new Date().toISOString().split("T")[0]

  let imageBase64: string
  let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"

  try {
    const body = await request.json() as { imageBase64: string; mimeType?: string }
    const raw = body.imageBase64
    // Strip data URL prefix if present
    const match = raw.match(/^data:(image\/[a-z+]+);base64,(.+)$/)
    if (match) {
      mediaType = match[1] as typeof mediaType
      imageBase64 = match[2]
    } else {
      imageBase64 = raw
      mediaType = (body.mimeType as typeof mediaType) || "image/jpeg"
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const systemPrompt = `Sen bir Türk kişisel finans uygulaması için fiş ve fatura tarama asistanısın.
Verilen görseli analiz et ve işlem bilgilerini çıkar.
YALNIZCA aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "amount": <sayı, zorunlu, fişin/faturanın toplam tutarı>,
  "description": <string, zorunlu, satıcı/marka adı veya kısa açıklama, Türkçe olabilir>,
  "date": <string, YYYY-MM-DD formatında, bulunamazsa "${today}">,
  "type": "expense",
  "category": <string, önerilen kategori: "Market", "Restoran/Kafe", "Fatura", "Ulaşım", "Sağlık", "Giyim", "Eğlence", "Eğitim", "Spor", "Elektronik", "Kişisel Bakım", "Diğer">,
  "currency": <"TRY" | "USD" | "EUR" | "GBP", para birimi sembolüne göre, varsayılan "TRY">,
  "notes": <string, isteğe bağlı ek bilgi, boş olabilir>
}

Eğer görüntü fiş/fatura değilse yine de mevcut sayısal değerleri ve metni kullanarak en iyi tahmini yap.
Tutar bulunamazsa null döndür.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
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
              text: "Bu görseli analiz et ve belirtilen JSON formatında yanıt ver.",
            },
          ],
        },
      ],
      system: systemPrompt,
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: "Parse error" }, { status: 422 })

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    console.error("scan-receipt error:", err)
    return NextResponse.json({ error: "Scan failed" }, { status: 500 })
  }
}
