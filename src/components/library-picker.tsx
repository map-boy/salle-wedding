"use client";

import { useState } from "react";

type Item = { path: string; url: string; size: number; type: string; updated: string };

export function LibraryPicker({ onPick }: { onPick: (url: string, isVideo: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  async function show() {
    setOpen(true);
    setErr("");
    const r = await fetch("/api/admin/media", { cache: "no-store" });
    const j = (await r.json().catch(() => ({}))) as { items?: Item[]; error?: string };
    if (!r.ok) { setErr(j.error || "Could not load the library."); setItems([]); return; }
    setItems(j.items ?? []);
  }

  return (
    <>
      <button type="button" className="btn btn-outline btn-sm" onClick={show}>Pick from library</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="card max-h-[85vh] w-full max-w-4xl overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Media library</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Done</button>
            </div>
            {err && <p className="text-sm text-wine-700">{err}</p>}
            {items === null && <p className="text-sm text-muted">Loading...</p>}
            {items && !items.length && !err && <p className="text-sm text-muted">No uploads yet. Upload files from the Media library tab.</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items?.map((it) => {
                const vid = it.type.startsWith("video/");
                return (
                  <button type="button" key={it.path} className="rounded-xl border border-line p-2 text-left hover:border-wine-500"
                    onClick={() => { onPick(it.url, vid); setAdded((a) => ({ ...a, [it.path]: true })); }}>
                    {vid
                      ? <video src={it.url} preload="metadata" className="h-24 w-full rounded-lg object-cover" />
                      : <img src={it.url} alt="" loading="lazy" className="h-24 w-full rounded-lg object-cover" />}
                    <p className="mt-1 truncate text-xs">{it.path.split("/").pop()}</p>
                    <p className="text-xs text-wine-700">{added[it.path] ? "Added" : "Click to add"}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}