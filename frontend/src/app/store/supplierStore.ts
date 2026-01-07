import { create } from 'zustand';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

interface SupplierStore {
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  initializeSuppliers: (suppliers: Supplier[]) => void;
}

export const useSupplierStore = create<SupplierStore>((set) => ({
  suppliers: [
    { id: '62348732', name: 'Supplier 63', contact: '+234 09 9458 2548' },
    { id: '12345678', name: 'ABC Suppliers Ltd', contact: '+234 08 1234 5678' },
    { id: '87654321', name: 'XYZ Distributors', contact: '+234 07 8765 4321' },
    { id: '11223344', name: 'Global Trade Co', contact: '+234 09 1122 3344' },
  ],
  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [...state.suppliers, supplier],
    })),
  initializeSuppliers: (suppliers) =>
    set(() => ({
      suppliers,
    })),
}));
