import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/"],
        disallow: ["/app/", "/admin/", "/onboarding/", "/api/"],
      },
    ],
    sitemap: "https://sermayem.com/sitemap.xml",
    host: "https://sermayem.com",
  }
}
