import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const initial = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  // class আগে বদলাই, যাতে চার্ট রেন্ডারের সময় নতুন CSS রং পড়তে পারে
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
  };
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}

export const useTheme = () => useContext(ThemeContext);
