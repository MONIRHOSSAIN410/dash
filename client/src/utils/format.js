export const iso = (d) => d.toISOString().slice(0, 10);
export const today = () => iso(new Date());
export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

const bdt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
export const money = (n) => `৳${bdt.format(n || 0)}`;
export const num = (n) => bdt.format(n || 0);
export const compact = (n) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n || 0);
export const shortDate = (s) =>
  new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

// শাখার রং সবসময় শাখার নামে বাঁধা — ফিল্টার বদলালেও রং বদলাবে না
export const SERIES = ["--series-1", "--series-2", "--series-3", "--series-4", "--series-5", "--series-6"];
export const colorVar = (i) => `var(${SERIES[i % SERIES.length]})`;
