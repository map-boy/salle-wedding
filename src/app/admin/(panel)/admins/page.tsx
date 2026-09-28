import { Banner } from "@/components/ui";
import { addAdminAction, removeAdminAction } from "@/lib/actions/admins";
import { listAdmins, rootEmail } from "@/lib/admins";
import { getSessionEmail } from "@/lib/auth";
import { first, fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const ERR: Record<string, string> = {
  email: "Enter a valid email address.",
  root: "Only the root admin can remove admins.",
  self: "The root admin cannot be removed.",
};

export default async function AdminsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const [list, me] = await Promise.all([listAdmins(), getSessionEmail()]);
  const root = rootEmail();
  const isRoot = me === root;
  const err = ERR[first(sp.error)];
  const note = first(sp.added) ? "Admin added." : first(sp.removed) ? "Admin removed." : "";
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Admins</h1>
      <p className="text-sm text-muted">Anyone listed here can sign in with Google and edit everything. Only the root admin can remove admins.</p>
      {err && <Banner tone="bad">{err}</Banner>}
      {note && <p className="rounded-lg bg-wine-50 px-4 py-2 text-sm text-wine-700">{note}</p>}

      <form action={addAdminAction} className="card grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div><label className="label" htmlFor="email">Google email</label><input id="email" name="email" type="email" required className="input" /></div>
        <div><label className="label" htmlFor="name">Name (optional)</label><input id="name" name="name" className="input" /></div>
        <button type="submit" className="btn btn-primary">Add admin</button>
      </form>

      <div className="card divide-y divide-line">
        <div className="flex items-center justify-between px-5 py-3">
          <div><p className="font-medium">{root || "(ROOT_ADMIN_EMAIL not set)"}</p><p className="text-xs text-muted">Root admin</p></div>
        </div>
        {list.map((a) => (
          <div key={a.email} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{a.email}{a.name ? ` (${a.name})` : ""}</p>
              <p className="text-xs text-muted">Added {fmtDate(a.createdAt)}{a.addedBy ? ` by ${a.addedBy}` : ""}</p>
            </div>
            {isRoot && (
              <form action={removeAdminAction}>
                <input type="hidden" name="email" value={a.email} />
                <button type="submit" className="btn btn-outline btn-sm">Remove</button>
              </form>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="px-5 py-4 text-sm text-muted">No other admins yet.</p>}
      </div>
    </div>
  );
}