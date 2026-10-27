import mongoose from "mongoose";

/**
 * query (from, to, branch, search, status) থেকে MongoDB filter বানায়।
 * manager হলে branch জোর করে তার নিজের শাখায় সীমাবদ্ধ (role-based view)।
 */
export const buildSaleFilter = (query, user) => {
  const { from, to, branch, search, status } = query;
  const filter = {};

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.date.$lte = new Date(`${to}T23:59:59.999Z`);
  }

  if (user?.role === "manager" && user.branch) {
    filter.branch = new mongoose.Types.ObjectId(String(user.branch._id || user.branch));
  } else if (branch && branch !== "all") {
    const ids = String(branch).split(",").filter((id) => mongoose.isValidObjectId(id));
    if (ids.length === 1) filter.branch = new mongoose.Types.ObjectId(ids[0]);
    else if (ids.length > 1) filter.branch = { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) };
  }

  if (status && status !== "all") filter.status = status;

  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ invoiceNo: rx }, { customer: rx }, { product: rx }, { category: rx }];
  }

  return filter;
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
