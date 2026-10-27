import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Branch from "../models/Branch.js";
import User from "../models/User.js";
import Sale from "../models/Sale.js";

dotenv.config();
await connectDB();

const BRANCHES = [
  { name: "Dhaka", code: "DHK", city: "Dhaka", manager: "Rahim" },
  { name: "Chattogram", code: "CTG", city: "Chattogram", manager: "Karim" },
  { name: "Sylhet", code: "SYL", city: "Sylhet", manager: "Nusrat" },
  { name: "Khulna", code: "KHL", city: "Khulna", manager: "Tanvir" },
  { name: "Rajshahi", code: "RAJ", city: "Rajshahi", manager: "Sadia" },
];
const PRODUCTS = [
  ["Smartphone", "Electronics", 18000], ["Headphones", "Electronics", 2500],
  ["T-Shirt", "Fashion", 650], ["Jeans", "Fashion", 1800],
  ["Rice 5kg", "Grocery", 420], ["Cooking Oil 2L", "Grocery", 380],
  ["Blender", "Home", 4200], ["Bedsheet", "Home", 1500],
];
const CUSTOMERS = ["Arif", "Mitu", "Shuvo", "Rumana", "Jamil", "Farhana", "Sabbir", "Lima", "Walk-in"];
const PAY = ["Cash", "Card", "bKash", "Nagad"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

await Promise.all([Branch.deleteMany(), User.deleteMany(), Sale.deleteMany()]);
const branches = await Branch.insertMany(BRANCHES);

await User.create({ name: "Super Admin", email: "admin@demo.com", password: "admin123", role: "admin" });
await User.create({
  name: "Dhaka Manager", email: "manager@demo.com", password: "manager123",
  role: "manager", branch: branches[0]._id,
});

const sales = [];
let n = 1;
const DAYS = 90;
for (let d = DAYS; d >= 0; d--) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - d);
  branches.forEach((b, bi) => {
    const count = 4 + Math.floor(Math.random() * 6) + (bi === 0 ? 3 : 0);
    for (let i = 0; i < count; i++) {
      const [product, category, price] = pick(PRODUCTS);
      const quantity = 1 + Math.floor(Math.random() * 3);
      const when = new Date(date);
      when.setUTCHours(3 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
      sales.push({
        invoiceNo: `INV-${String(n++).padStart(6, "0")}`,
        branch: b._id, customer: pick(CUSTOMERS), product, category, quantity,
        unitPrice: price, total: price * quantity, paymentMethod: pick(PAY),
        status: Math.random() < 0.05 ? "Refunded" : Math.random() < 0.08 ? "Pending" : "Completed",
        date: when,
      });
    }
  });
}
await Sale.insertMany(sales);

console.log(`🌱 Seeded ${branches.length} branches, ${sales.length} sales, 2 users`);
console.log("   admin@demo.com / admin123   |   manager@demo.com / manager123 (Dhaka)");
await mongoose.disconnect();
