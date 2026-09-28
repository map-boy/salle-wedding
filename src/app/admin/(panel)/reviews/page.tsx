import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { deleteReviewAction, saveReviewAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";
const subs = ["cleanliness", "staff", "food", "decoration", "parking", "accessibility", "valueForMoney"] as const;

export default async function AdminReviews(props: PageProps<"/admin/reviews">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const name = (id: string) => db.listings.find((l) => l.id === id)?.name ?? "(deleted listing)";
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Reviews</h1>
      {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
      {first(sp.error) && <Banner tone="bad">Choose a listing and enter an author.</Banner>}

      <form action={saveReviewAction} className="card grid gap-3 p-5 md:grid-cols-4">
        <h2 className="text-lg font-semibold md:col-span-4">Add a review</h2>
        <select name="listingId" className="input md:col-span-2" defaultValue="">
          <option value="" disabled>Listing</option>
          {db.listings.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <input name="author" placeholder="Author" className="input" />
        <input name="rating" type="number" step="0.5" min={0} max={5} defaultValue={5} className="input" />
        <textarea name="comment" rows={2} placeholder="Comment" className="input md:col-span-3" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="verified" />Verified</label>
        <button className="btn btn-primary btn-sm md:col-span-4 md:w-40" type="submit">Add review</button>
      </form>

      <div className="space-y-4">
        {db.reviews.map((r) => (
          <div key={r.id} className="card p-5">
            <p className="mb-3 text-sm text-muted">On <span className="font-medium text-ink">{name(r.listingId)}</span></p>
            <form action={saveReviewAction} className="grid gap-3 md:grid-cols-4">
              <input type="hidden" name="id" value={r.id} /><input type="hidden" name="listingId" value={r.listingId} />
              <input name="author" defaultValue={r.author} className="input md:col-span-2" />
              <input name="rating" type="number" step="0.5" min={0} max={5} defaultValue={r.rating} className="input" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="verified" defaultChecked={r.verified} />Verified</label>
              <textarea name="comment" rows={2} defaultValue={r.comment} className="input md:col-span-4" />
              {subs.map((k) => (
                <div key={k}><label className="label" htmlFor={`${r.id}-${k}`}>{k}</label><input id={`${r.id}-${k}`} name={k} type="number" step="0.5" min={0} max={5} defaultValue={r[k]} className="input" /></div>
              ))}
              <button className="btn btn-outline btn-sm md:col-span-4 md:w-32" type="submit">Save</button>
            </form>
            <form action={deleteReviewAction} className="mt-2">
              <input type="hidden" name="id" value={r.id} />
              <ConfirmButton message="Delete this review?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
            </form>
          </div>
        ))}
        {!db.reviews.length && <p className="text-sm text-muted">No reviews.</p>}
      </div>
    </div>
  );
}