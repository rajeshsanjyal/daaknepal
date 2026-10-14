"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function OtpInput({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function write(next: string) {
    onChange(next.replace(/\D/g, "").slice(0, 6));
  }

  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid}
          maxLength={1}
          className={cn(
            "h-12 min-w-0 w-full rounded-xl border bg-white text-center font-mono text-lg font-semibold text-navy outline-none focus:border-brand focus:ring-4 focus:ring-blue-500/10 sm:h-14 sm:text-xl",
            invalid ? "border-red-400" : "border-slate-200",
          )}
          onChange={(event) => {
            const char = event.target.value.replace(/\D/g, "").slice(-1);
            const next = digits.map((item, itemIndex) => (itemIndex === index ? char : item)).join("");
            write(next);
            if (char && index < 5) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              const next = digits.map((item, itemIndex) => (itemIndex === index - 1 ? "" : item)).join("");
              write(next);
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!text) return;
            event.preventDefault();
            write(text);
            refs.current[Math.min(text.length, 5)]?.focus();
          }}
        />
      ))}
    </div>
  );
}
