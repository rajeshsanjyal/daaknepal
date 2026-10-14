"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { PassActions } from "@/components/address/pass-actions";
import { MobileShell } from "@/components/shell/mobile-shell";
import { buttonVariants } from "@/components/ui/button";
import { daakQrValue } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";

export default function QrPage() {
  const language = useDaakStore((state) => state.language);
  const address = useDaakStore((state) => state.address);
  const t = dictionary[language];

  return (
    <MobileShell>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.pass.qrTitle}</h1>
        {address ? (
          <div className="grid items-start gap-4 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <div className="mx-auto w-fit rounded-2xl bg-white" role="img" aria-label={t.pass.qrTitle}>
                <QRCodeSVG value={daakQrValue(address)} size={220} level="M" bgColor="#ffffff" fgColor="#0F1E36" />
              </div>
              <p className="mt-4 font-mono text-xl font-semibold tracking-[0.14em] text-navy">{address.daakCode}</p>
            </div>
            <PassActions address={address} t={t} language={language} />
          </div>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm leading-6 text-slate-600">{t.dashboard.empty}</p>
            <Link href="/address/new" className={`${buttonVariants({ size: "lg" })} mt-4`}>
              {t.dashboard.create}
            </Link>
          </section>
        )}
      </div>
    </MobileShell>
  );
}
