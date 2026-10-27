import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ label, value, sub, icon: Icon, delta, index = 0 }) {
  const up = delta != null && delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-500 dark:bg-brand-500/20 dark:text-blue-300">
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta != null && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
            up ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
          }`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {up ? "+" : ""}{delta}%
          </span>
        )}
        {sub && <span className="text-zinc-500 dark:text-zinc-400">{sub}</span>}
      </div>
    </motion.div>
  );
}
