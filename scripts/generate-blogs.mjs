import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })
}

function buildPrompt(dateStr) {
  const months = {
    "01": "Ocak", "02": "Subat", "03": "Mart", "04": "Nisan",
    "05": "Mayis", "06": "Haziran", "07": "Temmuz", "08": "Agustos",
    "09": "Eylul", "10": "Ekim", "11": "Kasim", "12": "Aralik",
  }
  const [year, monthNum, day] = dateStr.split("-")
  const monthName = months[monthNum] ?? monthNum
  const monthSlug = monthName.toLowerCase()

  return `Sen sermayem.com icin Turkce kisisel finans blog yazarisin. Sermayem, Turkiye'de kullanilan bir kisisel finans uygulamasidir: gelir/gider takibi, butceleme, tasarruf hedefleri, AI finansal koc ve PDF raporlar sunar.

Bugunun tarihi: ${day} ${monthName} ${year}

Hedef kitle: Turkiye'de yasayan, finansal farkindaliligini artirmak isteyen 18-45 yas arasi bireyler.

BUGUN TURKIYE'DE GUNCEL ve TREND olan kisisel finans konularinda 5 farkli blog yazisi olustur. Her gun farkli konular sec; mevsimsel ve ekonomik guncellige dikkat et (faiz kararlari, enflasyon, vergi sezonlari, tatil donem vb.).

ZORUNLU KURALLAR:
- Hicbir yazida "---" (em-dash tire) karakteri KULLANMA
- Sermayem uygulamasindan bir bolumde dogal olarak bahset
- Guncel Turkiye ekonomisi baglamina uygun ol (TCMB faizi, TL degeri, enflasyon gercekligi)
- Pratik ve uygulanabilir tavsiyeler ver
- Her yazi farkli bir ana konu kapsamali
- HTML icerigi tek satirda (yeni satir yok), tum HTML etiketleri kapali olmali
- Double quote karakterlerini HTML icinde KULLANMA, yerine single quote kullan

save_blog_posts aracini kullanarak 5 blog yazisi olustur. Her yazi icin:
- slug: URL-safe Turkce, tire ile ayrilmis, ${monthSlug}-${year} ile bitsin
- title: SEO dostu 50-60 karakter Turkce baslik
- description: 150-160 karakter meta description
- category: Tasarruf / Butce Yonetimi / Yatirim / Borc Yonetimi / Gelir Artirma / Finansal Planlama / Guncel Finans
- tags: 3-5 SEO etiketi
- readTime: 5-8 (sayi)
- content: HTML formatinda 900-1200 kelime (h2, h3, p, ul, li, strong)`
}

async function main() {
  const today = new Date()
  const dateStr = today.toISOString().split("T")[0]

  console.log(`Generating blogs for ${dateStr}...`)

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    tools: [
      {
        name: "save_blog_posts",
        description: "Save the generated Turkish finance blog posts",
        input_schema: {
          type: "object",
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
    throw new Error("No tool_use block in AI response")
  }

  const posts = toolUse.input.posts
  console.log(`Generated ${posts.length} posts`)

  const saved = []
  const skipped = []

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
      console.log(`Skipped (duplicate?): ${post.slug} — ${error.message}`)
      skipped.push(post.slug)
    } else {
      console.log(`Saved: ${post.slug}`)
      saved.push(post)
    }
  }

  if (saved.length > 0) {
    const lines = saved
      .map((p, i) => `${i + 1}. <b>${p.title}</b>\nhttps://sermayem.com/blog/${p.slug}`)
      .join("\n\n")
    const msg = `<b>Sermayem Blog - Gunluk ${saved.length} Yeni Yazi</b>\n\n${lines}\n\nhttps://sermayem.com/blog`
    await sendTelegram(msg)
    console.log("Telegram notification sent")
  }

  console.log(`Done. Saved: ${saved.length}, Skipped: ${skipped.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
