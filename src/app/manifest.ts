import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wacu Events",
    short_name: "Wacu",
    description: "Wedding venues and vendors in Rwanda",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#404040",
    icons: [
      { src: "/pwa-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}