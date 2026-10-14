import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_Devanagari, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "DAAK Nepal",
  description:
    "Building Nepal's Digital Address Infrastructure — One Person. One DAAK Code. One Connected Nepal.",
  applicationName: "DAAK Nepal",
  appleWebApp: {
    capable: true,
    title: "DAAK Nepal",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1E36",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${devanagari.variable} ${plex.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
