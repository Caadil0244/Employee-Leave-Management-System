import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { LEAVE_TYPE_LABELS, Leave, leaveApi } from "@/services/api";

interface EditForm {
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
}

export default function MyLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } =
    useForm<EditForm>();

  const load = () => {
    leaveApi.my().then((res) => setLeaves(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const startEdit = (leave: Leave) => {
    setEditingId(leave.id);
    setValue("start_date", leave.start_date);
    setValue("end_date", leave.end_date);
    setValue("leave_type", leave.leave_type);
    setValue("reason", leave.reason);
  };

  const onSubmit = async (data: EditForm) => {
    if (!editingId) return;
    setError("");
    try {
      await leaveApi.update(editingId, data);
      setEditingId(null);
      reset();
      load();
    } catch {
      setError("Update failed. Only pending leaves can be edited.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this leave request?")) return;
    try {
      await leaveApi.delete(id);
      load();
    } catch {
      setError("Delete failed. Only pending leaves can be deleted.");
    }
  };

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Leaves</h1>

      {editingId && (
        <Card title="Edit Leave" className="mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
            <input type="date" {...register("start_date", { required: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input type="date" {...register("end_date", { required: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <select {...register("leave_type")} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="SANADLE">Sanadle</option>
              <option value="XANUUN">Xanuun</option>
              <option value="WAX_KALE">Wax kale</option>
            </select>
            <textarea {...register("reason", { required: true })} rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white">Save</button>
              <button type="button" onClick={() => { setEditingId(null); reset(); }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Leave History">
        {/* Table for medium+ screens */}
        <div className="hidden sm:block overflow-x-auto table-responsive">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-medium">Dates</th>
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">Days</th>
                <th className="pb-3 pr-4 font-medium">Reason</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">{leave.start_date} → {leave.end_date}</td>
                  <td className="py-3 pr-4">{LEAVE_TYPE_LABELS[leave.leave_type] || leave.leave_type}</td>
                  <td className="py-3 pr-4">{leave.duration_days}</td>
                  <td className="py-3 pr-4 max-w-xs truncate">{leave.reason}</td>
                  <td className="py-3 pr-4"><StatusBadge status={leave.status} /></td>
                  <td className="py-3">
                    {leave.status === "PENDING" && (
                      <>
                        <button onClick={() => startEdit(leave)}
                          className="mr-2 text-sm text-gray-700 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(leave.id)}
                          className="text-sm text-red-600 hover:underline">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">No leave requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stacked cards for small screens */}
        <div className="sm:hidden space-y-3">
          {leaves.map((leave) => (
            <Card key={leave.id} className="px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{LEAVE_TYPE_LABELS[leave.leave_type] || leave.leave_type}</p>
                  <p className="text-xs text-gray-500">{leave.start_date} → {leave.end_date} · {leave.duration_days} day(s)</p>
                  <p className="mt-2 text-sm text-gray-700 max-w-xs">{leave.reason}</p>
                </div>
                <div className="text-sm">
                  <StatusBadge status={leave.status} />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {leave.status === "PENDING" && (
                  <>
                    <button onClick={() => startEdit(leave)} className="text-sm text-gray-700 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(leave.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
