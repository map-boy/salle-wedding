import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { ImageInput } from "@/components/image-input";
import {
  deleteCategoryAction, deleteGroupAction, saveCategoryAction, saveGroupAction,
} from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";
import { PageViewToggle } from "@/components/view-toggle";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  name: "A name is required.", slug: "That slug is already used by another category.",
  inuse: "That category still has listings. Move or delete them first.",
  groupinuse: "That group still has categories. Move or delete them first.",
};

export default async function AdminCategories(props: PageProps<"/admin/categories">) {
  const sp = await props.searchParams;
  const err = first(sp.error);
  const db = await readDb();
  const groups = [...db.groups].sort((a, b) => a.order - b.order);
  const cats = [...db.categories].sort((a, b) => a.order - b.order);
  const used = (slug: string) => db.listings.filter((l) => l.categorySlug === slug).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">Categories</h1><PageViewToggle /></div>
      {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
      {err && <Banner tone="bad">{errors[err] ?? "Something went wrong."}</Banner>}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Groups</h2>
        <div className="card divide-y divide-line">
          {groups.map((g) => (
            <div key={g.id} className="flex flex-wrap items-center gap-2 p-4">
              <form action={saveGroupAction} className="flex flex-1 flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={g.id} />
                <input name="name" defaultValue={g.name} className="input w-56" />
                <input name="order" type="number" defaultValue={g.order} className="input w-24" />
                <button className="btn btn-outline btn-sm" type="submit">Save</button>
              </form>
              <form action={deleteGroupAction}>
                <input type="hidden" name="id" value={g.id} />
                <ConfirmButton message="Delete this group?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
              </form>
            </div>
          ))}
          <form action={saveGroupAction} className="flex flex-wrap items-center gap-2 bg-cream-100 p-4">
            <input name="name" placeholder="New group name" className="input w-56" />
            <input name="order" type="number" defaultValue={groups.length} className="input w-24" />
            <button className="btn btn-primary btn-sm" type="submit">Add group</button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Categories</h2>
        <div className="card divide-y divide-line view-host view-wide">
          {cats.map((c) => (
            <div key={c.slug} className="p-4">
              <form action={saveCategoryAction} className="grid gap-2 md:grid-cols-6">
                <input type="hidden" name="originalSlug" value={c.slug} />
                <input name="name" defaultValue={c.name} className="input md:col-span-2" />
                <input name="slug" defaultValue={c.slug} className="input" />
                <select name="groupId" defaultValue={c.groupId} className="input">
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select name="kind" defaultValue={c.kind} className="input"><option value="venue">venue</option><option value="vendor">vendor</option></select>
                <input name="order" type="number" defaultValue={c.order} className="input" />
                <input name="emoji" defaultValue={c.emoji ?? ""} placeholder="Emoji" className="input" /><ImageInput name="icon" defaultValue={c.icon ?? ""} className="md:col-span-2" />
                <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" name="hidePrice" defaultChecked={!!c.hidePrice} />Hide prices</label>
                <input name="description" defaultValue={c.description} className="input md:col-span-3" />
                <button className="btn btn-outline btn-sm" type="submit">Save ({used(c.slug)} listings)</button>
              </form>
              <form action={deleteCategoryAction} className="mt-2">
                <input type="hidden" name="slug" value={c.slug} />
                <ConfirmButton message="Delete this category?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
              </form>
            </div>
          ))}
          <form action={saveCategoryAction} className="grid gap-2 bg-cream-100 p-4 md:grid-cols-6">
            <input type="hidden" name="originalSlug" value="" />
            <input name="name" placeholder="New category name" className="input md:col-span-2" />
            <input name="slug" placeholder="slug (optional)" className="input" />
            <select name="groupId" className="input">{groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
            <select name="kind" defaultValue="vendor" className="input"><option value="venue">venue</option><option value="vendor">vendor</option></select>
            <input name="order" type="number" defaultValue={cats.length} className="input" />
            <input name="emoji" placeholder="Emoji" className="input" /><input name="icon" placeholder="Icon image URL or /icons/x.png (optional)" className="input md:col-span-2" />
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" name="hidePrice" />Hide prices</label>
            <input name="description" placeholder="Description" className="input md:col-span-3" />
            <button className="btn btn-primary btn-sm" type="submit">Add category</button>
          </form>
        </div>
      </section>
    </div>
  );
}