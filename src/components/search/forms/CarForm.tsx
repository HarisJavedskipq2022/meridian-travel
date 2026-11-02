"use client";

import { CalendarDays, IdCard, MapPin, ShieldCheck } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/Field";
import { YOUNG_DRIVER_SURCHARGE } from "@/lib/search/cars";
import type { CarQuery } from "@/lib/search/types";
import type { FieldErrors } from "@/lib/search/validate";
import { PlaceSelect } from "../PlaceSelect";
import { SubmitButton } from "../SubmitButton";
import { useSearchForm } from "../use-search-form";

type Props = { initial: CarQuery; initialErrors?: FieldErrors<CarQuery> };

const ageOptions = [
  { value: 21, label: "21" },
  { value: 22, label: "22" },
  { value: 23, label: "23" },
  { value: 24, label: "24" },
  { value: 30, label: "25 or older" },
];

export function CarForm({ initial, initialErrors }: Props) {
  const { values, errors, setField, handleSubmit, formRef, today } = useSearchForm("cars", initial, {
    initialErrors,
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Search rental cars">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto] lg:items-start">
        <Field
          label="Pick-up airport"
          icon={<MapPin />}
          error={errors.location}
          className="sm:col-span-2 lg:col-span-1"
        >
          {(a11y) => (
            <PlaceSelect
              {...a11y}
              placeholder="Where do you land?"
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          )}
        </Field>
        <Field label="Pick-up date" icon={<CalendarDays />} error={errors.pickUp}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={today}
              value={values.pickUp}
              onChange={(e) => setField("pickUp", e.target.value)}
            />
          )}
        </Field>
        <Field label="Drop-off date" icon={<CalendarDays />} error={errors.dropOff}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={values.pickUp || today}
              value={values.dropOff}
              onChange={(e) => setField("dropOff", e.target.value)}
            />
          )}
        </Field>
        <Field label="Driver's age" icon={<IdCard />} error={errors.driverAge} className="sm:col-span-2 lg:col-span-1">
          {(a11y) => (
            <Select {...a11y} value={values.driverAge} onChange={(e) => setField("driverAge", Number(e.target.value))}>
              {ageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <SubmitButton label="Find cars" className="sm:col-span-2 lg:col-span-1 lg:pt-[1.6rem]" />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate">
        <ShieldCheck className="size-3.5" aria-hidden />
        Collision cover included. Drivers under 25 pay ${YOUNG_DRIVER_SURCHARGE} a day extra.
      </p>
    </form>
  );
}
