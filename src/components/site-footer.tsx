import Link from "next/link";
import { pairs } from "@/lib/content";
import { readDb } from "@/lib/db";

export async function SiteFooter() {
  const { settings: s } = await readDb();
  const links = pairs(s, "footer.links");
  return (
    <footer id="contact" className="mt-20 border-t border-line bg-cream-100">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold text-wine-700">{s.siteName}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{s.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="label">Explore</p>
          <ul className="space-y-1.5">
            {links.map(([label, href]) => (
              <li key={label + href}><Link href={href} className="hover:text-wine-600">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="label">Contact</p>
          <ul className="space-y-1.5 text-muted">
            <li>{s.contactAddress}</li>
            <li>{s.contactPhone}</li>
            <li>{s.contactEmail}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        {s.footerNote} <Link href="/admin" className="ml-2 underline-offset-2 hover:underline">Admin</Link>
      </div>
    </footer>
  );
}
