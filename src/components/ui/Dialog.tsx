"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** Native <dialog> (focus trap, Esc, inert background for free) with a GSAP entrance. */
export function Dialog({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog,
          { y: 24, autoAlpha: 0, scale: 0.98 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" },
        );
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the ::backdrop land on the dialog element itself.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius-panel)] bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl font-bold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 rounded-full p-2 text-slate transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}
