import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPost, getAllPosts, getPostWithGenerated, getAllPostsWithGenerated } from "@/lib/blog"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostWithGenerated(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: "Sermayem" }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Sermayem"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `https://sermayem.com/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostWithGenerated(slug)
  if (!post) notFound()

  const allPostsList = await getAllPostsWithGenerated()
  const relatedPosts = allPostsList
    .filter((p) => p.slug !== slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: { "@type": "Organization", name: "Sermayem", url: "https://sermayem.com" },
        publisher: {
          "@type": "Organization",
          name: "Sermayem",
          url: "https://sermayem.com",
          logo: { "@type": "ImageObject", url: "https://sermayem.com/og-image.png", width: 1200, height: 630 },
        },
        image: { "@type": "ImageObject", url: "https://sermayem.com/og-image.png", width: 1200, height: 630 },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://sermayem.com/blog/${slug}` },
        keywords: post.tags.join(", "),
        articleSection: post.category,
        inLanguage: "tr-TR",
        url: `https://sermayem.com/blog/${slug}`,
        wordCount: Math.round(post.content.replace(/<[^>]+>/g, "").split(/\s+/).length),
        timeRequired: `PT${post.readTime}M`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://sermayem.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://sermayem.com/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://sermayem.com/blog/${slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#08080C]">
        {/* Header */}
        <header className="border-b border-white/[0.06] bg-[#08080C]/95 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 345 345" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0 C1.4955858 0.72372423 2.99193978 1.44586293 4.48901367 2.16650391 C8.41719117 4.06242954 12.33495859 5.97894619 16.25079346 7.90020752 C20.1286888 9.79863064 24.0156769 11.6782116 27.90234375 13.55859375 C32.3924081 15.7316738 36.88093378 17.90762409 41.36132812 20.10058594 C47.65240748 23.17841809 53.94494771 26.23516727 60.31640625 29.14453125 C65.01317679 31.29911854 66.75376854 32.08005424 68.5012207 32.84521484 C76.17484749 37.12453367 79.09157912 39.81358808 80.08435059 43.99913025 C80.26758561 46.21554804 80.29240272 48.37794931 80.25390625 50.6015625 C80.26024004 54.72504642 80.24692521 56.41439002 80.22192383 58.10351562 C80.22070312 65.8515625 80.21380697 67.49741036 80.21380697 67.49741036 C80.12879307 76.65741779 79.91031758 78.68408663 77.75366211 81.54443359 C74.69504072 83.72570528 69.625 83.0625 69.625 83.0625 C64.38542998 80.9650139 55.625 74.0625 55.625 74.0625 C54.44919068 69.72212293 54.30859375 67.05078125 54.30859375 67.05078125 C53.625 54.0625 51.2421875 53.3515625 51.2421875 53.3515625 C46.58176609 51.69072118 37.75 47.4375 37.75 47.4375 C30.20130341 43.8141077 25.51452184 41.52199977 20.85888672 39.16040039 C17.45922703 37.43746875 10.625 34.0625 10.625 34.0625 C4.24230673 30.90641346 1.13262968 29.40291161 -1.98361206 27.9112854 C-7.48179 25.21380929 -11.03125 23.52734375 -11.03125 23.52734375 C-21.33991566 19.89085661 -33.44140625 25.7109375 -33.44140625 25.7109375 C-38.12420343 28.02050256 -42.9375 30.4375 -42.9375 30.4375 C-52.90685439 35.36947544 -55.39263916 36.60507202 -55.39263916 36.60507202 C-63.03629572 40.40435719 -78.45922852 47.71240234 -78.45922852 47.71240234 C-85.375 51.0625 -93.05297852 56.85083008 -93.05297852 56.85083008 C-94.41493033 66.20482669 -92.5625 85.5 -92.5625 85.5 C-92.34960938 89.25585938 -92.10546875 92.87109375 -92.10546875 92.87109375 C-91.29977252 99.48551879 -88.375 104.0625 -88.375 104.0625 C-85.79722804 105.8022318 -75.4375 110.5625 -75.4375 110.5625 C-68.17863048 113.98333243 -61.41247559 117.11950684 -61.41247559 117.11950684 C-48.05263112 123.33652262 -37.26171875 128.3203125 -37.26171875 128.3203125 C-22.84470525 135.32008901 -16.375 135.0625 -16.375 135.0625 C-10.98241726 133.13496536 -7.375 129.0625 -7.375 129.0625 C-13.8113754 126.90923168 -21.25 123.4375 -21.25 123.4375 C-29.82826016 119.35384191 -42.36328125 113.0703125 -42.36328125 113.0703125 C-57.14868164 106.02734375 -57.14868164 106.02734375 -57.14868164 106.02734375 C-64.17318777 101.66827596 -66.375 97.0625 -66.375 97.0625 C-66.78025112 81.61022682 -63.375 75.0625 -63.375 75.0625 C-61.16113281 73.50439453 -52.625 69.1875 -52.625 69.1875 C-43.42048815 64.56413775 -40.375 63.0625 -40.375 63.0625 C-22.20591244 54.00318277 -15.69360352 55.80395508 -15.69360352 55.80395508 C-6.61445172 59.12818044 10.6763916 67.81826782 10.6763916 67.81826782 C23.58203125 74.16796875 26.17550659 75.43998718 26.17550659 75.43998718 C43.79331036 83.83985385 76.625 102.0625 76.625 102.0625 C78.6300476 107.85386518 75.625 119.625 75.625 119.625 C67.13921018 159.16828945 19.125 216.375 19.125 216.375 C10.65644781 222.90256363 -3.375 232.0625 -3.375 232.0625 C-12.66995214 237.84069284 -25.375 238.0625 -25.375 238.0625 C-34.86191508 233.11657536 -39.375 230.0625 -39.375 230.0625 C-61.40263682 213.85490174 -70.375 205.0625 -70.375 205.0625 C-77.375 198.0625 -79.375 196.0625 -79.375 196.0625 C-85.4375 188.0625 -87.20117188 185.59692383 -87.20117188 185.59692383 C-107.44000962 156.86480315 -106.375 144.0625 -106.375 144.0625 C-103.375 141.0625 -76.375 153.6875 -76.375 153.6875 C-64.71087449 173.68964974 -53.375 185.0625 -53.375 185.0625 C-42.9288019 195.45590781 -25.375 208.0625 -25.375 208.0625 C-20.31102217 210.42759043 -15.375 209.0625 -15.375 209.0625 C-7.8125 204.25 -5.69677734 202.76757812 -5.69677734 202.76757812 C21.2339353 183.47795733 47.625 123.0625 47.625 123.0625 C47.6875 118.8125 47.625 115.0625 47.625 115.0625 C29.16184762 105.13074592 -8.85546875 87.62109375 -8.85546875 87.62109375 C-17.66404817 83.45468002 -23.375 84.0625 -23.375 84.0625 C-31.375 88.0625 -22.51953125 93.91796875 -22.51953125 93.91796875 C-13.90026838 97.83168789 -5.63716125 101.63046265 -5.63716125 101.63046265 C1.54417236 104.93090164 15.625 112.0625 15.625 112.0625 C22.92578125 115.6640625 28.05859375 126.71875 28.05859375 126.71875 C28.0625 130.5625 28.12109375 134.40625 28.12109375 134.40625 C27.53119903 138.75382055 23.625 144.0625 23.625 144.0625 C19.30643795 146.80720718 16.875 148 16.875 148 C8.76855067 152.10422244 -3.84375 157.51953125 -3.84375 157.51953125 C-9.18810572 160.01596752 -11.8125 161.5 -11.8125 161.5 C-17.63633942 164.05431553 -27.79174805 161.7980957 -27.79174805 161.7980957 C-35.95989763 157.99842661 -40 156 -40 156 C-53.79833984 149.30371094 -53.79833984 149.30371094 -53.79833984 149.30371094 C-66.83203125 142.9765625 -78.68359375 137.24267578 -78.68359375 137.24267578 C-95.35546875 129.265625 -98.03149414 128.01928711 -98.03149414 128.01928711 C-102.75952148 125.84985352 -114.44921875 117.1953125 -114.44921875 117.1953125 C-119.6983894 100.0101296 -119.73144531 48.70849609 -119.73144531 48.70849609 C-119.24921348 43.77585901 -114.38232422 36.3059082 -114.38232422 36.3059082 C-112.0546875 35.05078125 -106.375 32.0625 -106.375 32.0625 C-99.62686089 28.66525568 -92.5 25.25 -92.5 25.25 C-80.52320792 19.50980119 -64.14575195 12.11621094 -64.14575195 12.11621094 C-54.12271426 7.49615193 -49.1875 5 -49.1875 5 C-41.86607314 1.31426791 -39.18164062 -0.06201172 -39.18164062 -0.06201172 C-32.4375 -3.4375 -30.39575195 -4.50024414 -30.39575195 -4.50024414 C-19.02425604 -10.04687199 0 0 0 0 Z" fill="#E50001" transform="translate(192.375,56.9375)"/>
              </svg>
              <span className="text-sm font-semibold text-white/80">Sermayem</span>
            </Link>
            <Link href="/blog" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              ← Blog
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Meta */}
          <div className="mb-6">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#E50001]/70 bg-[#E50001]/10 px-2 py-0.5 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">{post.title}</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{post.description}</p>
            <div className="flex items-center gap-2 text-xs text-white/25 pb-6 border-b border-white/[0.07]">
              <span>Sermayem</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>·</span>
              <span>{post.readTime} dk okuma</span>
            </div>
          </div>

          {/* Content */}
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 rounded-[20px] bg-[#E50001]/[0.07] border border-[#E50001]/20 text-center">
            <p className="text-white/70 text-sm mb-4">Gelir ve giderlerinizi kolayca takip edin. Ücretsiz hesap oluşturun.</p>
            <Link href="/auth/signup"
              className="inline-block px-6 py-2.5 rounded-full bg-[#E50001] text-white text-sm font-semibold hover:bg-[#cc0001] transition-colors">
              Hemen Başla — Ücretsiz
            </Link>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-white/30">
                {tag}
              </span>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`}
                    className="group block p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#E50001]/60 block mb-1.5">{rp.category}</span>
                    <p className="text-xs font-medium text-white/75 leading-snug group-hover:text-white transition-colors line-clamp-3">{rp.title}</p>
                    <p className="text-[10px] text-white/25 mt-2">{rp.readTime} dk okuma</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-white/[0.05] mt-12 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-xs text-white/20">
            © {new Date().getFullYear()} Sermayem. Tüm hakları saklıdır. |{" "}
            <Link href="/blog" className="hover:text-white/40 transition-colors">Blog</Link>
          </div>
        </footer>
      </div>
    </>
  )
}
