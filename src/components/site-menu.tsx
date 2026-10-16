"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Cat = { slug: string; name: string; href: string; emoji: string; desc?: string };
type Svc = { id: string; name: string; items: Cat[] };
type Item = { label: string; href: string };

const item = "block rounded-lg px-3 py-2 text-sm hover:bg-wine-50";

export function SiteMenu({ items, services }: { items: Item[]; services: Svc[] }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [svcAt, setSvcAt] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const open = openAt === pathname; // navigating changes pathname, which closes the menu
  const svc = svcAt === pathname;
  const svcLabel = items.find((i) => i.href === "services")?.label ?? "Services";

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpenAt(null); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenAt(null); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  useEffect(() => {
    if (!svc) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setSvcAt(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [svc]);

  return (
    <div ref={ref} className="relative ml-auto">
      <button type="button" aria-label="Menu" aria-expanded={open} className="btn btn-outline px-4 text-xl leading-none"
        onClick={() => setOpenAt(open ? null : pathname)}>{"\u2261"}</button>
      {open && (
        <div className="absolute right-0 mt-2 max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-line bg-paper p-2 shadow-lg"
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpenAt(null); }}>
          {items.map((it) => it.href === "services" ? (
            <button key={it.label} type="button" className={item + " flex w-full items-center justify-between text-left"}
              onClick={() => { setSvcAt(pathname); setOpenAt(null); }}>
              <span>{it.label}</span>
              <span className="text-xs text-muted">{"\u2192"}</span>
            </button>
          ) : (
            <Link key={it.label + it.href} href={it.href} className={item}>{it.label}</Link>
          ))}
        </div>
      )}
      {svc && createPortal(
        <div role="dialog" aria-modal="true" className="reveal fixed inset-0 z-[60] overflow-y-auto bg-cream-50"
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setSvcAt(null); }}>
          <div className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
            <div className="container-page flex h-16 items-center justify-between">
              <h2 className="text-2xl font-semibold text-wine-700">{svcLabel}</h2>
              <button type="button" aria-label="Close" className="btn btn-outline px-4 text-lg leading-none" onClick={() => setSvcAt(null)}>{"\u2715"}</button>
            </div>
          </div>
          <div className="container-page space-y-10 py-8">
            {services.map((g) => (
              <section key={g.id}>
                <Link href={"/vendors?group=" + g.id} className="text-xl font-semibold text-wine-700 hover:underline">{g.name}</Link>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((c) => (
                    <Link key={c.slug} href={c.href} className="card card-hover flex items-start gap-4 p-5">
                      <span className="text-4xl">{c.emoji}</span>
                      <span className="min-w-0">
                        <span className="block text-lg font-semibold">{c.name}</span>
                        {c.desc && <span className="mt-1 line-clamp-2 block text-sm text-muted">{c.desc}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}