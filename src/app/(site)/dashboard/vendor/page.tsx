import { DashboardShell } from "@/components/dashboard-shell";

export default function VendorDashboard() {
  return (
    <DashboardShell
      title="Vendor dashboard"
      intro="Manage bookings, your calendar, profile and reviews. For now, edits go through the admin team."
      sections={["Bookings", "Calendar", "Analytics", "Messages", "Profile", "Reviews", "Revenue"]}
    />
  );
}