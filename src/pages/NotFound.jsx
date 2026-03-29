import { Link } from 'react-router-dom';
export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-black text-brand-700 dark:text-brand-300">404</h1>
      <p className="mt-3 text-center text-lg text-slate-600 dark:text-slate-300">Sorry, we couldn’t find that page.</p>
      <Link to="/" className="mt-5 rounded-lg bg-brand-600 px-5 py-2 text-white hover:bg-brand-700">Back to Shop</Link>
    </div>
  );
}
