import Sale from "../models/Sale.js";
import { buildSaleFilter, asyncHandler } from "../utils/buildFilter.js";

const SORTABLE = ["date", "total", "quantity", "invoiceNo", "customer", "product"];

// GET /api/sales?from&to&branch&search&status&page&limit&sort&order
export const getSales = asyncHandler(async (req, res) => {
  const filter = buildSaleFilter(req.query, req.user);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const sortKey = SORTABLE.includes(req.query.sort) ? req.query.sort : "date";
  const order = req.query.order === "asc" ? 1 : -1;

  const [rows, total] = await Promise.all([
    Sale.find(filter)
      .populate("branch", "name code")
      .sort({ [sortKey]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Sale.countDocuments(filter),
  ]);

  res.json({ rows, total, page, pages: Math.ceil(total / limit) || 1, limit });
});

// POST /api/sales
export const createSale = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "manager") data.branch = req.user.branch?._id;
  data.invoiceNo ||= `INV-${Date.now()}`;
  const sale = await Sale.create(data);
  res.status(201).json(sale);
});

// DELETE /api/sales/:id (admin)
export const deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);
  if (!sale) return res.status(404).json({ message: "Sale not found" });
  res.json({ message: "Deleted" });
});
