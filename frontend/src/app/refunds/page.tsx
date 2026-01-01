'use client';

import { useState } from 'react';
import { ArrowLeft, Search, ShoppingCart, User, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RefundItem {
  id: string;
  item: string;
  productPrice: number;
  qtyPurchased: number;
  qtyToReturn: number;
  condition: 'Resellable' | 'Damaged';
  selected: boolean;
}

interface RefundSummaryItem {
  productName: string;
  price: number;
  quantity: number;
}

export default function RefundsPage() {
  const router = useRouter();
  const [saleOrderNumber, setSaleOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  // Mock data
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
    setRefundItems(
      refundItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setRefundItems(
      refundItems.map((item) => (item.id === id ? { ...item, qtyToReturn: qty } : item))
    );
  };

  const handleUpdateCondition = (id: string, condition: 'Resellable' | 'Damaged') => {
    setRefundItems(
      refundItems.map((item) => (item.id === id ? { ...item, condition } : item))
    );
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 0) {
      handleUpdateQty(id, currentQty - 1);
    }
  };

  const handleIncrement = (id: string, currentQty: number, maxQty: number) => {
    if (currentQty < maxQty) {
      handleUpdateQty(id, currentQty + 1);
    }
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

  const calculateRefundTotal = () => {
    return refundItems
      .filter((item) => item.selected && item.qtyToReturn > 0)
      .reduce((sum, item) => sum + item.productPrice * item.qtyToReturn, 0);
  };

  const handleProcessRefund = () => {
    const selectedItems = refundItems.filter(
      (item) => item.selected && item.qtyToReturn > 0
    );

    if (selectedItems.length === 0) {
      alert('Please select at least one item to refund');
      return;
    }

    const total = calculateRefundTotal();
    alert(`Refund processed successfully! Total: ₦${total.toFixed(2)}`);
  };

  // Filter items based on search query
  const filteredItems = refundItems.filter((item) => {
    const query = itemSearchQuery.toLowerCase();
    return item.item.toLowerCase().includes(query);
  });

  const displayItems = itemSearchQuery ? filteredItems : refundItems;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#2d4a5c] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-white" size={28} />
            <span className="text-white text-xl font-semibold">Checkout</span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#4a6575] text-white px-4 py-2 rounded-md border-none placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b92ab]"
            />
            <button className="p-2 bg-[#4a6575] rounded-md hover:bg-[#3d5a6c]">
              <Search className="text-white" size={20} />
            </button>
            <div className="flex items-center gap-2 bg-[#4a6575] px-3 py-2 rounded-md">
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="text-white text-sm">John D</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Main Layout - Left content and Right summary */}
          <div className="flex gap-6">
            {/* Left Column - Sale Lookup and Items Table */}
            <div className="flex-1">
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

              {/* Items for Return Table */}
              <div>
                <div className="bg-[#6b8fa3] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">Items for Return</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={itemSearchQuery}
                        onChange={(e) => setItemSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-md border-none bg-white text-sm text-gray-900 placeholder-gray-400 w-64"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#8fa9bc] text-[#2d4a5c]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold w-12"></th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Product price
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Qty purchased
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Qty to return
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => handleToggleSelect(item.id)}
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.item}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.productPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">
                              {item.qtyPurchased}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecrement(item.id, item.qtyToReturn)}
                                  className="w-7 h-7 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center text-white"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-gray-900">
                                  {item.qtyToReturn}
                                </span>
                                <button
                                  onClick={() =>
                                    handleIncrement(item.id, item.qtyToReturn, item.qtyPurchased)
                                  }
                                  className="w-7 h-7 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center text-white"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={item.condition}
                                onChange={(e) =>
                                  handleUpdateCondition(
                                    item.id,
                                    e.target.value as 'Resellable' | 'Damaged'
                                  )
                                }
                                className={`
                                  px-3 py-1.5 rounded text-sm border-none font-medium
                                  ${
                                    item.condition === 'Resellable'
                                      ? 'bg-blue-200 text-blue-800'
                                      : 'bg-gray-300 text-gray-700'
                                  }
                                `}
                              >
                                <option value="Resellable">Resellable</option>
                                <option value="Damaged">Damaged</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {/* Empty rows */}
                        {Array.from({ length: Math.max(0, 3 - displayItems.length) }).map(
                          (_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-gray-200">
                              <td className="px-4 py-3 h-12"></td>
                              <td className="px-4 py-3"></td>
                              <td className="px-4 py-3"></td>
                              <td className="px-4 py-3"></td>
                              <td className="px-4 py-3"></td>
                              <td className="px-4 py-3"></td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {itemSearchQuery && displayItems.length === 0 && (
                    <p className="text-center text-white py-4 text-sm">No items found</p>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-sm text-white">
                    <span className="bg-[#4a6575] px-3 py-1 rounded">ℹ️</span>
                    <span>Quantities cannot exceed original purchase</span>
                  </div>
                </div>

                {/* Summary Button */}
                <div className="mt-6 flex justify-end">
                  <button className="bg-[#34516A] hover:bg-[#2d4a5c] text-white px-12 py-3 rounded-lg font-semibold transition-colors">
                    Summary
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Refund Summary */}
            <div className="bg-[#b8d4e8] rounded-lg p-6 min-w-[320px] h-fit">
              <h3 className="text-[#2d4a5c] font-semibold text-lg mb-4">Refund summary</h3>

              {getRefundSummary().length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {getRefundSummary().map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-[#2d4a5c]"
                      >
                        <span>{item.productName}</span>
                        <span>{item.price.toFixed(2)}</span>
                        <span>{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#8fa9bc] pt-4 mb-6">
                    <p className="text-[#2d4a5c] font-semibold text-lg">
                      Refund Total = ₦ {calculateRefundTotal().toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-[#2d4a5c]">
                      <span>Refund method</span>
                      <span>card ****1234</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProcessRefund}
                    className="w-full bg-[#a8e6a8] hover:bg-[#95d895] text-[#2d4a5c] py-3 rounded-lg font-semibold transition-colors"
                  >
                    Process Refund
                  </button>
                </>
              ) : (
                <div className="text-gray-500 text-sm text-center py-8">
                  No items selected for refund
                </div>
              )}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="bg-[#4a6575] hover:bg-[#3d5a6c] text-white p-3 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              onClick={() => router.back()}
              className="bg-[#4a6575] hover:bg-[#3d5a6c] text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Cancel
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
