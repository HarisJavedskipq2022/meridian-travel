"use client";

import { BedDouble, CalendarDays, DoorOpen, MapPin, Users } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/Field";
import type { HotelQuery } from "@/lib/search/types";
import type { FieldErrors } from "@/lib/search/validate";
import { PlaceSelect } from "../PlaceSelect";
import { SubmitButton } from "../SubmitButton";
import { useSearchForm } from "../use-search-form";

type Props = { initial: HotelQuery; initialErrors?: FieldErrors<HotelQuery> };

export function HotelForm({ initial, initialErrors }: Props) {
  const { values, errors, setField, handleSubmit, formRef, today } = useSearchForm("hotels", initial, {
    initialErrors,
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Search hotels">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.7fr_0.7fr_auto] lg:items-start">
        <Field label="Destination" icon={<MapPin />} error={errors.city} className="sm:col-span-2 lg:col-span-1">
          {(a11y) => (
            <PlaceSelect
              {...a11y}
              placeholder="City or island"
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
            />
          )}
        </Field>
        <Field label="Check-in" icon={<CalendarDays />} error={errors.checkIn}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={today}
              value={values.checkIn}
              onChange={(e) => setField("checkIn", e.target.value)}
            />
          )}
        </Field>
        <Field label="Check-out" icon={<CalendarDays />} error={errors.checkOut}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={values.checkIn || today}
              value={values.checkOut}
              onChange={(e) => setField("checkOut", e.target.value)}
            />
          )}
        </Field>
        <Field label="Guests" icon={<Users />}>
          {(a11y) => (
            <Select {...a11y} value={values.guests} onChange={(e) => setField("guests", Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Rooms" icon={<DoorOpen />} error={errors.rooms}>
          {(a11y) => (
            <Select {...a11y} value={values.rooms} onChange={(e) => setField("rooms", Number(e.target.value))}>
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <SubmitButton label="Find hotels" className="sm:col-span-2 lg:col-span-1 lg:pt-[1.6rem]" />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate">
        <BedDouble className="size-3.5" aria-hidden />
        Most rooms can be cancelled for free up to 48 hours before check-in.
      </p>
    </form>
  );
}
