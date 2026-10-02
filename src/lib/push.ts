import { getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { firestore } from "./admin-sdk";

export type PushResult = { tokens: number; sent: number; failed: number; error?: string };

export async function notifyAdmins(title: string, body: string, link: string): Promise<PushResult> {
  try {
    const f = firestore();
    const app = getApps()[0];
    if (!f || !app) return { tokens: 0, sent: 0, failed: 0, error: "Firebase admin credentials missing." };
    const snap = await f.collection("push_tokens").get();
    const tokens = snap.docs.map((d) => String(d.data().token ?? "")).filter(Boolean);
    if (!tokens.length) return { tokens: 0, sent: 0, failed: 0, error: "No admin device has enabled notifications yet." };
    const res = await getMessaging(app).sendEachForMulticast({ tokens, data: { title, body, link }, webpush: { headers: { Urgency: "high" } } });
    const dead = new Set<string>();
    res.responses.forEach((r, i) => {
      const c = r.error?.code;
      if (c === "messaging/registration-token-not-registered" || c === "messaging/invalid-registration-token") dead.add(tokens[i]);
    });
    await Promise.all(snap.docs.filter((d) => dead.has(String(d.data().token))).map((d) => d.ref.delete()));
    return { tokens: tokens.length, sent: res.successCount, failed: res.failureCount };
  } catch (e) {
    console.error("[push]", e);
    return { tokens: 0, sent: 0, failed: 0, error: (e as Error).message };
  }
}