import { redirect } from "next/navigation";
import { Banner } from "@/components/ui";
import { GoogleSignIn } from "@/components/google-sign-in";
import { loginAction } from "@/lib/actions/admin";
import { isAdmin } from "@/lib/auth";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LoginPage(props: PageProps<"/admin/login">) {
  if (await isAdmin()) redirect("/admin");
  const sp = await props.searchParams;
  const configured = Boolean(process.env.AUTH_SECRET && process.env.ROOT_ADMIN_EMAIL);
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  return (
    <main className="flex flex-1 items-center justify-center bg-cream-100 px-5 py-16">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <div className="mt-5">
          {!configured && <Banner tone="bad">AUTH_SECRET and ROOT_ADMIN_EMAIL are missing in .env.local. Add them and restart the server.</Banner>}
          {first(sp.error) && <Banner tone="bad">Wrong password.</Banner>}
        </div>
        <GoogleSignIn />
        {hasPassword && (
          <>
            <p className="my-5 text-center text-xs text-muted">or use the emergency password</p>
            <form action={loginAction} className="space-y-4">
              <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="input" /></div>
              <button type="submit" className="btn btn-outline w-full">Sign in with password</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}