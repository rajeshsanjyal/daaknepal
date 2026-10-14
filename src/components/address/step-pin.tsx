"use client";

import { LocateFixed, PenLine } from "lucide-react";
import { useState } from "react";
import { MapView } from "@/components/map/map-view";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { formatCoordinate, isInNepal, roundCoord } from "@/lib/format";
import { adminLabel } from "@/lib/admin";
import type { Dict } from "@/lib/i18n";
import type { AddressDraft } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ARRIVAL_POINTS, type Language } from "@/types/daak";

export function StepPin({
  draft,
  language,
  t,
  recenterToken,
  locating,
  onMove,
  onLocate,
  onPatch,
  onAdjust,
  onConfirm,
}: {
  draft: AddressDraft;
  language: Language;
  t: Dict;
  recenterToken: number;
  locating: boolean;
  onMove: (lat: number, lng: number) => void;
  onLocate: () => void;
  onPatch: (patch: Partial<AddressDraft>) => void;
  onAdjust: () => void;
  onConfirm: () => void;
}) {
  const [manual, setManual] = useState(false);
  const place = draft.areaTole
    ? `${draft.areaTole}, ${adminLabel(draft.district, language)}`
    : adminLabel(draft.municipality, language);

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-navy">{t.wizard.pinTitle}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="navy" size="sm" onClick={onLocate} disabled={locating}>
            <LocateFixed className="size-4" />
            {t.wizard.useCurrent}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setManual((open) => !open)}>
            <PenLine className="size-4" />
            {t.wizard.manual}
          </Button>
        </div>
      {manual ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label={t.wizard.lat}>
            <Input
              inputMode="decimal"
              value={draft.lat}
              onChange={(event) => {
                const lat = Number(event.target.value);
                if (Number.isFinite(lat)) onMove(lat, draft.lng);
              }}
            />
          </Field>
          <Field label={t.wizard.lng}>
            <Input
              inputMode="decimal"
              value={draft.lng}
              onChange={(event) => {
                const lng = Number(event.target.value);
                if (Number.isFinite(lng)) onMove(draft.lat, lng);
              }}
            />
          </Field>
        </div>
      ) : null}
      <div id="daak-map" className="h-72 overflow-hidden rounded-2xl border border-slate-200 lg:h-[28rem]">
        <MapView
          className="h-full w-full"
          lat={draft.lat}
          lng={draft.lng}
          recenterToken={recenterToken}
          onMove={(lat, lng) => onMove(roundCoord(lat), roundCoord(lng))}
        />
      </div>
      <p className="text-sm leading-6 text-slate-600 italic">{t.wizard.movePin}</p>
      </div>
      <div className="space-y-4">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.wizard.selected}</p>
        <p className="mt-1 font-semibold text-navy">{place}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">{t.wizard.coordinates}</dt>
            <dd className="font-medium text-navy">{formatCoordinate(draft.lat, draft.lng)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.wizard.accuracy}</dt>
            <dd className="font-medium text-navy">
              ± {draft.accuracyMeters} {t.common.meters}
            </dd>
          </div>
        </dl>
        {!isInNepal(draft.lat, draft.lng) ? <p className="mt-3 text-xs text-amber-700">{t.wizard.outside}</p> : null}
        <p className="mt-4 text-sm font-medium text-ink">{t.wizard.arrival}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ARRIVAL_POINTS.map((point) => (
            <button
              key={point}
              type="button"
              aria-pressed={draft.arrivalPoint === point}
              onClick={() => onPatch({ arrivalPoint: point })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                draft.arrivalPoint === point ? "border-brand bg-blue-50 font-semibold text-brand" : "border-slate-200 text-slate-600",
              )}
            >
              {t.arrival[point]}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Field label={`${t.wizard.note} · ${t.common.optional}`}>
            <Textarea
              value={draft.arrivalNotes}
              placeholder={t.wizard.notePlaceholder}
              onChange={(event) => onPatch({ arrivalNotes: event.target.value })}
            />
          </Field>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" onClick={onAdjust}>
          {t.wizard.adjust}
        </Button>
        <Button size="lg" onClick={onConfirm}>
          {t.wizard.confirmLocation}
        </Button>
      </div>
      </div>
    </div>
  );
}
