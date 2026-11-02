"use client";

import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { isEmail } from "@/lib/validation";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    setError("");
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p role="status" className="flex items-center gap-2 text-paper">
        <Check className="size-5 text-saffron" aria-hidden />
        Subscribed. The next fare drop goes to {email}.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2 rounded-full bg-paper/8 p-1.5 ring-1 ring-paper/15 focus-within:ring-saffron">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-paper placeholder:text-paper/40 focus:outline-none"
        />
        <Button type="submit" size="sm">
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 pl-4 text-sm text-saffron">
          {error}
        </p>
      )}
    </form>
  );
}
