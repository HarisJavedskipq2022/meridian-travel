import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

type StyleProps = { variant?: Variant; size?: Size; className?: string };

const variants: Record<Variant, string> = {
  primary: "bg-saffron text-ink hover:bg-saffron-deep",
  dark: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light": "border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonStyles({ variant = "primary", size = "md", className }: StyleProps = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
