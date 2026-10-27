import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { SERIES } from "../utils/format.js";

// CSS ভেরিয়েবল থেকে আসল hex পড়ে — থিম বদলালে চার্টের রংও বদলায়
export default function useChartColors() {
  const { theme } = useTheme();
  return useMemo(() => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    return {
      series: SERIES.map(v),
      grid: v("--chart-grid"),
      axis: v("--chart-axis"),
      surface: v("--chart-surface"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
}
