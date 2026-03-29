import { useMemo, useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore, useThemeStore } from '../store';
import { HiOutlineShoppingCart, HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';
import { useDebounce } from '../hooks/useDebounce';
import { siteSettings } from '../siteSettings';

export function Navbar({ onSearchChange }) {
  const items = useCartStore((state) => state.items);
  const totalCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const dark = useThemeStore((state) => state.dark);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 360);

  useEffect(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('q') !== debouncedSearch) {
      if (debouncedSearch) params.set('q', debouncedSearch);
      else params.delete('q');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramValue = params.get('q') || '';
    setSearch(paramValue);
  }, [location.search]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileOpen((v) => !v)} className="inline-flex items-center justify-center rounded-lg border p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden">
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
          <Link to="/" className="text-2xl font-semibold tracking-tight text-brand-700 dark:text-brand-200">
            {siteSettings.logoText}
          </Link>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <NavLink to="/" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:text-brand-700 dark:text-slate-200'}`}>
            Shop
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:text-brand-700 dark:text-slate-200'}`}>
            Favorites
          </NavLink>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="hidden w-72 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-300 sm:inline-block"
          />
          <button onClick={toggleTheme} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle theme">
            {dark ? <HiSun /> : <HiMoon />}
          </button>

          <Link to="/cart" className="relative inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Cart">
            <HiOutlineShoppingCart />
            {totalCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{totalCount}</span>}
          </Link>
        </div>
      </div>
      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:hidden">
          <div className="space-y-1 p-3">
            <NavLink to="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Shop</NavLink>
            <NavLink to="/favorites" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Favorites</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
