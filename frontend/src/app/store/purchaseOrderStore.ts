import { create } from 'zustand';

export interface PurchaseOrderItem {
  barcode: string;
  productName: string;
  qtyNeeded: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: Date;
  selected: boolean;
}

interface PurchaseOrderStore {
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'selected'>) => void;
  togglePurchaseOrder: (id: string) => void;
  getSelectedOrders: () => PurchaseOrder[];
}

export const usePurchaseOrderStore = create<PurchaseOrderStore>((set, get) => ({
  purchaseOrders: [],
  addPurchaseOrder: (order) =>
    set((state) => ({
      purchaseOrders: [{ ...order, selected: false }, ...state.purchaseOrders],
    })),
  togglePurchaseOrder: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? { ...po, selected: !po.selected } : po
      ),
    })),
  getSelectedOrders: () => get().purchaseOrders.filter((po) => po.selected),
}));
