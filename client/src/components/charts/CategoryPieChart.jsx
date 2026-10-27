import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ChartCard, { ChartTooltip } from "./ChartCard.jsx";
import useChartColors from "../../hooks/useChartColors.js";
import { money } from "../../utils/format.js";

const MAX = 5; // ৫টার বেশি হলে বাকিগুলো "Other"

export default function CategoryPieChart({ data }) {
  const c = useChartColors();
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const rows = sorted.length > MAX
    ? [...sorted.slice(0, MAX - 1), { name: "Other", value: sorted.slice(MAX - 1).reduce((s, d) => s + d.value, 0) }]
    : sorted;
  const total = rows.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard title="ক্যাটাগরি অনুযায়ী বিক্রি" subtitle="মোট বিক্রির ভাগ" delay={0.1}>
      <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
        <div className="relative h-52 w-52 shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={rows} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="100%"
                paddingAngle={2} stroke={c.surface} strokeWidth={2} animationDuration={900}>
                {rows.map((d, i) => <Cell key={d.name} fill={c.series[i]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={money} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">মোট</p>
              <p className="text-lg font-semibold tabular-nums">{money(total)}</p>
            </div>
          </div>
        </div>
        <ul className="w-full space-y-2 text-sm">
          {rows.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.series[i] }} />
                {d.name}
              </span>
              <span className="tabular-nums text-zinc-900 dark:text-zinc-100">
                {total ? Math.round((d.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
