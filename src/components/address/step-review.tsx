"use client";

import { ShieldCheck } from "lucide-react";
import { MapView } from "@/components/map/map-view";
import { Button } from "@/components/ui/button";
import { adminLabel } from "@/lib/admin";
import { formatCoordinate, isInNepal } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { AddressDraft } from "@/lib/store";
import type { Language } from "@/types/daak";

export function StepReview({
  draft,
  language,
  t,
  replacing,
  onGenerate,
}: {
  draft: AddressDraft;
  language: Language;
  t: Dict;
  replacing: boolean;
  onGenerate: () => void;
}) {
  const rows = [
    [t.wizard.municipality, adminLabel(draft.municipality, language)],
    [t.wizard.ward, String(draft.ward)],
    [t.wizard.area, draft.areaTole],
    [t.wizard.street, draft.streetName || "—"],
    [t.wizard.house, draft.houseNumber],
    [t.wizard.landmark, draft.landmark],
    [t.wizard.residence, t.residence[draft.residenceType]],
    [t.pass.family, draft.isFamilyShared ? t.pass.familyYes : t.pass.familyNo],
    [t.wizard.arrival, t.arrival[draft.arrivalPoint]],
    [t.wizard.coordinates, formatCoordinate(draft.lat, draft.lng)],
    [t.wizard.accuracy, `± ${draft.accuracyMeters} ${t.common.meters}`],
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-navy">{t.wizard.reviewTitle}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-56 overflow-hidden rounded-2xl border border-slate-200 lg:h-full lg:min-h-72">
        <MapView className="h-full w-full" lat={draft.lat} lng={draft.lng} interactive={false} />
      </div>
      <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-right text-sm font-medium text-navy">{value}</dd>
          </div>
        ))}
      </dl>
      </div>
      {draft.arrivalNotes ? <p className="text-sm text-slate-600">{draft.arrivalNotes}</p> : null}
      {!isInNepal(draft.lat, draft.lng) ? <p className="text-sm text-amber-700">{t.wizard.outside}</p> : null}
      {replacing ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{t.wizard.replace}</p> : null}
      <div className="flex gap-2 rounded-2xl bg-blue-50 px-3 py-3 text-sm leading-6 text-ink">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
        <p>{t.wizard.disclaimer}</p>
      </div>
      <Button size="lg" onClick={onGenerate}>
        {t.wizard.generate}
      </Button>
    </div>
  );
}
