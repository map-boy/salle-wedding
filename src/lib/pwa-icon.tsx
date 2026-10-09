import { ImageResponse } from "next/og";

export function pwaIcon(px: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#404040", color: "#f5b942", fontSize: Math.round(px * 0.6), fontWeight: 700 }}>
        W
      </div>
    ),
    { width: px, height: px },
  );
}