import { useMemo, useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore, useThemeStore, useAuthStore } from '../store';
import { HiOutlineShoppingCart, HiSun, HiMoon, HiMenu, HiX, HiUser, HiChevronDown, HiOutlineSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { siteSettings } from '../siteSettings';

export function Navbar({ onSearchChange }) {
  const items = useCartStore((state) => state.items);
  const totalCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const dark = useThemeStore((state) => state.dark);
  const { currentUser, register, login, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 360);

  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const getInitials = (name = '') => {
    const normalized = name.trim();
    if (!normalized) return '??';
    const words = normalized.split(' ').filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setShowAuth(false);
    setIsLogin(true);
  };

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

  useEffect(() => {
    if (currentUser) {
      setShowAuth(false);
      setProfileOpen(false);
    }
  }, [currentUser]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    const emailValue = authEmail.trim().toLowerCase();
    const passwordValue = authPassword.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (passwordValue.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (!isLogin && !authName.trim()) {
      setAuthError('Please enter your name.');
      return;
    }

    try {
      if (isLogin) {
        await login(emailValue, passwordValue);
      } else {
        await register(emailValue, passwordValue, authName.trim());
        await login(emailValue, passwordValue);
      }
      setShowAuth(false);
      setProfileOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthError('');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <>
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
            <button onClick={() => setMobileSearchOpen(true)} className="sm:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Search">
              <HiOutlineSearch />
            </button>
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

            {currentUser ? (
              <div className="relative">
                <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800" aria-label="User menu">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${currentUser.isAdmin ? 'bg-indigo-500' : 'bg-green-500'}`}>
                    {getInitials(currentUser.name)}
                  </span>
                  <span className="hidden sm:inline-block text-slate-700 dark:text-slate-200">{currentUser.name}</span>
                  <HiChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">My Account</button>
                    {currentUser.isAdmin && (
                      <button onClick={() => { setProfileOpen(false); navigate('/admin-secret-portal'); }} className="w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">Admin Panel</button>
                    )}
                    <button onClick={handleLogout} className="w-full rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => { setShowAuth(true); setIsLogin(true); }} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" aria-label="Login">
                Login
              </button>
            )}

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

      {mobileSearchOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-2 p-4">
            <input
              ref={(el) => el && mobileSearchOpen && el.focus()}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-300"
            />
            <button onClick={() => setMobileSearchOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close search">
              <HiX />
            </button>
          </div>
        </motion.div>
      )}

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleAuth} className="space-y-3">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                required
              />
              {!isLogin && (
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              )}
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                required
              />
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">{isLogin ? 'Login' : 'Register'}</button>
                <button type="button" onClick={() => setShowAuth(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</button>
              </div>
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-sm text-brand-600 hover:underline">
                {isLogin ? 'Need to register?' : 'Already have an account?'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
