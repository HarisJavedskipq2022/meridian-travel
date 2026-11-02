"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { withDateDefaults } from "@/lib/search/defaults";
import { searchHref } from "@/lib/search/params";
import type { QueryFor, SearchType } from "@/lib/search/types";
import { validateQuery, type FieldErrors } from "@/lib/search/validate";
import { useToday } from "@/lib/use-today";

type Options<T extends SearchType> = {
  /** Errors to show on first render, e.g. when /search was opened with an incomplete query. */
  initialErrors?: FieldErrors<QueryFor[T]>;
};

/**
 * Shared state for the four search forms: values with date defaults,
 * per-field errors, and submit → validate → navigate to /search.
 */
export function useSearchForm<T extends SearchType>(type: T, initial: QueryFor[T], options: Options<T> = {}) {
  const router = useRouter();
  const today = useToday();
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors<QueryFor[T]>>(options.initialErrors ?? {});

  const values = withDateDefaults(type, draft, today);

  function setField<K extends keyof QueryFor[T]>(field: K, value: QueryFor[T][K]) {
    setDraft((prev) => ({ ...withDateDefaults(type, prev, today), [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateQuery(type, values, today);
    // Commit synchronously so the first invalid control has aria-invalid before we focus it.
    flushSync(() => setErrors(nextErrors));

    if (Object.keys(nextErrors).length) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    router.push(searchHref(type, values));
  }

  return { values, errors, setField, handleSubmit, formRef, today };
}
