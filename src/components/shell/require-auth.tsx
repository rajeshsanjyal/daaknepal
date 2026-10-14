"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileShell } from "@/components/shell/mobile-shell";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useDaakStore((state) => state.hydrated);
  const profile = useDaakStore((state) => state.profile);
  const language = useDaakStore((state) => state.language);

  useEffect(() => {
    if (hydrated && !profile?.isVerified) router.replace("/");
  }, [hydrated, profile, router]);

  if (!hydrated || !profile?.isVerified) {
    return (
      <MobileShell showNav={false}>
        <p className="px-5 py-10 text-sm text-slate-500">{dictionary[language].common.loading}</p>
      </MobileShell>
    );
  }

  return children;
}
