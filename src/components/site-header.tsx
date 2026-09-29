import Link from "next/link";
import { categoryHref, readDb } from "@/lib/db";

export async function SiteHeader() {
  const { settings, groups, categories } = await readDb();
  const services = [...groups]
    .filter((g) => g.id !== "planning")
    .sort((a, b) => a.order - b.order)
    .map((g) => {
      const first = categories.filter((c) => c.groupId === g.id).sort((a, b) => a.order - b.order)[0];
      return first ? { id: g.id, name: g.name, href: categoryHref(first) } : null;
    })
    .filter((x): x is { id: string; name: string; href: string } => x !== null);

  const item = "block rounded-lg px-3 py-2 text-sm hover:bg-wine-50";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="font-display text-xl font-semibold text-wine-700">{settings.siteName}</Link>
        <details className="relative ml-auto">
          <summary aria-label="Menu" className="btn btn-outline list-none px-4 text-xl leading-none">{"\u2261"}</summary>
          <div className="absolute right-0 mt-2 max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-lg">
            <Link href="/" className={item}>Home</Link>
            <details className="group">
              <summary className={`${item} flex cursor-pointer list-none items-center justify-between`}>
                <span>Services</span>
                <span className="text-xs text-muted transition group-open:rotate-180">{"\u25BE"}</span>
              </summary>
              <div className="ml-3 border-l border-line pl-2">
                {services.map((s) => (
                  <Link key={s.id} href={s.href} className={item}>{s.name}</Link>
                ))}
              </div>
            </details>
            <Link href="/planning" className={item}>Start planning</Link>
            <Link href="/about" className={item}>About</Link>
            <Link href="/#contact" className={item}>Contact</Link>
            <div className="my-1 border-t border-line" />
            <Link href="/join" className={item}>Join as vendor</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
