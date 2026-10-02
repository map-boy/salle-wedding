"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/upload-client";

export function ImageInput({ label, name, defaultValue = "", hint, className = "" }: {
  label?: string; name: string; defaultValue?: string; hint?: string; className?: string;
}) {
  const [v, setV] = useState(defaultValue);
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function pick(f?: File) {
    if (!f) return;
    setError("");
    setPct(0);
    try { setV(await uploadFile(f, setPct)); } catch (e) { setError((e as Error).message); }
    setPct(null);
  }

  return (
    <div className={className}>
      {label && <label className="label" htmlFor={name}>{label}</label>}
      <div className="flex gap-2">
        <input id={name} name={name} value={v} onChange={(e) => setV(e.target.value)} className="input" />
        <button type="button" className="btn btn-outline btn-sm shrink-0" disabled={pct !== null} onClick={() => ref.current?.click()}>
          {pct === null ? "Upload" : `${pct}%`}
        </button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {v && <img src={v} alt="" className="mt-2 h-16 rounded border border-line object-contain" />}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}