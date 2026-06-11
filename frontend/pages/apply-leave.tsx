import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { leaveApi } from "@/services/api";

interface LeaveForm {
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
}

const LEAVE_TYPES = [
  { value: "SANADLE", label: "Sanadle (Annual Leave)" },
  { value: "XANUUN", label: "Xanuun (Sick Leave)" },
  { value: "WAX_KALE", label: "Wax kale (Other)" },
];

export default function ApplyLeave() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting } } =
    useForm<LeaveForm>({ defaultValues: { leave_type: "SANADLE" } });

  // compute today's date string in local timezone for input `min` and max (30 days)
  const pad = (n: number) => n.toString().padStart(2, "0");
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + 30);
  const maxStr = `${maxDate.getFullYear()}-${pad(maxDate.getMonth() + 1)}-${pad(maxDate.getDate())}`;

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const duration =
    startDate && endDate
      ? Math.max(
          0,
          Math.floor(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const onSubmit = async (data: LeaveForm) => {
    setError("");
    if (data.end_date <= data.start_date) {
      setError("End date must be greater than start date");
      return;
    }
    // Ensure start date is not in the past (local)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const s = new Date(data.start_date);
    s.setHours(0, 0, 0, 0);
    if (s < today) {
      setError("Start date cannot be in the past");
      return;
    }
    try {
      await leaveApi.create(data);
      router.push("/my-leaves");
    } catch {
      setError("Failed to submit leave request");
    }
  };

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Apply for Leave</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              {...register("start_date", { required: true })}
              min={todayStr}
              max={maxStr}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              {...register("end_date", { required: true })}
              min={startDate ? startDate : todayStr}
              max={maxStr}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          {duration > 0 && (
            <p className="text-sm text-gray-600">Duration: {duration} day(s)</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              {...register("leave_type", { required: true })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              {...register("reason", { required: true, minLength: 3 })}
              rows={4}
              placeholder="Describe your reason..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </Card>
    </Layout>
  );
}
