import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import { formatCurrency } from '../utils/formatCurrency';
import { siteSettings } from '../siteSettings';

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const favoriteIds = useCartStore((state) => state.favoriteIds);
  const isFavorite = favoriteIds.includes(product.id);
  const navigate = useNavigate();

  const inStock = (product.stock ?? 0) > 0;
  const priceWithDiscount = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
  const NEW_DAYS = 7;
  const isNew = product.createdAt ? (Date.now() - Number(product.createdAt)) <= NEW_DAYS * 24 * 60 * 60 * 1000 : false;

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="group h-full rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden dark:border-slate-700 dark:bg-slate-900">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.image || siteSettings.fallbackImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = siteSettings.fallbackImage; }}
          />
          {product.discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">−{product.discount}%</span>}
          {isNew && <span className="absolute left-3 top-12 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">NEW</span>}
          <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${inStock ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>{inStock ? 'In Stock' : 'Out'}</span>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 dark:text-white">{product.name}</h3>
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">{(product.averageRating ?? product.rating ?? 0).toFixed(1)} ★ · {product.reviewCount ?? (product.reviews?.length ?? 0)} reviews</p>
            <div className="mt-2 flex gap-2">
              {((product.averageRating ?? product.rating) >= 4.7) && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Top rated</span>}
              {(product.reviewCount ?? (product.reviews?.length ?? 0)) >= 5 && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Best seller</span>}
            </div>
          </div>
          <button onClick={() => toggleFavorite(product.id)} className="text-xl transition-colors flex-shrink-0" aria-label="Wishlist">
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {product.discount > 0 ? (
              <><span>{formatCurrency(priceWithDiscount)}</span> <span className="ml-2 text-sm font-normal line-through text-slate-400">{formatCurrency(product.price)}</span></>
            ) : (
              formatCurrency(product.price)
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <button onClick={() => addItem(product)} disabled={!inStock} className="flex-1 min-h-[44px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all sm:py-2.5">
            Add to cart
          </button>
          <button onClick={() => { addItem(product); navigate('/cart'); }} disabled={!inStock} className="flex-1 min-h-[44px] rounded-lg border-2 border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:hover:bg-slate-800 dark:text-blue-400 dark:border-blue-400 sm:py-2.5">
            Buy now
          </button>
        </div>
      </div>
    </motion.article>
  );
}
