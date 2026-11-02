import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-ink pt-40 pb-32 text-paper">
      <div className="container-page max-w-2xl">
        <p className="font-display text-xl font-bold text-saffron">Gate closed</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.03em]">This page doesn&apos;t exist</h1>
        <p className="mt-4 text-lg text-paper/70">
          The link may be old or mistyped. Search for a trip or head back home.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/search?type=flights" variant="outline-light">
            Search flights
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
