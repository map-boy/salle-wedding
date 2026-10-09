"use client";

import { useEffect, useState } from "react";

export function IosInstallHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true || window.matchMedia("(display-mode: standalone)").matches;
    setShow(ios && !standalone);
  }, []);
  if (!show) return null;
  return (
    <div className="mt-2 rounded-xl border border-line bg-paper p-3 text-sm">
      <p className="font-medium">Notifications on iPhone</p>
      <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted">
        <li>Open this site in Safari.</li>
        <li>Tap the Share button, then Add to Home Screen.</li>
        <li>Open the new Wacu icon from your Home Screen and sign in again.</li>
        <li>Turn on notifications there and tap Allow.</li>
      </ol>
    </div>
  );
}