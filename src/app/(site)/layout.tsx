import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { readDb } from "@/lib/db";
import { DEFAULT_OG, siteUrl } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings: s } = await readDb();
  const base = siteUrl(s);
  const image = s.seoImage || DEFAULT_OG;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.siteName,
    url: base,
    description: s.seoDescription || s.tagline,
    image: image.startsWith("http") ? image : base + image,
    telephone: s.contactPhone || undefined,
    email: s.contactEmail || undefined,
    address: s.contactAddress ? { "@type": "PostalAddress", addressLocality: s.contactAddress, addressCountry: "RW" } : undefined,
  };
  const json = JSON.stringify(ld).split("<").join(String.fromCharCode(92) + "u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
