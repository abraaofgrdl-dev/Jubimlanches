import { Order, OrderStatus, DailySalesSummary, PaymentMethod } from '../types';

const STORAGE_KEY = 'hambu_orders_v1';
const SETTINGS_KEY = 'hambu_settings_v1';

export const getStoredPin = (): string => {
  return localStorage.getItem('hambu_owner_pin') || '1234';
};

export const setStoredPin = (pin: string): void => {
  localStorage.setItem('hambu_owner_pin', pin);
};

// Initial seed orders for demonstration if empty
const generateInitialOrders = (): Order[] => {
  const now = new Date();
  const getPastTime = (minutesAgo: number) => {
    return new Date(now.getTime() - minutesAgo * 60000).toISOString();
  };

  return [
    {
      id: 'ord-101',
      orderNumber: 101,
      createdAt: getPastTime(120),
      customerName: 'Rodrigo Medeiros',
      customerPhone: '(91) 98122-3344',
      deliveryType: 'delivery',
      deliveryAddress: 'Rua Principal, 240 - Apto 302',
      items: [
        { name: 'Duplo Cheddar Especial', quantity: 2, unitPrice: 21, notes: 'Bem caprichado no cheddar' },
        { name: 'Hot Dog', quantity: 1, unitPrice: 11 },
      ],
      subtotal: 53,
      deliveryFee: 7,
      total: 60,
      paymentMethod: 'pix',
      status: 'entregue',
      notes: 'Tocar o interfone 302',
    },
    {
      id: 'ord-102',
      orderNumber: 102,
      createdAt: getPastTime(75),
      customerName: 'Camila Vasconcelos',
      customerPhone: '(91) 99311-8899',
      deliveryType: 'retirada',
      items: [
        { name: 'X-Eggs Bacon', quantity: 1, unitPrice: 25, notes: 'Bacon bem crocante' },
        { name: 'X-Burg', quantity: 1, unitPrice: 15 },
      ],
      subtotal: 40,
      deliveryFee: 0,
      total: 40,
      paymentMethod: 'cartao',
      status: 'entregue',
      notes: 'Cliente retira no balcão em Jubim, PA',
    },
    {
      id: 'ord-103',
      orderNumber: 103,
      createdAt: getPastTime(35),
      customerName: 'Lucas Ferreira',
      customerPhone: '(91) 98455-1122',
      deliveryType: 'delivery',
      deliveryAddress: 'Travessa das Flores, 88 - Casa',
      items: [
        { name: 'Big Brother', quantity: 2, unitPrice: 20 },
        { name: 'Cachorrão', quantity: 1, unitPrice: 16 },
      ],
      subtotal: 56,
      deliveryFee: 7,
      total: 63,
      paymentMethod: 'pix',
      status: 'preparando',
      notes: 'Entregar na portaria',
    },
    {
      id: 'ord-104',
      orderNumber: 104,
      createdAt: getPastTime(10),
      customerName: 'Beatriz Almeida',
      customerPhone: '(91) 98877-6655',
      deliveryType: 'delivery',
      deliveryAddress: 'Jubim, Conjunto B - Bloco 4',
      items: [
        { name: 'X-Salada', quantity: 1, unitPrice: 19 },
        { name: 'Cheddar Melt', quantity: 1, unitPrice: 16 },
      ],
      subtotal: 35,
      deliveryFee: 6,
      total: 41,
      paymentMethod: 'cartao',
      status: 'novo',
      notes: 'Campainha com defeito, chamar no portão',
    },
  ];
};

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialOrders();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveOrder = (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> & { id?: string; createdAt?: string }): Order => {
  const currentOrders = getOrders();
  const nextNumber = currentOrders.length > 0 
    ? Math.max(...currentOrders.map(o => o.orderNumber || 100)) + 1 
    : 101;

  const newOrder: Order = {
    ...order,
    id: order.id || `ord-${Date.now()}`,
    orderNumber: nextNumber,
    createdAt: order.createdAt || new Date().toISOString(),
  };

  const updated = [newOrder, ...currentOrders];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('hambu_orders_updated'));
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): void => {
  const orders = getOrders();
  const updated = orders.map(o => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('hambu_orders_updated'));
};

export const deleteOrder = (orderId: string): void => {
  const orders = getOrders();
  const updated = orders.filter(o => o.id !== orderId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('hambu_orders_updated'));
};

export const clearAllOrders = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('hambu_orders_updated'));
};

export const resetToDemoOrders = (): void => {
  const demo = generateInitialOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  window.dispatchEvent(new CustomEvent('hambu_orders_updated'));
};

export const calculateDailyStats = (orders: Order[]): DailySalesSummary => {
  // Filter orders from today
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr && o.status !== 'cancelado');

  const totalRevenue = todayOrders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = todayOrders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  let totalBurgersSold = 0;
  const itemMap: Record<string, { quantity: number; revenue: number }> = {};
  const byPayment: Record<PaymentMethod, number> = {
    pix: 0,
    cartao: 0,
    dinheiro: 0,
  };
  const byStatus: Record<OrderStatus, number> = {
    novo: 0,
    preparando: 0,
    saiu: 0,
    entregue: 0,
    cancelado: 0,
  };

  orders.forEach(o => {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  });

  todayOrders.forEach(o => {
    byPayment[o.paymentMethod] = (byPayment[o.paymentMethod] || 0) + o.total;

    o.items.forEach(item => {
      totalBurgersSold += item.quantity;
      if (!itemMap[item.name]) {
        itemMap[item.name] = { quantity: 0, revenue: 0 };
      }
      itemMap[item.name].quantity += item.quantity;
      itemMap[item.name].revenue += item.quantity * item.unitPrice;
    });
  });

  const topItems = Object.entries(itemMap)
    .map(([name, data]) => ({ name, quantity: data.quantity, revenue: data.revenue }))
    .sort((a, b) => b.quantity - a.quantity);

  return {
    totalRevenue,
    totalOrders,
    averageTicket,
    totalBurgersSold,
    byPayment,
    byStatus,
    topItems,
  };
};
