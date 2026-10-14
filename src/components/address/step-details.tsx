"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { ADMIN, districtByName, municipalityByName, provinceByName } from "@/lib/admin";
import { errorText, type Dict } from "@/lib/i18n";
import { detailsSchema, type DetailsValues } from "@/lib/schemas";
import type { AddressDraft } from "@/lib/store";
import { cn } from "@/lib/utils";
import { RESIDENCE_TYPES, type Language } from "@/types/daak";

export function StepDetails({
  draft,
  language,
  t,
  onSave,
}: {
  draft: AddressDraft;
  language: Language;
  t: Dict;
  onSave: (values: DetailsValues) => void;
}) {
  const form = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      province: draft.province,
      district: draft.district,
      municipality: draft.municipality,
      ward: draft.ward,
      areaTole: draft.areaTole,
      streetName: draft.streetName,
      houseNumber: draft.houseNumber,
      landmark: draft.landmark,
      residenceType: draft.residenceType,
      isFamilyShared: draft.isFamilyShared,
    },
  });
  const province = form.watch("province"); // eslint-disable-line react-hooks/incompatible-library -- react-hook-form watch is intentionally not compiler-memoized
  const district = form.watch("district");
  const municipality = form.watch("municipality");
  const residence = form.watch("residenceType");
  const shared = form.watch("isFamilyShared");
  const provinceData = provinceByName(province);
  const districtData = districtByName(province, district);
  const municipalityData = municipalityByName(province, district, municipality);
  const label = (name: string, nameNe: string) => (language === "ne" ? nameNe : name);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSave)} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.wizard.province} error={errorText(form.formState.errors.province?.message, t)}>
          <Select
            value={province}
            onChange={(event) => {
              const nextProvince = provinceByName(event.target.value);
              const nextDistrict = nextProvince.districts[0];
              const nextMunicipality = nextDistrict.municipalities[0];
              form.setValue("province", nextProvince.name);
              form.setValue("district", nextDistrict.name);
              form.setValue("municipality", nextMunicipality.name);
              form.setValue("ward", 1);
            }}
          >
            {ADMIN.map((item) => (
              <option key={item.name} value={item.name}>
                {label(item.name, item.nameNe)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.wizard.district}>
          <Select
            value={districtData.name}
            onChange={(event) => {
              const nextDistrict = districtByName(province, event.target.value);
              form.setValue("district", nextDistrict.name);
              form.setValue("municipality", nextDistrict.municipalities[0].name);
              form.setValue("ward", 1);
            }}
          >
            {provinceData.districts.map((item) => (
              <option key={item.name} value={item.name}>
                {label(item.name, item.nameNe)}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-[1.4fr_0.8fr] gap-3 sm:col-span-2">
          <Field label={t.wizard.municipality}>
            <Select
              value={municipalityData.name}
              onChange={(event) => {
                const next = municipalityByName(province, district, event.target.value);
                form.setValue("municipality", next.name);
                form.setValue("ward", Math.min(form.getValues("ward") || 1, next.wards));
              }}
            >
              {districtData.municipalities.map((item) => (
                <option key={item.name} value={item.name}>
                  {label(item.name, item.nameNe)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t.wizard.ward} error={errorText(form.formState.errors.ward?.message, t)}>
            <Select {...form.register("ward", { valueAsNumber: true })}>
              {Array.from({ length: municipalityData.wards }, (_, index) => index + 1).map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label={t.wizard.area} error={errorText(form.formState.errors.areaTole?.message, t)}>
          <Input placeholder="Lainchaur" {...form.register("areaTole")} />
        </Field>
        <Field label={t.wizard.street}>
          <Input placeholder="Lainchaur Marg" {...form.register("streetName")} />
        </Field>
        <Field label={t.wizard.house} error={errorText(form.formState.errors.houseNumber?.message, t)}>
          <Input placeholder="12B" {...form.register("houseNumber")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label={t.wizard.landmark} error={errorText(form.formState.errors.landmark?.message, t)}>
            <Input placeholder="Near Lainchaur" {...form.register("landmark")} />
          </Field>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-ink">{t.wizard.residence}</p>
        <div className="flex flex-wrap gap-2">
          {RESIDENCE_TYPES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={residence === item}
              onClick={() => form.setValue("residenceType", item)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                residence === item ? "border-brand bg-blue-50 font-semibold text-brand" : "border-slate-200 bg-white text-slate-600",
              )}
            >
              {t.residence[item]}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-sm font-medium text-navy">{t.wizard.familyQ}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={shared === value}
              onClick={() => form.setValue("isFamilyShared", value)}
              className={cn(
                "h-11 rounded-xl border text-sm font-semibold",
                shared === value ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600",
              )}
            >
              {value ? t.common.yes : t.common.no}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">{t.wizard.familyCaption}</p>
      </div>
      <Button type="submit" size="lg">
        {t.wizard.permission}
      </Button>
    </form>
  );
}
