import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { DEPARTMENTS, employeeApi, User } from "@/services/api";

interface EmployeeForm {
  employee_id: string;
  name: string;
  email: string;
  telephone: string;
  department: string;
  password: string;
  role: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } =
    useForm<EmployeeForm>({ defaultValues: { role: "EMPLOYEE", department: "General" } });

  const load = () => {
    employeeApi.list().then((res) => setEmployees(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: EmployeeForm) => {
    setError("");
    try {
      if (editingId) {
        const payload: Partial<EmployeeForm> = {
          employee_id: data.employee_id,
          name: data.name,
          email: data.email,
          telephone: data.telephone,
          department: data.department,
          role: data.role,
        };
        if (data.password) payload.password = data.password;
        await employeeApi.update(editingId, payload);
      } else {
        await employeeApi.create(data);
      }
      reset({ employee_id: "", name: "", email: "", telephone: "", department: "General", password: "", role: "EMPLOYEE" });
      setEditingId(null);
      load();
    } catch {
      setError("Operation failed. Check ID/email is unique.");
    }
  };

  const startEdit = (emp: User) => {
    setEditingId(emp.id);
    setValue("employee_id", emp.employee_id);
    setValue("name", emp.name);
    setValue("email", emp.email);
    setValue("telephone", emp.telephone);
    setValue("department", emp.department);
    setValue("role", emp.role);
    setValue("password", "");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee?")) return;
    await employeeApi.delete(id);
    load();
  };

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Employees</h1>

      <Card title={editingId ? "Edit Employee" : "Add Employee"} className="mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <input {...register("employee_id", { required: true })} placeholder="Employee ID"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <input {...register("name", { required: true })} placeholder="Name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <input {...register("email", { required: true })} placeholder="Email" type="email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <input {...register("telephone", { required: true })} placeholder="Telephone"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <select {...register("department")} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register("role")} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input {...register("password", { required: !editingId })} placeholder="Password" type="password"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-2" />
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={isSubmitting}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); reset(); }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            )}
          </div>
        </form>
      </Card>

      <Card title="All Employees">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Telephone</th>
                <th className="pb-3 pr-4 font-medium">Department</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">{emp.employee_id}</td>
                  <td className="py-3 pr-4">{emp.name}</td>
                  <td className="py-3 pr-4">{emp.telephone}</td>
                  <td className="py-3 pr-4">{emp.department}</td>
                  <td className="py-3 pr-4">{emp.role}</td>
                  <td className="py-3">
                    <button onClick={() => startEdit(emp)} className="mr-2 text-sm text-gray-700 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
