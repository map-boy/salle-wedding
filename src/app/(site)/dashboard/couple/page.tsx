import { DashboardShell } from "@/components/dashboard-shell";
import { list, txt } from "@/lib/content";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoupleDashboard() {
  const { settings: s } = await readDb();
  return (
    <DashboardShell
      title={txt(s, "dash.couple.title")}
      intro={txt(s, "dash.couple.intro")}
      sections={list(s, "dash.couple.sections")}
      soon={txt(s, "dash.comingSoon")}
      back={txt(s, "dash.backHome")}
    />
  );
}