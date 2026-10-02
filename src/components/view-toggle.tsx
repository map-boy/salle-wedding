"use client";

import { useEffect, useState } from "react";

export type View = "grid" | "list";
const KEY = "media:view";
const EVT = "view-change";
let current: View | null = null;

function read(): View {
  if (current) return current;
  try { return localStorage.getItem(KEY) === "list" ? "list" : "grid"; } catch { return "grid"; }
}

export function useView(): [View, (v: View) => void] {
  const [view, set] = useState<View>("grid");
  useEffect(() => {
    const sync = () => { const v = read(); set(v); document.documentElement.dataset.view = v; };
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const setView = (v: View) => {
    current = v;
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    window.dispatchEvent(new Event(EVT));
  };
  return [view, setView];
}

export function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-line text-xs">
      {(["grid", "list"] as const).map((v) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={"px-3 py-1.5 " + (view === v ? "bg-wine-600 text-white" : "bg-paper text-ink")}>
          {v === "grid" ? "Grid" : "List"}
        </button>
      ))}
    </div>
  );
}

export function PageViewToggle() {
  const [view, setView] = useView();
  return <ViewToggle view={view} onChange={setView} />;
}