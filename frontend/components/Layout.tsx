import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />

      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold text-gray-900">ELMS</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{user.name}</span>
        </div>
      </header>

      {/* Slide-over mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="relative w-64 bg-slate-900 text-white">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
              <div>
                <h1 className="text-lg font-bold">ELMS</h1>
                <p className="text-xs text-slate-300">Leave Management</p>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-xl">×</button>
            </div>
            <nav className="px-3 py-4">
              {/** replicate basic nav items so mobile menu is functional */}
              {[
                { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
                { href: "/employees", label: "Employees", roles: ["ADMIN"] },
                { href: "/apply-leave", label: "Apply Leave", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
                { href: "/my-leaves", label: "My Leaves", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
                { href: "/approve-leaves", label: "Approve Leaves", roles: ["ADMIN", "MANAGER"] },
              ]
                .filter((i) => i.roles.includes(user.role))
                .map((item) => {
                  const active = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-md px-3 py-2 text-sm font-medium ${
                        active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="absolute bottom-0 w-full border-t border-slate-700 px-4 py-4">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-300">{user.employee_id} · {user.department}</p>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="md:ml-64">
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-28 md:px-8 md:pt-6 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
