"use client";

import { useEffect } from "react";

export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    try {
      const k = "v:" + id;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch { /* storage blocked */ }
    fetch("/api/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), keepalive: true }).catch(() => undefined);
  }, [id]);
  return null;
}