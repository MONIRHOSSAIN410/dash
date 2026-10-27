import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Moon, Sun, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "admin@demo.com", password: "admin123" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <button onClick={toggle} className="btn-ghost absolute right-4 top-4 h-10 w-10 p-0" aria-label="Toggle theme">
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.form onSubmit={submit}
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="card relative w-full max-w-sm space-y-4 p-7">
        <div className="mb-2 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-white"><BarChart3 size={20} /></div>
          <div>
            <h1 className="text-lg font-semibold">SalesPulse Admin</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">মালিক ও ম্যানেজারদের রিপোর্টিং প্যানেল</p>
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">ইমেইল</span>
          <input className="input" type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">পাসওয়ার্ড</span>
          <input className="input" type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>

        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">{error}</motion.p>
        )}

        <button className="btn-primary w-full py-2.5" disabled={busy}>
          <LogIn size={16} /> {busy ? "অপেক্ষা করুন..." : "লগইন"}
        </button>

        <div className="rounded-xl bg-zinc-100 p-3 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <p className="mb-1 font-medium">ডেমো অ্যাকাউন্ট</p>
          <button type="button" className="block hover:underline" onClick={() => setForm({ email: "admin@demo.com", password: "admin123" })}>
            Admin: admin@demo.com / admin123
          </button>
          <button type="button" className="block hover:underline" onClick={() => setForm({ email: "manager@demo.com", password: "manager123" })}>
            Manager (Dhaka): manager@demo.com / manager123
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
