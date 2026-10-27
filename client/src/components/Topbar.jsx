import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Topbar({ onMenu }) {
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={onMenu} className="rounded-lg p-2 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="btn-ghost h-10 w-10 overflow-hidden p-0" aria-label="Toggle dark mode">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={logout} className="btn-ghost h-10" aria-label="Logout">
            <LogOut size={16} /> <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </div>
    </header>
  );
}
