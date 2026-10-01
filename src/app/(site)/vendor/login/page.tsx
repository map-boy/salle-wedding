import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/components/google-sign-in";
import { getVendorEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vendor sign in" };

export default async function VendorLogin() {
  if (await getVendorEmail()) redirect("/vendor");
  return (
    <div className="container-page max-w-sm py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold">Vendor sign in</h1>
        <p className="mt-2 text-sm text-muted">Use the Google account whose email you gave when you applied.</p>
        <div className="mt-5"><GoogleSignIn endpoint="/api/vendor/session" redirectTo="/vendor" /></div>
      </div>
    </div>
  );
}