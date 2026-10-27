import Sale from "../models/Sale.js";
import Branch from "../models/Branch.js";
import { buildSaleFilter, asyncHandler } from "../utils/buildFilter.js";

const DAY = 24 * 60 * 60 * 1000;

// GET /api/dashboard/summary?from&to&branch
export const getSummary = asyncHandler(async (req, res) => {
  const filter = buildSaleFilter(req.query, req.user);
  const completed = { ...filter, status: { $ne: "Refunded" } };

  // ---- KPI ----
  const [totals] = await Sale.aggregate([
    { $match: completed },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
        items: { $sum: "$quantity" },
      },
    },
  ]);

  // আজকের বিক্রি (branch ফিল্টার মেনে, তারিখ ফিল্টার বাদে)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { date: _ignored, ...noDate } = completed;
  const [today] = await Sale.aggregate([
    { $match: { ...noDate, date: { $gte: todayStart } } },
    { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  ]);

  // আগের সমান সময়ের সাথে তুলনা (growth %)
  let growth = null;
  if (filter.date?.$gte && filter.date?.$lte) {
    const span = filter.date.$lte - filter.date.$gte;
    const prevFilter = {
      ...completed,
      date: { $gte: new Date(filter.date.$gte - span - 1), $lte: new Date(filter.date.$gte - 1) },
    };
    const [prev] = await Sale.aggregate([
      { $match: prevFilter },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]);
    if (prev?.revenue) growth = (((totals?.revenue || 0) - prev.revenue) / prev.revenue) * 100;
  }

  // ---- শাখা অনুযায়ী দৈনিক বিক্রি (line chart) ----
  const daily = await Sale.aggregate([
    { $match: completed },
    {
      $group: {
        _id: { day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, branch: "$branch" },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  const branches = await Branch.find(
    filter.branch ? { _id: filter.branch.$in ? { $in: filter.branch.$in } : filter.branch } : {}
  )
    .sort({ name: 1 })
    .lean();
  const nameOf = Object.fromEntries(branches.map((b) => [String(b._id), b.name]));

  const byDay = {};
  for (const row of daily) {
    const d = row._id.day;
    byDay[d] ??= { date: d };
    const name = nameOf[String(row._id.branch)];
    if (name) byDay[d][name] = Math.round(row.revenue);
  }
  const trend = Object.values(byDay).map((r) => {
    for (const b of branches) r[b.name] ??= 0;
    return r;
  });

  // ---- শাখা তুলনা (bar chart) ----
  const byBranchRaw = await Sale.aggregate([
    { $match: completed },
    { $group: { _id: "$branch", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  ]);
  const byBranch = branches.map((b) => {
    const r = byBranchRaw.find((x) => String(x._id) === String(b._id));
    return { branch: b.name, revenue: Math.round(r?.revenue || 0), orders: r?.orders || 0 };
  });

  // ---- ক্যাটাগরি ভাগ (pie chart) ----
  const byCategory = await Sale.aggregate([
    { $match: completed },
    { $group: { _id: "$category", value: { $sum: "$total" } } },
    { $sort: { value: -1 } },
    { $project: { _id: 0, name: "$_id", value: { $round: ["$value", 0] } } },
  ]);

  // ---- পেমেন্ট মেথড ----
  const byPayment = await Sale.aggregate([
    { $match: completed },
    { $group: { _id: "$paymentMethod", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $project: { _id: 0, name: "$_id", value: 1 } },
  ]);

  const revenue = totals?.revenue || 0;
  const orders = totals?.orders || 0;

  res.json({
    kpi: {
      todayRevenue: Math.round(today?.revenue || 0),
      todayOrders: today?.orders || 0,
      revenue: Math.round(revenue),
      orders,
      items: totals?.items || 0,
      avgOrder: orders ? Math.round(revenue / orders) : 0,
      growth: growth == null ? null : Number(growth.toFixed(1)),
    },
    branches: branches.map((b) => b.name),
    trend,
    byBranch,
    byCategory,
    byPayment,
    range: { days: filter.date?.$gte ? Math.ceil((filter.date.$lte - filter.date.$gte) / DAY) : null },
  });
});
