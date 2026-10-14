"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AppHeader } from "@/components/shell/app-header";
import { BottomNav, SideNav } from "@/components/shell/bottom-nav";
import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  showNav = true,
  showHeader = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-dvh overflow-x-clip bg-slate-100">
      {showHeader ? <AppHeader /> : null}
      <div className={cn("mx-auto flex w-full min-w-0", showNav && "max-w-6xl")}>
        {showNav ? (
          <aside className="sticky top-[calc(4rem+env(safe-area-inset-top))] hidden h-[calc(100dvh-4rem-env(safe-area-inset-top))] w-56 shrink-0 self-start overflow-y-auto border-r border-slate-200 bg-white lg:block">
            <SideNav />
          </aside>
        ) : null}
        <main className={cn("min-w-0 flex-1", showNav && "pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-10")}>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
