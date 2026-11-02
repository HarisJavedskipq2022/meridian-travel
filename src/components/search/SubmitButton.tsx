import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Sits on the same baseline as the fields by reserving the label row height. */
export function SubmitButton({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex flex-col justify-end", className)}>
      <Button type="submit" size="lg" variant="dark" className="h-12 w-full">
        <Search className="size-4.5" aria-hidden />
        {label}
      </Button>
    </div>
  );
}
