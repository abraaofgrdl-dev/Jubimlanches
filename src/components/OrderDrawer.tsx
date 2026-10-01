import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/menu';
import { saveOrder } from '../services/orderStorage';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'retirada'>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? 7 : 0;
  const total = subtotal + deliveryFee;

  const generateWhatsAppMessage = () => {
    let msg = `*PEDIDO JUBIM LANCHES - JUBIM, PARÁ*\n`;
    if (customerName.trim()) {
      msg += `*Cliente:* ${customerName.trim()}\n`;
    }
    msg += `*Tipo:* ${deliveryType === 'delivery' ? 'Entrega (Delivery)' : 'Retirada no Balcão'}\n`;
    if (deliveryType === 'delivery' && address.trim()) {
      msg += `*Endereço:* ${address.trim()}\n`;
    }
    msg += `\n*ITENS:*\n`;
    cart.forEach((c) => {
      msg += `• ${c.quantity}x ${c.item.name} (R$ ${(c.item.price * c.quantity).toFixed(2)})\n`;
      if (c.notes) {
        msg += `   _Obs: ${c.notes}_\n`;
      }
    });
    if (deliveryType === 'delivery') {
      msg += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
    }
    msg += `\n*TOTAL:* R$ ${total.toFixed(2)}\n`;
    if (notes.trim()) {
      msg += `*Observações Gerais:* ${notes.trim()}\n`;
    }
    msg += `\n_Pedido gerado via cardápio online Jubim Lanches_`;

    return encodeURIComponent(msg);
  };

  const handleCheckout = () => {
    // Record into the system for the owner dashboard
    saveOrder({
      customerName: customerName.trim() || 'Cliente Online',
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? address.trim() : undefined,
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        unitPrice: c.item.price,
        notes: c.notes,
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'pix',
      status: 'novo',
      notes: notes.trim() || undefined,
    });

    const encoded = generateWhatsAppMessage();
    const url = `https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#1F1F1F] border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white font-display">
                  Seu Pedido
                </h2>
                <p className="text-xs text-neutral-400">
                  {cart.length === 0
                    ? 'Nenhum item selecionado'
                    : `${cart.reduce((a, b) => a + b.quantity, 0)} item(ns) na sacola`}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar sacola"
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <p className="text-lg font-display uppercase tracking-wider text-neutral-400">
                    A sacola está vazia
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Explore o cardápio e adicione os melhores smash burgers da Hambu.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#F97316] rounded-lg cursor-pointer"
                  >
                    Ver Cardápio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-semibold uppercase text-white tracking-wide text-base">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-xs text-[#F97316] font-mono tabular-nums font-medium">
                            R$ {cartItem.item.price.toFixed(2)} cada
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          aria-label={`Remover ${cartItem.item.name}`}
                          className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                            className="p-1 hover:text-[#F97316] text-neutral-300 transition-colors cursor-pointer"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-semibold text-white tabular-nums">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                            className="p-1 hover:text-[#F97316] text-neutral-300 transition-colors cursor-pointer"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-semibold text-white tabular-nums">
                          R$ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">
                        Seu Nome:
                      </label>
                      <input
                        type="text"
                        placeholder="Como podemos te chamar?"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                          deliveryType === 'delivery'
                            ? 'bg-[#F97316] border-[#F97316] text-white'
                            : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                        }`}
                      >
                        Entrega
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('retirada')}
                        className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                          deliveryType === 'retirada'
                            ? 'bg-[#F97316] border-[#F97316] text-white'
                            : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                        }`}
                      >
                        Retirada (Jubim, PA)
                      </button>
                    </div>

                    {deliveryType === 'delivery' && (
                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">
                          Endereço para entrega:
                        </label>
                        <input
                          type="text"
                          placeholder="Rua, número, complemento..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] text-xs"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">
                        Observações do pedido (opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: sem picles, ponto bem passado..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Subtotal & WhatsApp CTA */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-neutral-900/90 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wider text-neutral-400 font-display">
                    Total
                  </span>
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-xl shadow-[#F97316]/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Finalizar via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
