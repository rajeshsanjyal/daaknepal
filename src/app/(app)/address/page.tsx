"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileShell } from "@/components/shell/mobile-shell";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";

export default function AddressIndexPage() {
  const router = useRouter();
  const address = useDaakStore((state) => state.address);
  const language = useDaakStore((state) => state.language);

  useEffect(() => {
    router.replace(address ? "/address/verified" : "/address/new");
  }, [address, router]);

  return (
    <MobileShell>
      <p className="px-5 py-10 text-sm text-slate-500">{dictionary[language].common.loading}</p>
    </MobileShell>
  );
}
