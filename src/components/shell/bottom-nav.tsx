"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock as ClockIcon, House as HomeIcon, MapPin as MapPinIcon, QrCode as QrCodeIcon, Settings as SettingsIcon } from "lucide-react";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", key: "home", icon: HomeIcon, match: (path: string) => path === "/dashboard" },
  { href: "/address", key: "address", icon: MapPinIcon, match: (path: string) => path.startsWith("/address") },
  { href: "/qr", key: "qr", icon: QrCodeIcon, match: (path: string) => path === "/qr" },
  { href: "/activity", key: "activity", icon: ClockIcon, match: (path: string) => path === "/activity" },
  { href: "/settings", key: "settings", icon: SettingsIcon, match: (path: string) => path === "/settings" },
] as const;

export function SideNav() {
  const pathname = usePathname();
  const language = useDaakStore((state) => state.language);
  const t = dictionary[language].nav;

  return (
    <nav className="px-3 py-4" aria-label={t.home}>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                {t[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const language = useDaakStore((state) => state.language);
  const t = dictionary[language].nav;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.key} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] leading-tight font-medium sm:text-[11px]",
                  active ? "text-brand" : "text-slate-500",
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
                <span className="max-w-full truncate">{t[item.key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
