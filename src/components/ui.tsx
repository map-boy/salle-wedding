import type { ReactNode } from "react";

const tones = {
  wine: "bg-wine-700 text-white",
  gold: "bg-gold-400 text-ink",
  green: "bg-green-50 text-ok",
  amber: "bg-neutral-100 text-neutral-700",
  red: "bg-neutral-100 text-neutral-700",
  gray: "bg-zinc-100 text-zinc-600",
} as const;

export function Badge({ tone = "gray", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "approved" ? "green" : status === "pending" ? "amber" : status === "rejected" ? "red" : "gray";
  return <Badge tone={tone}>{status}</Badge>;
}

export function Stars({ avg, count }: { avg: number; count: number }) {
  if (!count) return <span className="text-xs text-muted">New</span>;
  return (
    <span className="text-sm">
      <span className="text-gold-500">&#9733;</span> {avg.toFixed(1)} <span className="text-muted">({count})</span>
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card p-10 text-center text-muted">{children}</div>;
}

export function Banner({ tone = "ok", children }: { tone?: "ok" | "bad"; children: ReactNode }) {
  const cls = tone === "ok" ? "border-green-200 bg-green-50 text-ok" : "border-neutral-300 bg-neutral-100 text-neutral-700";
  return <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}