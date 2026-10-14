"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

const steps = ["identity", "location", "record", "qr", "permanent"] as const;

export function Provisioning({ t, onDone }: { t: Dict; onDone: () => void }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= steps.length) {
      const timer = window.setTimeout(onDone, 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setDone((count) => count + 1), 680);
    return () => window.clearTimeout(timer);
  }, [done, onDone]);

  return (
    <section className="px-4 py-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">DAAK</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy">{t.provision.title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{t.provision.subtitle}</p>
      <ol className="mt-6 space-y-3">
        {steps.map((key, index) => {
          const complete = index < done;
          const active = index === done;
          return (
            <li key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <span
                className={`grid size-8 place-items-center rounded-full ${
                  complete ? "bg-verified text-white" : active ? "bg-blue-50 text-brand" : "bg-slate-100 text-slate-400"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {complete ? (
                    <motion.span key="ok" initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                      <Check className="size-4" />
                    </motion.span>
                  ) : active ? (
                    <Loader2 key="wait" className="size-4 animate-spin" />
                  ) : (
                    <span key="n" className="text-xs font-semibold">
                      {index + 1}
                    </span>
                  )}
                </AnimatePresence>
              </span>
              <span className={`text-sm font-medium ${complete || active ? "text-navy" : "text-slate-400"}`}>{t.provision[key]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
