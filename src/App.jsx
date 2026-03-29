import { useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Favorites } from './pages/Favorites';
import { NotFound } from './pages/NotFound';
import { Toast } from './components/Toast';
import { useCartStore } from './store/cartStore';


function AnimatedRoutes({ searchText }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home searchText={searchText} />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin-secret-portal" element={<Admin />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [toast, setToast] = useState('');
  const items = useCartStore((state) => state.items);
  const total = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2400);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        <div className="relative z-10">
          <Navbar onSearchChange={setSearchText} />

          <main className="min-h-[calc(100vh-160px)]">
            <AnimatedRoutes searchText={searchText} />
          </main>

          <footer>
            <Footer />
          </footer>

          {toast && <Toast message={toast} onClose={() => setToast('')} />}

          {items.length > 0 && (
            <div className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors">
              Cart: ${total.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}
