import { create } from 'zustand';

export interface SaleItem {
  barcode: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  orderId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: {
    cash: number;
    card: number;
    transfer: number;
  };
  createdAt: Date;
}

interface SalesStore {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  getSaleByOrderId: (orderId: string) => Sale | undefined;
  generateOrderId: () => string;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  sales: [],

  addSale: (sale: Sale) => {
    set((state) => ({
      sales: [...state.sales, sale],
    }));
  },

  getSaleByOrderId: (orderId: string) => {
    return get().sales.find(
      (sale) => sale.orderId.toLowerCase() === orderId.toLowerCase()
    );
  },

  generateOrderId: () => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${datePart}-${randomPart}`;
  },
}));
