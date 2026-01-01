'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InventorySidebar, InventoryHeader } from '@/app/components/inventory';

interface InventoryItem {
  barcode: string;
  productName: string;
  qtyNeeded: number;
  unitPrice: number;
}

interface PurchaseOrder {
  id: string;
  number: string;
  selected: boolean;
}

export default function InventoryListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPO, setSelectedPO] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock inventory history data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      barcode: '83464569',
      productName: 'PRODUCT 8',
      qtyNeeded: 85,
      unitPrice: 2000.0,
    },
    {
      barcode: '44575676',
      productName: 'PRODUCT 7',
      qtyNeeded: 120,
      unitPrice: 3000.0,
    },
  ]);

  // Mock purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: '1', number: 'Purchase Order 4557', selected: true },
    { id: '2', number: 'Purchase Order 4822', selected: false },
  ]);

  const calculateTotalAmount = () => {
    return inventoryItems.reduce((total, item) => {
      return total + item.qtyNeeded * item.unitPrice;
    }, 0);
  };

  const handleTogglePO = (id: string) => {
    setPurchaseOrders(
      purchaseOrders.map((po) =>
        po.id === id ? { ...po, selected: !po.selected } : po
      )
    );
  };

  const handleLoadOrder = () => {
    const selectedPOs = purchaseOrders.filter((po) => po.selected);
    if (selectedPOs.length === 0) {
      alert('Please select at least one purchase order');
      return;
    }

    // TODO: API call to load selected purchase orders
    console.log('Loading orders:', selectedPOs);
    alert(`Loading ${selectedPOs.length} purchase order(s)`);
  };

  return (
    <div className="flex min-h-screen bg-[#2d4a5c]">
      <InventorySidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader
          searchPlaceholder="Load Previously Purchased Order"
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Main Content - Inventory History */}
            <div className="flex-1">
              <div className="bg-[#a8c5d8] rounded-lg p-4">
                {/* Header with Date Filter */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#2d4a5c] font-semibold text-lg">
                    Inventory History
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter Order Date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-4 py-2 rounded-md border-none bg-white text-sm w-48"
                    />
                    <button className="p-2 bg-white rounded-md hover:bg-gray-50">
                      <Calendar size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-md hover:bg-gray-50">
                      <Calendar size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-md hover:bg-gray-50">
                      <Calendar size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#8fa9bc] text-[#2d4a5c]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Barcode
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Product name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Qty needed
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Unit price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm">{item.barcode}</td>
                          <td className="px-4 py-3 text-sm">{item.productName}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-[#6b8fa3] text-white px-3 py-1 rounded">
                              {item.qtyNeeded}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{item.unitPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                      {/* Empty rows */}
                      {Array.from({ length: Math.max(0, 6 - inventoryItems.length) }).map(
                        (_, i) => (
                          <tr key={`empty-${i}`} className="border-b border-gray-200">
                            <td className="px-4 py-3 h-12"></td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-6 bg-[#34516A] rounded-lg p-6 flex items-center gap-4">
                <div className="bg-[#4a6575] px-6 py-3 rounded-lg">
                  <span className="text-white text-sm font-medium">Total Amount</span>
                </div>
                <div className="bg-[#4a6575] px-6 py-3 rounded-lg min-w-[150px] text-center">
                  <span className="text-white text-lg font-semibold">
                    {calculateTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Purchase Orders */}
            <div className="bg-[#b8d4e8] rounded-lg p-6 min-w-[280px] h-fit">
              <h3 className="text-[#2d4a5c] font-semibold text-lg mb-4">
                Purchase Order
              </h3>

              <div className="space-y-3 mb-6">
                {purchaseOrders.map((po) => (
                  <div
                    key={po.id}
                    className="bg-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => handleTogglePO(po.id)}
                  >
                    <span className="text-sm text-[#2d4a5c] font-medium">
                      {po.number}
                    </span>
                    <input
                      type="checkbox"
                      checked={po.selected}
                      onChange={() => handleTogglePO(po.id)}
                      className="w-4 h-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleLoadOrder}
                className="w-full bg-[#8fa9bc] hover:bg-[#7a96a8] text-[#2d4a5c] py-3 rounded-lg font-semibold transition-colors"
              >
                Load Order
              </button>
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
