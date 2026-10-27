import { useEffect, useState } from "react";
import { Banknote, ShoppingCart, Receipt, CalendarCheck } from "lucide-react";
import api from "../api/axios.js";
import useFilters from "../hooks/useFilters.js";
import useBranches from "../hooks/useBranches.js";
import FilterBar from "../components/FilterBar.jsx";
import ExportButtons from "../components/ExportButtons.jsx";
import KpiCard from "../components/KpiCard.jsx";
import { Skeleton } from "../components/Loader.jsx";
import SalesTrendChart from "../components/charts/SalesTrendChart.jsx";
import BranchBarChart from "../components/charts/BranchBarChart.jsx";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import PaymentBreakdown from "../components/charts/PaymentBreakdown.jsx";
import { money, num } from "../utils/format.js";

export default function Dashboard() {
  const { filters, update, params } = useFilters(30);
  const { branches, colorOf } = useBranches();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setError("");
    api.get("/dashboard/summary", { params })
      .then(({ data }) => alive && setData(data))
      .catch((e) => alive && setError(e.response?.data?.message || "ডেটা লোড করা যায়নি"));
    return () => { alive = false; };
  }, [params]);

  const k = data?.kpi;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">বিক্রয় ড্যাশবোর্ড</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">সব শাখার বিক্রি এক স্ক্রিনে — তারিখ ও শাখা দিয়ে ফিল্টার করুন</p>
      </div>

      <FilterBar filters={filters} update={update} branches={branches}>
        <ExportButtons params={params} />
      </FilterBar>

      {error && <p className="card p-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!k ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <KpiCard index={0} icon={CalendarCheck} label="আজকের বিক্রি" value={money(k.todayRevenue)} sub={`${num(k.todayOrders)} টি অর্ডার আজ`} />
            <KpiCard index={1} icon={Banknote} label="মোট বিক্রি" value={money(k.revenue)} delta={k.growth} sub="আগের সময়ের তুলনায়" />
            <KpiCard index={2} icon={ShoppingCart} label="মোট অর্ডার" value={num(k.orders)} sub={`${num(k.items)} টি পণ্য`} />
            <KpiCard index={3} icon={Receipt} label="গড় অর্ডার মূল্য" value={money(k.avgOrder)} sub="প্রতি অর্ডার" />
          </>
        )}
      </div>

      {!data ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" /><Skeleton className="h-96" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <SalesTrendChart data={data.trend} branches={data.branches} colorOf={colorOf} />
            <CategoryPieChart data={data.byCategory} />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2"><BranchBarChart data={data.byBranch} colorOf={colorOf} /></div>
            <PaymentBreakdown data={data.byPayment} />
          </div>
        </>
      )}
    </div>
  );
}
