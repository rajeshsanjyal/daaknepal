"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MobileShell } from "@/components/shell/mobile-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { normalizePhone } from "@/lib/format";
import { dictionary, errorText } from "@/lib/i18n";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { useDaakStore } from "@/lib/store";

export function LoginForm() {
  const router = useRouter();
  const language = useDaakStore((state) => state.language);
  const login = useDaakStore((state) => state.login);
  const t = dictionary[language];
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const phone = normalizePhone(values.phone);
    const ok = await login(phone, values.password);
    if (!ok) {
      form.setError("password", { message: "credentials" });
      return;
    }
    router.push(useDaakStore.getState().address ? "/address/verified" : "/dashboard");
  }

  return (
    <MobileShell showNav={false}>
      <form className="mx-auto w-full max-w-lg space-y-4 px-4 py-10 sm:py-16" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">{t.login.title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t.login.subtitle}</p>
        </div>
        <Field label={t.register.phone} error={errorText(form.formState.errors.phone?.message, t)}>
          <Input
            placeholder="+977-98XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            {...form.register("phone")}
            onBlur={(event) => form.setValue("phone", normalizePhone(event.target.value))}
          />
        </Field>
        <Field label={t.register.password} error={errorText(form.formState.errors.password?.message, t)}>
          <Input type="password" autoComplete="current-password" {...form.register("password")} />
        </Field>
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {t.login.signIn}
        </Button>
        <p className="text-center text-sm text-slate-600">
          {t.login.newUser}{" "}
          <Link href="/register" className="font-semibold text-brand">
            {t.login.create}
          </Link>
        </p>
      </form>
    </MobileShell>
  );
}
