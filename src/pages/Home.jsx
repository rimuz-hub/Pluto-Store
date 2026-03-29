import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore, useProductStore } from '../store';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SkeletonCard } from '../components/SkeletonCard';

export function Home({ searchText }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewGrid, setViewGrid] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState([Number(searchParams.get('min') || 0), Number(searchParams.get('max') || 2000)]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.set('q', searchText);
    if (category !== 'All') params.set('category', category);
    if (priceRange[0]) params.set('min', priceRange[0].toString());
    if (priceRange[1]) params.set('max', priceRange[1].toString());
    setSearchParams(params, { replace: true });
  }, [searchText, category, priceRange, setSearchParams]);

  const products = useProductStore((state) => state.products);
  const categories = useMemo(() => [...new Set(products.map((item) => item.category))], [products]);
  const recommended = useMemo(() => products.filter((item) => (item.averageRating ?? item.rating ?? 0) >= 4.5).slice(0, 3), [products]);
  const [sortOption, setSortOption] = useState('default');

  const filtered = useMemo(() => {
    let items = [...products];
    if (category !== 'All') items = items.filter((item) => item.category === category);
    items = items.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);
    if (searchText) {
      const query = searchText.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
    }
    return items;
  }, [category, priceRange, searchText]);

  const recentlyAdded = useMemo(() => {
    return [...products].sort((a, b) => (Number(b.createdAt || 0) - Number(a.createdAt || 0))).slice(0, 6);
  }, [products]);

  const sortedFiltered = useMemo(() => {
    let items = [...filtered];
    if (sortOption === 'highest-rated') items.sort((a, b) => (b.averageRating ?? b.rating ?? 0) - (a.averageRating ?? a.rating ?? 0));
    if (sortOption === 'most-reviewed') items.sort((a, b) => (b.reviewCount ?? b.reviews?.length ?? 0) - (a.reviewCount ?? a.reviews?.length ?? 0));
    if (sortOption === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [filtered, sortOption]);

  const loading = false;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* New Arrivals / Recently Added - top of page */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-extrabold">New Arrivals</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Latest products added to the store</p>
            </div>
            <div>
              <button onClick={() => { const params = new URLSearchParams(searchParams); params.set('new', 'true'); setSearchParams(params); }} className="rounded-lg bg-blue-600 px-4 py-2 text-white">View All New</button>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4">
              {recentlyAdded.map((p) => <ProductCard key={`new-${p.id}`} product={p} />)}
            </div>
          </div>
        </motion.section>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileFilterOpen(true)} className="w-full min-h-[44px] rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors">
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onClearFilters={() => {
                setCategory('All');
                setPriceRange([0, 2000]);
              }}
            />
          </div>

          <main>
            <section className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{filtered.length} products</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewGrid(true)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewGrid ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>Grid</button>
                  <button onClick={() => setViewGrid(false)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!viewGrid ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>List</button>
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="ml-2 rounded-lg border border-slate-200 p-1 text-sm dark:border-slate-700">
                    <option value="default">Sort</option>
                    <option value="highest-rated">Highest rated</option>
                    <option value="most-reviewed">Most reviewed</option>
                    <option value="price-asc">Price low → high</option>
                    <option value="price-desc">Price high → low</option>
                  </select>
                </div>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
                </div>
              ) : (
                <motion.div className={viewGrid ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                  {sortedFiltered.map((product) => <ProductCard key={product.id} product={product} />)}
                </motion.div>
              )}
            </section>

            <section className="mt-8 space-y-6 py-8 sm:py-12 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recommended for you</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Curated picks based on your preferences</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4">
                {recommended.map((product) => <ProductCard key={`recommended-${product.id}`} product={product} />)}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFilterOpen(false)}></div>
          <div className="relative ml-auto w-80 max-w-full bg-white dark:bg-slate-900 p-6">
            <button onClick={() => setMobileFilterOpen(false)} className="absolute top-4 right-4 text-xl">×</button>
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              onCategoryChange={(cat) => { setCategory(cat); setMobileFilterOpen(false); }}
              priceRange={priceRange}
              onPriceChange={(range) => { setPriceRange(range); setMobileFilterOpen(false); }}
              onClearFilters={() => {
                setCategory('All');
                setPriceRange([0, 2000]);
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
