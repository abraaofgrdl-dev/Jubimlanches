import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, MessageCircle } from 'lucide-react';
import heroImg from '../assets/images/hambu_hero_burger_1790808198424.jpg';
import { RESTAURANT_INFO } from '../data/menu';

export const Hero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle ambient warm glow in the background */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#F97316]/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
        {/* Top Kicker - Unboxed clean typography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium mb-4"
        >
          <Flame className="w-4 h-4 text-[#F97316]" />
          <span>★ Jubim Lanches</span>
          <span aria-hidden="true">·</span>
          <span>Jubim, Pará ★</span>
        </motion.div>

        {/* Main Headline - Massive Oswald clamp typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight uppercase leading-[0.9] text-white font-display max-w-5xl"
        >
          Lanches clássicos. <br />
          <span className="text-[#F97316]">Especiais da casa.</span> <br />
          Sabor inigualável.
        </motion.h1>

        {/* Max 1 supportive sentence */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-neutral-300 font-light max-w-xl leading-relaxed"
        >
          Do tradicional X-Burg ao famoso Duplo Cheddar e X-Eggs Bacon: ingredientes selecionados preparados com carinho na chapa.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href={RESTAURANT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-wider font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] transition-all rounded-lg shadow-xl shadow-[#F97316]/25"
          >
            <MessageCircle className="w-5 h-5" />
            Entrar em contato
          </a>

          <a
            href="#cardapio"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-wider font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            Ver Cardápio
          </a>
        </motion.div>
      </div>

      {/* Hero Visual Monument - Large, bleed with peek into next section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="max-w-7xl mx-auto px-6 w-full mt-12"
      >
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group">
          <img
            src={heroImg}
            alt="Double smash burger artesanal Hambu com cheddar cremoso e bacon"
            referrerPolicy="no-referrer"
            className="w-full h-[420px] sm:h-[540px] lg:h-[620px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient scrim */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/20"
            aria-hidden="true"
          />

          {/* Discreet bottom overlay bar with proof of craft */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs tracking-widest uppercase text-neutral-300">
            <span className="font-semibold text-white">Feito na Hora na Chapa Quente</span>
            <span className="hidden sm:inline text-neutral-400 font-mono tabular-nums">Pão Fresquinho · Queijo Derretido</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-8 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <span>Arraste para explorar</span>
        <a
          href="#sobre"
          aria-label="Rolar para a seção sobre"
          className="p-2 hover:text-[#F97316] transition-colors"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
