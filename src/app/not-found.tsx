import Link from "next/link";
import { connection } from "next/server";
import { txt } from "@/lib/content";
import { readDb } from "@/lib/db";

export default async function NotFound() {
  await connection();
  const { settings: s } = await readDb();
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-gold-500">404</p>
      <h1 className="mt-3 text-4xl font-semibold">{txt(s, "notfound.title")}</h1>
      <p className="mt-3 text-muted">{txt(s, "notfound.text")}</p>
      <Link href="/" className="btn btn-primary mt-8">{txt(s, "notfound.back")}</Link>
    </main>
  );
}