import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import ChartCard, { ChartTooltip } from "./ChartCard.jsx";
import useChartColors from "../../hooks/useChartColors.js";
import { compact, money } from "../../utils/format.js";

export default function BranchBarChart({ data, colorOf }) {
  const c = useChartColors();
  return (
    <ChartCard title="শাখা তুলনা" subtitle="নির্বাচিত সময়ে মোট বিক্রি" delay={0.05}>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke={c.grid} vertical={false} />
            <XAxis dataKey="branch" tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={compact} tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip formatter={money} />} cursor={{ fill: c.grid, opacity: 0.5 }} />
            <Bar dataKey="revenue" name="বিক্রি" radius={[4, 4, 0, 0]} animationDuration={900}>
              {data.map((d) => <Cell key={d.branch} fill={c.series[colorOf(d.branch)]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
