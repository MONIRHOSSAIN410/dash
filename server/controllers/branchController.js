import Branch from "../models/Branch.js";
import { asyncHandler } from "../utils/buildFilter.js";

// GET /api/branches  — manager শুধু নিজের শাখা পায়
export const getBranches = asyncHandler(async (req, res) => {
  const q = req.user.role === "manager" ? { _id: req.user.branch?._id } : {};
  const branches = await Branch.find(q).sort({ name: 1 }).lean();
  res.json(branches);
});

// POST /api/branches (admin)
export const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json(branch);
});
