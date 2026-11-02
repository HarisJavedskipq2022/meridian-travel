import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact } from "@/data/content";
import { ContactForm } from "./ContactForm";

const digits = (value: string) => value.replace(/[^\d+]/g, "");

const channels: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
  { icon: Phone, label: "Call the office", value: contact.phone, href: `tel:${digits(contact.phone)}` },
  {
    icon: MessageCircle,
    label: "WhatsApp a planner",
    value: contact.whatsapp,
    href: `https://wa.me/${digits(contact.whatsapp).replace("+", "")}`,
  },
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: MapPin, label: "Visit us", value: contact.address },
  { icon: Clock, label: "Opening hours", value: contact.hours },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-mist py-24 sm:py-32">
      <Reveal className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            title="Tell us where you want to be"
            intro="Send the rough idea. We'll come back with options, prices and what the visa will take."
          />
          <ul className="mt-10 space-y-5">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li key={label} data-reveal className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-lagoon ring-1 ring-line">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm text-slate">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      className="font-semibold underline-offset-4 hover:underline"
                      {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="font-semibold">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <ContactForm />
        </div>
      </Reveal>
    </section>
  );
}
