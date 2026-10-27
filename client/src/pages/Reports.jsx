import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { Search } from "lucide-react";
import api from "../api/axios.js";
import useFilters from "../hooks/useFilters.js";
import useBranches from "../hooks/useBranches.js";
import FilterBar from "../components/FilterBar.jsx";
import ExportButtons from "../components/ExportButtons.jsx";
import SalesTable from "../components/SalesTable.jsx";

export default function Reports() {
  const { filters, update, params } = useFilters(30);
  const { branches } = useBranches();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: "date", order: "desc" });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const q = useDeferredValue(search);

  const query = useMemo(
    () => ({ ...params, search: q, status, sort: sort.key, order: sort.order, page, limit: 12 }),
    [params, q, status, sort, page]
  );

  // ফিল্টার বদলালে প্রথম পৃষ্ঠায় ফেরত
  useEffect(() => setPage(1), [params, q, status]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const t = setTimeout(() => {
      api.get("/sales", { params: query })
        .then(({ data }) => alive && setResult(data))
        .finally(() => alive && setLoading(false));
    }, 250); // সার্চ debounce
    return () => { alive = false; clearTimeout(t); };
  }, [query]);

  const onSort = (key) =>
    setSort((s) => ({ key, order: s.key === key && s.order === "desc" ? "asc" : "desc" }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">বিক্রয় রিপোর্ট</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">টেবিল, সার্চ ও Excel/PDF এক্সপোর্ট</p>
      </div>

      <FilterBar filters={filters} update={update} branches={branches}>
        <ExportButtons params={{ ...params, search: q, status }} />
      </FilterBar>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="input pl-9" placeholder="ইনভয়েস, গ্রাহক, পণ্য বা ক্যাটাগরি দিয়ে খুঁজুন..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select className="input sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">সব স্ট্যাটাস</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <SalesTable result={result} loading={loading} sort={sort} onSort={onSort} page={page} onPage={setPage} />
    </div>
  );
}
