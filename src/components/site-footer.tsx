import Link from "next/link";
import { pairs } from "@/lib/content";
import { readDb } from "@/lib/db";

export async function SiteFooter() {
  const { settings: s } = await readDb();
  const links = pairs(s, "footer.links");
  return (
    <footer id="contact" className="mt-20 border-t-4 border-gold-400 bg-wine-900 text-white/80">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold text-white">{s.siteName}</p>
          <p className="mt-2 max-w-xs text-sm text-white/60">{s.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="label">Explore</p>
          <ul className="space-y-1.5">
            {links.map(([label, href]) => (
              <li key={label + href}><Link href={href} className="transition hover:text-gold-400">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="label">Contact</p>
          <ul className="space-y-1.5 text-white/60">
            <li>{s.contactAddress}</li>
            <li>{s.contactPhone}</li>
            <li>{s.contactEmail}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        {s.footerNote} <Link href="/admin" className="ml-2 underline-offset-2 hover:underline">Admin</Link>
      </div>
    </footer>
  );
}
