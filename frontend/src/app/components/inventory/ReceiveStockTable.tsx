'use client';

import { Search } from 'lucide-react';

export interface ReceiveStockItem {
  barcode: string;
  productName: string;
  qtyPurchased: number;
  qtyDelivered: number;
  unitPrice: number;
}

interface ReceiveStockTableProps {
  items: ReceiveStockItem[];
  onUpdateDelivered?: (index: number, qtyDelivered: number) => void;
}

export default function ReceiveStockTable({
  items,
  onUpdateDelivered,
}: ReceiveStockTableProps) {
  const calculateDifference = (purchased: number, delivered: number) => {
    return purchased - delivered;
  };

  const calculateTotalPrice = (unitPrice: number, qtyDelivered: number) => {
    return (unitPrice * qtyDelivered).toFixed(2);
  };

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
              <th className="px-4 py-3 text-left text-sm font-semibold">Qty purchased</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Qty delivered</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Difference</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Unit price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const difference = calculateDifference(item.qtyPurchased, item.qtyDelivered);
              const totalPrice = calculateTotalPrice(item.unitPrice, item.qtyDelivered);

              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">{item.barcode}</td>
                  <td className="px-4 py-3 text-sm">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.qtyPurchased}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <input
                      type="number"
                      value={item.qtyDelivered}
                      onChange={(e) =>
                        onUpdateDelivered?.(index, parseInt(e.target.value) || 0)
                      }
                      className="w-16 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span
                      className={`
                        inline-flex items-center justify-center
                        w-8 h-8 rounded-full text-white font-medium
                        ${difference === 0 ? 'bg-gray-400' : 'bg-blue-500'}
                      `}
                    >
                      {difference}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{totalPrice}</td>
                </tr>
              );
            })}
            {/* Empty rows */}
            {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-200">
                <td className="px-4 py-3 h-12"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
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
