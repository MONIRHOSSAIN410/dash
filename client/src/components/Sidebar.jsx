import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileBarChart2, X, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "ড্যাশবোর্ড", icon: LayoutDashboard, end: true },
  { to: "/reports", label: "রিপোর্ট ও টেবিল", icon: FileBarChart2 },
];

function Nav({ onClose }) {
  const { user } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">SalesPulse</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "text-brand-600 dark:text-white" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-brand-500/10 dark:bg-brand-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <Icon size={18} className="relative" />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-xl bg-zinc-100 p-3 text-xs dark:bg-zinc-800/60">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-zinc-500 dark:text-zinc-400">
          {user?.role === "admin" ? "অ্যাডমিন — সব শাখা" : `ম্যানেজার — ${user?.branch?.name ?? ""} শাখা`}
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900">
        <Nav onClose={onClose} />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden dark:bg-zinc-900"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <Nav onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
