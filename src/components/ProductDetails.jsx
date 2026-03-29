import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore, useProductStore, useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { siteSettings } from '../siteSettings';
import { Toast } from './Toast';
import { FaWhatsapp } from 'react-icons/fa';

export function ProductDetails({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const favoriteIds = useCartStore((state) => state.favoriteIds);
  const isFavorite = favoriteIds.includes(product.id);
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const addReview = useProductStore((state) => state.addReview);
  const deleteReview = useProductStore((state) => state.deleteReview);

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

  const handleWhatsAppOrder = () => {
    const message = `Hello, I want to order: ${product.name} - Price: ${formatCurrency(priceWithDiscount)}`;
    const whatsappBase = siteSettings.socials.whatsapp || `https://wa.me/${siteSettings.whatsappNumber}`;
    const separator = whatsappBase.includes('?') ? '&' : '?';
    const url = `${whatsappBase}${separator}text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getInitials = (name) => {
    const normalized = (name || '').trim();
    if (!normalized) return '??';
    const words = normalized.split(' ').filter(Boolean);
    if (words.length === 0) return '??';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getRandomColor = (name) => {
    const normalized = (name || 'user').trim();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const index = [...normalized].reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 sm:pb-6">
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
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
            <div className="text-4xl font-black">
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
            <button onClick={handleWhatsAppOrder} className="flex-1 rounded-lg bg-green-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2">
              <FaWhatsapp className="h-6 w-6" />
              <span className="text-lg">Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-slate-200 p-4 sm:hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="flex gap-2">
          <button onClick={() => addItem({ ...product, variantLabel: selectedVariant?.label, variantStock: selectedVariant?.stock })} disabled={!inStock} className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Add to Cart
          </button>
          <button onClick={handleWhatsAppOrder} className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-base font-bold text-white hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2">
            <FaWhatsapp className="h-5 w-5" />
            Order
          </button>
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
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getRandomColor(review.userName)}`}>
                        {getInitials(review.userName)}
                      </div>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        {review.verifiedBuyer && (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-500">{'★'.repeat(Math.round(review.rating))}</span>
                      {(currentUser && (review.userEmail === currentUser.email || currentUser.isAdmin)) && (
                        <button onClick={() => { deleteReview(product.id, review.id, currentUser.email, currentUser.isAdmin); setToast('Review deleted'); }} className="text-xs text-red-600">Delete</button>
                      )}
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
              {currentUser ? (
                (() => {
                  const existingReview = product.reviews.find(r => r.userEmail === currentUser.email);
                  if (existingReview) {
                    return (
                      <p className="text-sm text-slate-500">You already reviewed this product.</p>
                    );
                  }
                  return (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!reviewComment.trim() || !reviewRating) {
                        setToast('Please provide rating and comment');
                        return;
                      }
                      addReview(product.id, { userEmail: currentUser.email, userName: currentUser.name, rating: reviewRating, comment: reviewComment.trim() });
                      setReviewRating(5); setReviewComment('');
                      setToast('Review submitted — thanks!');
                    }} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map((i) => (
                          <button key={i} type="button" onClick={() => setReviewRating(i)} className={`text-2xl ${i <= reviewRating ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
                        ))}
                      </div>
                      <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} placeholder="Your review" className="w-full rounded-lg border border-slate-200 p-2 text-sm" />
                      <button type="submit" className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Submit Review</button>
                    </form>
                  );
                })()
              ) : (
                <p className="text-sm text-slate-500">Please log in to write a review.</p>
              )}
            </div>
          </div>
        </div>
        <Toast message={toast} onClose={() => setToast('')} />
      </div>
    </motion.section>
  );
}
