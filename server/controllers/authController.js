import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/buildFilter.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  branch: u.branch,
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email }).select("+password").populate("branch", "name code");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

// POST /api/auth/register  (admin only)
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, branch } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });
  const user = await User.create({ name, email, password, role, branch: branch || null });
  res.status(201).json({ user: publicUser(user) });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
