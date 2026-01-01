'use client';

import { useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  InventorySidebar,
  InventoryHeader,
  ReceiveStockTable,
  type ReceiveStockItem,
} from '@/app/components/inventory';

export default function ReceiveStockPage() {
  const router = useRouter();
  const [poNumber, setPoNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [poLoaded, setPoLoaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [setPrice, setSetPrice] = useState('');

  // Mock data - replace with API call
  const [receiveItems, setReceiveItems] = useState<ReceiveStockItem[]>([]);

  const mockPOData: Record<string, ReceiveStockItem[]> = {
    '134903': [
      {
        barcode: '83464569',
        productName: 'PRODUCT 1',
        qtyPurchased: 25,
        qtyDelivered: 24,
        unitPrice: 1000.0,
      },
      {
        barcode: '08458094',
        productName: 'PRODUCT 2',
        qtyPurchased: 120,
        qtyDelivered: 120,
        unitPrice: 450.0,
      },
    ],
  };

  const handleSearchPO = () => {
    if (poNumber.trim() === '') {
      alert('Please enter a Purchase Order number');
      return;
    }

    // Mock API call - replace with real API
    const data = mockPOData[poNumber];
    if (data) {
      setReceiveItems(data);
      setPoLoaded(true);
      setShowWarning(true);
    } else {
      alert(`Purchase Order ${poNumber} not found`);
      setReceiveItems([]);
      setPoLoaded(false);
    }
  };

  const handleUpdateDelivered = (index: number, qtyDelivered: number) => {
    const newItems = [...receiveItems];
    newItems[index] = { ...newItems[index], qtyDelivered };
    setReceiveItems(newItems);
  };

  const calculateTotalAmount = () => {
    return receiveItems.reduce((total, item) => {
      return total + item.unitPrice * item.qtyDelivered;
    }, 0);
  };

  const hasDiscrepancies = () => {
    return receiveItems.some((item) => item.qtyPurchased !== item.qtyDelivered);
  };

  const handleSaveAsDraft = () => {
    // TODO: API call to save as draft
    console.log('Saving as draft:', receiveItems);
    alert('Saved as draft');
  };

  const handleSave = () => {
    if (hasDiscrepancies()) {
      const confirmSave = confirm(
        'There are discrepancies between purchased and delivered quantities. Do you want to continue?'
      );
      if (!confirmSave) return;
    }

    // TODO: API call to update inventory
    console.log('Updating inventory with:', receiveItems);
    console.log('Total Amount:', calculateTotalAmount());
    alert('Stock received and inventory updated!');
    // router.push('/inventory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InventorySidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader
          searchPlaceholder="Purchase Order 134903"
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6">
          {/* Purchase Order Search */}
          <div className="bg-[#b8d4e8] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Order 6249548"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPO()}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-[#4a6575] text-[#2d4a5c] placeholder-gray-500 focus:outline-none focus:border-[#34516A]"
              />
              <button
                onClick={handleSearchPO}
                className="bg-[#6b92ab] hover:bg-[#5a7f99] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {poLoaded && (
              <div className="mt-3">
                <span className="text-green-700 text-sm font-medium">
                  Order {poNumber} Found
                </span>
              </div>
            )}
          </div>

          {/* Receive Stock Table */}
          {poLoaded && (
            <>
              <ReceiveStockTable
                items={receiveItems}
                onUpdateDelivered={handleUpdateDelivered}
              />

              {/* Warning Message */}
              {showWarning && hasDiscrepancies() && (
                <div className="mt-4 bg-[#d9a5a5] text-[#5c2d2d] px-6 py-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Review quantities before saving
                  </span>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="text-[#5c2d2d] hover:text-red-900"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Total Amount and Action Buttons */}
              <div className="mt-6 bg-[#34516A] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
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
                    <div className="bg-[#4a6575] px-4 py-2 rounded-lg flex items-center gap-2">
                      <span className="text-white text-sm">Set Price :</span>
                      <input
                        type="number"
                        value={setPrice}
                        onChange={(e) => setSetPrice(e.target.value)}
                        placeholder="24500.00"
                        className="bg-white text-[#2d4a5c] px-3 py-1 rounded w-32 text-sm"
                      />
                      <button className="bg-[#6b92ab] hover:bg-[#5a7f99] text-white px-3 py-1 rounded text-sm font-medium">
                        ₦
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={handleSaveAsDraft}
                    className="bg-[#6b92ab] hover:bg-[#5a7f99] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#b8d4e8] hover:bg-[#a3c4db] text-[#2d4a5c] px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    Save
                    <ArrowLeft className="rotate-180" size={20} />
                  </button>
                </div>
              </div>
            </>
          )}

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
