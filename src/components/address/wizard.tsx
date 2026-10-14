"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Provisioning } from "@/components/address/provisioning";
import { StepDetails } from "@/components/address/step-details";
import { StepPin } from "@/components/address/step-pin";
import { StepReview } from "@/components/address/step-review";
import { MobileShell } from "@/components/shell/mobile-shell";
import { useToast } from "@/components/ui/toast";
import { dictionary } from "@/lib/i18n";
import { roundCoord } from "@/lib/format";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { DetailsValues } from "@/lib/schemas";

export function AddressWizard() {
  const router = useRouter();
  const toast = useToast();
  const language = useDaakStore((state) => state.language);
  const draft = useDaakStore((state) => state.draft);
  const address = useDaakStore((state) => state.address);
  const updateDraft = useDaakStore((state) => state.updateDraft);
  const provisionAddress = useDaakStore((state) => state.provisionAddress);
  const t = dictionary[language];
  const [step, setStep] = useState(1);
  const [recenterToken, setRecenterToken] = useState(0);
  const [locating, setLocating] = useState(false);
  const [provisioning, setProvisioning] = useState(false);

  const finish = useCallback(() => {
    setProvisioning(false);
    setStep(1);
    router.push("/address/verified");
  }, [router]);

  function locate(announce: boolean) {
    if (!navigator.geolocation) {
      if (announce) toast(t.errors.geoUnsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateDraft({
          lat: roundCoord(position.coords.latitude),
          lng: roundCoord(position.coords.longitude),
          accuracyMeters: Math.max(1, Math.round(position.coords.accuracy)),
        });
        setRecenterToken((token) => token + 1);
        setLocating(false);
      },
      () => {
        setLocating(false);
        if (announce) toast(t.errors.geoDenied);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 },
    );
  }

  function saveDetails(values: DetailsValues) {
    updateDraft(values);
    setStep(2);
    locate(true);
  }

  const labels = [t.wizard.details, t.wizard.pin, t.wizard.review];

  return (
    <MobileShell>
      {provisioning ? (
        <Provisioning t={t} onDone={finish} />
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
          <button type="button" className="text-sm font-semibold text-brand" onClick={() => (step === 1 ? router.push("/dashboard") : setStep(step - 1))}>
            {t.common.back}
          </button>
          <ol className="mt-3 grid grid-cols-3 gap-2">
            {labels.map((label, index) => {
              const number = index + 1;
              const active = step === number;
              const complete = step > number;
              return (
                <li key={label}>
                  <div className={cn("mb-1.5 h-1 rounded-full", complete || active ? "bg-brand" : "bg-slate-200")} />
                  <p className={cn("text-[11px] leading-4 font-medium break-words sm:text-xs", active ? "text-brand" : "text-slate-500")}>
                    {number}. {label}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                {step === 1 ? <StepDetails draft={draft} language={language} t={t} onSave={saveDetails} /> : null}
                {step === 2 ? (
                  <StepPin
                    draft={draft}
                    language={language}
                    t={t}
                    recenterToken={recenterToken}
                    locating={locating}
                    onMove={(lat, lng) => updateDraft({ lat, lng })}
                    onLocate={() => locate(true)}
                    onPatch={updateDraft}
                    onAdjust={() => document.getElementById("daak-map")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    onConfirm={() => setStep(3)}
                  />
                ) : null}
                {step === 3 ? (
                  <StepReview
                    draft={draft}
                    language={language}
                    t={t}
                    replacing={Boolean(address)}
                    onGenerate={() => {
                      provisionAddress();
                      setProvisioning(true);
                    }}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
