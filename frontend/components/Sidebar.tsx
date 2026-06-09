import Link from "next/link";
import { useRouter } from "next/router";
import { User } from "@/services/api";

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/employees", label: "Employees", roles: ["ADMIN"] },
  { href: "/apply-leave", label: "Apply Leave", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/my-leaves", label: "My Leaves", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/approve-leaves", label: "Approve Leaves", roles: ["ADMIN", "MANAGER"] },
];

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter();

  const filtered = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-700 bg-slate-900 md:flex">
        <div className="border-b border-slate-700 px-6 py-5">
          <h1 className="text-xl font-bold text-white">ELMS</h1>
          <p className="mt-1 text-sm text-slate-300">Leave Management</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filtered.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-700 px-6 py-4">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-slate-300">{user.employee_id} · {user.department}</p>
          <p className="text-xs text-slate-300">{user.role}</p>
          <button
            onClick={onLogout}
            className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-700 bg-slate-900 md:hidden">
        {filtered.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 text-center text-xs font-medium ${
                active ? "text-white" : "text-slate-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
