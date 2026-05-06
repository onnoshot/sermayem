import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ sourceId: null }, { status: 200 })
  }

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { description, type, sources } = body as {
    description: string
    type: "income" | "expense"
    sources: { id: string; name: string; emoji: string }[]
  }

  if (!description || description.trim().length < 3) {
    return NextResponse.json({ sourceId: null })
  }

  const sourceList = sources.map((s) => `${s.emoji} ${s.name} (id: ${s.id})`).join("\n")
  const typeLabel = type === "income" ? "gelir" : "gider"

  const prompt = `Sen bir Türk kişisel finans uygulamasının kategori öneri motorusun.

İşlem türü: ${typeLabel}
İşlem açıklaması: "${description.trim()}"

Mevcut ${typeLabel} kategorileri:
${sourceList}

Bu işlem için en uygun kategoriyi seç. Sadece JSON döndür, başka hiçbir şey yazma:
{"sourceId": "<id veya null>", "confidence": "high|medium|low"}`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 80,
      messages: [{ role: "user", content: prompt }],
    })

    const text = (response.content[0] as { type: string; text: string }).text.trim()
    const parsed = JSON.parse(text) as { sourceId: string | null; confidence: string }

    const matched = sources.find((s) => s.id === parsed.sourceId)
    return NextResponse.json({
      sourceId: matched ? parsed.sourceId : null,
      sourceName: matched?.name ?? null,
      sourceEmoji: matched?.emoji ?? null,
      confidence: parsed.confidence ?? "low",
    })
  } catch {
    return NextResponse.json({ sourceId: null })
  }
}
