import Link from "next/link";
import { pairs } from "@/lib/content";
import { categoryHref, readDb } from "@/lib/db";
import { catEmoji } from "@/lib/emoji";
import { SiteMenu } from "./site-menu";

export async function SiteHeader() {
  const { settings, groups, categories } = await readDb();
  const services = [...groups]
    .filter((g) => g.id !== "planning")
    .sort((a, b) => a.order - b.order)
    .map((g) => {
      const first = categories.filter((c) => c.groupId === g.id).sort((a, b) => a.order - b.order)[0];
      return first ? { id: g.id, name: g.name, href: categoryHref(first), emoji: catEmoji(first) } : null;
    })
    .filter((x): x is { id: string; name: string; href: string; emoji: string } => x !== null);
  const items = pairs(settings, "menu.items").map(([label, href]) => ({ label, href }));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="font-display text-xl font-semibold text-wine-700"><span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-gold-400" />{settings.siteName}</Link>
        <SiteMenu items={items} services={services} />
      </div>
    </header>
  );
}
