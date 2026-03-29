import { useMemo, useState } from 'react';
import { ProductForm } from '../components/ProductForm';
import { ProductCard } from '../components/ProductCard';
import { useProductStore } from '../store';
import { siteSettings } from '../siteSettings';

export function Admin() {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [tab, setTab] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [openReviewsFor, setOpenReviewsFor] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [password, setPassword] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (item) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...item });
      setEditingProduct(null);
      setTab('manage');
    } else {
      addProduct(item);
    }
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setTab('add');
  };

  const deleteReview = useProductStore((state) => state.deleteReview);

  const sortedProducts = useMemo(() => {
    let items = [...products];
    if (sortOption === 'highest-rated') items.sort((a, b) => (b.averageRating ?? b.rating ?? 0) - (a.averageRating ?? a.rating ?? 0));
    if (sortOption === 'most-reviewed') items.sort((a, b) => (b.reviewCount ?? b.reviews?.length ?? 0) - (a.reviewCount ?? a.reviews?.length ?? 0));
    if (sortOption === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, sortOption]);

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (password === siteSettings.adminPassword) {
      setAccessGranted(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);

  if (!accessGranted) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
        <form onSubmit={handleAdminLogin} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>

      <div className="mb-6 flex gap-2">
        <button onClick={() => { setTab('add'); setEditingProduct(null); }} className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${tab === 'add' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>Add Product</button>
        <button onClick={() => setTab('manage')} className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${tab === 'manage' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>Manage Products</button>
      </div>

      {tab === 'add' && (
      <div className="rounded-2xl border border-slate-200/50 bg-white/95 p-5 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/95">
          <ProductForm onSave={handleSave} categories={categories} initial={editingProduct || {}} />
          {editingProduct && (
            <button onClick={() => { setEditingProduct(null); }} className="mt-2 text-sm text-brand-600 hover:underline">Cancel edit</button>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <div className="mt-6 rounded-2xl border border-slate-200/50 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/95">
          <h2 className="mb-3 text-xl font-semibold">Manage Products</h2>
          <div className="mb-3 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Sort:</label>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-lg border border-slate-200 p-1 text-sm dark:border-slate-700">
                <option value="default">Default</option>
                <option value="highest-rated">Highest rated</option>
                <option value="most-reviewed">Most reviewed</option>
                <option value="price-asc">Price low → high</option>
                <option value="price-desc">Price high → low</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">Rating</th>
                      <th className="px-3 py-2">Reviews</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 odd:bg-slate-50 dark:odd:bg-slate-900">
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2">{product.price}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            value={product.stock ?? 0}
                            onChange={(e) => updateProduct({ ...product, stock: Number(e.target.value) })}
                            className="w-20 rounded-lg border border-slate-200 p-1 text-xs dark:border-slate-700"
                          />
                        </td>
                        <td className="px-3 py-2">{(product.averageRating ?? product.rating ?? 0).toFixed(1)}</td>
                        <td className="px-3 py-2">{product.reviewCount ?? product.reviews?.length ?? 0}</td>
                        <td className="px-3 py-2">{product.category}</td>
                        <td className="px-3 py-2 flex gap-2">
                          <button onClick={() => handleEdit(product)} className="rounded-lg bg-brand-600 px-2 py-1 text-xs font-semibold text-white hover:bg-brand-700">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
                          <button onClick={() => setOpenReviewsFor(openReviewsFor === product.id ? null : product.id)} className="rounded-lg bg-slate-200 px-2 py-1 text-xs font-semibold">Reviews</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
            </table>
          </div>
              {openReviewsFor && (
                <div className="mt-4 rounded-lg border border-slate-100 bg-white p-4">
                  <h4 className="font-semibold">Reviews for {products.find(p => p.id === openReviewsFor)?.name}</h4>
                  <div className="mt-2 space-y-2">
                    {(products.find(p => p.id === openReviewsFor)?.reviews || []).map((r) => (
                      <div key={r.id} className="flex items-start justify-between rounded-lg border p-2">
                        <div>
                          <div className="font-semibold">{r.name} <span className="text-xs text-amber-500">{'★'.repeat(Math.round(r.rating))}</span></div>
                          <div className="text-sm text-slate-600">{r.comment}</div>
                          <div className="text-xs text-slate-400">{new Date(r.date).toLocaleString()}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => { deleteReview(openReviewsFor, r.id); }} className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Categories</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => <li key={c} className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">{c}</li>)}
        </ul>
      </div>
      </div>
    </div>
  );
}
