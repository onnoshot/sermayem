import type { MetadataRoute } from "next"
import { getAllPostsWithGenerated } from "@/lib/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsWithGenerated()
  const base = "https://sermayem.com"
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/pro`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/auth/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const publishedAt = new Date(post.publishedAt)
    const isRecent = publishedAt > thirtyDaysAgo
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: publishedAt,
      changeFrequency: isRecent ? ("weekly" as const) : ("monthly" as const),
      priority: isRecent ? 0.85 : 0.75,
    }
  })

  return [...staticPages, ...blogPages]
}
