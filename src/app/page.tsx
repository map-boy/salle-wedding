import Link from "next/link";
import { VENDOR_CATEGORIES } from "@/lib/categories";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Plan your wedding in one place</h1>
      <p className="mt-3 text-zinc-600">Compare venues and book trusted vendors.</p>
      <Link href="/venues" className="mt-6 inline-block rounded bg-foreground px-5 py-3 text-background">
        Browse venues
      </Link>
      <h2 className="mt-12 mb-4 text-2xl font-semibold">Vendors</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {VENDOR_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/vendors/${c.slug}`} className="rounded-lg border p-4 hover:bg-black/5">
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}