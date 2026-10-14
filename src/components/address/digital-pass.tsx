"use client";

import { QRCodeSVG } from "qrcode.react";
import { DaakMark } from "@/components/brand/logo";
import { daakQrValue, locationSummary } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { DaakAddress, Language } from "@/types/daak";

export function DigitalPass({
  name,
  address,
  language,
  t,
  qrSize = 168,
}: {
  name: string;
  address: DaakAddress;
  language: Language;
  t: Dict;
  qrSize?: number;
}) {
  const delivery = `${t.arrival[address.arrivalPoint]} — ${address.landmark}`;

  return (
    <article className="relative overflow-hidden rounded-3xl bg-navy p-5 text-white shadow-[0_18px_40px_rgba(15,30,54,0.28)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(200,16,46,0.45), transparent 34%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 18px 18px, 18px 18px",
        }}
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <DaakMark className="size-10" />
              <div>
                <p className="text-sm font-semibold">{t.appName}</p>
                <p className="text-[10px] tracking-wide text-blue-100/80 uppercase">{t.kernel}</p>
              </div>
            </div>
            <span className="rounded-full bg-verified px-2.5 py-1 text-[11px] font-semibold text-white">{t.common.verified}</span>
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight break-words lg:text-2xl">{name}</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">{locationSummary(address, language)}</p>
          <p className="mt-1 text-sm text-white/90">
            <span className="text-blue-100/70">{t.pass.delivery}: </span>
            {delivery}
          </p>
        </div>
        <div className="shrink-0 text-center">
          <div className="mx-auto w-fit rounded-2xl bg-white p-3 lg:mx-0" role="img" aria-label={t.pass.qrTitle}>
            <QRCodeSVG value={daakQrValue(address)} size={qrSize} level="M" bgColor="#ffffff" fgColor="#0F1E36" includeMargin={false} />
          </div>
          <p className="mt-4 font-mono text-base font-semibold tracking-wide break-all sm:text-xl sm:tracking-[0.12em] lg:text-[22px] lg:tracking-[0.16em]">
            {address.daakCode}
          </p>
        </div>
      </div>
    </article>
  );
}
