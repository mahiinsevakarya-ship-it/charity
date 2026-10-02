import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileChrome } from "@/components/layout/MobileChrome";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sevakarya.com"),
  title: {
    default: "SevaKarya — Give What You Don't Need. Change Someone's Tomorrow.",
    template: "%s · SevaKarya",
  },
  description:
    "SevaKarya makes it easy to donate pre-owned clothes, books, shoes and bags to verified NGOs, shelters and schools — and earn Impact Stars for every verified donation.",
  keywords: [
    "donate clothes",
    "donate books",
    "reuse platform",
    "social impact",
    "NGO donations",
    "SevaKarya",
    "Impact Stars",
  ],
  openGraph: {
    title: "SevaKarya — Give it a second life",
    description:
      "Your old clothes, books and shoes can become someone else's new beginning. Donate in under 3 minutes.",
    type: "website",
    siteName: "SevaKarya",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e5c43",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen pb-20 md:pb-0">
        <OrganizationJsonLd />
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileChrome />
        </AppProvider>
      </body>
    </html>
  );
}
