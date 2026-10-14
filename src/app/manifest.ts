import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DAAK Nepal",
    short_name: "DAAK",
    description: "Nepal's verified digital address infrastructure. One person. One DAAK code.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0F1E36",
    theme_color: "#0F1E36",
    lang: "en",
    icons: [
      { src: "/pwa/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
