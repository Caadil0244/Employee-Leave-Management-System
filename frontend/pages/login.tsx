import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { authApi } from "@/services/api";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, setValue, formState: { isSubmitting } } =
    useForm<LoginForm>();

  const doLogin = async (email: string, password: string) => {
    setError("");
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (!axiosErr.response) {
        setError("Cannot connect to server. Run start-all.ps1 or: cd backend && uvicorn app.main:app --reload --port 8001");
      } else {
        setError("Invalid email or password");
      }
    }
  };

  const onSubmit = (data: LoginForm) => doLogin(data.email, data.password);

  const quickLogin = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    doLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-1 text-sm text-slate-500">Employee Leave Management System</p>

        {/* Quick-login buttons removed for production */}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link removed for ADMIN-only flow */}
      </div>
    </div>
  );
}
