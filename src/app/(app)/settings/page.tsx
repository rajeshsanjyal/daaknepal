"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/shell/mobile-shell";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ROLES, type Language, type Role } from "@/types/daak";

export default function SettingsPage() {
  const router = useRouter();
  const language = useDaakStore((state) => state.language);
  const setLanguage = useDaakStore((state) => state.setLanguage);
  const profile = useDaakStore((state) => state.profile);
  const privacy = useDaakStore((state) => state.privacy);
  const updatePrivacy = useDaakStore((state) => state.updatePrivacy);
  const switchRole = useDaakStore((state) => state.switchRole);
  const attachRole = useDaakStore((state) => state.attachRole);
  const logout = useDaakStore((state) => state.logout);
  const t = dictionary[language];
  const hints = {
    citizen: t.roles.citizenHint,
    business: t.roles.businessHint,
    rider: t.roles.riderHint,
    government: t.roles.governmentHint,
  } satisfies Record<Role, string>;
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <MobileShell>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.settings.title}</h1>
        <div className="grid items-start gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.settings.profile}</p>
          <p className="mt-2 text-lg font-semibold text-navy">{profile?.fullName}</p>
          <p className="text-sm text-slate-600">{profile?.phone}</p>
          <p className="text-sm text-slate-600">{profile?.email}</p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">{t.settings.roles}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{t.settings.rolesHint}</p>
          <ul className="mt-3 space-y-2">
            {ROLES.map((role) => {
              const attached = profile?.roles.includes(role);
              const active = profile?.role === role;
              return (
                <li key={role} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.roles[role]}</p>
                    <p className="text-[11px] text-slate-500">{active ? t.settings.active : attached ? t.settings.attached : hints[role]}</p>
                  </div>
                  {active ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">{t.settings.active}</span>
                  ) : attached ? (
                    <button type="button" className="text-sm font-semibold text-brand" onClick={() => switchRole(role)}>
                      {t.settings.active}
                    </button>
                  ) : (
                    <button type="button" className="text-sm font-semibold text-brand" onClick={() => setPendingRole(role)}>
                      {t.settings.add}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">{t.settings.language}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["en", "ne"] as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={language === item}
                onClick={() => setLanguage(item)}
                className={cn(
                  "h-11 rounded-xl border text-sm font-semibold",
                  language === item ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600",
                )}
              >
                {item === "en" ? "English" : "नेपाली"}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white px-4">
          <h2 className="pt-4 text-sm font-semibold text-navy">{t.settings.privacy}</h2>
          <Toggle label={t.privacy.full} hint={t.privacy.fullHint} checked={privacy.shareFullAddress} onChange={(shareFullAddress) => updatePrivacy({ shareFullAddress })} />
          <Toggle label={t.privacy.coords} hint={t.privacy.coordsHint} checked={privacy.showExactCoordinates} onChange={(showExactCoordinates) => updatePrivacy({ showExactCoordinates })} />
          <Toggle label={t.privacy.family} hint={t.privacy.familyHint} checked={privacy.allowFamilyLookup} onChange={(allowFamilyLookup) => updatePrivacy({ allowFamilyLookup })} />
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">{t.settings.about}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.landing.aboutBody}</p>
        </section>
        <Button className="sm:w-auto md:col-span-2" variant="danger" size="lg" onClick={() => setLogoutOpen(true)}>
          {t.settings.logout}
        </Button>
        </div>
      </div>
      <Sheet open={pendingRole !== null} title={t.settings.confirmAttach} closeLabel={t.common.close} onClose={() => setPendingRole(null)}>
        <p className="text-sm leading-6 text-slate-600">
          {pendingRole ? t.roles[pendingRole] : ""} — {t.settings.rolesHint}
        </p>
        <Button
          className="mt-4"
          size="lg"
          onClick={() => {
            if (pendingRole) attachRole(pendingRole);
            setPendingRole(null);
          }}
        >
          {t.settings.confirmAttach}
        </Button>
      </Sheet>
      <Sheet open={logoutOpen} title={t.settings.logoutTitle} closeLabel={t.common.close} onClose={() => setLogoutOpen(false)}>
        <p className="text-sm leading-6 text-slate-600">{t.settings.logoutBody}</p>
        <Button
          className="mt-4"
          variant="danger"
          size="lg"
          onClick={() => {
            logout();
            router.replace("/");
          }}
        >
          {t.settings.logout}
        </Button>
      </Sheet>
    </MobileShell>
  );
}

function Toggle({
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
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-start gap-3 border-b border-slate-100 py-3 text-left last:border-0">
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
