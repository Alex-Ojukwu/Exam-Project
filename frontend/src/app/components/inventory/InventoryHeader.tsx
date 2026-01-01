'use client';

import { Search, ChevronDown, ShoppingCart } from 'lucide-react';

interface InventoryHeaderProps {
  searchPlaceholder?: string;
  userName?: string;
  onSearch?: (query: string) => void;
}

export default function InventoryHeader({
  searchPlaceholder = 'Search Purchase Order',
  userName = 'John D',
  onSearch,
}: InventoryHeaderProps) {
  return (
    <header className="bg-[#34516A] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShoppingCart size={28} className="text-white" />
        <h1 className="text-white text-2xl font-semibold">Checkout</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-4 pr-10 py-2 rounded-full w-96 text-sm border-none bg-[#4a6575] text-white placeholder-gray-300"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5">
            <Search size={18} className="text-[#34516A]" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#4a6575] px-4 py-2 rounded-full">
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0)}
          </div>
          <span className="text-white text-sm font-medium">{userName}</span>
          <ChevronDown size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}
