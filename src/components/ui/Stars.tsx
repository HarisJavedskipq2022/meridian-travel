import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stars({ count, max = 5, className }: { count: number; max?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${count} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("size-3.5", i < count ? "fill-saffron text-saffron" : "fill-transparent text-line")}
        />
      ))}
    </span>
  );
}
