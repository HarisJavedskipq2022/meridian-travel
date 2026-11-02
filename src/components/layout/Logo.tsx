import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-[-0.03em]",
        tone === "light" ? "text-paper" : "text-ink",
        className,
      )}
      aria-label="Meridian Travel, home"
    >
      {/* A globe crossed by a single meridian line, with the saffron sun on the horizon. */}
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <ellipse cx="16" cy="16" rx="5.5" ry="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="24.5" cy="8" r="4" fill="var(--color-saffron)" />
      </svg>
      Meridian
    </Link>
  );
}
