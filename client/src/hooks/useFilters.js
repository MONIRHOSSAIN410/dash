import { useMemo, useState } from "react";
import { daysAgo, today } from "../utils/format.js";

export default function useFilters(defaultDays = 30) {
  const [filters, setFilters] = useState({
    from: daysAgo(defaultDays - 1),
    to: today(),
    branch: "all",
  });
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const params = useMemo(() => ({ ...filters }), [filters]);
  return { filters, update, params };
}
