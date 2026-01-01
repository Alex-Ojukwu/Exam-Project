'use client';

import { Search } from 'lucide-react';

export interface PurchaseOrderItem {
  barcode: string;
  productName: string;
  qtyNeeded: number;
  unitPrice: number;
}

interface PurchaseOrderTableProps {
  items: PurchaseOrderItem[];
  onUpdateItem?: (index: number, item: PurchaseOrderItem) => void;
  onRemoveItem?: (index: number) => void;
}

export default function PurchaseOrderTable({
  items,
  onUpdateItem,
  onRemoveItem,
}: PurchaseOrderTableProps) {
  return (
    <div className="bg-[#a8c5d8] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#2d4a5c] font-semibold text-lg">Inventory</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-md border-none bg-white text-sm w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#8fa9bc] text-[#2d4a5c]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Barcode</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Product name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Qty needed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Unit price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.barcode}
                    onChange={(e) =>
                      onUpdateItem?.(index, { ...item, barcode: e.target.value })
                    }
                    className="w-full bg-transparent text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) =>
                      onUpdateItem?.(index, { ...item, productName: e.target.value })
                    }
                    className="w-full bg-transparent text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.qtyNeeded}
                    onChange={(e) =>
                      onUpdateItem?.(index, {
                        ...item,
                        qtyNeeded: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-transparent text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      onUpdateItem?.(index, {
                        ...item,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-transparent text-sm"
                  />
                </td>
              </tr>
            ))}
            {/* Empty rows for better UX */}
            {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-200">
                <td className="px-4 py-3 h-12"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
