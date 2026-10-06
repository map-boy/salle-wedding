import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/components/google-sign-in";
import { getVendorEmail } from "@/lib/auth";
import { txt } from "@/lib/content";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await readDb();
  return { title: txt(settings, "vendorLogin.title") };
}

export default async function VendorLogin() {
  if (await getVendorEmail()) redirect("/vendor");
  const { settings: s } = await readDb();
  return (
    <div className="container-page max-w-sm py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold">{txt(s, "vendorLogin.title")}</h1>
        <p className="mt-2 text-sm text-muted">{txt(s, "vendorLogin.text")}</p>
        <div className="mt-5"><GoogleSignIn endpoint="/api/vendor/session" redirectTo="/vendor" /></div>
      </div>
    </div>
  );
}