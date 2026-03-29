import { useMemo } from 'react';
import { useCartStore, useProductStore } from '../store';
import { ProductCard } from '../components/ProductCard';

export function Favorites() {
  const favoriteIds = useCartStore((state) => state.favoriteIds);
  const products = useProductStore((state) => state.products);

  const favoriteProducts = useMemo(() => products.filter((p) => favoriteIds.includes(p.id)), [favoriteIds, products]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Favorites</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Your saved items ({favoriteProducts.length})</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {favoriteProducts.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No favorite products yet.</p>
        ) : (
          favoriteProducts.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
      </div>
    </div>
  );
}
