import type { Inquiry, Settings } from "./types";

export type BookRules = { offsetHours: number; daysAhead: number; closed: number[] };

export const rulesOf = (s: Pick<Settings, "timezoneOffset" | "appointmentDaysAhead" | "appointmentClosedDays">): BookRules => ({
  offsetHours: s.timezoneOffset ?? 0,
  daysAhead: s.appointmentDaysAhead ?? 0,
  closed: String(s.appointmentClosedDays ?? "").split(/[,\s]+/).filter(Boolean).map(Number).filter((n) => n >= 0 && n <= 6),
});

const ms = (h: number) => h * 3600 * 1000;
export const todayKigali = (offsetHours = 0) => new Date(Date.now() + ms(offsetHours)).toISOString().slice(0, 10);
const limitDate = (r: BookRules) => new Date(Date.now() + ms(r.offsetHours) + r.daysAhead * 86400000).toISOString().slice(0, 10);

export const isDateStr = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
export const weekday = (s: string) => new Date(`${s}T00:00:00Z`).getUTCDay();

export function isBookable(s: string, today: string, r: BookRules): boolean {
  return isDateStr(s) && s > today && s <= limitDate(r) && !r.closed.includes(weekday(s));
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