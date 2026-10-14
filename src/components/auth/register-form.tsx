"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Building2, Eye, EyeOff, Landmark, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MobileShell } from "@/components/shell/mobile-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { dictionary, errorText } from "@/lib/i18n";
import { normalizePhone } from "@/lib/format";
import { registerSchema, type RegisterValues } from "@/lib/schemas";
import { useDaakStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { isRole, ROLES, type Language } from "@/types/daak";

const roleIcons = {
  citizen: UserRound,
  business: Building2,
  rider: Bike,
  government: Landmark,
} as const;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const language = useDaakStore((state) => state.language);
  const beginRegistration = useDaakStore((state) => state.beginRegistration);
  const t = dictionary[language];
  const [showPassword, setShowPassword] = useState(false);
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "citizen",
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      language,
      acceptTerms: false,
    },
  });
  const role = form.watch("role"); // eslint-disable-line react-hooks/incompatible-library -- react-hook-form watch is intentionally not compiler-memoized
  const preferred = form.watch("language");

  useEffect(() => {
    const requested = params.get("role");
    if (isRole(requested)) form.setValue("role", requested);
  }, [params, form]);

  function onSubmit(values: RegisterValues) {
    const phone = normalizePhone(values.phone);
    if (!/^\+977-9[6-8]\d{8}$/.test(phone)) {
      form.setError("phone", { message: "phone" });
      return;
    }
    const result = beginRegistration({ ...values, phone });
    if (result === "taken") {
      form.setError("phone", { message: "taken" });
      return;
    }
    router.push("/verify");
  }

  return (
    <MobileShell showNav={false}>
      <form className="mx-auto w-full max-w-lg space-y-4 px-4 py-10 sm:py-16" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.register.title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t.register.subtitle}</p>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.register.role}</legend>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((item) => {
              const Icon = roleIcons[item];
              const selected = role === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => form.setValue("role", item)}
                  className={cn(
                    "rounded-2xl border p-3 text-left",
                    selected ? "border-brand bg-blue-50 ring-2 ring-brand/20" : "border-slate-200 bg-white",
                  )}
                >
                  <Icon className={cn("size-5", selected ? "text-brand" : "text-slate-500")} />
                  <span className="mt-2 block text-sm font-semibold text-navy">{t.roles[item]}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <Field label={t.register.fullName} error={errorText(form.formState.errors.fullName?.message, t)}>
          <Input placeholder="Trailokya Bhattarai" autoComplete="name" {...form.register("fullName")} />
        </Field>
        <Field label={t.register.phone} error={errorText(form.formState.errors.phone?.message, t)}>
          <Input
            placeholder="+977-98XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            {...form.register("phone")}
            onBlur={(event) => {
              form.setValue("phone", normalizePhone(event.target.value), { shouldValidate: true });
              void form.register("phone").onBlur(event);
            }}
          />
        </Field>
        <Field label={t.register.email} error={errorText(form.formState.errors.email?.message, t)}>
          <Input type="email" placeholder="name@email.com" autoComplete="email" {...form.register("email")} />
        </Field>
        <Field label={t.register.password} error={errorText(form.formState.errors.password?.message, t)}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-12"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <Field label={t.register.confirm} error={errorText(form.formState.errors.confirmPassword?.message, t)}>
          <Input type={showPassword ? "text" : "password"} autoComplete="new-password" {...form.register("confirmPassword")} />
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium text-ink">{t.register.language}</p>
          <div className="grid grid-cols-2 gap-2">
            {(["en", "ne"] as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={preferred === item}
                onClick={() => form.setValue("language", item)}
                className={cn(
                  "h-11 rounded-xl border text-sm font-semibold",
                  preferred === item ? "border-brand bg-blue-50 text-brand" : "border-slate-200 bg-white text-slate-600",
                )}
              >
                {item === "en" ? "English" : "नेपाली"}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <input type="checkbox" className="mt-0.5 size-5 accent-brand" {...form.register("acceptTerms")} />
          <span className="text-sm leading-6 text-slate-700">
            {t.register.accept}{" "}
            <button type="button" className="font-semibold text-brand" onClick={() => setLegal("privacy")}>
              {t.register.privacy}
            </button>{" "}
            {t.register.and}{" "}
            <button type="button" className="font-semibold text-brand" onClick={() => setLegal("terms")}>
              {t.register.terms}
            </button>
            .
          </span>
        </label>
        {form.formState.errors.acceptTerms ? (
          <p className="text-xs text-red-600">{errorText(form.formState.errors.acceptTerms.message, t)}</p>
        ) : null}
        <Button type="submit" size="lg">
          {t.register.create}
        </Button>
        <p className="text-center text-sm text-slate-600">
          {t.register.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-brand">
            {t.register.signIn}
          </Link>
        </p>
      </form>
      <Sheet
        open={legal !== null}
        title={legal === "terms" ? t.legal.termsTitle : t.legal.privacyTitle}
        closeLabel={t.common.close}
        onClose={() => setLegal(null)}
      >
        <p className="text-sm leading-6 text-slate-700">{legal === "terms" ? t.legal.termsBody : t.legal.privacyBody}</p>
      </Sheet>
    </MobileShell>
  );
}
