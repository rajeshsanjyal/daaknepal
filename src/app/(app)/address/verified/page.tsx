"use client";

import Link from "next/link";
import { DigitalPass } from "@/components/address/digital-pass";
import { PassActions } from "@/components/address/pass-actions";
import { MapView } from "@/components/map/map-view";
import { MobileShell } from "@/components/shell/mobile-shell";
import { buttonVariants } from "@/components/ui/button";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";

export default function VerifiedPage() {
  const language = useDaakStore((state) => state.language);
  const profile = useDaakStore((state) => state.profile);
  const address = useDaakStore((state) => state.address);
  const t = dictionary[language];

  if (!address || !profile) {
    return (
      <MobileShell>
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <h1 className="text-2xl font-semibold text-navy">{t.dashboard.permanent}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.dashboard.empty}</p>
          <Link href="/address/new" className={`${buttonVariants({ size: "lg" })} mt-5`}>
            {t.dashboard.create}
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 lg:px-8">
        <DigitalPass name={profile.fullName} address={address} language={language} t={t} />
        <PassActions address={address} t={t} language={language} />
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid md:grid-cols-2">
          <div className="h-56 md:h-full md:min-h-72">
            <MapView className="h-full w-full" lat={address.coordinates.lat} lng={address.coordinates.lng} interactive={false} />
          </div>
          <dl className="divide-y divide-slate-100 px-4 lg:px-6">
            <Row label={t.pass.residence} value={t.residence[address.residenceType]} />
            <Row label={t.pass.family} value={address.isFamilyShared ? t.pass.familyYes : t.pass.familyNo} />
            <Row label={t.pass.accuracy} value={`± ${address.coordinates.accuracyMeters} ${t.common.meters}`} />
            {address.arrivalNotes ? <Row label={t.pass.note} value={address.arrivalNotes} /> : null}
          </dl>
        </section>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words text-navy">{value}</dd>
    </div>
  );
}
