"use client";

import { CheckCircle2, Copy, MapPinned, QrCode, Share2, Shield, Smartphone, UserRound } from "lucide-react";
import { MobileShell } from "@/components/shell/mobile-shell";
import { formatWhen } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import type { ActivityKey } from "@/lib/store";
import { useDaakStore } from "@/lib/store";

const icons: Record<ActivityKey, typeof CheckCircle2> = {
  account_created: UserRound,
  phone_verified: Smartphone,
  address_created: MapPinned,
  code_copied: Copy,
  address_shared: Share2,
  qr_opened: QrCode,
  navigation_opened: MapPinned,
  role_switched: Shield,
  role_attached: Shield,
};

export default function ActivityPage() {
  const language = useDaakStore((state) => state.language);
  const activities = useDaakStore((state) => state.activities);
  const t = dictionary[language];

  return (
    <MobileShell>
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.activity.title}</h1>
        {activities.length === 0 ? (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
            <CheckCircle2 className="size-6 text-brand" />
            <h2 className="mt-3 font-semibold text-navy">{t.activity.emptyTitle}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t.activity.emptyBody}</p>
          </section>
        ) : (
          <ol className="mt-5 rounded-3xl border border-slate-200 bg-white px-5 py-5">
            {activities.map((item, index) => {
              const Icon = icons[item.key];
              return (
                <li key={item.id} className="relative flex gap-3 pb-5">
                  {index < activities.length - 1 ? <span className="absolute top-8 left-[15px] h-[calc(100%-16px)] w-px bg-slate-200" /> : null}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.activity[item.key]}</p>
                    {item.meta ? <p className="text-xs text-slate-500">{labelMeta(item.key, item.meta, t)}</p> : null}
                    <p className="text-xs text-slate-400">{formatWhen(item.at, language)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </MobileShell>
  );
}

function labelMeta(key: ActivityKey, meta: string, t: (typeof dictionary)["en"]) {
  if (key === "role_switched" || key === "role_attached") {
    if (meta === "citizen" || meta === "business" || meta === "rider" || meta === "government") return t.roles[meta];
  }
  return meta;
}
