import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useProductStore } from '../store';
import { formatCurrency } from '../utils/formatCurrency';

export function Cart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

  if (items.length === 0) {
    return (
    <div>
      <p className="text-slate-600 dark:text-slate-400">Your cart is empty. Start shopping!</p>
    </div>
    );
  }

  const decreaseStock = useProductStore((state) => state.decreaseStock);

  const onCheckout = () => {
    items.forEach((item) => {
      decreaseStock(item.productId, item.quantity);
    });
    clearCart();
    alert('Checkout complete (mock). Stock updated and cart cleared.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border p-4 dark:border-slate-800">
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[auto,1fr,auto] sm:items-center">
              <img
                src={item.image || 'https://via.placeholder.com/150?text=No+Image'}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover self-center sm:self-auto"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)} x {item.quantity}</p>
                <p className="text-xs text-slate-400">{item.variantLabel || 'Default variant'}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">−</button>
                  <span className="px-3 font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} disabled={item.quantity >= item.stock} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400">+</button>
                </div>
                <button onClick={() => removeItem(item.cartKey)} className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h3>
          <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span>Included</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={onCheckout} className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white hover:bg-blue-700 transition-colors active:scale-95">
            Checkout
          </button>
          <button onClick={() => navigate('/')} className="w-full rounded-lg border-2 border-blue-600 px-6 py-3 text-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors dark:hover:bg-slate-800 dark:text-blue-400 dark:border-blue-400">
            Continue Shopping
          </button>
          <button onClick={() => clearCart()} className="w-full rounded-lg bg-red-100 px-6 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
            Clear Cart
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
