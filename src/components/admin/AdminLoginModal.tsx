import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, KeyRound, ShieldCheck } from 'lucide-react';
import { getStoredPin } from '../../services/orderStorage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredPin();
    if (pin === correctPin) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm rounded-2xl bg-[#1F1F1F] border border-white/10 p-6 shadow-2xl z-10 space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display uppercase tracking-wider text-white font-bold text-lg">
                    Gestor Jubim Lanches
                  </h3>
                  <p className="text-xs text-neutral-400">Acesso exclusivo do proprietário</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
                  Digite seu PIN de Acesso:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={6}
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      setError(false);
                      setPin(e.target.value);
                    }}
                    placeholder="••••"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-neutral-900 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[#F97316]"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                {error && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    PIN incorreto. Tente novamente.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-lg shadow-[#F97316]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>

            <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-[11px] text-neutral-400 text-center font-mono">
              PIN padrão inicial: <strong className="text-white">1234</strong>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
