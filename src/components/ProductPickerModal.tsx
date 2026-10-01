import React, { useState } from 'react';
import { Product } from '../types';
import { Search, X, Plus, AlertCircle, ShoppingCart } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ProductPickerModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  products,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Beverages', 'Instant Food', 'Snacks', 'Dairy', 'Confectionery', 'Staples'];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search.trim());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (product: Product) => {
    soundFX.playScanBeep();
    onSelectProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#002E6E]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#E0E6ED] rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.18)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E0E6ED] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#002E6E]">Browse Store Catalog</h2>
              <p className="text-xs text-[#6B7A90]">Select any product to add to your cart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#6B7A90] hover:text-[#002E6E] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-[#E0E6ED] bg-[#F5F7FA] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by name or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E0E6ED] rounded-lg text-sm text-[#1C2D42] placeholder-[#6B7A90] focus:outline-none focus:border-[#00BAF2] shadow-sm transition"
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#00BAF2] text-white shadow-sm'
                    : 'bg-white text-[#002E6E] hover:bg-sky-50 border border-[#E0E6ED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#6B7A90] text-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#002E6E]" />
              <p>No products found matching "{search}"</p>
            </div>
          ) : (
            filtered.map((prod) => {
              const priceRupees = (prod.pricePaise / 100).toFixed(2);
              const isLowStock = prod.stock <= prod.lowStockThreshold;
              const isOutOfStock = prod.stock === 0;

              return (
                <div
                  key={prod.id}
                  className="bg-white hover:bg-[#F9FBFE] border border-[#E0E6ED] hover:border-[#00BAF2] rounded-xl p-3 flex gap-3 transition group shadow-sm"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#F5F7FA] border border-[#E0E6ED]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#00BAF2]">
                          {prod.category}
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-[#FD5C63] border border-rose-100">
                            {prod.stock} left
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#002E6E] truncate group-hover:text-[#00BAF2] transition">
                        {prod.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-extrabold text-[#002E6E]">
                        ₹{priceRupees}
                      </span>
                      <button
                        onClick={() => handleAdd(prod)}
                        disabled={isOutOfStock}
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#00BAF2] hover:bg-[#00a4d6] text-white shadow-sm active:scale-95'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
