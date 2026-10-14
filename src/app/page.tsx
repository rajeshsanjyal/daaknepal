"use client";

import { Bike, Building2, Landmark, UserRound } from "lucide-react";
import Link from "next/link";
import { MobileShell } from "@/components/shell/mobile-shell";
import { buttonVariants } from "@/components/ui/button";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/daak";

const cards: { role: Role; icon: typeof UserRound; hint: "citizenHint" | "businessHint" | "riderHint" | "governmentHint" }[] = [
  { role: "citizen", icon: UserRound, hint: "citizenHint" },
  { role: "business", icon: Building2, hint: "businessHint" },
  { role: "rider", icon: Bike, hint: "riderHint" },
  { role: "government", icon: Landmark, hint: "governmentHint" },
];

export default function HomePage() {
  const language = useDaakStore((state) => state.language);
  const hydrated = useDaakStore((state) => state.hydrated);
  const profile = useDaakStore((state) => state.profile);
  const t = dictionary[language];
  const signedIn = hydrated && Boolean(profile?.isVerified);

  return (
    <MobileShell showNav={false}>
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-end lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-red-200 uppercase">DAAK NEPAL</p>
            <h1 className="mt-4 max-w-2xl text-[1.7rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              {t.landing.hero}
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
            {signedIn ? (
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}>
                {t.landing.continueApp}
              </Link>
            ) : (
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}>
                {t.landing.getStarted}
              </Link>
            )}
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "sm:w-auto")}>
              {t.landing.login}
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-lg font-semibold text-navy">{t.landing.rolesTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.role}
                  href={`/register?role=${card.role}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand">
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-4 block text-sm font-semibold text-navy">{t.roles[card.role]}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{t.roles[card.hint]}</span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">{t.landing.aboutTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t.landing.aboutBody}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[t.landing.p1, t.landing.p2, t.landing.p3, t.landing.p4].map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-navy">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MobileShell>
  );
}
