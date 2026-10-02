import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "./admin-sdk";

export type ViewStat = { total: number; week: number; today: number };
const dayKey = (d: Date = new Date()) => d.toISOString().slice(0, 10);

export async function recordView(id: string): Promise<void> {
  const f = firestore();
  if (!f) return;
  await f.collection("views").doc(id).set(
    { total: FieldValue.increment(1), days: { [dayKey()]: FieldValue.increment(1) }, updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

export async function getViews(ids: string[]): Promise<Record<string, ViewStat>> {
  const out: Record<string, ViewStat> = {};
  for (const id of ids) out[id] = { total: 0, week: 0, today: 0 };
  const f = firestore();
  if (!f || !ids.length) return out;
  const snaps = await f.getAll(...ids.map((id) => f.collection("views").doc(id)));
  const week = Array.from({ length: 7 }, (_, i) => dayKey(new Date(Date.now() - i * 86400000)));
  snaps.forEach((s, i) => {
    if (!s.exists) return;
    const d = s.data() as { total?: number; days?: Record<string, number> };
    const days = d.days ?? {};
    out[ids[i]] = { total: d.total ?? 0, week: week.reduce((a, k) => a + (days[k] ?? 0), 0), today: days[dayKey()] ?? 0 };
  });
  return out;
}