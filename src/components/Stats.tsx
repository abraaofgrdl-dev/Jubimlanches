import React from 'react';
import { motion } from 'motion/react';

const METRICS = [
  {
    value: '23',
    label: 'Opções de Lanches',
    detail: 'Tradicionais e Especiais da casa',
  },
  {
    value: '100%',
    label: 'Feito na Hora',
    detail: 'Chapa quente e queijo derretido',
  },
  {
    value: 'R$11',
    label: 'Preços a partir de',
    detail: 'O melhor custo-benefício da região',
  },
  {
    value: '0',
    label: 'Complicação no Pedido',
    detail: 'Atendimento direto via WhatsApp',
  },
];

export const Stats: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#141414] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display text-white tabular-nums tracking-tight">
                <span className="text-[#F97316]">{metric.value.replace(/[^0-9]/g, '')}</span>
                <span className="text-white text-3xl sm:text-5xl lg:text-6xl font-normal">
                  {metric.value.replace(/[0-9]/g, '')}
                </span>
              </div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-200 font-semibold font-display">
                {metric.label}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {metric.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
