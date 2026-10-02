import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sevakarya.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/donate",
          "/impact",
          "/rewards",
          "/partners",
          "/transparency",
          "/faq",
          "/contact",
          "/terms",
          "/privacy",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/ngo",
          "/ngo/*",
          "/auth/*",
          "/api/*",
          "/my-donations/*",
          "/profile",
          "/donation/success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
