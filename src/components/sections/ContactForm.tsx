"use client";

import { CircleCheck, Loader2, Send } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { services } from "@/data/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { isEmail, isPhone } from "@/lib/validation";

type Values = { name: string; email: string; phone: string; service: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", service: "", message: "" };
/** Simulated network latency for the mock submission. */
const SUBMIT_DELAY_MS = 900;

function validateContact(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!isEmail(values.email)) errors.email = "Enter an email address like name@example.com.";
  if (values.phone && !isPhone(values.phone))
    errors.phone = "Enter a phone number with country code, e.g. +92 300 0000000.";
  if (!values.service) errors.service = "Choose what you need help with.";
  if (values.message.trim().length < 10) errors.message = "Tell us a little about the trip (at least 10 characters).";
  return errors;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useGSAP(
    () => {
      if (status !== "sent" || prefersReducedMotion()) return;
      gsap.from(successRef.current, { y: 20, autoAlpha: 0, duration: 0.6, ease: "power3.out" });
      gsap.from("[data-success-icon]", { scale: 0, rotate: -45, duration: 0.7, ease: "back.out(2.5)", delay: 0.1 });
    },
    { dependencies: [status], scope: successRef },
  );

  function update(field: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateContact(values);
    flushSync(() => setErrors(nextErrors));
    if (Object.keys(nextErrors).length) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        role="status"
        className="flex flex-col items-start rounded-[var(--radius-panel)] bg-white p-8 ring-1 ring-line sm:p-10"
      >
        <CircleCheck data-success-icon className="size-12 text-lagoon" aria-hidden />
        <h3 className="mt-5 font-display text-3xl font-bold tracking-tight">Message sent</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-slate">
          Thanks, {values.name.split(" ")[0]}. A planner will reply to {values.email} within two working hours.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setValues(EMPTY);
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact a travel planner"
      className="grid gap-4 rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8"
    >
      <Field label="Full name" error={errors.name}>
        {(a11y) => (
          <Input {...a11y} autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} />
        )}
      </Field>
      <Field label="Email" error={errors.email}>
        {(a11y) => (
          <Input
            {...a11y}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
        )}
      </Field>
      <Field label="Phone or WhatsApp (optional)" error={errors.phone}>
        {(a11y) => (
          <Input
            {...a11y}
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        )}
      </Field>
      <Field label="I need help with" error={errors.service}>
        {(a11y) => (
          <Select {...a11y} value={values.service} onChange={(e) => update("service", e.target.value)}>
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((s) => (
              <option key={s.type}>{s.title}</option>
            ))}
            <option>A complete trip</option>
          </Select>
        )}
      </Field>
      <Field label="About your trip" error={errors.message} className="sm:col-span-2">
        {(a11y) => (
          <Textarea
            {...a11y}
            rows={5}
            placeholder="Where, when, how many travellers and a rough budget."
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
          />
        )}
      </Field>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">We reply within two working hours, Monday to Saturday.</p>
        <Button type="submit" size="lg" variant="dark" disabled={status === "sending"}>
          {status === "sending" ? (
            <Loader2 className="size-4.5 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4.5" aria-hidden />
          )}
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
