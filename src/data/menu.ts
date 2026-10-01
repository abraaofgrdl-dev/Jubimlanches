import { MenuItem } from '../types';
import { getStoredMenuItems } from '../services/menuStorage';

export const getMenuItems = (): MenuItem[] => {
  return getStoredMenuItems();
};

export const RESTAURANT_INFO = {
  name: 'Jubim Lanches',
  slogan: 'Os melhores hambúrgueres e lanches da cidade.',
  address: 'Jubim, Pará',
  phone: '(91) 98537-8374',
  phoneRaw: '5591985378374',
  whatsappUrl: 'https://wa.me/5591985378374?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20pedido%20no%20Jubim%20Lanches!',
};
