import Link from "next/link";
import { logoutAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";

const nav = [
  ["/admin", "Overview"], ["/admin/listings", "Listings"], ["/admin/categories", "Categories"],
  ["/admin/reviews", "Reviews"], ["/admin/inquiries", "Inquiries"], ["/admin/settings", "Settings"], ["/admin/data", "Raw data"],
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <p className="font-display text-lg font-semibold text-wine-700">Admin</p>
          <Link href="/" className="text-xs text-muted hover:text-wine-600 md:mt-1 md:block">View site</Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:pb-0">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted hover:bg-wine-50 hover:text-wine-700">{label}</Link>
          ))}
        </nav>
        <form action={logoutAction} className="hidden px-4 py-4 md:block"><button className="btn btn-outline btn-sm w-full" type="submit">Sign out</button></form>
      </aside>
      <div className="min-w-0 flex-1 bg-cream-50 p-5 sm:p-8">{children}</div>
    </div>
  );
}