"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

export function ProgressiveItems({ children, batch = 6 }: { children: ReactNode; batch?: number }) {
  const items = Children.toArray(children);
  const [shown, setShown] = useState(batch);
  const sentinel = useRef<HTMLDivElement>(null);
  const more = shown < items.length;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !more) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setShown((n) => n + batch); },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [more, batch, shown]);

  return (
    <>
      {items.slice(0, shown).map((it, i) => (
        <div key={i} className="reveal flex [&>*]:w-full" style={{ animationDelay: (i % batch) * 70 + "ms" }}>{it}</div>
      ))}
      {more && (
        <div ref={sentinel} className="col-span-full flex items-center justify-center gap-2 py-8 text-sm text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold-400" />
          Loading more...
        </div>
      )}
    </>
  );
}