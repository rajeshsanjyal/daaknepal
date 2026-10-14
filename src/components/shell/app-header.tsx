"use client";

import Link from "next/link";
import { DaakMark } from "@/components/brand/logo";
import { dictionary } from "@/lib/i18n";
import { initials } from "@/lib/format";
import { useDaakStore } from "@/lib/store";
import type { Language } from "@/types/daak";

export function AppHeader() {
  const language = useDaakStore((state) => state.language);
  const setLanguage = useDaakStore((state) => state.setLanguage);
  const profile = useDaakStore((state) => state.profile);
  const hydrated = useDaakStore((state) => state.hydrated);
  const t = dictionary[language];

  return (
    <header className="sticky top-0 z-30 border-b-2 border-stamp bg-white pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-8">
        <Link href={profile?.isVerified ? "/dashboard" : "/"} className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <DaakMark className="size-8 shrink-0 sm:size-9" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-navy sm:text-base">{t.appName}</span>
            <span className="hidden truncate text-[11px] text-slate-500 sm:block">{t.kernel}</span>
          </span>
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <div className="flex rounded-full bg-slate-100 p-0.5" role="group" aria-label={t.settings.language}>
            {(["en", "ne"] as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={language === item}
                onClick={() => setLanguage(item)}
                className={`rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${
                  language === item ? "bg-white text-navy shadow-sm" : "text-slate-500"
                }`}
              >
                {item === "en" ? (
                  "EN"
                ) : (
                  <>
                    <span className="sm:hidden">ने</span>
                    <span className="hidden sm:inline">नेपाली</span>
                  </>
                )}
              </button>
            ))}
          </div>
          {hydrated && profile?.isVerified ? (
            <Link
              href="/settings"
              aria-label={profile.fullName}
              className="grid size-8 place-items-center rounded-full bg-navy text-[11px] font-semibold text-white"
            >
              {initials(profile.fullName)}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
