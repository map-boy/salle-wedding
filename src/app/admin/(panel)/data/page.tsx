import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { saveRawAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminData(props: PageProps<"/admin/data">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const err = first(sp.error);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Raw data</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Edit the whole database as JSON. The previous version is copied to data/db.backup.json before saving. Keep the top-level keys: settings, groups, categories, listings, reviews, inquiries.</p>
      <div className="mt-5">
        {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
        {err === "json" && <Banner tone="bad">That is not valid JSON. Nothing was saved.</Banner>}
        {err === "shape" && <Banner tone="bad">Missing a required top-level key. Nothing was saved.</Banner>}
      </div>
      <form action={saveRawAction} className="space-y-4">
        <textarea name="json" rows={32} defaultValue={JSON.stringify(db, null, 2)} className="input font-mono text-xs" spellCheck={false} />
        <ConfirmButton message="Replace the whole database with this JSON?" className="btn btn-primary">Save raw data</ConfirmButton>
      </form>
    </div>
  );
}