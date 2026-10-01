import { MenuItem } from '../types';
import heroBurgerImg from '../assets/images/hambu_hero_burger_1790808198424.jpg';
import truffleBurgerImg from '../assets/images/hambu_truffle_burger_1790808220039.jpg';
import grillFlameImg from '../assets/images/hambu_grill_flame_1790808209991.jpg';

const MENU_STORAGE_KEY = 'jubim_menu_items_v2';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // --- HAMBÚRGUERES (Simplesmente deliciosos) ---
  {
    id: 'hot-dog',
    name: 'Hot Dog',
    description: 'Pão, salsicha e salada.',
    price: 11,
    category: 'tradicionais',
    image: grillFlameImg,
  },
  {
    id: 'queijo-quente',
    name: 'Queijo Quente',
    description: 'Pão e queijo derretido.',
    price: 13,
    category: 'tradicionais',
    image: heroBurgerImg,
  },
  {
    id: 'misto',
    name: 'Misto',
    description: 'Pão, queijo e presunto.',
    price: 13,
    category: 'tradicionais',
    image: heroBurgerImg,
  },
  {
    id: 'hamburguer',
    name: 'Hambúrguer',
    description: 'Pão, carne e salada.',
    price: 14,
    category: 'tradicionais',
    image: heroBurgerImg,
  },
  {
    id: 'x-eggs-hot',
    name: 'X Eggs Hot',
    description: 'Pão, salsicha, ovo, queijo e salada.',
    price: 14,
    category: 'tradicionais',
    image: grillFlameImg,
  },
  {
    id: 'eggs',
    name: 'Eggs',
    description: 'Pão, carne, ovo e salada.',
    price: 15,
    category: 'tradicionais',
    image: truffleBurgerImg,
  },
  {
    id: 'x-burg',
    name: 'X Burg',
    description: 'Pão, carne, queijo e salada.',
    price: 15,
    category: 'tradicionais',
    badge: 'Popular',
    image: heroBurgerImg,
  },
  {
    id: 'cachorrao',
    name: 'Cachorrão',
    description: 'Pão, carne, salsicha, queijo e salada.',
    price: 16,
    category: 'tradicionais',
    image: grillFlameImg,
  },
  {
    id: 'x-eggs-burg',
    name: 'X Eggs Burg',
    description: 'Pão, carne, ovo, queijo e salada.',
    price: 16,
    category: 'tradicionais',
    image: truffleBurgerImg,
  },

  // --- ESPECIAIS (Para quem busca algo a mais) ---
  {
    id: 'x-maionese',
    name: 'X-Maionese',
    description: 'Pão, carne, queijo, presunto e salada.',
    price: 16,
    category: 'especiais',
    image: heroBurgerImg,
  },
  {
    id: 'bauru',
    name: 'Bauru',
    description: 'Pão, queijo, presunto, ovo e salada.',
    price: 16,
    category: 'especiais',
    image: heroBurgerImg,
  },
  {
    id: 'x-frango',
    name: 'X-Frango',
    description: 'Pão, frango, queijo e salada.',
    price: 16,
    category: 'especiais',
    image: grillFlameImg,
  },
  {
    id: 'x-eggs-frango',
    name: 'X-Eggs Frango',
    description: 'Pão, frango, ovo, queijo e salada.',
    price: 18,
    category: 'especiais',
    image: grillFlameImg,
  },
  {
    id: 'cheddar-melt',
    name: 'Cheddar Melt',
    description: 'Pão, carne, queijo cheddar e salada.',
    price: 16,
    category: 'especiais',
    badge: 'Favorito',
    image: heroBurgerImg,
  },
  {
    id: 'duplo-cheddar-especial',
    name: 'Duplo Cheddar Especial',
    description: 'Pão, duas carnes, queijo cheddar e salada.',
    price: 21,
    category: 'especiais',
    badge: 'Mais Pedido',
    image: heroBurgerImg,
  },
  {
    id: 'x-salada',
    name: 'X-Salada',
    description: 'Pão, carne, queijo, presunto, ovo e salada.',
    price: 19,
    category: 'especiais',
    image: truffleBurgerImg,
  },
  {
    id: 'big-brother',
    name: 'Big Brother',
    description: 'Pão, carne, queijo, presunto, calabresa e salada.',
    price: 20,
    category: 'especiais',
    badge: 'Destaque',
    image: grillFlameImg,
  },
  {
    id: 'x-calabresa',
    name: 'X-Calabresa',
    description: 'Pão, carne, queijo, calabresa e salada.',
    price: 19,
    category: 'especiais',
    image: grillFlameImg,
  },
  {
    id: 'x-eggs-calabresa',
    name: 'X-Eggs Calabresa',
    description: 'Pão, carne, queijo, calabresa, ovo e salada.',
    price: 20,
    category: 'especiais',
    image: grillFlameImg,
  },
  {
    id: 'x-big-burguer',
    name: 'X-Big Burguer',
    description: 'Pão, 2 carnes, queijo e salada.',
    price: 22,
    category: 'especiais',
    badge: 'Top da Casa',
    image: heroBurgerImg,
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Pão, carne, queijo, presunto, calabresa, ovo e salada.',
    price: 22,
    category: 'especiais',
    badge: 'Especial',
    image: truffleBurgerImg,
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon',
    description: 'Pão, carne, queijo, bacon e salada.',
    price: 24,
    category: 'especiais',
    badge: 'Sucesso',
    image: heroBurgerImg,
  },
  {
    id: 'x-eggs-bacon',
    name: 'X-Eggs Bacon',
    description: 'Pão, carne, queijo, ovo, bacon e salada.',
    price: 25,
    category: 'especiais',
    badge: 'O Campeão',
    image: heroBurgerImg,
  },

  // --- BEBIDAS (Geadas e Refrescantes) ---
  {
    id: 'refrigerante-lata',
    name: 'Refrigerante Lata 350ml',
    description: 'Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Uva.',
    price: 6,
    category: 'bebidas',
  },
  {
    id: 'refrigerante-2l',
    name: 'Refrigerante 2 Litros',
    description: 'Coca-Cola ou Guaraná Antarctica gelado para a família.',
    price: 13,
    category: 'bebidas',
  },
  {
    id: 'refrigerante-1l',
    name: 'Refrigerante 1 Litro',
    description: 'Guaraná ou Coca-Cola garrafa 1L gelada.',
    price: 9,
    category: 'bebidas',
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural 500ml',
    description: 'Suco natural feito na hora: Laranja, Acerola ou Maracujá.',
    price: 8,
    category: 'bebidas',
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral 500ml',
    description: 'Com gás ou sem gás, bem gelada.',
    price: 4,
    category: 'bebidas',
  },
  {
    id: 'cerveja-lata',
    name: 'Cerveja Lata 350ml',
    description: 'Heineken, Brahma ou Amstel gelada (para maiores de 18 anos).',
    price: 7,
    category: 'bebidas',
  },
];

export const getStoredMenuItems = (): MenuItem[] => {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MENU_ITEMS;
  }
};

export const saveStoredMenuItems = (items: MenuItem[]): void => {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('jubim_menu_updated'));
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
  const current = getStoredMenuItems();
  const id = `item-${Date.now()}`;
  const newItem: MenuItem = { ...item, id };
  const updated = [...current, newItem];
  saveStoredMenuItems(updated);
  return newItem;
};

export const updateMenuItem = (id: string, updates: Partial<MenuItem>): void => {
  const current = getStoredMenuItems();
  const updated = current.map((i) => (i.id === id ? { ...i, ...updates } : i));
  saveStoredMenuItems(updated);
};

export const deleteMenuItem = (id: string): void => {
  const current = getStoredMenuItems();
  const updated = current.filter((i) => i.id !== id);
  saveStoredMenuItems(updated);
};

export const resetMenuToDefault = (): void => {
  saveStoredMenuItems(DEFAULT_MENU_ITEMS);
};
