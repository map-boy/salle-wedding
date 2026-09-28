import { DashboardShell } from "@/components/dashboard-shell";

export default function CoupleDashboard() {
  return (
    <DashboardShell
      title="Couple dashboard"
      intro="Your planning space: save favorites, budget, track guests and follow your checklist."
      sections={["Wishlist", "Budget planner", "Guest list", "Checklist", "Bookings", "Messages", "Payments"]}
    />
  );
}