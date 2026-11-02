import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { contact, services } from "@/data/content";
import { Logo } from "./Logo";
import { navLinks } from "./nav-links";
import { NewsletterForm } from "./NewsletterForm";

const supportLinks = [
  { href: "/#contact", label: "Talk to a planner" },
  { href: "/search?type=visa", label: "Visa checker" },
  { href: "/#how-it-works", label: "How booking works" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page grid gap-12 border-b border-paper/10 py-16 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        <div>
          <p className="max-w-lg font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Fare drops and visa rule changes, once a fortnight.
          </p>
          <p className="mt-3 max-w-md text-paper/60">No spam. Unsubscribe from any email in one click.</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        <address className="grid content-start gap-4 not-italic sm:grid-cols-2 lg:grid-cols-1">
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="flex items-start gap-3 text-paper/80 hover:text-paper"
          >
            <Phone className="mt-0.5 size-5 shrink-0 text-saffron" aria-hidden />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-start gap-3 text-paper/80 hover:text-paper">
            <Mail className="mt-0.5 size-5 shrink-0 text-saffron" aria-hidden />
            {contact.email}
          </a>
          <p className="flex items-start gap-3 text-paper/80 sm:col-span-2 lg:col-span-1">
            <MapPin className="mt-0.5 size-5 shrink-0 text-saffron" aria-hidden />
            {contact.address}
          </p>
        </address>
      </div>

      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            Visas, flights, hotels and cars, planned by people who answer the phone. Karachi, since 2014.
          </p>
        </div>
        <FooterColumn
          title="Services"
          links={services.map((s) => ({ href: `/search?type=${s.type}`, label: s.title }))}
        />
        <FooterColumn title="Explore" links={[...navLinks]} />
        <FooterColumn title="Support" links={supportLinks} />
      </div>

      <div className="container-page flex flex-col gap-3 border-t border-paper/10 py-6 text-sm text-paper/50 sm:flex-row sm:justify-between">
        <p>© 2026 Meridian Travel. A demo project; prices and visa rules are illustrative.</p>
        <p>{contact.hours}</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-paper/60 transition-colors hover:text-saffron">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
