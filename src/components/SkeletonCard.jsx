export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="h-44 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
