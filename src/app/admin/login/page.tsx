import { redirect } from "next/navigation";
import { Banner } from "@/components/ui";
import { loginAction } from "@/lib/actions/admin";
import { isAdmin } from "@/lib/auth";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LoginPage(props: PageProps<"/admin/login">) {
  if (await isAdmin()) redirect("/admin");
  const sp = await props.searchParams;
  const configured = Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
  return (
    <main className="flex flex-1 items-center justify-center bg-cream-100 px-5 py-16">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <div className="mt-5">
          {!configured && <Banner tone="bad">ADMIN_PASSWORD and AUTH_SECRET are missing in .env.local. Add them and restart the server.</Banner>}
          {first(sp.error) && <Banner tone="bad">Wrong password.</Banner>}
        </div>
        <form action={loginAction} className="space-y-4">
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoFocus className="input" /></div>
          <button type="submit" className="btn btn-primary w-full">Sign in</button>
        </form>
      </div>
    </main>
  );
}