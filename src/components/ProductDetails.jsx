import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore, useProductStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { siteSettings } from '../siteSettings';
import { Toast } from './Toast';

export function ProductDetails({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const favoriteIds = useCartStore((state) => state.favoriteIds);
  const isFavorite = favoriteIds.includes(product.id);
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const addReview = useProductStore((state) => state.addReview);
  const deleteReview = useProductStore((state) => state.deleteReview);

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [toast, setToast] = useState('');

  const averageRating = useMemo(() => (product.averageRating ?? (product.reviews && product.reviews.length ? product.reviews.reduce((acc, r) => acc + (r.rating ?? r.stars ?? 0), 0) / product.reviews.length : (product.rating ?? 0))), [product]);
  const inStock = (selectedVariant?.stock ?? product.stock ?? 0) > 0;
  const priceWithDiscount = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  useEffect(() => {
    if (!selectedVariant && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product.variants, selectedVariant]);

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <img
            src={product.photos?.[0] || product.image || siteSettings.fallbackImage}
            alt={product.name}
            className="h-full w-full rounded-xl object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = siteSettings.fallbackImage; }}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <button onClick={() => toggleFavorite(product.id)} className="text-lg text-brand-700 dark:text-brand-300">
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {product.variants?.length > 0 && (
              <select value={selectedVariant?.label} onChange={(e) => setSelectedVariant(product.variants.find((v) => v.label === e.target.value))} className="rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950">
                {product.variants.map((variant) => <option key={variant.label} value={variant.label}>{variant.label} ({variant.stock} left)</option>)}
              </select>
            )}
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${inStock ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>{inStock ? 'In stock' : 'Out of stock'}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-3xl font-black">
              {product.discount > 0 ? (
                <><span>{formatCurrency(priceWithDiscount)}</span> <small className="ml-2 text-base font-medium line-through text-slate-400 dark:text-slate-500">{formatCurrency(product.price)}</small></>
              ) : (
                <span>{formatCurrency(product.price)}</span>
              )}
            </div>
            <div className="rounded-lg bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">{averageRating.toFixed(1)} ★</div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{product.description}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button onClick={() => addItem({ ...product, variantLabel: selectedVariant?.label, variantStock: selectedVariant?.stock })} disabled={!inStock} className="flex-1 rounded-lg bg-blue-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Add to Cart
            </button>
            <button onClick={() => { addItem({ ...product, variantLabel: selectedVariant?.label, variantStock: selectedVariant?.stock }); navigate('/cart'); }} disabled={!inStock} className="flex-1 rounded-lg border-2 border-blue-600 px-6 py-3.5 text-lg font-bold text-blue-600 hover:bg-blue-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:hover:bg-slate-800 dark:text-blue-400 dark:border-blue-400">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Average rating {Number(averageRating).toFixed(1)} ({product.reviewCount ?? product.reviews.length} reviews)</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="mt-2 space-y-3">
              {product.reviews.map((review, index) => (
                <div key={`${product.id}-review-${review.id || index}`} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-500">{'★'.repeat(Math.round(review.rating))}</span>
                      <button onClick={() => { deleteReview(product.id, review.id); setToast('Review deleted'); }} className="text-xs text-red-600">Delete</button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(review.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <div className="rounded-lg border border-slate-100 p-3">
              <h3 className="font-semibold">Rating breakdown</h3>
              {([5,4,3,2,1].map((star) => {
                const count = (product.reviews || []).filter((r) => Math.round(r.rating) === star).length;
                const pct = product.reviewCount ? Math.round((count / product.reviewCount) * 100) : 0;
                return (
                  <div key={star} className="mt-2 flex items-center gap-2">
                    <div className="w-8 text-sm">{star}★</div>
                    <div className="flex-1 h-3 rounded bg-slate-100 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-3 bg-amber-400" />
                    </div>
                    <div className="w-8 text-right text-sm">{count}</div>
                  </div>
                );
              }))}
            </div>
            <div className="mt-4 rounded-lg border border-slate-100 p-3">
              <h3 className="font-semibold">Write a review</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!reviewName.trim() || !reviewComment.trim() || !reviewRating) {
                  setToast('Please provide name, rating and comment');
                  return;
                }
                addReview(product.id, { name: reviewName.trim(), rating: reviewRating, comment: reviewComment.trim() });
                setReviewName(''); setReviewRating(5); setReviewComment('');
                setToast('Review submitted — thanks!');
              }} className="space-y-2">
                <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-slate-200 p-2 text-sm" />
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((i) => (
                    <button key={i} type="button" onClick={() => setReviewRating(i)} className={`text-2xl ${i <= reviewRating ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
                  ))}
                </div>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} placeholder="Your review" className="w-full rounded-lg border border-slate-200 p-2 text-sm" />
                <button type="submit" className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
        <Toast message={toast} onClose={() => setToast('')} />
      </div>
    </motion.section>
  );
}
