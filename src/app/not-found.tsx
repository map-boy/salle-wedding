import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-gold-500">404</p>
      <h1 className="mt-3 text-4xl font-semibold">We could not find that page</h1>
      <p className="mt-3 text-muted">It may have been moved, removed or is still awaiting approval.</p>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </main>
  );
}