import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetails } from '../components/ProductDetails';
import { useCartStore, useProductStore } from '../store';


export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const products = useProductStore((state) => state.products);

  useEffect(() => {
    const itemBySlug = products.find((p) => p.slug === id);
    const itemById = products.find((p) => String(p.id) === id);
    const item = itemBySlug || itemById;
    if (!item) {
      setNotFound(true);
      return;
    }
    setProduct(item);
  }, [id, products]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-transparent via-slate-900/5 to-transparent py-6">
        <div className="mx-auto max-w-7xl p-4">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-sm text-slate-500">The product you were looking for does not exist.</p>
          <button onClick={() => navigate('/')} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Go to shop</button>
        </div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-gradient-to-b from-transparent via-slate-900/5 to-transparent py-6"><div className="mx-auto max-w-7xl p-4">Loading product...</div></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
