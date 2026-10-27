# SalesPulse — Admin Dashboard / Reporting

মালিক ও ম্যানেজারদের জন্য বিক্রয় রিপোর্টিং প্যানেল। উদাহরণ: **"আমাদের ৫টা শাখার প্রতিদিনের বিক্রি একটা স্ক্রিনে চার্ট আকারে দেখতে চাই।"**

## স্ট্যাক
- **Frontend:** React 19 + Vite, Tailwind CSS v4, Framer Motion, Recharts, Lenis (smooth scroll), Lucide icons
- **Backend:** Node.js + Express 5 (`"type": "module"`), MongoDB + Mongoose, JWT auth, ExcelJS, PDFKit

## ফিচার
- KPI কার্ড — আজকের বিক্রি, মোট বিক্রি (আগের সময়ের তুলনায় growth %), মোট অর্ডার, গড় অর্ডার মূল্য
- Line chart (শাখা অনুযায়ী দৈনিক বিক্রি), Bar chart (শাখা তুলনা), Donut/Pie (ক্যাটাগরি), পেমেন্ট মেথড
- তারিখ (৭/৩০/৯০ দিন বা কাস্টম) ও শাখা অনুযায়ী ফিল্টার
- টেবিল — সার্চ, সর্ট, স্ট্যাটাস ফিল্টার, পেজিনেশন
- Excel (.xlsx) ও PDF এক্সপোর্ট (ফিল্টার মেনে)
- রোল অনুযায়ী দেখা — **admin** সব শাখা, **manager** শুধু নিজের শাখা (সার্ভারেই সীমাবদ্ধ)
- Dark mode, পুরো রেসপন্সিভ (মোবাইলে স্লাইড-ইন সাইডবার), smooth scroll, পেইজ/কার্ড/চার্ট অ্যানিমেশন

## ফোল্ডার
```
server/
  config/db.js
  models/       Branch.js, User.js, Sale.js
  controllers/  auth, dashboard, sale, branch, export
  routes/       authRoutes, dashboardRoutes, saleRoutes, branchRoutes, exportRoutes
  middleware/   auth.js (JWT + role), errorHandler.js
  utils/        buildFilter.js (তারিখ/শাখা/সার্চ filter + role lock)
  seed/seed.js  ৫টি শাখা, ৯০ দিনের ডেমো ডেটা, ২ জন ইউজার
  server.js
client/
  src/ api, context (Auth, Theme), hooks, components (charts, table, filter), pages
```

## চালানো
```bash
# ১) Backend
cd server
cp .env.example .env        # MONGO_URI ঠিক করুন
npm install
npm run seed                # ডেমো ডেটা
npm run dev                 # http://localhost:5000

# ২) Frontend (নতুন টার্মিনালে)
cd client
npm install
npm run dev                 # http://localhost:5173
```

ডেমো লগইন:
- Admin: `admin@demo.com` / `admin123`
- Manager (Dhaka): `manager@demo.com` / `manager123`

## API
| Method | Route | কাজ |
|---|---|---|
| POST | /api/auth/login | লগইন → JWT |
| GET | /api/auth/me | বর্তমান ইউজার |
| POST | /api/auth/register | নতুন ইউজার (admin) |
| GET | /api/dashboard/summary?from&to&branch | KPI + সব চার্ট ডেটা |
| GET | /api/sales?from&to&branch&search&status&page&limit&sort&order | টেবিল |
| POST | /api/sales | নতুন বিক্রি |
| DELETE | /api/sales/:id | মুছুন (admin) |
| GET/POST | /api/branches | শাখা তালিকা / নতুন শাখা (admin) |
| GET | /api/export/excel , /api/export/pdf | এক্সপোর্ট |

## ক্লায়েন্টকে জিজ্ঞেস করার প্রশ্ন
- ডেটার উৎস কী (Excel, ডেটাবেস, অন্য সফটওয়্যারের API)? কত ঘন ঘন আপডেট হয়?
- কে কী দেখবে (মালিক সব, ম্যানেজার নিজের শাখা)?
- কোন KPI সবচেয়ে জরুরি? নমুনা রিপোর্ট আছে?
- রেডিমেড টুল (Power BI / Metabase) চলবে, নাকি কাস্টম দরকার?
- অটো রিপোর্ট ইমেইল লাগবে কি?
