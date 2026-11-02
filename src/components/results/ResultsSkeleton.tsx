export function ResultsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10" aria-busy="true" aria-label="Loading results">
      <div className="hidden h-80 animate-pulse rounded-[var(--radius-card)] bg-mist lg:block" />
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded-full bg-mist" />
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[var(--radius-card)] bg-mist"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
