import { redirect } from "next/navigation";

export default function AdminMedia() {
  redirect("/admin/listings?tab=media");
}