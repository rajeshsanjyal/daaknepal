"use client";

import { MapPin, QrCode, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/shell/mobile-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { locationSummary } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const language = useDaakStore((state) => state.language);
  const profile = useDaakStore((state) => state.profile);
  const address = useDaakStore((state) => state.address);
  const t = dictionary[language];

  return (
    <MobileShell>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight break-words text-navy sm:text-2xl">
              {t.dashboard.namaste}, {profile?.fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{t.roles[profile?.role ?? "citizen"]}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              address ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800",
            )}
          >
            {address ? t.dashboard.verifiedPill : t.dashboard.notCreated}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.8fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">{t.dashboard.permanent}</p>
          {address ? (
            <>
              <p className="mt-3 font-mono text-base font-semibold tracking-wide break-all text-navy sm:text-lg sm:tracking-[0.12em]">{address.daakCode}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{locationSummary(address, language)}</p>
              <Link href="/address/verified" className={cn(buttonVariants({ size: "lg" }), "mt-4 sm:w-auto")}>
                {t.dashboard.viewPass}
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.dashboard.empty}</p>
              <Button className="mt-4 sm:w-auto" size="lg" onClick={() => router.push("/address/new")}>
                {t.dashboard.create}
              </Button>
            </>
          )}
        </section>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-1 md:content-start">
          <Link href="/address/new" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy sm:flex-col sm:gap-1 sm:px-2 sm:text-center sm:text-xs md:flex-row md:gap-3 md:px-4 md:text-left md:text-sm">
            <MapPin className="size-5 shrink-0 text-brand" />
            {t.dashboard.shortcutCreate}
          </Link>
          <Link href="/qr" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy sm:flex-col sm:gap-1 sm:px-2 sm:text-center sm:text-xs md:flex-row md:gap-3 md:px-4 md:text-left md:text-sm">
            <QrCode className="size-5 shrink-0 text-brand" />
            {t.dashboard.shortcutQr}
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy sm:flex-col sm:gap-1 sm:px-2 sm:text-center sm:text-xs md:flex-row md:gap-3 md:px-4 md:text-left md:text-sm"
            onClick={() => {
              if (!address) {
                toast(t.errors.needAddress);
                return;
              }
              router.push("/address/verified");
            }}
          >
            <Share2 className="size-5 shrink-0 text-brand" />
            {t.dashboard.shortcutShare}
          </button>
        </div>
        </div>
      </div>
    </MobileShell>
  );
}
