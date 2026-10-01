import React, { useState, useEffect } from 'react';
import { Plus, Check, MessageCircle, GlassWater, Sparkles, Utensils } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { RESTAURANT_INFO } from '../data/menu';
import { getStoredMenuItems } from '../services/menuStorage';

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ onAddToCart }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | MenuCategory>('todos');
  const [addedId, setAddedId] = useState<string | null>(null);

  const refreshMenu = () => {
    setMenuItems(getStoredMenuItems());
  };

  useEffect(() => {
    refreshMenu();
    const handleUpdate = () => refreshMenu();
    window.addEventListener('jubim_menu_updated', handleUpdate);
    return () => window.removeEventListener('jubim_menu_updated', handleUpdate);
  }, []);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  const handleDirectOrder = (item: MenuItem) => {
    const msg = encodeURIComponent(
      `Olá! Gostaria de pedir *${item.name}* (R$ ${item.price.toFixed(2)}) no Jubim Lanches em Jubim, Pará!`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'todos') return true;
    return item.category === selectedCategory;
  });

  const countTradicionais = menuItems.filter((i) => i.category === 'tradicionais').length;
  const countEspeciais = menuItems.filter((i) => i.category === 'especiais').length;
  const countBebidas = menuItems.filter((i) => i.category === 'bebidas').length;

  return (
    <section id="cardapio" className="py-20 sm:py-28 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F97316] font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Cardápio Oficial</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display">
            Escolha o Seu Lanche
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Lanches feitos na hora na chapa quente com pão fresquinho, queijo derretido e bebidas bem geladas.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Todos ({menuItems.length})
          </button>

          <button
            onClick={() => setSelectedCategory('tradicionais')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'tradicionais'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Tradicionais ({countTradicionais})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('especiais')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'especiais'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Especiais ({countEspeciais})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('bebidas')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'bebidas'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <GlassWater className="w-3.5 h-3.5" />
            <span>Bebidas Geladas ({countBebidas})</span>
          </button>
        </div>

        {/* Clean, Simple Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isJustAdded = addedId === item.id;
            const isDrink = item.category === 'bebidas';

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-5 rounded-xl bg-[#202020] border border-white/5 hover:border-[#F97316]/40 transition-all duration-200 hover:bg-[#242424] shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-display uppercase tracking-wide text-white group-hover:text-[#F97316] transition-colors">
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-lg font-bold font-mono text-[#F97316] tabular-nums whitespace-nowrap">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F97316] hover:bg-[#EA580C] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Adicionado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pedir Lanche</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDirectOrder(item)}
                    title="Pedir direto no WhatsApp"
                    className="p-2.5 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors cursor-pointer"
                    aria-label={`Pedir ${item.name} no WhatsApp`}
                  >
                    <MessageCircle className="w-4 h-4 text-[#F97316]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
