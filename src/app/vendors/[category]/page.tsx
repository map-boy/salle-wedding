import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getVendors } from "@/lib/sample-data";
import { avgRating, rwf } from "@/lib/format";

export default async function CategoryPage({ params }: PageProps<"/vendors/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const list = getVendors(cat.slug);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{cat.label}</h1>
      {list.length === 0 && <p className="text-zinc-500">No vendors listed yet.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((v) => (
          <Link key={v.id} href={`/vendors/${cat.slug}/${v.id}`} className="rounded-lg border p-5 hover:bg-black/5">
            <h2 className="text-xl font-semibold">{v.businessName}</h2>
            <p className="text-sm text-zinc-600">{v.owner}</p>
            <p className="mt-2 text-sm">From {rwf(v.startingPrice)} · Rating: {avgRating(v.reviews)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}