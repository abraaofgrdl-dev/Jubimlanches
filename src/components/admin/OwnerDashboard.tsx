import React, { useState, useEffect } from 'react';
import {
  Printer,
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Plus,
  RotateCcw,
  LogOut,
  Flame,
  Search,
  FileSpreadsheet,
  UtensilsCrossed,
  Edit2,
  Trash2,
  Save,
  X,
  MenuSquare,
  Sparkles,
  GlassWater,
} from 'lucide-react';
import { Order, OrderStatus, PaymentMethod, MenuItem, MenuCategory } from '../../types';
import {
  getOrders,
  saveOrder,
  updateOrderStatus,
  deleteOrder,
  calculateDailyStats,
  resetToDemoOrders,
  clearAllOrders,
} from '../../services/orderStorage';
import {
  getStoredMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  resetMenuToDefault,
} from '../../services/menuStorage';
import { ThermalReceipt } from './ThermalReceipt';

interface OwnerDashboardProps {
  onExit: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onExit }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'vendas' | 'cardapio' | 'novo_pedido'>('pedidos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Print state
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [printMode, setPrintMode] = useState<'order' | 'daily_report'>('order');

  // Menu Management State
  const [menuFilter, setMenuFilter] = useState<'todos' | MenuCategory>('todos');
  const [menuSearch, setMenuSearch] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for creating or editing item
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(15);
  const [formCategory, setFormCategory] = useState<MenuCategory>('tradicionais');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');

  // New POS Order State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newDeliveryType, setNewDeliveryType] = useState<'delivery' | 'retirada'>('retirada');
  const [newDeliveryAddress, setNewDeliveryAddress] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('pix');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<{ [itemId: string]: number }>({});
  const [newItemsNotes, setNewItemsNotes] = useState<{ [itemId: string]: string }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const refreshOrders = () => {
    setOrders(getOrders());
  };

  const refreshMenu = () => {
    setMenuItems(getStoredMenuItems());
  };

  useEffect(() => {
    refreshOrders();
    refreshMenu();

    const handleOrdersUpdate = () => refreshOrders();
    const handleMenuUpdate = () => refreshMenu();

    window.addEventListener('hambu_orders_updated', handleOrdersUpdate);
    window.addEventListener('jubim_menu_updated', handleMenuUpdate);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);

    return () => {
      window.removeEventListener('hambu_orders_updated', handleOrdersUpdate);
      window.removeEventListener('jubim_menu_updated', handleMenuUpdate);
      clearInterval(timer);
    };
  }, []);

  const stats = calculateDailyStats(orders);

  // Trigger thermal receipt print
  const handlePrintOrder = (order: Order) => {
    setPrintingOrder(order);
    setPrintMode('order');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintDailyReport = () => {
    setPrintMode('daily_report');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Status transitions
  const handleNextStatus = (order: Order) => {
    const nextMap: Record<OrderStatus, OrderStatus> = {
      novo: 'preparando',
      preparando: order.deliveryType === 'delivery' ? 'saiu' : 'entregue',
      saiu: 'entregue',
      entregue: 'entregue',
      cancelado: 'cancelado',
    };
    updateOrderStatus(order.id, nextMap[order.status]);
  };

  const handleExportCSV = () => {
    let csv = 'Numero,Data,Cliente,Tipo,Total,Pagamento,Status\n';
    orders.forEach((o) => {
      csv += `${o.orderNumber},"${new Date(o.createdAt).toLocaleString('pt-BR')}","${o.customerName}",${o.deliveryType},${o.total.toFixed(2)},${o.paymentMethod},${o.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jubim_vendas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormBadge(item.badge || '');
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormPrice(15);
    setFormCategory('tradicionais');
    setFormDescription('');
    setFormBadge('');
    setIsNewItemModalOpen(true);
  };

  // Save Item (Create or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formName.trim(),
        price: Number(formPrice),
        category: formCategory,
        description: formDescription.trim(),
        badge: formBadge.trim() || undefined,
      });
      showToast(`Item "${formName}" atualizado com sucesso!`);
      setEditingItem(null);
    } else {
      addMenuItem({
        name: formName.trim(),
        price: Number(formPrice),
        category: formCategory,
        description: formDescription.trim(),
        badge: formBadge.trim() || undefined,
      });
      showToast(`Novo item "${formName}" adicionado ao cardápio!`);
      setIsNewItemModalOpen(false);
    }
  };

  // Delete Item
  const handleDeleteItem = (item: MenuItem) => {
    if (confirm(`Tem certeza que deseja remover "${item.name}" do cardápio?`)) {
      deleteMenuItem(item.id);
      showToast(`Item "${item.name}" removido.`);
    }
  };

  // Reset Menu
  const handleResetMenu = () => {
    if (confirm('Restaurar o cardápio original de 23 lanches e bebidas do Jubim Lanches?')) {
      resetMenuToDefault();
      showToast('Cardápio restaurado para o padrão.');
    }
  };

  // POS Order submission
  const handleCreatePosOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const items = Object.entries(newOrderItems)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = menuItems.find((m) => m.id === itemId)!;
        return {
          name: item.name,
          quantity: qty,
          unitPrice: item.price,
          notes: newItemsNotes[itemId] || undefined,
        };
      });

    if (items.length === 0) {
      alert('Selecione pelo menos um item do cardápio!');
      return;
    }

    const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const deliveryFee = newDeliveryType === 'delivery' ? 7 : 0;
    const total = subtotal + deliveryFee;

    const created = saveOrder({
      customerName: newCustomerName.trim() || 'Cliente Balcão',
      customerPhone: newCustomerPhone.trim() || undefined,
      deliveryType: newDeliveryType,
      deliveryAddress: newDeliveryType === 'delivery' ? newDeliveryAddress.trim() : undefined,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: newPaymentMethod,
      status: 'novo',
      notes: newOrderNotes.trim() || undefined,
    });

    // Reset form
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewDeliveryAddress('');
    setNewOrderNotes('');
    setNewOrderItems({});
    setNewItemsNotes({});

    // Switch to orders tab and print prompt
    setActiveTab('pedidos');
    handlePrintOrder(created);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'todos' && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchNum = o.orderNumber.toString().includes(q);
      return matchName || matchNum;
    }
    return true;
  });

  const filteredMenuItems = menuItems.filter((item) => {
    if (menuFilter !== 'todos' && item.category !== menuFilter) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'novo':
        return { text: 'Novo Pedido', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'preparando':
        return { text: 'Na Chapa', color: 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40' };
      case 'saiu':
        return { text: 'Em Entrega', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'entregue':
        return { text: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'cancelado':
        return { text: 'Cancelado', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-neutral-100 font-body">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Hidden Thermal Receipt Area for window.print() */}
      <ThermalReceipt
        order={printingOrder}
        dailySummary={stats}
        mode={printMode}
      />

      {/* Top Bar for Owner */}
      <header className="sticky top-0 z-30 bg-[#1A1A1A] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-display uppercase tracking-widest text-[#F97316] flex items-center gap-1.5">
                <span>★</span>
                <span>JUBIM LANCHES</span>
              </span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                GESTOR
              </span>
            </div>

            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="tabular-nums">{currentTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Store Toggle */}
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isStoreOpen
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
              <span>{isStoreOpen ? 'Loja Aberta' : 'Loja Fechada'}</span>
            </button>

            {/* Print Daily Closing */}
            <button
              onClick={handlePrintDailyReport}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs uppercase tracking-wider text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Imprimir relatório térmico de fechamento de caixa do dia"
            >
              <Printer className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Fechamento do Dia</span>
            </button>

            {/* Back to Client Menu */}
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ver Site / Cardápio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pedidos'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Pedidos do Dia</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-mono tabular-nums">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cardapio')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'cardapio'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MenuSquare className="w-4 h-4" />
            <span>Editar Cardápio ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vendas')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vendas'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Vendas & Caixa</span>
          </button>

          <button
            onClick={() => setActiveTab('novo_pedido')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'novo_pedido'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Balcão (PDV)</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ================= TAB: EDITAR CARDÁPIO ================= */}
        {activeTab === 'cardapio' && (
          <div className="space-y-6">
            {/* Top Bar for Cardapio Management */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                  Gerenciar Cardápio & Preços
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Adicione novos lanches ou bebidas, altere preços, nomes e ingredientes em tempo real.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetMenu}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg text-xs uppercase tracking-wider font-semibold border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  title="Restaurar itens originais"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>

                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs uppercase tracking-wider font-semibold shadow-lg shadow-[#F97316]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Novo Lanche / Bebida</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'tradicionais', label: 'Tradicionais' },
                  { id: 'especiais', label: 'Especiais' },
                  { id: 'bebidas', label: 'Bebidas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMenuFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                      menuFilter === f.id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar lanche ou bebida..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] w-full sm:w-64"
                />
              </div>
            </div>

            {/* Menu Items List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 hover:border-white/15 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white uppercase font-display text-base tracking-wide">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                            {item.category === 'tradicionais' ? 'Tradicional' : item.category === 'especiais' ? 'Especial' : 'Bebida'}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] text-[#F97316] font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <span className="text-xl font-bold font-mono text-[#F97316] tabular-nums">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Edit / Delete actions */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Mudar Valor / Nome</span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Excluir do cardápio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for Editing / Adding Items */}
            {(editingItem || isNewItemModalOpen) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  onClick={() => {
                    setEditingItem(null);
                    setIsNewItemModalOpen(false);
                  }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                />

                <div className="relative w-full max-w-lg rounded-2xl bg-[#1F1F1F] border border-white/10 p-6 shadow-2xl z-10 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display uppercase tracking-wider text-white font-bold text-lg">
                        {editingItem ? 'Editar Item do Cardápio' : 'Adicionar Novo Item'}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {editingItem ? `Alterando dados de "${editingItem.name}"` : 'Cadastre um novo lanche ou bebida'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setIsNewItemModalOpen(false);
                      }}
                      className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                    {/* Name */}
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider">
                        Nome do Lanche ou Bebida:
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: X-Tudo da Casa, Coca-Cola 2L"
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    {/* Price and Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider">
                          Valor / Preço (R$):
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="1"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#F97316]"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider">
                          Categoria:
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]"
                        >
                          <option value="tradicionais">Hambúrguer Tradicional</option>
                          <option value="especiais">Especial da Casa</option>
                          <option value="bebidas">Bebida Gelada</option>
                        </select>
                      </div>
                    </div>

                    {/* Description / Ingredients */}
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider">
                        Ingredientes ou Descrição:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Ex: Pão, carne, queijo, presunto, ovo, bacon e salada."
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316] resize-none"
                      />
                    </div>

                    {/* Badge / Destaque */}
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider">
                        Destaque / Etiqueta Opcional:
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="Ex: Mais Pedido, Promoção, Novidade"
                        className="w-full px-4 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setIsNewItemModalOpen(false);
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs uppercase tracking-wider font-semibold shadow-lg shadow-[#F97316]/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar no Cardápio</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 1: PEDIDOS ================= */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'novo', label: 'Novos' },
                  { id: 'preparando', label: 'Na Chapa' },
                  { id: 'saiu', label: 'Em Entrega' },
                  { id: 'entregue', label: 'Entregues' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterStatus(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                      filterStatus === f.id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente ou nº..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316] w-full sm:w-64"
                />
              </div>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-neutral-900/50 border border-white/5 space-y-3">
                <ShoppingBag className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-display uppercase tracking-wider text-neutral-300">
                  Nenhum pedido encontrado
                </p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Os pedidos feitos pelos clientes no site aparecerão aqui instantaneamente.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusLabel(order.status);
                  const isNew = order.status === 'novo';

                  return (
                    <div
                      key={order.id}
                      className={`flex flex-col justify-between rounded-2xl p-6 transition-all border ${
                        isNew
                          ? 'bg-[#221e1a] border-[#F97316]/50 ring-1 ring-[#F97316]/30 shadow-lg shadow-[#F97316]/5'
                          : 'bg-[#1E1E1E] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Order Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold font-display text-white tabular-nums tracking-wide">
                                #{order.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded border ${statusInfo.color}`}
                              >
                                {statusInfo.text}
                              </span>
                            </div>
                            <span className="text-xs text-neutral-400 font-mono">
                              {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <span className="text-xs uppercase tracking-wider font-semibold font-mono text-neutral-300 bg-white/5 px-2 py-1 rounded">
                            {order.deliveryType === 'delivery' ? 'Entrega' : 'Balcão'}
                          </span>
                        </div>

                        {/* Customer Information */}
                        <div className="pt-2 border-t border-white/5 text-xs space-y-1">
                          <div className="font-semibold text-white text-sm">
                            {order.customerName}
                          </div>
                          {order.customerPhone && (
                            <div className="text-neutral-400 font-mono">
                              {order.customerPhone}
                            </div>
                          )}
                          {order.deliveryAddress && (
                            <div className="text-neutral-300 bg-white/5 p-2 rounded text-[11px] leading-snug">
                              {order.deliveryAddress}
                            </div>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                            Itens ({order.items.reduce((a, b) => a + b.quantity, 0)})
                          </div>
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-xs flex justify-between items-start">
                              <div>
                                <span className="font-semibold text-white">
                                  {it.quantity}x {it.name}
                                </span>
                                {it.notes && (
                                  <p className="text-[11px] text-[#F97316] italic pl-2">
                                    Obs: {it.notes}
                                  </p>
                                )}
                              </div>
                              <span className="text-neutral-400 font-mono tabular-nums">
                                R$ {(it.quantity * it.unitPrice).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* General Notes */}
                        {order.notes && (
                          <div className="text-xs text-neutral-400 bg-black/40 p-2 rounded border border-white/5">
                            <span className="font-semibold text-neutral-300">Obs:</span> {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-6 border-t border-white/5 space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-neutral-400">
                            Pagamento ({order.paymentMethod.toUpperCase()})
                          </span>
                          <span className="text-lg font-bold font-mono text-white tabular-nums">
                            R$ {order.total.toFixed(2)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Print Comanda Button */}
                          <button
                            onClick={() => handlePrintOrder(order)}
                            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#F97316]" />
                            <span>Imprimir</span>
                          </button>

                          {/* Advance Status Button */}
                          {order.status !== 'entregue' && order.status !== 'cancelado' ? (
                            <button
                              onClick={() => handleNextStatus(order)}
                              className="py-2.5 px-3 bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {order.status === 'novo' && <span>Pra Chapa &rarr;</span>}
                              {order.status === 'preparando' && (
                                <span>{order.deliveryType === 'delivery' ? 'Despachar' : 'Concluir'}</span>
                              )}
                              {order.status === 'saiu' && <span>Entregue</span>}
                            </button>
                          ) : (
                            <div className="py-2.5 px-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              Finalizado
                            </div>
                          )}
                        </div>

                        {/* Extra controls (Cancel/Delete) */}
                        <div className="flex justify-between items-center pt-1 text-[11px] text-neutral-500">
                          {order.status !== 'cancelado' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelado')}
                              className="hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Cancelar pedido
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Excluir o pedido #${order.orderNumber}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="hover:text-neutral-300 ml-auto transition-colors cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: VENDAS & CAIXA ================= */}
        {activeTab === 'vendas' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                  <span>Faturamento Hoje</span>
                  <DollarSign className="w-4 h-4 text-[#F97316]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                  R$ {stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-neutral-500 font-light">
                  Receita total de vendas do dia
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                  <span>Pedidos Concluídos</span>
                  <ShoppingBag className="w-4 h-4 text-[#F97316]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                  {stats.totalOrders}
                </div>
                <p className="text-xs text-neutral-500 font-light">
                  Comandas ativas e finalizadas
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                  <span>Ticket Médio</span>
                  <TrendingUp className="w-4 h-4 text-[#F97316]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                  R$ {stats.averageTicket.toFixed(2)}
                </div>
                <p className="text-xs text-neutral-500 font-light">
                  Valor médio por cliente
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                  <span>Lanches Vendidos</span>
                  <Flame className="w-4 h-4 text-[#F97316]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                  {stats.totalBurgersSold} un
                </div>
                <p className="text-xs text-neutral-500 font-light">
                  Lanches preparados na chapa
                </p>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-wider font-display text-white">
                  Formas de Pagamento
                </h3>

                <div className="space-y-4">
                  {[
                    { label: 'PIX', val: stats.byPayment.pix, color: 'bg-emerald-500' },
                    { label: 'Cartão de Crédito/Débito', val: stats.byPayment.cartao, color: 'bg-[#F97316]' },
                    { label: 'Dinheiro em Espécie', val: stats.byPayment.dinheiro, color: 'bg-amber-400' },
                  ].map((p) => {
                    const pct = stats.totalRevenue > 0 ? (p.val / stats.totalRevenue) * 100 : 0;
                    return (
                      <div key={p.label} className="space-y-1 text-xs">
                        <div className="flex justify-between text-neutral-300">
                          <span>{p.label}</span>
                          <span className="font-mono font-semibold tabular-nums text-white">
                            R$ {p.val.toFixed(2)} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${p.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    onClick={handlePrintDailyReport}
                    className="flex-1 py-3 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Fechamento</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                    title="Exportar planilha CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Best Selling Burgers */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-wider font-display text-white">
                  Ranking dos Mais Vendidos
                </h3>

                {stats.topItems.length === 0 ? (
                  <p className="text-xs text-neutral-500">Nenhum lanche vendido ainda hoje.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topItems.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center font-bold text-neutral-400 text-xs font-mono">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-white block text-sm font-display uppercase tracking-wide">
                              {item.name}
                            </span>
                            <span className="text-neutral-400 font-mono">
                              {item.quantity} unidades vendidas
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-white text-sm tabular-nums">
                            R$ {item.revenue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Demo Reset / Clear buttons */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
                  <button
                    onClick={() => {
                      if (confirm('Carregar pedidos de demonstração para testar o sistema?')) {
                        resetToDemoOrders();
                      }
                    }}
                    className="hover:text-[#F97316] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recarregar Dados de Teste</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Atenção: deseja zerar todos os pedidos do sistema?')) {
                        clearAllOrders();
                      }
                    }}
                    className="hover:text-red-400 cursor-pointer"
                  >
                    Zerar Caixa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LANÇAR BALCÃO (PDV) ================= */}
        {activeTab === 'novo_pedido' && (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleCreatePosOrder} className="p-8 rounded-2xl bg-[#1E1E1E] border border-white/10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-display">
                  Lançar Pedido Balcão / Telefone
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Registre vendas presenciais ou recebidas por ligação para controle total do caixa e impressão de comanda.
                </p>
              </div>

              {/* Customer data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Nome do Cliente:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Telefone (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (91) 98000-0000"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              {/* Delivery Type */}
              <div className="space-y-2 text-xs">
                <label className="block text-neutral-300 font-medium">
                  Tipo de Atendimento:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewDeliveryType('retirada')}
                    className={`py-3 px-4 rounded-lg border font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      newDeliveryType === 'retirada'
                        ? 'bg-[#F97316] border-[#F97316] text-white'
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    Retirada no Balcão
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewDeliveryType('delivery')}
                    className={`py-3 px-4 rounded-lg border font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      newDeliveryType === 'delivery'
                        ? 'bg-[#F97316] border-[#F97316] text-white'
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    Entrega (Delivery +R$ 7)
                  </button>
                </div>
              </div>

              {newDeliveryType === 'delivery' && (
                <div className="text-xs">
                  <label className="block text-neutral-300 font-medium mb-1">
                    Endereço de Entrega Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rua, número, bairro, ponto de referência..."
                    value={newDeliveryAddress}
                    onChange={(e) => setNewDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              )}

              {/* Item selection (Dynamic from menuItems!) */}
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                  Selecione os Lanches & Bebidas ({menuItems.length} opções):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.map((item) => {
                    const qty = newOrderItems[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all ${
                          qty > 0
                            ? 'bg-[#28211b] border-[#F97316]/50'
                            : 'bg-neutral-900/60 border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-display uppercase font-semibold text-white text-sm block">
                              {item.name}
                            </span>
                            <span className="text-xs text-[#F97316] font-mono tabular-nums">
                              R$ {item.price.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-lg border border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setNewOrderItems((prev) => ({
                                  ...prev,
                                  [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
                                }));
                              }}
                              className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-[#F97316] cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-white">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewOrderItems((prev) => ({
                                  ...prev,
                                  [item.id]: (prev[item.id] || 0) + 1,
                                }));
                              }}
                              className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-[#F97316] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {qty > 0 && (
                          <input
                            type="text"
                            placeholder="Obs do item (ex: bem passado, sem cebola)"
                            value={newItemsNotes[item.id] || ''}
                            onChange={(e) =>
                              setNewItemsNotes((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="w-full mt-2 px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded text-[11px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Forma de Pagamento:
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão de Crédito / Débito</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Observações Gerais:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Troco para R$ 100, entregar com pressa..."
                    value={newOrderNotes}
                    onChange={(e) => setNewOrderNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-xl shadow-[#F97316]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gravar Pedido & Imprimir Comanda</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
