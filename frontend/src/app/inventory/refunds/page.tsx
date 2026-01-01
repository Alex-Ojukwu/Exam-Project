'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  InventorySidebar,
  InventoryHeader,
  RefundItemsTable,
  RefundSummary,
  type RefundItem,
  type RefundSummaryItem,
} from '@/app/components/inventory';

export default function RefundsPage() {
  const router = useRouter();
  const [saleOrderNumber, setSaleOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  // Mock data - replace with API call
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);

  const mockSaleOrders: Record<string, RefundItem[]> = {
    '6249548': [
      {
        id: '1',
        item: 'PRODUCT 1',
        productPrice: 1200.0,
        qtyPurchased: 1,
        qtyToReturn: 1,
        condition: 'Resellable',
        selected: true,
      },
      {
        id: '2',
        item: 'PRODUCT 2',
        productPrice: 2000.0,
        qtyPurchased: 2,
        qtyToReturn: 1,
        condition: 'Damaged',
        selected: false,
      },
    ],
  };

  const handleSearchOrder = () => {
    if (saleOrderNumber.trim() === '') {
      alert('Please enter a Sale Order number');
      return;
    }

    // Mock API call - replace with real API
    const data = mockSaleOrders[saleOrderNumber];
    if (data) {
      setRefundItems(data);
      setOrderLoaded(true);
      setOrderFound(true);
    } else {
      alert(`Sale Order ${saleOrderNumber} not found`);
      setRefundItems([]);
      setOrderLoaded(true);
      setOrderFound(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    const newItems = refundItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setRefundItems(newItems);
  };

  const handleUpdateQty = (id: string, qty: number) => {
    const newItems = refundItems.map((item) =>
      item.id === id ? { ...item, qtyToReturn: qty } : item
    );
    setRefundItems(newItems);
  };

  const handleUpdateCondition = (id: string, condition: 'Resellable' | 'Damaged') => {
    const newItems = refundItems.map((item) =>
      item.id === id ? { ...item, condition } : item
    );
    setRefundItems(newItems);
  };

  const getRefundSummary = (): RefundSummaryItem[] => {
    return refundItems
      .filter((item) => item.selected && item.qtyToReturn > 0)
      .map((item) => ({
        productName: item.item,
        price: item.productPrice,
        quantity: item.qtyToReturn,
      }));
  };

  const handleProcessRefund = () => {
    const selectedItems = refundItems.filter(
      (item) => item.selected && item.qtyToReturn > 0
    );

    if (selectedItems.length === 0) {
      alert('Please select at least one item to refund');
      return;
    }

    // TODO: API call to process refund
    console.log('Processing refund for:', selectedItems);
    const total = selectedItems.reduce(
      (sum, item) => sum + item.productPrice * item.qtyToReturn,
      0
    );
    console.log('Refund Total:', total);
    alert(`Refund processed successfully! Total: ₦${total.toFixed(2)}`);
    // router.push('/inventory');
  };

  return (
    <div className="flex min-h-screen bg-[#2d4a5c]">
      <InventorySidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader
          searchPlaceholder="Search by barcode..."
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6">
          {/* Sale Lookup */}
          <div className="bg-[#b8d4e8] rounded-lg p-6 mb-6">
            <h3 className="text-[#2d4a5c] font-semibold text-lg mb-4">Sale lookup</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Order 6249548"
                value={saleOrderNumber}
                onChange={(e) => setSaleOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-[#4a6575] text-[#2d4a5c] placeholder-gray-500 focus:outline-none focus:border-[#34516A]"
              />
              <button
                onClick={handleSearchOrder}
                className="bg-[#6b92ab] hover:bg-[#5a7f99] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {orderLoaded && orderFound && (
              <div className="mt-3">
                <span className="text-green-700 text-sm font-medium">
                  Order {saleOrderNumber} Found
                </span>
              </div>
            )}
          </div>

          {/* Refund Items and Summary */}
          {orderLoaded && orderFound && (
            <div className="flex gap-6">
              {/* Left side - Refund Items Table */}
              <div className="flex-1">
                <RefundItemsTable
                  items={refundItems}
                  onToggleSelect={handleToggleSelect}
                  onUpdateQty={handleUpdateQty}
                  onUpdateCondition={handleUpdateCondition}
                />

                {/* Summary Button */}
                <div className="mt-6 flex justify-center">
                  <button className="bg-[#34516A] hover:bg-[#2d4a5c] text-white px-12 py-3 rounded-lg font-semibold transition-colors">
                    Summary
                  </button>
                </div>
              </div>

              {/* Right side - Refund Summary */}
              <RefundSummary
                items={getRefundSummary()}
                refundMethod={{
                  type: 'card',
                  last4: '1234',
                }}
                onProcessRefund={handleProcessRefund}
              />
            </div>
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
