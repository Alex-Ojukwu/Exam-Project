'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  InventorySidebar,
  InventoryHeader,
  PurchaseOrderTable,
  LowStockAlert,
  SupplierSelector,
  type PurchaseOrderItem,
  type Supplier,
} from '@/app/components/inventory';

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    { barcode: '', productName: '', qtyNeeded: 0, unitPrice: 0 },
  ]);

  // Mock low stock items (replace with API call later)
  const lowStockItems = [
    { barcode: '83464569', productName: 'PRODUCT 8' },
    { barcode: '44675676', productName: 'PRODUCT 7' },
    { barcode: '83464569', productName: 'PRODUCT 9' },
  ];

  // Mock suppliers (replace with API call later)
  const suppliers: Supplier[] = [
    { id: '62348732', name: 'Supplier 63', contact: '+234 09 9458 2548' },
    { id: '12345678', name: 'ABC Suppliers Ltd', contact: '+234 08 1234 5678' },
    { id: '87654321', name: 'XYZ Distributors', contact: '+234 07 8765 4321' },
    { id: '11223344', name: 'Global Trade Co', contact: '+234 09 1122 3344' },
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

    if (!selectedSupplierId) {
      alert('Please select a supplier');
      return;
    }

    console.log('Creating PO with items:', validItems);
    console.log('Supplier ID:', selectedSupplierId);
    console.log('Total Amount:', calculateTotalAmount());

    // Show success message
    setShowSuccessMessage(true);

    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

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

                <div className="flex items-center gap-4">
                  {/* Success Message */}
                  {showSuccessMessage && (
                    <div className="bg-[#86efac] text-gray-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                      <span className="font-medium">Order created and forwarded</span>
                      <button
                        onClick={() => setShowSuccessMessage(false)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Create Order Button - Changes to green with checkmark when order is created */}
                  <button
                    onClick={handleCreateOrder}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      showSuccessMessage
                        ? 'bg-[#4ade80] hover:bg-[#3bc670] text-white'
                        : 'bg-[#b8d4e8] hover:bg-[#a3c4db] text-[#2d4a5c]'
                    }`}
                  >
                    {showSuccessMessage ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Create Order
                        <ArrowLeft className="rotate-180" size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Low Stock Alerts */}
              <LowStockAlert items={lowStockItems} onSelectItem={handleSelectLowStockItem} />

              {/* Supplier Selector */}
              <SupplierSelector
                suppliers={suppliers}
                selectedSupplierId={selectedSupplierId}
                onSelectSupplier={setSelectedSupplierId}
              />
            </div>
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
