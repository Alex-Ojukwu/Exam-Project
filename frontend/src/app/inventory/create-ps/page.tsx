'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  InventorySidebar,
  InventoryHeader,
  NotificationsPanel,
  type Notification,
} from '@/app/components/inventory';

export default function CreateProductSupplierPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('Create New Product');

  // Form fields
  const [barcode, setBarcode] = useState('');
  const [productName, setProductName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'low_stock',
      message: 'Low stock alert !',
      productCode: 'PRODUCT2',
    },
    {
      id: '2',
      type: 'low_stock',
      message: 'Low stock alert !',
      productCode: 'PRODUCT34',
    },
    {
      id: '3',
      type: 'refund',
      message: 'Refund Request',
      productCode: 'ORDER12121',
    },
  ]);

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode || !productName || !purchasePrice || !sellingPrice) {
      alert('Please fill in all fields');
      return;
    }

    // TODO: API call to create product
    const productData = {
      barcode,
      productName,
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
    };

    console.log('Creating product:', productData);
    alert(`Product "${productName}" created successfully!`);

    // Clear form
    setBarcode('');
    setProductName('');
    setPurchasePrice('');
    setSellingPrice('');
  };

  return (
    <div className="flex min-h-screen bg-[#2d4a5c]">
      <InventorySidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader searchPlaceholder="" onSearch={setSearchQuery} />

        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Main Content - Create Product Form */}
            <div className="flex-1">
              {/* Dropdown Menu */}
              <div className="bg-[#34516A] rounded-lg p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-[#2d4a5c] transition-colors">
                <span className="text-white font-semibold text-lg">
                  {selectedOption}
                </span>
                <ChevronDown size={24} className="text-white" />
              </div>

              {/* Create Product Form */}
              <form onSubmit={handleCreateProduct}>
                <div className="bg-[#8fa9bc] rounded-lg p-8 max-w-xl">
                  <div className="space-y-6">
                    {/* Product Barcode */}
                    <div>
                      <label className="block text-[#2d4a5c] text-sm font-medium mb-2">
                        Enter Product Barcode
                      </label>
                      <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="162638236"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white text-[#2d4a5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34516A]"
                      />
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-[#2d4a5c] text-sm font-medium mb-2">
                        Enter Product Name
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="PRODUCT 82"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white text-[#2d4a5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34516A]"
                      />
                    </div>

                    {/* Purchase Price */}
                    <div>
                      <label className="block text-[#2d4a5c] text-sm font-medium mb-2">
                        Enter Purchase Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        placeholder="550.00"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white text-[#2d4a5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34516A]"
                      />
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label className="block text-[#2d4a5c] text-sm font-medium mb-2">
                        Set Selling Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        placeholder="600.00"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white text-[#2d4a5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34516A]"
                      />
                    </div>

                    {/* Create Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#b8d4e8] hover:bg-[#a3c4db] text-[#2d4a5c] py-3 rounded-lg font-semibold transition-colors mt-4"
                    >
                      Create Product
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Sidebar - Notifications */}
            <NotificationsPanel
              notifications={notifications}
              onDismiss={handleDismissNotification}
            />
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
