import { useState, useEffect } from 'react';

export function ProductForm({ onSave, initial = {}, categories = [] }) {
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    category: '',
    image: '',
    description: '',
    stock: 0,
    ...initial
  });

  useEffect(() => {
    setProduct({
      name: initial.name || '',
      price: initial.price || 0,
      category: initial.category || '',
      image: initial.image || '',
      description: initial.description || '',
      stock: initial.stock || 0,
      ...initial,
    });
  }, [initial]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...product });
    setProduct({ name: '', price: 0, category: '', image: '', description: '', stock: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-900">
      <h2 className="text-xl font-semibold">Add / Edit Product (Mock)</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
        <input
          required
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Enter product name"
          className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
            placeholder="0"
            className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
          />
        </div>
        {categories.length > 0 ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              required
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="">Other</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <input
              required
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              placeholder="Enter category"
              className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
            />
          </div>
        )}
      </div>
      <label className="block text-sm font-medium">Upload image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setProduct({ ...product, image: reader.result });
          reader.readAsDataURL(file);
        }}
        className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
      />
      <input
        required
        value={product.image}
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
        placeholder="Image URL"
        className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
      />
      {product.image && (
        <div className="h-40 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <img
            src={product.image}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/500x300?text=Preview+not+available';
            }}
          />
        </div>
      )}
      <textarea
        required
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        rows={4}
        placeholder="Description"
        className="w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700"
      />
      <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Save Product</button>
    </form>
  );
}
