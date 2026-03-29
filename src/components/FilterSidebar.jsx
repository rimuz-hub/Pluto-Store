import { useMemo } from 'react';

export function FilterSidebar({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, onClearFilters }) {
  const categoryItems = useMemo(() => ['All', ...categories], [categories]);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 sticky top-24 h-fit dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
        <button onClick={onClearFilters} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-200">Reset</button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950">
            {categoryItems.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price range</label>
          <div className="flex items-center gap-2">
            <input value={priceRange[0]} onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])} type="number" min={0} className="w-1/2 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
            <input value={priceRange[1]} onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])} type="number" min={0} className="w-1/2 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
          </div>
        </div>
      </div>
    </aside>
  );
}
