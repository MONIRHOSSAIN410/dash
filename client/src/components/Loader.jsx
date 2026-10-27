export default function Loader({ full }) {
  return (
    <div className={`grid place-items-center ${full ? "h-screen" : "h-64"}`}>
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-500/25 border-t-brand-500" />
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800 ${className}`} />;
}
