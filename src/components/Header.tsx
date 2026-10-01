import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menu';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onOpenAdmin }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <a
          href="#inicio"
          className="text-2xl font-bold tracking-wider text-white font-display uppercase hover:text-[#F97316] transition-colors flex items-center gap-2"
        >
          <span className="text-[#F97316]">★</span>
          <span>JUBIM LANCHES</span>
          <span className="text-[#F97316]">★</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-neutral-300 font-medium">
          <a
            href="#inicio"
            className="hover:text-[#F97316] transition-colors duration-200"
          >
            Início
          </a>
          <a
            href="#sobre"
            className="hover:text-[#F97316] transition-colors duration-200"
          >
            A Essência
          </a>
          <a
            href="#cardapio"
            className="hover:text-[#F97316] transition-colors duration-200"
          >
            Cardápio
          </a>
          <a
            href="#contato"
            className="hover:text-[#F97316] transition-colors duration-200"
          >
            Contato
          </a>
        </nav>

        {/* Zone 3: Primary action + Cart toggle + Owner Access */}
        <div className="flex items-center gap-3">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              title="Acesso do Proprietário (Gestor de Pedidos)"
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Acesso do Proprietário"
            >
              <ShieldCheck className="w-5 h-5 text-neutral-400 hover:text-[#F97316]" />
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="Abrir sacola de pedidos"
            className="relative p-2.5 text-neutral-200 hover:text-[#F97316] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] text-white text-xs font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href={RESTAURANT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] transition-all duration-150 rounded-lg shadow-lg shadow-[#F97316]/20 whitespace-nowrap"
          >
            Pedir no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
};

