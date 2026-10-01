import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import truffleBurgerImg from '../assets/images/hambu_truffle_burger_1790808220039.jpg';
import { RESTAURANT_INFO } from '../data/menu';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-28 sm:py-36 border-t border-white/5 relative overflow-hidden bg-neutral-950">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-[#F97316]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-[#202020] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium">
              03 · Peça no Jubim Lanches
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Bateu aquela fome? <br />
              Peça seu lanche <span className="text-[#F97316]">agora mesmo.</span>
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed max-w-lg">
              Atendimento ágil e direto no WhatsApp do Jubim Lanches em Jubim, Pará. Escolha seu lanche favorito do nosso cardápio e receba quentinho.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-xl shadow-[#F97316]/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Entrar em contato</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="#cardapio"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs uppercase tracking-widest font-medium rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                Explorar Cardápio
              </a>
            </div>
          </motion.div>

          {/* Image Showcase Column */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full">
            <img
              src={truffleBurgerImg}
              alt="Hambu Burger com queijo derretido e blend suculento"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#202020] via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
