export type MenuCategory = 'tradicionais' | 'especiais' | 'bebidas';

export interface MenuItem {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  category: MenuCategory;
  highlight?: string;
  image?: string;
  badge?: string;
  isAvailable?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'novo' | 'preparando' | 'saiu' | 'entregue' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string; // ISO string
  customerName: string;
  customerPhone?: string;
  deliveryType: 'delivery' | 'retirada';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
}

export interface DailySalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  totalBurgersSold: number;
  byPayment: Record<PaymentMethod, number>;
  byStatus: Record<OrderStatus, number>;
  topItems: { name: string; quantity: number; revenue: number }[];
}

