import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SevaKarya — Give What You Don't Need",
    short_name: "SevaKarya",
    description:
      "Donate pre-owned clothes, books, shoes and bags to verified NGOs, shelters and schools across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcfa",
    theme_color: "#0e5c43",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
