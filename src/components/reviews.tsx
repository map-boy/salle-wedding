import type { Review } from "@/lib/types";

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <p className="text-sm text-zinc-500">No reviews yet.</p>;
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded border p-3">
          <p className="font-medium">
            {r.author} {r.verified && <span className="text-xs text-green-600">Verified</span>} · {r.overall}/5
          </p>
          <p className="text-sm">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}