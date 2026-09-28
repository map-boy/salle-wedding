import { DashboardShell } from "@/components/dashboard-shell";

export default function VendorDashboard() {
  return (
    <DashboardShell
      title="Vendor Dashboard"
      sections={["Bookings", "Calendar", "Analytics", "Messages", "Profile", "Reviews", "Revenue"]}
    />
  );
}