"use client";

import { useState } from "react";

const CODES = [
  0x1F3DB, 0x26EA, 0x1F3E8, 0x1F3E0, 0x1F334, 0x1F37D, 0x1F382, 0x1F370, 0x1F942, 0x1F37E, 0x1F377, 0x1F379,
  0x1F4F8, 0x1F3A5, 0x1F3A8, 0x1F490, 0x1F338, 0x1F33A, 0x26FA, 0x1FA91, 0x1F484, 0x1F487, 0x1F457, 0x1F454,
  0x1F935, 0x1F470, 0x1F48D, 0x1F48C, 0x1F497, 0x2764, 0x1F697, 0x1F68C, 0x1F6A4, 0x1F3A7, 0x1F3B8, 0x1F941,
  0x1F3A4, 0x1F3B6, 0x1F3B7, 0x1F483, 0x1F4CB, 0x1F4C5, 0x1F381, 0x1F389, 0x1F38A, 0x2728, 0x1F31F, 0x1F4A1,
];
const LIST = CODES.map((c) => String.fromCodePoint(c) + "\uFE0F");

export function EmojiPicker({ name, defaultValue = "", className = "" }: { name: string; defaultValue?: string; className?: string }) {
  const [v, setV] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <input name={name} value={v} onChange={(e) => setV(e.target.value)} placeholder="Emoji" className="input w-24 text-center text-xl" />
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Pick"}</button>
        {v && <button type="button" className="text-xs text-wine-600 hover:underline" onClick={() => setV("")}>Clear</button>}
      </div>
      {open && (
        <div className="mt-2 grid grid-cols-8 gap-1 rounded-xl border border-line bg-paper p-2">
          {LIST.map((e) => (
            <button key={e} type="button" onClick={() => { setV(e); setOpen(false); }} className="rounded-md p-1 text-2xl transition hover:bg-wine-50">{e}</button>
          ))}
        </div>
      )}
      <p className="mt-1 text-xs text-muted">Tap Pick, or use your phone emoji keyboard in the box.</p>
    </div>
  );
}