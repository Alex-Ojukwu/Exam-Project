'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  InventorySidebar,
  InventoryHeader,
  PurchaseOrderTable,
  LowStockAlert,
  type PurchaseOrderItem,
} from '@/app/components/inventory';

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    { barcode: '', productName: '', qtyNeeded: 0, unitPrice: 0 },
  ]);

  // Mock low stock items (replace with API call later)
  const lowStockItems = [
    { barcode: '83464569', productName: 'PRODUCT 8' },
    { barcode: '44675676', productName: 'PRODUCT 7' },
    { barcode: '83464569', productName: 'PRODUCT 9' },
  ];

  const calculateTotalAmount = () => {
    return poItems.reduce((total, item) => {
      return total + item.qtyNeeded * item.unitPrice;
    }, 0);
  };

  const handleUpdateItem = (index: number, updatedItem: PurchaseOrderItem) => {
    const newItems = [...poItems];
    newItems[index] = updatedItem;
    setPoItems(newItems);
  };

  const handleAddRow = () => {
    setPoItems([
      ...poItems,
      { barcode: '', productName: '', qtyNeeded: 0, unitPrice: 0 },
    ]);
  };

  const handleSelectLowStockItem = (item: { barcode: string; productName: string }) => {
    // Add low stock item to the purchase order table
    const existingIndex = poItems.findIndex((poItem) => poItem.barcode === item.barcode);

    if (existingIndex === -1) {
      setPoItems([
        ...poItems,
        { barcode: item.barcode, productName: item.productName, qtyNeeded: 0, unitPrice: 0 },
      ]);
    }
  };

  const handleCreateOrder = () => {
    // TODO: API call to create purchase order
    const validItems = poItems.filter(
      (item) => item.barcode && item.productName && item.qtyNeeded > 0
    );

    if (validItems.length === 0) {
      alert('Please add at least one product with quantity');
      return;
    }

    console.log('Creating PO with items:', validItems);
    console.log('Total Amount:', calculateTotalAmount());
    // router.push('/inventory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InventorySidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader
          searchPlaceholder="Search Purchase Order"
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1">
              <PurchaseOrderTable items={poItems} onUpdateItem={handleUpdateItem} />

              {/* Total Amount and Create Order Button */}
              <div className="mt-6 bg-[#34516A] rounded-lg p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#4a6575] px-6 py-3 rounded-lg">
                    <span className="text-white text-sm font-medium">Total Amount</span>
                  </div>
                  <div className="bg-[#4a6575] px-6 py-3 rounded-lg min-w-[150px] text-center">
                    <span className="text-white text-lg font-semibold">
                      {calculateTotalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  className="bg-[#b8d4e8] hover:bg-[#a3c4db] text-[#2d4a5c] px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  Create Order
                  <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>

            {/* Low Stock Alerts Sidebar */}
            <LowStockAlert items={lowStockItems} onSelectItem={handleSelectLowStockItem} />
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mt-6 bg-[#4a6575] hover:bg-[#3d5a6c] text-white p-3 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </main>
      </div>
    </div>
  );
}
