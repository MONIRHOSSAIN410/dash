import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { money, num } from "../utils/format.js";

const COLS = [
  { key: "invoiceNo", label: "ইনভয়েস", sort: true },
  { key: "date", label: "তারিখ", sort: true },
  { key: "branch", label: "শাখা" },
  { key: "customer", label: "গ্রাহক", sort: true },
  { key: "product", label: "পণ্য", sort: true },
  { key: "quantity", label: "পরিমাণ", sort: true, right: true },
  { key: "total", label: "মোট", sort: true, right: true },
  { key: "paymentMethod", label: "পেমেন্ট" },
  { key: "status", label: "স্ট্যাটাস" },
];

const STATUS = {
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Refunded: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function SalesTable({ result, loading, sort, onSort, page, onPage }) {
  const rows = result?.rows || [];
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto" data-lenis-prevent>
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <tr>
              {COLS.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-medium ${c.right ? "text-right" : ""}`}>
                  {c.sort ? (
                    <button onClick={() => onSort(c.key)} className={`inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white ${sort.key === c.key ? "text-zinc-900 dark:text-white" : ""}`}>
                      {c.label} <ArrowUpDown size={12} />
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y divide-zinc-100 transition-opacity dark:divide-zinc-800 ${loading ? "opacity-50" : ""}`}>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => (
                <motion.tr key={r._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-mono text-xs">{r.invoiceNo}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(r.date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3">{r.branch?.name}</td>
                  <td className="px-4 py-3">{r.customer}</td>
                  <td className="px-4 py-3">{r.product}<span className="block text-xs text-zinc-500">{r.category}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{num(r.quantity)}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{money(r.total)}</td>
                  <td className="px-4 py-3">{r.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[r.status]}`}>{r.status}</span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && rows.length === 0 && (
              <tr><td colSpan={COLS.length} className="px-4 py-12 text-center text-zinc-500">কোনো ডেটা পাওয়া যায়নি</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 text-sm sm:flex-row dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">মোট {num(result?.total)} টি রেকর্ড · পৃষ্ঠা {page} / {result?.pages || 1}</p>
        <div className="flex gap-2">
          <button className="btn-ghost px-2.5" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous"><ChevronLeft size={16} /></button>
          <button className="btn-ghost px-2.5" disabled={page >= (result?.pages || 1)} onClick={() => onPage(page + 1)} aria-label="Next"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
