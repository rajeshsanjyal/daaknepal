"use client";

import { Copy, Navigation, QrCode, Share2, Shield } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { daakQrValue, locationSummary, mapsUrl } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { PrivacySettings } from "@/lib/store";
import { useDaakStore } from "@/lib/store";
import type { DaakAddress, Language } from "@/types/daak";

function shareText(address: DaakAddress, privacy: PrivacySettings, language: Language) {
  const lines = [address.daakCode];
  if (privacy.shareFullAddress) {
    lines.push(locationSummary(address, language));
    lines.push(`${address.arrivalPoint} — ${address.landmark}`);
  }
  if (privacy.showExactCoordinates) lines.push(mapsUrl(address.coordinates.lat, address.coordinates.lng));
  return lines.join("\n");
}

export function PassActions({ address, t, language }: { address: DaakAddress; t: Dict; language: Language }) {
  const toast = useToast();
  const privacy = useDaakStore((state) => state.privacy);
  const updatePrivacy = useDaakStore((state) => state.updatePrivacy);
  const pushActivity = useDaakStore((state) => state.pushActivity);
  const [qrOpen, setQrOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const payload = shareText(address, privacy, language);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(address.daakCode);
      pushActivity("code_copied", address.daakCode);
      toast(t.pass.copied);
    } catch {
      toast(t.errors.copy);
    }
  }

  async function share() {
    const url = privacy.showExactCoordinates ? mapsUrl(address.coordinates.lat, address.coordinates.lng) : undefined;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `DAAK ${address.daakCode}`, text: payload, url });
        pushActivity("address_shared", address.daakCode);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setShareOpen(true);
  }

  function navigate() {
    pushActivity("navigation_opened", address.daakCode);
    window.open(mapsUrl(address.coordinates.lat, address.coordinates.lng), "_blank", "noopener,noreferrer");
  }

  const actions = [
    { key: "copy", label: t.pass.copy, icon: Copy, onClick: () => void copyCode() },
    { key: "share", label: t.pass.share, icon: Share2, onClick: () => void share() },
    {
      key: "qr",
      label: t.pass.showQr,
      icon: QrCode,
      onClick: () => {
        pushActivity("qr_opened", address.daakCode);
        setQrOpen(true);
      },
    },
    { key: "nav", label: t.pass.navigate, icon: Navigation, onClick: navigate },
    { key: "privacy", label: t.pass.privacy, icon: Shield, onClick: () => setPrivacyOpen(true) },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center text-[11px] leading-4 font-semibold break-words text-navy sm:text-xs"
            >
              <Icon className="size-5 text-brand" />
              {action.label}
            </button>
          );
        })}
      </div>
      <Sheet open={qrOpen} title={t.pass.qrTitle} closeLabel={t.common.close} onClose={() => setQrOpen(false)}>
        <div className="mx-auto w-fit rounded-2xl border border-slate-200 p-4">
          <QRCodeSVG value={daakQrValue(address)} size={220} level="M" bgColor="#ffffff" fgColor="#0F1E36" />
        </div>
        <p className="mt-4 text-center font-mono text-lg font-semibold tracking-[0.14em] text-navy">{address.daakCode}</p>
      </Sheet>
      <Sheet open={shareOpen} title={t.pass.shareTitle} closeLabel={t.common.close} onClose={() => setShareOpen(false)}>
        <p className="text-sm leading-6 text-slate-600">{t.pass.shareHint}</p>
        <pre className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm whitespace-pre-wrap text-navy">{payload}</pre>
        <Button
          className="mt-4"
          size="lg"
          onClick={() => {
            void navigator.clipboard.writeText(payload).then(() => {
              pushActivity("address_shared", address.daakCode);
              toast(t.pass.copied);
              setShareOpen(false);
            });
          }}
        >
          {t.pass.copy}
        </Button>
      </Sheet>
      <Sheet open={privacyOpen} title={t.privacy.title} closeLabel={t.common.close} onClose={() => setPrivacyOpen(false)}>
        <PrivacyRow
          label={t.privacy.full}
          hint={t.privacy.fullHint}
          checked={privacy.shareFullAddress}
          onChange={(shareFullAddress) => updatePrivacy({ shareFullAddress })}
        />
        <PrivacyRow
          label={t.privacy.coords}
          hint={t.privacy.coordsHint}
          checked={privacy.showExactCoordinates}
          onChange={(showExactCoordinates) => updatePrivacy({ showExactCoordinates })}
        />
        <PrivacyRow
          label={t.privacy.family}
          hint={t.privacy.familyHint}
          checked={privacy.allowFamilyLookup}
          onChange={(allowFamilyLookup) => updatePrivacy({ allowFamilyLookup })}
        />
      </Sheet>
    </>
  );
}

function PrivacyRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-start gap-3 border-b border-slate-100 py-3 text-left">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-navy">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span>
      </span>
      <span className={`mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 ${checked ? "bg-brand" : "bg-slate-300"}`}>
        <span className={`block size-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}
