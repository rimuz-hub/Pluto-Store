import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { useCartStore } from '../store';
import { formatCurrency } from '../utils/formatCurrency';

export function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white p-6 shadow-xl dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Close</button>
            </div>
            {items.length === 0 ? (
              <p className="text-slate-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.cartKey} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.name}</p>
                        <div className="mt-1 text-sm text-slate-500">{formatCurrency(item.price)}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="rounded border px-2 text-sm">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="rounded border px-2 text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.cartKey)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-lg font-semibold">Total: {formatCurrency(total)}</div>
              <button className="mt-3 w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">Checkout</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
