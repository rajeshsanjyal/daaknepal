"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/shell/mobile-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/otp-input";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { clock, normalizePhone } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { useDaakStore } from "@/lib/store";

export function VerifyFlow() {
  const router = useRouter();
  const toast = useToast();
  const hydrated = useDaakStore((state) => state.hydrated);
  const language = useDaakStore((state) => state.language);
  const pending = useDaakStore((state) => state.pending);
  const profile = useDaakStore((state) => state.profile);
  const otpSentAt = useDaakStore((state) => state.otpSentAt);
  const verifyOtp = useDaakStore((state) => state.verifyOtp);
  const resendOtp = useDaakStore((state) => state.resendOtp);
  const updatePendingPhone = useDaakStore((state) => state.updatePendingPhone);
  const t = dictionary[language];
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [verified, setVerified] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [nextPhone, setNextPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [remaining, setRemaining] = useState(45);

  useEffect(() => {
    if (!hydrated) return;
    if (profile?.isVerified && !verified) router.replace("/dashboard");
    else if (!pending && !verified) router.replace("/register");
  }, [hydrated, pending, profile, router, verified]);

  useEffect(() => {
    const tick = () => {
      const sent = useDaakStore.getState().otpSentAt ?? Date.now();
      setRemaining(Math.max(0, 45 - Math.floor((Date.now() - sent) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [otpSentAt]);

  async function submit() {
    const result = await verifyOtp(code);
    if (result === "ok") {
      setVerified(true);
      return;
    }
    if (result === "taken") {
      toast(t.errors.taken);
      return;
    }
    if (result === "offline") {
      toast(t.errors.offline);
      return;
    }
    setInvalid(true);
    setCode("");
    window.setTimeout(() => setInvalid(false), 500);
  }

  function updatePhone() {
    const phone = normalizePhone(nextPhone);
    if (!/^\+977-9[6-8]\d{8}$/.test(phone)) {
      setPhoneError(t.errors.phone);
      return;
    }
    updatePendingPhone(phone);
    setCode("");
    setPhoneOpen(false);
    setNextPhone("");
    toast(t.verify.sentAgain);
  }

  if (!hydrated || (!pending && !verified)) {
    return (
      <MobileShell showNav={false}>
        <p className="mx-auto max-w-lg px-5 py-16 text-sm text-slate-500">{t.common.loading}</p>
      </MobileShell>
    );
  }

  if (verified) {
    return (
      <MobileShell showNav={false}>
        <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid size-20 place-items-center rounded-full bg-verified text-white"
          >
            <Check className="size-10" />
          </motion.div>
          <p className="mt-6 text-lg leading-7 font-semibold text-navy">{t.verify.successBody}</p>
          <Button className="mt-8 sm:w-auto" size="lg" onClick={() => router.push("/dashboard")}>
            {t.verify.dashboard}
          </Button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showNav={false}>
      <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-10 sm:py-16">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.verify.title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {t.verify.sentTo} <span className="font-semibold text-navy">{pending?.phone}</span>
          </p>
        </div>
        <motion.div animate={invalid ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}>
          <OtpInput value={code} invalid={invalid} onChange={setCode} />
        </motion.div>
        {invalid ? <p className="text-sm text-red-600">{t.errors.otp}</p> : null}
        <div className="flex items-center justify-between text-sm">
          {remaining > 0 ? (
            <p className="text-slate-500">
              {t.verify.resendIn} {clock(remaining)}
            </p>
          ) : (
            <button
              type="button"
              className="font-semibold text-brand"
              onClick={() => {
                resendOtp();
                toast(t.verify.sentAgain);
              }}
            >
              {t.verify.resend}
            </button>
          )}
          <button type="button" className="font-semibold text-navy" onClick={() => setPhoneOpen(true)}>
            {t.verify.changePhone}
          </button>
        </div>
        <Button size="lg" disabled={code.length !== 6} onClick={submit}>
          {t.verify.submit}
        </Button>
      </div>
      <Sheet open={phoneOpen} title={t.verify.changePhone} closeLabel={t.common.close} onClose={() => setPhoneOpen(false)}>
        <Field label={t.verify.newPhone} error={phoneError}>
          <Input
            value={nextPhone}
            placeholder="+977-98XXXXXXXX"
            inputMode="tel"
            onChange={(event) => {
              setPhoneError("");
              setNextPhone(event.target.value);
            }}
          />
        </Field>
        <Button className="mt-4" size="lg" onClick={updatePhone}>
          {t.verify.updatePhone}
        </Button>
      </Sheet>
    </MobileShell>
  );
}
