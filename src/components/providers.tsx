"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { readAccount } from "@/lib/account";
import { firebaseApp, firebaseAuth } from "@/lib/firebase";
import { useDaakStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const language = useDaakStore((state) => state.language);

  useEffect(() => {
    void useDaakStore.persist.rehydrate();
    const unsubscribe = onAuthStateChanged(firebaseAuth(), (user) => {
      if (!user) {
        useDaakStore.setState({ hydrated: true });
        return;
      }
      void readAccount(user.uid)
        .then((record) => {
          if (!record) {
            useDaakStore.setState({ hydrated: true });
            return;
          }
          useDaakStore.setState({
            profile: record.profile,
            address: record.address,
            activities: record.activities,
            privacy: record.privacy,
            language: record.profile.language,
            hydrated: true,
          });
        })
        .catch(() => useDaakStore.setState({ hydrated: true }));
    });
    void import("firebase/analytics")
      .then(async ({ getAnalytics, isSupported }) => {
        if (await isSupported()) getAnalytics(firebaseApp());
      })
      .catch(() => undefined);
    return unsubscribe;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ne" ? "ne" : "en";
  }, [language]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
}
