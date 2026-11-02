"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Select } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-0 last:pb-0">
      <legend className="float-left mb-3 w-full font-display text-base font-semibold">{legend}</legend>
      <div className="clear-left space-y-2.5">{children}</div>
    </fieldset>
  );
}

type OptionProps = {
  label: ReactNode;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
  name?: string;
  meta?: ReactNode;
};

export function FilterOption({ label, checked, onChange, type = "checkbox", name, meta }: OptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[0.95rem]">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4.5 shrink-0 cursor-pointer accent-lagoon"
      />
      <span className="flex-1">{label}</span>
      {meta && <span className="text-sm text-slate">{meta}</span>}
    </label>
  );
}

type RangeProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

export function PriceRange({ label, min, max, value, onChange }: RangeProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-slate">{label}</span>
        <output className="font-semibold">{formatPrice(value)}</output>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-lagoon"
      />
      <div className="flex justify-between text-xs text-slate">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}

type SortProps<K extends string> = {
  options: Record<K, string>;
  value: K;
  onChange: (value: K) => void;
};

export function SortSelect<K extends string>({ options, value, onChange }: SortProps<K>) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate">
      <span className="shrink-0">Sort by</span>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as K)}
        className="h-10 w-auto py-0 pr-9 text-sm font-semibold"
      >
        {(Object.keys(options) as K[]).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </Select>
    </label>
  );
}

type LayoutProps = {
  count: number;
  noun: string;
  sort: ReactNode;
  filters: ReactNode;
  onReset: () => void;
  children: ReactNode;
};

/** Sidebar filters (collapsible on small screens) beside a toolbar and list. */
export function ResultsLayout({ count, noun, sort, filters, onReset, children }: LayoutProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
      <aside
        aria-label="Filters"
        className="rounded-[var(--radius-card)] bg-white ring-1 ring-line lg:sticky lg:top-24 lg:self-start"
      >
        <h2 className="hidden items-center gap-2 p-5 pb-4 font-display font-semibold lg:flex">
          <SlidersHorizontal className="size-4.5 text-lagoon" aria-hidden />
          Filters
        </h2>
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex w-full items-center justify-between p-5 font-display font-semibold lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4.5 text-lagoon" aria-hidden />
            Filters
          </span>
          <ChevronDown
            className={cn("size-5 text-slate transition-transform", filtersOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        <div id={panelId} className={cn("px-5 pb-5", filtersOpen ? "block" : "hidden", "lg:block")}>
          {filters}
          <button
            type="button"
            onClick={onReset}
            className="mt-5 text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="font-semibold">
            {count} {count === 1 ? noun : `${noun}s`}
          </p>
          {sort}
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyResults({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <div className="rounded-[var(--radius-card)] border-2 border-dashed border-line p-10 text-center">
      <p className="font-display text-xl font-semibold">{message}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-3 font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "positive" && "bg-lagoon/10 text-lagoon",
        tone === "warning" && "bg-saffron/20 text-ink",
        tone === "neutral" && "bg-mist text-slate",
      )}
    >
      {children}
    </span>
  );
}
