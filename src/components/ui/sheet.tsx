"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Sheet({
  open,
  title,
  closeLabel,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0 bg-navy/50" aria-label={closeLabel} onClick={onClose} />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ y: 28 }}
          animate={{ y: 0 }}
          exit={{ y: 28 }}
          className="relative max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
        >
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-navy">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full bg-slate-100 text-navy"
              aria-label={closeLabel}
            >
              <X className="size-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
