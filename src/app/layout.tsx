import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ts, txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { DEFAULT_OG, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const viewport: Viewport = { themeColor: "#404040" };

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await readDb();
  const title = ts(s, "seo.homeTitle");
  const description = s.seoDescription || s.tagline;
  const image = s.seoImage || DEFAULT_OG;
  return {
    metadataBase: new URL(siteUrl(s)),
    title: { default: title, template: "%s | " + s.siteName },
    description,
    applicationName: s.siteName,
    appleWebApp: { capable: true, title: s.siteName, statusBarStyle: "default" },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: { type: "website", siteName: s.siteName, title, description, url: "/", locale: txt(s, "locale.localeCode"), images: [{ url: image, alt: s.siteName }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable + " " + geistMono.variable + " " + playfair.variable + " h-full antialiased"}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
