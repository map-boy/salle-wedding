"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Cat = { slug: string; name: string; href: string; emoji: string };
type Svc = { id: string; name: string; items: Cat[] };
type Item = { label: string; href: string };

const item = "block rounded-lg px-3 py-2 text-sm hover:bg-wine-50";

export function SiteMenu({ items, services }: { items: Item[]; services: Svc[] }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [svc, setSvc] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const open = openAt === pathname; // navigating changes pathname, which closes the menu

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpenAt(null); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenAt(null); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-auto">
      <button type="button" aria-label="Menu" aria-expanded={open} className="btn btn-outline px-4 text-xl leading-none"
        onClick={() => { setOpenAt(open ? null : pathname); setSvc(false); }}>{"\u2261"}</button>
      {open && (
        <div className="absolute right-0 mt-2 max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-line bg-paper p-2 shadow-lg"
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpenAt(null); }}>
          {items.map((it) => it.href === "services" ? (
            <div key={it.label}>
              <button type="button" aria-expanded={svc} className={item + " flex w-full items-center justify-between text-left"} onClick={() => setSvc((s) => !s)}>
                <span>{it.label}</span>
                <span className={"text-xs text-muted transition " + (svc ? "rotate-180" : "")}>{"\u25BE"}</span>
              </button>
              {svc && (
                <div className="ml-3 border-l border-line pl-2">
                  {services.map((g) => (
                    <div key={g.id}>
                      <Link href={"/vendors?group=" + g.id} className="block px-3 pt-2 text-xs uppercase tracking-wide text-muted hover:text-wine-600">{g.name}</Link>
                      {g.items.map((c) => <Link key={c.slug} href={c.href} className={item}>{c.emoji + " " + c.name}</Link>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={it.label + it.href} href={it.href} className={item}>{it.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}