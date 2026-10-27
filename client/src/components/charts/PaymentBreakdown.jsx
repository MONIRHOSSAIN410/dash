import { motion } from "framer-motion";
import ChartCard from "./ChartCard.jsx";
import { num } from "../../utils/format.js";

// একক সিরিজ — তাই এক রং (series-1), দৈর্ঘ্যই তুলনা বোঝায়
export default function PaymentBreakdown({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ChartCard title="পেমেন্ট মেথড" subtitle="অর্ডার সংখ্যা" delay={0.15}>
      <ul className="space-y-4">
        {data.map((d, i) => (
          <li key={d.name} title={`${d.name}: ${num(d.value)} orders`}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">{d.name}</span>
              <span className="font-medium tabular-nums">{num(d.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <motion.div className="h-full rounded-full" style={{ background: "var(--series-1)" }}
                initial={{ width: 0 }} whileInView={{ width: `${(d.value / max) * 100}%` }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }} />
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
