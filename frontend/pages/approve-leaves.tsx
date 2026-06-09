import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { LEAVE_TYPE_LABELS, Leave, leaveApi } from "@/services/api";

export default function ApproveLeaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    leaveApi.all().then((res) => setLeaves(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    setError("");
    try {
      await leaveApi.approve(id);
      load();
    } catch {
      setError("Cannot approve this request");
    }
  };

  const handleReject = async (id: number) => {
    setError("");
    try {
      await leaveApi.reject(id);
      load();
    } catch {
      setError("Cannot reject this request");
    }
  };

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Approve Leaves</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Card title="Leave Requests">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-medium">Employee</th>
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Department</th>
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">Dates</th>
                <th className="pb-3 pr-4 font-medium">Reason</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => {
                const isOwn = leave.user_id === user?.id;
                return (
                  <tr key={leave.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{leave.user_name}</td>
                    <td className="py-3 pr-4">{leave.employee_id}</td>
                    <td className="py-3 pr-4">{leave.department}</td>
                    <td className="py-3 pr-4">{LEAVE_TYPE_LABELS[leave.leave_type]}</td>
                    <td className="py-3 pr-4">{leave.start_date} → {leave.end_date}</td>
                    <td className="py-3 pr-4 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 pr-4"><StatusBadge status={leave.status} /></td>
                    <td className="py-3">
                      {leave.status === "PENDING" && !isOwn && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(leave.id)}
                            className="rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                            Approve
                          </button>
                          <button onClick={() => handleReject(leave.id)}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      )}
                      {isOwn && leave.status === "PENDING" && (
                        <span className="text-xs text-gray-400">Own request</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
