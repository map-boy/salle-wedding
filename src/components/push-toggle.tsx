"use client";

import { useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
type State = "checking" | "unsupported" | "blocked" | "off" | "busy" | "on";

async function register(): Promise<void> {
  const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  await navigator.serviceWorker.ready;
  const app = getApps().length ? getApp() : initializeApp(config);
  const token = await getToken(getMessaging(app), { serviceWorkerRegistration: reg });
  if (!token) throw new Error("No token received");
  const r = await fetch("/api/admin/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "Could not save token");
}

export function PushToggle() {
  const [state, setState] = useState<State>("checking");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!(await isSupported())) { setState("unsupported"); return; }
      if (Notification.permission === "denied") { setState("blocked"); return; }
      if (Notification.permission === "granted" && localStorage.getItem("push:on") === "1") {
        setState("on");
        register().catch(() => undefined);
        return;
      }
      setState("off");
    })().catch(() => setState("unsupported"));
  }, []);

  async function enable() {
    setState("busy");
    setMsg("");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState(perm === "denied" ? "blocked" : "off"); return; }
      await register();
      localStorage.setItem("push:on", "1");
      setState("on");
    } catch (e) {
      setMsg((e as Error).message);
      setState("off");
    }
  }

  async function test() {
    setMsg("Sending...");
    const r = await fetch("/api/admin/push", { method: "PUT" });
    const j = (await r.json().catch(() => ({}))) as { sent?: number; error?: string };
    setMsg(j.sent ? "Test sent." : j.error || "Nothing was sent.");
  }

  if (state === "checking") return null;
  if (state === "unsupported") return <p className="text-xs text-muted">Push is not supported in this browser.</p>;
  if (state === "blocked") return <p className="text-xs text-muted">Notifications are blocked. Allow them in the browser site settings.</p>;
  return (
    <div className="space-y-1">
      {state === "on" ? (
        <div className="flex items-center justify-between text-xs"><span className="text-ok">Notifications on</span><button type="button" className="underline" onClick={test}>Test</button></div>
      ) : (
        <button type="button" className="btn btn-outline btn-sm w-full" disabled={state === "busy"} onClick={enable}>{state === "busy" ? "Enabling..." : "Enable notifications"}</button>
      )}
      {msg && <p className="text-xs text-muted">{msg}</p>}
    </div>
  );
}