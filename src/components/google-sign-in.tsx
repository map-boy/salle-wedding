"use client";

import { useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function GoogleSignIn({ endpoint = "/api/admin/session", redirectTo = "/admin" }: { endpoint?: string; redirectTo?: string } = {}) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setMsg("");
    try {
      const app = getApps().length ? getApp() : initializeApp(config);
      const auth = getAuth(app);
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      await signOut(auth);
      if (res.ok) {
        window.location.href = redirectTo;
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setMsg(j.error ?? "Sign-in failed.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sign-in failed.");
    }
    setBusy(false);
  }

  return (
    <div>
      <button type="button" onClick={go} disabled={busy} className="btn btn-primary w-full">
        {busy ? "Signing in..." : "Continue with Google"}
      </button>
      {msg && <p className="mt-3 text-sm text-neutral-700">{msg}</p>}
    </div>
  );
}