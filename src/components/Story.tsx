import React from 'react';
import { motion } from 'motion/react';
import grillImg from '../assets/images/hambu_grill_flame_1790808209991.jpg';

export const Story: React.FC = () => {
  return (
    <section id="sobre" className="py-28 sm:py-36 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Element - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
              <img
                src={grillImg}
                alt="Smash burger sendo prensado na chapa incandescente da Hambu"
                referrerPolicy="no-referrer"
                className="w-full h-[460px] sm:h-[520px] object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80"
                aria-hidden="true"
              />
              <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-neutral-400 font-mono">
                Feito com Capricho · Chapa Quente em Jubim, PA
              </div>
            </div>
          </motion.div>

          {/* Editorial Content - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium">
              01 · Tradição & Sabor
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[0.95] text-white font-display">
              O lanche como deve ser: <br />
              <span className="text-[#F97316]">caprichado,</span> saboroso e farto.
            </h2>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              Na chapa quente, cada lanche do Jubim Lanches é feito na hora com ingredientes frescos, queijo derretido de verdade e aquele sabor marcante que você já conhece.
            </p>

            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-white font-semibold uppercase tracking-wider mb-1 font-display text-base">
                  23 Opções de Lanches
                </span>
                <p className="text-neutral-400 font-light leading-snug">
                  Linha tradicional e especiais para todos os gostos e fomes.
                </p>
              </div>

              <div>
                <span className="block text-white font-semibold uppercase tracking-wider mb-1 font-display text-base">
                  Chapa Quente & Rápida
                </span>
                <p className="text-neutral-400 font-light leading-snug">
                  Preparo ágil para entrega rápida ou retirada em Jubim, Pará.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
