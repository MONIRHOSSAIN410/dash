import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import ChartCard, { ChartTooltip } from "./ChartCard.jsx";
import useChartColors from "../../hooks/useChartColors.js";
import { compact, money, shortDate } from "../../utils/format.js";

// colorOf(name) → শাখার স্থায়ী রং
export default function SalesTrendChart({ data, branches, colorOf }) {
  const c = useChartColors();
  return (
    <ChartCard title="শাখা অনুযায়ী দৈনিক বিক্রি" subtitle="প্রতিটি লাইন একটি শাখা (৳)" className="lg:col-span-2">
      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke={c.grid} vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis tickFormatter={compact} tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip formatter={money} labelFormatter={shortDate} />}
              cursor={{ stroke: c.axis, strokeDasharray: "4 4" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {branches.map((b) => (
              <Line key={b} type="monotone" dataKey={b} name={b} stroke={c.series[colorOf(b)]} strokeWidth={2}
                dot={false} activeDot={{ r: 5, stroke: c.surface, strokeWidth: 2 }} animationDuration={900} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
