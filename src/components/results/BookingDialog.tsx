"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatPrice } from "@/lib/format";
import { createRandom } from "@/lib/random";

export type BookingSummary = {
  id: string;
  title: string;
  details: string[];
  total: number;
  /** What the hold covers, e.g. "fare" or "room". */
  item: string;
};

function referenceFor(id: string) {
  return `MRD-${createRandom(id).int(100_000, 999_999)}`;
}

type Props = { booking: BookingSummary | null; onClose: () => void };

/** Mock reservation: holds the price and shows a reference. No data leaves the browser. */
export function BookingDialog({ booking, onClose }: Props) {
  const [heldId, setHeldId] = useState<string | null>(null);
  const held = booking !== null && heldId === booking.id;

  return (
    <Dialog
      open={booking !== null}
      onClose={onClose}
      title={held ? "Price held for 24 hours" : "Review your selection"}
    >
      {booking && (
        <div>
          {held ? (
            <div role="status">
              <CircleCheck className="size-10 text-lagoon" aria-hidden />
              <p className="mt-4 leading-relaxed text-slate">
                We&apos;ve held this {booking.item} at {formatPrice(booking.total)}. Quote reference{" "}
                <strong className="font-semibold text-ink">{referenceFor(booking.id)}</strong> when a planner calls you
                to confirm traveller details and payment.
              </p>
            </div>
          ) : (
            <>
              <p className="font-display text-xl font-semibold">{booking.title}</p>
              <ul className="mt-3 space-y-1.5 text-slate">
                {booking.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-slate">Total</span>
                <span className="font-display text-3xl font-bold tracking-tight">{formatPrice(booking.total)}</span>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {held ? (
              <>
                <ButtonLink href="/#contact" variant="outline" onClick={onClose}>
                  Message a planner
                </ButtonLink>
                <Button variant="dark" onClick={onClose}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Keep looking
                </Button>
                <Button onClick={() => setHeldId(booking.id)}>Hold this price</Button>
              </>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
