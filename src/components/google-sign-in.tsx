"use client";

import { useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";

const config = {
  apiKey: "AIzaSyBbyW2aQVoV20alrCFPGzcf-EaC1c_y6rw",
  authDomain: "salle-wedding.firebaseapp.com",
  projectId: "salle-wedding",
  storageBucket: "salle-wedding.firebasestorage.app",
  messagingSenderId: "39542623279",
  appId: "1:39542623279:web:cff7e3f343e832536ccada",
};

export function GoogleSignIn() {
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
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      await signOut(auth);
      if (res.ok) {
        window.location.href = "/admin";
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
      {msg && <p className="mt-3 text-sm text-red-700">{msg}</p>}
    </div>
  );
}