import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton";
import { SearchResults } from "@/components/results/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Compare flights, hotels and rental cars, or check visa requirements for your passport.",
};

function SearchFallback() {
  return (
    <>
      <div className="h-80 bg-ink" />
      <div className="container-page py-10 sm:py-14">
        <ResultsSkeleton />
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    // useSearchParams needs a Suspense boundary so the shell can be prerendered.
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}
