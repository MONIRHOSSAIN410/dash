import { motion } from "framer-motion";

export default function ChartCard({ title, subtitle, children, className = "", delay = 0, action }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      className={`card p-5 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

export function ChartTooltip({ active, payload, label, formatter = (v) => v, labelFormatter = (l) => l }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-40 rounded-xl border border-zinc-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
      {label != null && <p className="mb-1.5 font-medium text-zinc-500 dark:text-zinc-400">{labelFormatter(label)}</p>}
      {[...payload].sort((a, b) => b.value - a.value).map((p) => (
        <div key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.payload?.fill }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{formatter(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
