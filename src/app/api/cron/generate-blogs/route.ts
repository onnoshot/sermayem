import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export const maxDuration = 60

interface GeneratedPost {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  readTime: number
  content: string
}

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    })
  } catch {}
}

function buildPrompt(dateStr: string): string {
  const months: Record<string, string> = {
    "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan",
    "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos",
    "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık",
  }
  const [year, monthNum, day] = dateStr.split("-")
  const monthName = months[monthNum] ?? monthNum
  const monthSlug = monthName.toLowerCase().replace("ş", "s").replace("ı", "i").replace("ö", "o").replace("ü", "u").replace("ç", "c").replace("ğ", "g")

  return `Sen sermayem.com için Türkçe kişisel finans blog yazarısın. Sermayem, Türkiye'de kullanılan bir kişisel finans uygulamasıdır: gelir/gider takibi, bütçeleme, tasarruf hedefleri, AI finansal koç ve PDF raporlar sunar.

Bugünün tarihi: ${day} ${monthName} ${year}

Hedef kitle: Türkiye'de yaşayan, finansal farkındalığını artırmak isteyen 18-45 yaş arası bireyler.

Şimdi BUGÜN TÜRKİYE'DE GÜNCEL ve TREND olan kişisel finans konularında 5 farklı blog yazısı oluştur. Her gün farklı konular seç; mevsimsel ve ekonomik güncelliğe dikkat et (faiz kararları, enflasyon, vergi sezonları, tatil dönemleri vb.).

Her blog yazısı için şunları oluştur:
- SEO dostu, ilgi çekici bir Türkçe başlık (50-60 karakter ideal)
- 150-160 karakterlik meta description
- URL-safe Türkçe slug: küçük harf, tire ile ayrılmış, ${monthSlug}-${year} ile bitsin (örn: "tasarruf-ipuclari-${monthSlug}-${year}")
- Okuma süresi: 5-8 dakika (readTime sayı olarak)
- HTML formatında tam içerik (h2, h3, p, ul, li, strong etiketleri kullan). 900-1200 kelime.
- Kategori: şunlardan biri: "Tasarruf", "Bütçe Yönetimi", "Yatırım", "Borç Yönetimi", "Gelir Artırma", "Finansal Planlama", "Güncel Finans"
- 3-5 SEO etiketi (Türkçe anahtar kelimeler)

ZORUNLU KURALLAR:
- Hiçbir yazıda "—" (em-dash tire) karakteri KULLANMA
- Sermayem uygulamasından bir bölümde doğal olarak bahset
- Güncel Türkiye ekonomisi bağlamına uygun ol (TCMB faizi, TL değeri, enflasyon gerçekliği)
- Pratik ve uygulanabilir tavsiyeler ver
- Her yazı farklı bir ana konu kapsamalı
- Yazılar profesyonel ama sıcak ve anlaşılır bir dilde olmalı
- HTML içeriği tek satırda (yeni satır yok), tüm HTML etiketleri kapalı olmalı

SADECE JSON dizisi döndür, başka hiçbir şey yazma:
[
  {
    "slug": "ornek-konu-${monthSlug}-${year}",
    "title": "...",
    "description": "...",
    "category": "...",
    "tags": ["...", "...", "..."],
    "readTime": 6,
    "content": "<h2>...</h2><p>...</p>..."
  }
]`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 })
  }

  const today = new Date()
  const dateStr = today.toISOString().split("T")[0]

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const supabase = createAdminClient()

  let posts: GeneratedPost[] = []

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      tools: [
        {
          name: "save_blog_posts",
          description: "Save the generated Turkish finance blog posts",
          input_schema: {
            type: "object" as const,
            properties: {
              posts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    slug: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    readTime: { type: "number" },
                    content: { type: "string" },
                  },
                  required: ["slug", "title", "description", "category", "tags", "readTime", "content"],
                },
              },
            },
            required: ["posts"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "save_blog_posts" },
      messages: [{ role: "user", content: buildPrompt(dateStr) }],
    })

    const toolUse = message.content.find((b) => b.type === "tool_use")
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "No tool_use block in AI response" }, { status: 500 })
    }

    const input = toolUse.input as { posts: GeneratedPost[] }
    posts = input.posts
  } catch (err) {
    return NextResponse.json({ error: "AI generation failed", detail: String(err) }, { status: 500 })
  }

  const saved: GeneratedPost[] = []
  const skipped: string[] = []

  for (const post of posts) {
    const { error } = await supabase.from("generated_blog_posts").insert({
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      published_at: dateStr,
      read_time: post.readTime ?? 6,
      category: post.category,
      tags: post.tags,
    })

    if (error) {
      skipped.push(post.slug)
    } else {
      saved.push(post)
    }
  }

  // Revalidate blog pages so new posts appear immediately
  try {
    revalidatePath("/blog", "page")
    revalidatePath("/sitemap.xml")
    for (const post of saved) {
      revalidatePath(`/blog/${post.slug}`, "page")
    }
  } catch {}

  // Telegram notification
  if (saved.length > 0) {
    const lines = saved.map((p, i) => `${i + 1}. <b>${p.title}</b>\nhttps://sermayem.com/blog/${p.slug}`).join("\n\n")
    const msg = `<b>Sermayem Blog - Gunluk ${saved.length} Yeni Yazi</b>\n\n${lines}\n\nhttps://sermayem.com/blog`
    await sendTelegramMessage(msg)
  }

  return NextResponse.json({
    date: dateStr,
    saved: saved.length,
    skipped: skipped.length,
    posts: saved.map((p) => ({ slug: p.slug, title: p.title })),
  })
}
