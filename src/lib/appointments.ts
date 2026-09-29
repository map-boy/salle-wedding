import type { Inquiry } from "./types";

export const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

const KIGALI_MS = 2 * 3600 * 1000;
export const todayKigali = () => new Date(Date.now() + KIGALI_MS).toISOString().slice(0, 10);
const limitDate = () => new Date(Date.now() + KIGALI_MS + 200 * 86400000).toISOString().slice(0, 10);

export const isDateStr = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
export const weekday = (s: string) => new Date(`${s}T00:00:00Z`).getUTCDay();

export function isBookable(s: string, today: string = todayKigali()): boolean {
  return isDateStr(s) && s > today && s <= limitDate() && weekday(s) !== 0;
}

const RE = /^Appointment: (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/;

export function takenSlots(inquiries: Pick<Inquiry, "message" | "status">[]): Set<string> {
  const out = new Set<string>();
  for (const q of inquiries) {
    if (q.status === "closed") continue;
    const m = RE.exec(q.message ?? "");
    if (m) out.add(`${m[1]}|${m[2]}`);
  }
  return out;
}
