import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    favoriteIds: [],
    addItem: (product) => {
      if ((product.stock ?? 0) <= 0) return;
      const key = `${product.id}-${product.variantLabel || 'default'}`;
      const existing = get().items.find((item) => item.cartKey === key);
      const maxQty = product.variantStock ?? product.stock ?? 1;

      if (existing) {
        if (existing.quantity >= maxQty) return;
        set((state) => ({
          items: state.items.map((item) => item.cartKey === key ? { ...item, quantity: item.quantity + 1 } : item)
        }));
      } else {
        set((state) => ({
          items: [...state.items, {
            cartKey: key,
            productId: product.id,
            ...product,
            quantity: 1,
            stock: product.stock ?? 0,
            variantLabel: product.variantLabel,
            variantStock: product.variantStock,
          }]
        }));
      }
    },
    removeItem: (cartKey) => set((state) => ({ items: state.items.filter((item) => item.cartKey !== cartKey) })),
    updateQuantity: (cartKey, qty) => set((state) => {
      if (qty <= 0) {
        return { items: state.items.filter((item) => item.cartKey !== cartKey) };
      }
      return {
        items: state.items.map((item) => {
          if (item.cartKey !== cartKey) return item;
          const maxQty = item.variantStock ?? item.stock ?? 1;
          const normalized = Math.max(1, Math.min(qty, maxQty));
          return { ...item, quantity: normalized };
        }),
      };
    }),
    clearCart: () => set({ items: [] }),
    toggleFavorite: (id) => set((state) => ({
      favoriteIds: state.favoriteIds.includes(id) ? state.favoriteIds.filter((item) => item !== id) : [...state.favoriteIds, id]
    }))
  }),
  {
    name: 'premium-store-cart',
    storage: createJSONStorage(() => localStorage),
  }
));
