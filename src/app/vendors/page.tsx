import Link from "next/link";
import { VENDOR_CATEGORIES } from "@/lib/categories";

export default function VendorsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Vendors</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {VENDOR_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/vendors/${c.slug}`} className="rounded-lg border p-5 font-medium hover:bg-black/5">
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}