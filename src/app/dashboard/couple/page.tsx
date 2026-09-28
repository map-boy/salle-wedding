import { DashboardShell } from "@/components/dashboard-shell";

export default function CoupleDashboard() {
  return (
    <DashboardShell
      title="Couple Dashboard"
      sections={["Wishlist", "Budget planner", "Guest list", "Checklist", "Bookings", "Messages", "Payments"]}
    />
  );
}