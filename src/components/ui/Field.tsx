"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
};

/** Label + control + inline error, with ids wired for screen readers. */
export function Field({ label, error, icon, className, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("relative flex min-w-0 flex-col", className)}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-slate">
        {icon && (
          <span className="text-lagoon [&_svg]:size-3.5" aria-hidden>
            {icon}
          </span>
        )}
        {label}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined })}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[0.8rem] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const controlStyles = cn(
  "h-12 w-full min-w-0 rounded-xl border border-line bg-white px-3.5 text-[0.95rem] text-ink",
  "transition-colors duration-150 placeholder:text-slate/60",
  "hover:border-ink/30 focus:border-lagoon focus:ring-3 focus:ring-lagoon/15 focus:outline-none focus-visible:outline-none",
  "aria-invalid:border-danger aria-invalid:ring-danger/10",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlStyles, "h-auto min-h-32 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(controlStyles, "cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate"
      />
    </div>
  );
}
