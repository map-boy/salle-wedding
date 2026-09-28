import { DashboardShell } from "@/components/dashboard-shell";

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      sections={["Manage users", "Approve vendors", "Manage listings", "Reports", "Payments", "Support"]}
    />
  );
}