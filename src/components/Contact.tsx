import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Send } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menu';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let fullMsg = `Olá! Meu nome é ${name.trim() || 'Cliente'}.\n${message.trim()}`;
    const url = `https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contato" className="py-28 sm:py-36 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-8"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium mb-3">
                04 · Onde Estamos & Contato
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display">
                Fale com o Jubim Lanches
              </h2>
            </div>

            <p className="text-neutral-300 text-lg font-light leading-relaxed max-w-lg">
              Faça seu pedido para entrega rápida em casa ou venha retirar no nosso balcão. Lanches quentinhos na chapa todos os dias.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-[#F97316] border border-white/5 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                    Localização
                  </span>
                  <span className="text-lg font-semibold text-white font-display tracking-wide">
                    {RESTAURANT_INFO.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-[#F97316] border border-white/5 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                    Telefone & Pedidos
                  </span>
                  <a
                    href={RESTAURANT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-white hover:text-[#F97316] transition-colors font-display tracking-wide tabular-nums"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-xl shadow-[#F97316]/25 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>
          </motion.div>

          {/* Direct Message Form column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="p-8 sm:p-10 rounded-2xl bg-[#202020] border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-display">
                  Envie uma Mensagem Rápida
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Sua mensagem será direcionada diretamente para o nosso WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                    Seu Nome
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-2">
                    Mensagem ou Pedido
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva sua dúvida, pedido especial ou reserva..."
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-lg shadow-[#F97316]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar para o WhatsApp</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
