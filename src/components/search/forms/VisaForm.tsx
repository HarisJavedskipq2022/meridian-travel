"use client";

import { BookUser, Briefcase, Globe2, Info } from "lucide-react";
import { Field, Select } from "@/components/ui/Field";
import { passports, visaDestinations, visaPurposes } from "@/data/visa";
import type { VisaQuery } from "@/lib/search/types";
import type { FieldErrors } from "@/lib/search/validate";
import { SubmitButton } from "../SubmitButton";
import { useSearchForm } from "../use-search-form";

type Props = { initial: VisaQuery; initialErrors?: FieldErrors<VisaQuery> };

const sortedDestinations = [...visaDestinations].sort((a, b) => a.country.localeCompare(b.country));

export function VisaForm({ initial, initialErrors }: Props) {
  const { values, errors, setField, handleSubmit, formRef } = useSearchForm("visa", initial, { initialErrors });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Check visa requirements">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_auto] lg:items-start">
        <Field label="My passport" icon={<BookUser />} error={errors.passport}>
          {(a11y) => (
            <Select {...a11y} value={values.passport} onChange={(e) => setField("passport", e.target.value)}>
              <option value="" disabled>
                Passport country
              </option>
              {passports.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.country}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Travelling to" icon={<Globe2 />} error={errors.destination}>
          {(a11y) => (
            <Select {...a11y} value={values.destination} onChange={(e) => setField("destination", e.target.value)}>
              <option value="" disabled>
                Destination country
              </option>
              {sortedDestinations.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.country}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Purpose" icon={<Briefcase />} className="sm:col-span-2 lg:col-span-1">
          {(a11y) => (
            <Select {...a11y} value={values.purpose} onChange={(e) => setField("purpose", e.target.value)}>
              {visaPurposes.map((purpose) => (
                <option key={purpose}>{purpose}</option>
              ))}
            </Select>
          )}
        </Field>
        <SubmitButton label="Check requirements" className="sm:col-span-2 lg:col-span-1 lg:pt-[1.6rem]" />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate">
        <Info className="size-3.5" aria-hidden />
        Free check. If you need a visa, we can file it for you.
      </p>
    </form>
  );
}
