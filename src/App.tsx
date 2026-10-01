/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Stats } from './components/Stats';
import { Menu } from './components/Menu';
import { CallToAction } from './components/CallToAction';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { OrderDrawer } from './components/OrderDrawer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { OwnerDashboard } from './components/admin/OwnerDashboard';
import { MenuItem, CartItem } from './types';
import { ShoppingBag } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'site' | 'admin'>('site');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check URL hash for direct owner access (e.g. #admin or #gestor)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#gestor') {
        setIsAdminLoginOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.item.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // If in Owner Mode, show the complete management app
  if (currentView === 'admin') {
    return <OwnerDashboard onExit={() => setCurrentView('site')} />;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-neutral-100 font-body selection:bg-[#F97316] selection:text-white">
      {/* Navigation Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsDrawerOpen(true)}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <Story />
        <Stats />
        <Menu onAddToCart={handleAddToCart} />
        <CallToAction />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminLoginOpen(true)} />

      {/* Floating Cart Button for Quick Access */}
      {totalCartCount > 0 && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Ver sacola de pedidos"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-display uppercase tracking-wider text-sm font-semibold rounded-full shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Ver Pedido</span>
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono tabular-nums">
            {totalCartCount}
          </span>
        </button>
      )}

      {/* Interactive Cart / Order Drawer */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Owner Security PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setCurrentView('admin');
        }}
      />
    </div>
  );
}

