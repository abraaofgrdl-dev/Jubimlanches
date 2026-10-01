import React from 'react';
import { Lock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menu';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#141414] text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-display uppercase tracking-widest text-white flex items-center gap-1.5">
            <span className="text-[#F97316]">★</span>
            <span>JUBIM LANCHES</span>
          </span>
          <span className="text-neutral-600">·</span>
          <span>Hambúrgueres & Especiais</span>
        </div>

        <div className="flex items-center gap-6 tracking-wider uppercase text-[11px]">
          <a href="#inicio" className="hover:text-white transition-colors">
            Início
          </a>
          <a href="#sobre" className="hover:text-white transition-colors">
            A Essência
          </a>
          <a href="#cardapio" className="hover:text-white transition-colors">
            Cardápio
          </a>
          <a href="#contato" className="hover:text-white transition-colors">
            Contato
          </a>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Painel do Dono</span>
            </button>
          )}
        </div>

        <div className="text-neutral-500 font-mono text-[11px] text-center sm:text-right">
          <span>{RESTAURANT_INFO.address} · {RESTAURANT_INFO.phone}</span>
          <div className="mt-1">
            © {new Date().getFullYear()} Jubim Lanches. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

