import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/data/content";

export function Stats() {
  return (
    <section aria-label="Meridian in numbers" className="py-16 sm:py-20">
      <Reveal className="container-page">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {stats.map((stat) => (
            <div key={stat.label} data-reveal className="flex flex-col-reverse gap-2 pr-4 lg:px-8 lg:first:pl-0">
              <dt className="max-w-[16ch] text-sm leading-snug text-slate">{stat.label}</dt>
              <dd className="font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
