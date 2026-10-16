export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="container-page animate-pulse py-10">
      <div className="h-4 w-24 rounded bg-cream-200" />
      <div className="mt-4 h-10 w-72 rounded bg-cream-200" />
      <div className="mt-6 h-56 w-full rounded-2xl bg-cream-200" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded-2xl bg-cream-200" />)}
      </div>
    </div>
  );
}