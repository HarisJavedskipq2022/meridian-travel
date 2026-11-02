"use client";

import { CalendarClock, CircleCheck, FileText, Hourglass, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { VisaKind } from "@/data/visa";
import { cn } from "@/lib/cn";
import { formatPrice, plural } from "@/lib/format";
import type { VisaQuery } from "@/lib/search/types";
import { checkVisa } from "@/lib/search/visa";
import { BookingDialog, type BookingSummary } from "./BookingDialog";
import { EmptyResults } from "./filters";

const kindCopy: Record<VisaKind, { headline: string; tone: "easy" | "medium" | "hard" }> = {
  "Visa-free": { headline: "No visa needed", tone: "easy" },
  "Visa on arrival": { headline: "Visa on arrival", tone: "easy" },
  "Travel authorisation": { headline: "Online travel authorisation", tone: "medium" },
  eVisa: { headline: "Apply online for an eVisa", tone: "medium" },
  "Embassy visa": { headline: "Embassy visa required", tone: "hard" },
};

const toneStyles = {
  easy: "bg-lagoon text-paper",
  medium: "bg-saffron text-ink",
  hard: "bg-ink text-paper",
};

function processingLabel([min, max]: [number, number]) {
  if (max === 0) return "At the border";
  return min === max ? plural(min, "working day") : `${min} to ${max} working days`;
}

export function VisaResult({ query }: { query: VisaQuery }) {
  const result = useMemo(() => checkVisa(query), [query]);
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  if (!result) return <EmptyResults message="We don't have rules for this combination yet. Ask a planner." />;

  if (result.status === "home-country") {
    return <EmptyResults message={`It's your home country. You don't need a visa to enter ${result.country}.`} />;
  }

  const { rule } = result;
  const copy = kindCopy[rule.kind];
  const needsFiling = result.serviceFee > 0;

  const facts = [
    { icon: CalendarClock, label: "Stay allowed", value: `Up to ${plural(rule.maxStayDays, "day")}` },
    { icon: Hourglass, label: "Processing time", value: processingLabel(rule.processingDays) },
    { icon: Wallet, label: "Government fee", value: rule.governmentFee ? formatPrice(rule.governmentFee) : "Free" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <article className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
        <header className={cn("p-6 sm:p-8", toneStyles[copy.tone])}>
          <p className="text-sm opacity-80">
            {result.passportCountry} passport, travelling to {result.destinationCountry} for{" "}
            {result.purpose.toLowerCase()}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{copy.headline}</h2>
        </header>

        <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col-reverse gap-1 p-5 sm:p-6">
              <dt className="flex items-center gap-1.5 text-sm text-slate">
                <Icon className="size-4 text-lagoon" aria-hidden />
                {label}
              </dt>
              <dd className="font-display text-lg font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-line p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold">
            <FileText className="size-5 text-lagoon" aria-hidden />
            Documents to prepare
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.documents.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5">
                <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-lagoon" aria-hidden />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <aside className="h-fit rounded-[var(--radius-panel)] bg-ink p-6 text-paper sm:p-8 lg:sticky lg:top-24">
        {needsFiling ? (
          <>
            <h3 className="font-display text-2xl font-bold tracking-tight">Let us file it</h3>
            <p className="mt-2 text-paper/70">
              We check every document against the embassy list, fill the forms and book any appointment.
            </p>
            <dl className="mt-6 space-y-2 border-t border-paper/15 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-paper/70">Government fee</dt>
                <dd>{formatPrice(rule.governmentFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/70">Meridian service fee</dt>
                <dd>{formatPrice(result.serviceFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-paper/15 pt-3 font-display text-lg font-bold">
                <dt>Total</dt>
                <dd className="text-saffron">{formatPrice(result.totalFee)}</dd>
              </div>
            </dl>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() =>
                setBooking({
                  id: `visa-${query.passport}-${query.destination}-${query.purpose}`,
                  item: "visa service",
                  title: `${result.destinationCountry} ${rule.kind.toLowerCase()}`,
                  details: [
                    `${result.passportCountry} passport, ${result.purpose.toLowerCase()}`,
                    `Processing ${processingLabel(rule.processingDays).toLowerCase()}`,
                    `${plural(result.documents.length, "document")} to prepare`,
                  ],
                  total: result.totalFee,
                })
              }
            >
              Start my application
            </Button>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl font-bold tracking-tight">You&apos;re good to go</h3>
            <p className="mt-2 text-paper/70">
              Carry the documents listed and you can enter without applying in advance. Want flights next?
            </p>
            <ButtonLink href="/search?type=flights" size="lg" className="mt-6 w-full">
              Search flights
            </ButtonLink>
          </>
        )}
        <p className="mt-5 text-xs text-paper/50">
          Sample guidance for this demo. Rules change; we confirm current requirements before filing.
        </p>
      </aside>

      <BookingDialog booking={booking} onClose={() => setBooking(null)} />
    </div>
  );
}
