"use client";

import { ArrowLeftRight, CalendarDays, PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useRef } from "react";
import { Field, Input } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cabins, tripTypes, type Cabin, type FlightQuery, type TripType } from "@/lib/search/types";
import type { FieldErrors } from "@/lib/search/validate";
import { PlaceSelect } from "../PlaceSelect";
import { SubmitButton } from "../SubmitButton";
import { useSearchForm } from "../use-search-form";

type Props = { initial: FlightQuery; initialErrors?: FieldErrors<FlightQuery> };

const tripLabels: Record<TripType, string> = { return: "Return", oneway: "One way" };

export function FlightForm({ initial, initialErrors }: Props) {
  const { values, errors, setField, handleSubmit, formRef, today } = useSearchForm("flights", initial, {
    initialErrors,
  });
  const swapIcon = useRef<SVGSVGElement>(null);

  function swap() {
    setField("from", values.to);
    setField("to", values.from);
    if (!prefersReducedMotion()) {
      gsap.fromTo(swapIcon.current, { rotation: 0 }, { rotation: 180, duration: 0.45, ease: "back.out(2)" });
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Search flights">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <fieldset className="flex rounded-full bg-mist p-1">
          <legend className="sr-only">Trip type</legend>
          {tripTypes.map((trip) => (
            <label
              key={trip}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-lagoon",
                values.trip === trip ? "bg-white text-ink shadow-sm" : "text-slate hover:text-ink",
              )}
            >
              <input
                type="radio"
                name="trip"
                value={trip}
                checked={values.trip === trip}
                onChange={() => setField("trip", trip)}
                className="sr-only"
              />
              {tripLabels[trip]}
            </label>
          ))}
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-slate">
          <span>Travellers</span>
          <select
            value={values.travellers}
            onChange={(e) => setField("travellers", Number(e.target.value))}
            className="cursor-pointer rounded-lg bg-transparent py-1 font-semibold text-ink"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate">
          <span>Cabin</span>
          <select
            value={values.cabin}
            onChange={(e) => setField("cabin", e.target.value as Cabin)}
            className="cursor-pointer rounded-lg bg-transparent py-1 font-semibold text-ink"
          >
            {cabins.map((cabin) => (
              <option key={cabin}>{cabin}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_0.8fr_0.8fr_auto] lg:items-start">
        <Field label="From" icon={<PlaneTakeoff />} error={errors.from}>
          {(a11y) => (
            <PlaceSelect
              {...a11y}
              placeholder="Departure city"
              value={values.from}
              onChange={(e) => setField("from", e.target.value)}
            />
          )}
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden size-12 items-center justify-center self-end rounded-full border border-line bg-white text-ink transition-colors hover:border-ink lg:flex"
        >
          <ArrowLeftRight ref={swapIcon} className="size-4.5" aria-hidden />
        </button>

        <Field label="To" icon={<PlaneLanding />} error={errors.to}>
          {(a11y) => (
            <PlaceSelect
              {...a11y}
              placeholder="Where to?"
              value={values.to}
              onChange={(e) => setField("to", e.target.value)}
            />
          )}
        </Field>

        <Field label="Depart" icon={<CalendarDays />} error={errors.depart}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={today}
              value={values.depart}
              onChange={(e) => setField("depart", e.target.value)}
            />
          )}
        </Field>

        <Field label="Return" icon={<CalendarDays />} error={errors.return}>
          {(a11y) => (
            <Input
              {...a11y}
              type="date"
              min={values.depart || today}
              value={values.return}
              disabled={values.trip === "oneway"}
              placeholder="One way"
              onChange={(e) => setField("return", e.target.value)}
              className="disabled:cursor-not-allowed disabled:bg-mist/60 disabled:text-slate/50"
            />
          )}
        </Field>

        <SubmitButton label="Search flights" className="sm:col-span-2 lg:col-span-1 lg:pt-[1.6rem]" />
      </div>
    </form>
  );
}
