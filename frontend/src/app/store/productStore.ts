import { create } from 'zustand';
import productService, { SKU } from '../services/productService';

export interface Product {
  id: number;
  barcode: string;
  productName: string;
  purchasePrice: number;
  sellingPrice: number;
  skuId: number;
  createdAt: Date;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  fetchProducts: (search?: string) => Promise<void>;
  addProduct: (product: Product) => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  createProductWithSKU: (data: {
    name: string;
    description?: string;
    barcode: string;
    skuCode: string;
    basePrice: number;
  }) => Promise<Product>;
  clearError: () => void;
}

type ProductStore = ProductState & ProductActions;

// Helper to map SKU from backend to frontend Product format
const mapSKUToProduct = (sku: SKU): Product => ({
  id: sku.id,
  barcode: sku.barcode,
  productName: sku.product_name,
  purchasePrice: parseFloat(sku.base_price),
  sellingPrice: parseFloat(sku.base_price), // You might want to calculate this differently
  skuId: sku.id,
  createdAt: new Date(),
});

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch SKUs since they have barcode and price info
      const skus = await productService.getSKUs(search);
      const products = skus.map(mapSKUToProduct);
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),

  getProductByBarcode: (barcode) =>
    get().products.find((p) => p.barcode === barcode),

  searchProducts: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().products.filter(
      (p) =>
        p.barcode.toLowerCase().includes(lowerQuery) ||
        p.productName.toLowerCase().includes(lowerQuery)
    );
  },

  createProductWithSKU: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // First create the product
      const product = await productService.createProduct({
        name: data.name,
        description: data.description,
      });

      // Then create the SKU
      const sku = await productService.createSKU({
        product: product.id,
        sku_code: data.skuCode,
        barcode: data.barcode,
        base_price: data.basePrice,
      });

      const newProduct = mapSKUToProduct(sku);
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));

      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      set({ error: 'Failed to create product', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
