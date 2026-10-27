import { CalendarDays, Store } from "lucide-react";
import { daysAgo, today } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

const PRESETS = [
  { label: "৭ দিন", days: 7 },
  { label: "৩০ দিন", days: 30 },
  { label: "৯০ দিন", days: 90 },
];

export default function FilterBar({ filters, update, branches = [], children }) {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const activePreset = PRESETS.find((p) => filters.from === daysAgo(p.days - 1) && filters.to === today());

  return (
    <div className="card flex flex-col gap-3 p-3 md:flex-row md:flex-wrap md:items-center">
      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        {PRESETS.map((p) => (
          <button key={p.days} onClick={() => update({ from: daysAgo(p.days - 1), to: today() })}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activePreset?.days === p.days ? "bg-white shadow-sm dark:bg-zinc-900" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2">
        <CalendarDays size={16} className="shrink-0 text-zinc-400" />
        <input type="date" className="input" value={filters.from} max={filters.to}
          onChange={(e) => update({ from: e.target.value })} aria-label="From date" />
        <span className="text-zinc-400">–</span>
        <input type="date" className="input" value={filters.to} min={filters.from} max={today()}
          onChange={(e) => update({ to: e.target.value })} aria-label="To date" />
      </label>

      <label className="flex items-center gap-2 md:w-52">
        <Store size={16} className="shrink-0 text-zinc-400" />
        <select className="input" value={isManager ? user.branch?._id : filters.branch} disabled={isManager}
          onChange={(e) => update({ branch: e.target.value })} aria-label="Branch">
          {!isManager && <option value="all">সব শাখা</option>}
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </label>

      {children && <div className="flex gap-2 md:ml-auto">{children}</div>}
    </div>
  );
}
