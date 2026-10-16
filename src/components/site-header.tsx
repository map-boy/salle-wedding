import Link from "next/link";
import Image from "next/image";
import { pairs } from "@/lib/content";
import { categoryHref, readDb } from "@/lib/db";
import { catEmoji, groupEmoji } from "@/lib/emoji";
import { SiteMenu } from "./site-menu";

export async function SiteHeader() {
  const { settings, groups, categories } = await readDb();
  const services = [...groups]
    .filter((g) => !g.hidden)
    .sort((a, b) => a.order - b.order)
    .map((g) => ({
      id: g.id, name: groupEmoji(g) + " " + g.name,
      items: categories.filter((c) => c.groupId === g.id).sort((a, b) => a.order - b.order)
        .map((c) => ({ slug: c.slug, name: c.name, href: categoryHref(c), emoji: catEmoji(c), desc: c.description })),
    }))
    .filter((g) => g.items.length > 0);
  const items = pairs(settings, "menu.items").map(([label, href]) => ({ label, href }));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/80 shadow-sm backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-wine-700"><Image src="/logo-mark-dark.png" alt="" width={31} height={36} priority className="h-9 w-auto" />{settings.siteName}</Link>
        <SiteMenu items={items} services={services} />
      </div>
    </header>
  );
}