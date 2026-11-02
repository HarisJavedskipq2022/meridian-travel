import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  /** Rendered on the right on wide screens, e.g. a "view all" link or filter chips. */
  aside?: ReactNode;
  id?: string;
};

export function SectionHeading({ title, intro, tone = "dark", className, aside, id }: Props) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl" data-reveal>
        <h2
          id={id}
          className={cn(
            "font-display text-[2.25rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.5rem]",
            tone === "light" ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {intro && (
          <p
            className={cn(
              "mt-4 max-w-xl text-lg leading-relaxed text-pretty",
              tone === "light" ? "text-paper/70" : "text-slate",
            )}
          >
            {intro}
          </p>
        )}
      </div>
      {aside && <div data-reveal>{aside}</div>}
    </div>
  );
}
