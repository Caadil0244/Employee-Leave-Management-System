import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats, leaveApi } from "@/services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myLeaves, setMyLeaves] = useState(0);

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      leaveApi.stats().then((res) => setStats(res.data)).catch(() => {});
    } else {
      leaveApi.my().then((res) => setMyLeaves(res.data.length)).catch(() => {});
    }
  }, [user]);

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <Card className="mb-6">
        <p className="text-gray-600">
          Welcome, <strong>{user?.name}</strong> · Role: <strong>{user?.role}</strong>
        </p>
        <p className="mt-1 text-sm text-gray-500">
          ID: {user?.employee_id} · Tel: {user?.telephone} · Dept: {user?.department}
        </p>
      </Card>

      {user?.role === "ADMIN" && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Employees">
            <p className="text-3xl font-bold text-gray-900">{stats.total_employees}</p>
          </Card>
          <Card title="Total Leaves">
            <p className="text-3xl font-bold text-gray-900">{stats.total_leaves}</p>
          </Card>
          <Card title="Pending">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending_leaves}</p>
          </Card>
          <Card title="Approved">
            <p className="text-3xl font-bold text-green-600">{stats.approved_leaves}</p>
          </Card>
          <Card title="Rejected">
            <p className="text-3xl font-bold text-red-600">{stats.rejected_leaves}</p>
          </Card>
        </div>
      )}

      {user?.role === "MANAGER" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="Your Role">
            <p className="text-gray-600">Review and approve team leave requests.</p>
          </Card>
          <Card title="Quick Action">
            <a href="/approve-leaves" className="text-sm font-medium text-gray-900 hover:underline">
              Go to Approve Leaves →
            </a>
          </Card>
        </div>
      )}

      {user?.role === "EMPLOYEE" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="My Leave Requests">
            <p className="text-3xl font-bold text-gray-900">{myLeaves}</p>
          </Card>
          <Card title="Quick Action">
            <a href="/apply-leave" className="text-sm font-medium text-gray-900 hover:underline">
              Apply for Leave →
            </a>
          </Card>
        </div>
      )}
    </Layout>
  );
}
