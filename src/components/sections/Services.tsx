import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/content";
import { ServiceCard } from "./ServiceCard";

const variants = ["feature", "standard", "standard", "wide"] as const;

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="pb-24 sm:pb-32">
      <Reveal className="container-page">
        <SectionHeading
          id="services-title"
          title="Paperwork, tickets, rooms and wheels"
          intro="Book one piece or the whole trip. Either way you get one planner, one invoice and one number to call."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.type} service={service} variant={variants[i] ?? "standard"} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
