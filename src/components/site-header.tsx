import Link from "next/link";
import { readDb } from "@/lib/db";

const links = [
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/dashboard/couple", label: "Plan" },
  { href: "/join", label: "Join as vendor" },
];

export async function SiteHeader() {
  const { settings } = await readDb();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="font-display text-xl font-semibold text-wine-700">{settings.siteName}</Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition hover:text-wine-600">{l.label}</Link>
          ))}
        </nav>
        <details className="relative ml-auto md:hidden">
          <summary className="btn btn-outline btn-sm list-none">Menu</summary>
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-line bg-white p-2 shadow-lg">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-wine-50">{l.label}</Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}