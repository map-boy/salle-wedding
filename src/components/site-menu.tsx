"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

type Svc = { id: string; name: string; href: string; emoji: string };
type Item = { label: string; href: string };

export function SiteMenu({ items, services }: { items: Item[]; services: Svc[] }) {
  const ref = useRef<HTMLDetailsElement>(null); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll("details").forEach((d) => { d.open = false; });
    el.open = false;
  }, []);

  useEffect(() => { close(); }, [pathname, close]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = ref.current;
      if (el && el.open && !el.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } }; const scheduleClose = () => { cancel(); timer.current = setTimeout(close, 250); }; const item = "block rounded-lg px-3 py-2 text-sm hover:bg-wine-50";

  return (
    <details ref={ref} className="relative ml-auto" onMouseEnter={cancel} onMouseLeave={scheduleClose}>
      <summary aria-label="Menu" className="btn btn-outline list-none px-4 text-xl leading-none">{"\u2261"}</summary>
      <div
        className="absolute right-0 mt-2 max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-lg"
        onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}
      >
        {items.map((it) => it.href === "services" ? (
          <details key={it.label} className="group">
            <summary className={item + " flex cursor-pointer list-none items-center justify-between"}>
              <span>{it.label}</span>
              <span className="text-xs text-muted transition group-open:rotate-180">{"\u25BE"}</span>
            </summary>
            <div className="ml-3 border-l border-line pl-2">
              {services.map((s) => (
                <Link key={s.id} href={s.href} className={item}>{s.emoji + " " + s.name}</Link>
              ))}
            </div>
          </details>
        ) : (
          <Link key={it.label + it.href} href={it.href} className={item}>{it.label}</Link>
        ))}
      </div>
    </details>
  );
}
