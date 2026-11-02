import { Contact } from "@/components/sections/Contact";
import { Destinations } from "@/components/sections/Destinations";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Destinations />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </>
  );
}
