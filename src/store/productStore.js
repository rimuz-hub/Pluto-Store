import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import productsData from '../data/products.json';
import { nanoid } from 'nanoid';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: productsData.map((p) => {
        // normalize reviews and compute rating metadata
        const reviews = (p.reviews || []).map((r, idx) => ({
          id: r.id || `${Date.now()}-${idx}`,
          userEmail: r.userEmail || '',
          userName: r.userName || r.name || 'Anonymous',
          rating: (r.stars !== undefined ? r.stars : (r.rating !== undefined ? r.rating : 5)),
          comment: r.comment || r.text || '',
          date: r.date || new Date().toISOString(),
          verifiedBuyer: r.verifiedBuyer !== undefined ? r.verifiedBuyer : (idx % 2 === 0), // every 2nd review
        }));
        const reviewCount = reviews.length;
        const averageRating = reviewCount ? reviews.reduce((a, b) => a + b.rating, 0) / reviewCount : (p.rating !== undefined ? p.rating : 0);
        return {
          ...p,
          reviews,
          reviewCount,
          averageRating: Number(averageRating.toFixed(2)),
          createdAt: (p.createdAt !== undefined ? p.createdAt : Date.now()),
        };
      }),
      addProduct: (newProduct) => {
        set((state) => {
          const nextId = state.products.length ? Math.max(...state.products.map((p) => p.id)) + 1 : 1;
          const reviews = (newProduct.reviews || []).map((r, idx) => ({ id: r.id || nanoid(), userEmail: r.userEmail || '', userName: r.userName || r.name || 'Anonymous', rating: (r.stars !== undefined ? r.stars : (r.rating !== undefined ? r.rating : 5)), comment: r.comment || '', date: r.date || new Date().toISOString(), verifiedBuyer: r.verifiedBuyer !== undefined ? r.verifiedBuyer : (idx % 2 === 0) }));
          const reviewCount = reviews.length;
          const averageRating = reviewCount ? reviews.reduce((a, b) => a + b.rating, 0) / reviewCount : (newProduct.rating !== undefined ? newProduct.rating : 0);
          const product = {
            ...newProduct,
            id: nextId,
            slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
            rating: (newProduct.rating !== undefined ? newProduct.rating : Number(averageRating.toFixed(2)) ),
            featured: (newProduct.featured !== undefined ? newProduct.featured : false),
            reviews,
            stock: (newProduct.stock !== undefined ? newProduct.stock : 0),
            discount: (newProduct.discount !== undefined ? newProduct.discount : 0),
            variants: (newProduct.variants !== undefined ? newProduct.variants : []),
            reviewCount,
            averageRating: Number(averageRating.toFixed(2)),
            createdAt: (newProduct.createdAt !== undefined ? newProduct.createdAt : Date.now()),
          };
          return { products: [...state.products, product] };
        });
      },
      addReview: (productId, { userEmail, userName, rating, comment }) => {
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id !== productId) return product;
            // Check if user already reviewed
            const existingReview = product.reviews.find(r => r.userEmail === userEmail);
            if (existingReview) return product; // Prevent duplicate
            const review = { id: nanoid(), userEmail, userName, rating: Number(rating) || 5, comment: comment || '', date: new Date().toISOString(), verifiedBuyer: Math.random() > 0.5 }; // random for new reviews
            const reviews = [review, ...(product.reviews || [])];
            const reviewCount = reviews.length;
            const averageRating = reviewCount ? reviews.reduce((a, b) => a + b.rating, 0) / reviewCount : 0;
            return { ...product, reviews, reviewCount, averageRating: Number(averageRating.toFixed(2)), rating: Number(averageRating.toFixed(2)) };
          }),
        }));
      },
      deleteReview: (productId, reviewId, userEmail, isAdmin) => {
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id !== productId) return product;
            const review = product.reviews.find(r => r.id === reviewId);
            if (!review) return product;
            if (review.userEmail !== userEmail && !isAdmin) return product; // No permission
            const reviews = (product.reviews || []).filter((r) => r.id !== reviewId);
            const reviewCount = reviews.length;
            const averageRating = reviewCount ? reviews.reduce((a, b) => a + b.rating, 0) / reviewCount : 0;
            return { ...product, reviews, reviewCount, averageRating: Number(averageRating.toFixed(2)), rating: Number(averageRating.toFixed(2)) };
          }),
        }));
      },
      updateProduct: (updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
      },
      decreaseStock: (id, amount) => {
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id !== id) return product;
            const newStock = Math.max(0, (product.stock ?? 0) - amount);
            return { ...product, stock: newStock };
          }),
        }));
      },
    }),
    {
      name: 'premium-store-products',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
