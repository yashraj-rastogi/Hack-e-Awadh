import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, QrCode } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.pathname.startsWith('/merchant');

  // Merchant Header (Section 11: Deep Navy #002E6E)
  if (isMerchant) {
    return (
      <header className="sticky top-0 z-40 bg-[#002E6E] text-white border-b border-[#001D47] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/merchant/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00BAF2] flex items-center justify-center font-black text-white text-base shadow-sm">
                F
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">FinBuddy</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#00BAF2] text-white">
                    Merchant
                  </span>
                </div>
                <span className="text-[11px] text-blue-200">Awadh Mart (Hazratganj)</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/merchant/dashboard"
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00BAF2]" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/s/store-awadh-01/checkout"
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-[#00BAF2] hover:bg-[#00a4d6] text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Self-Checkout</span>
            </Link>

            <a
              href="/test_barcodes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 transition"
              title="Open Barcodes Sheet"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Barcodes</span>
            </a>
          </div>
        </div>
      </header>
    );
  }

  // Customer Header (Section 11: White Surface #FFFFFF, Dark Navy Text #002E6E)
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E6ED] shadow-[0_1px_4px_rgba(0,46,110,0.06)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#002E6E] flex items-center justify-center font-black text-white text-base shadow-sm group-hover:bg-[#001D47] transition">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#002E6E]">
                FinBuddy<span className="text-[#00BAF2]">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-50 text-[#002E6E] border border-sky-100">
                Self-Checkout
              </span>
            </div>
            <p className="text-[11px] text-[#6B7A90] font-medium">Awadh Mart (Hazratganj)</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/s/store-awadh-01/checkout"
            className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#00BAF2] hover:bg-[#00a4d6] text-white shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Scan & Pay</span>
          </Link>

          <Link
            to="/merchant/dashboard"
            className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#002E6E] hover:text-[#00BAF2] bg-[#F5F7FA] hover:bg-[#EBF3FB] border border-[#E0E6ED] flex items-center gap-1.5 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#002E6E]" />
            <span className="hidden sm:inline">Merchant Hub</span>
          </Link>

          <a
            href="/test_barcodes.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Open printable demo barcode sheet"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6B7A90] hover:text-[#002E6E] bg-white border border-[#E0E6ED] transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Barcodes</span>
          </a>
        </div>
      </div>
    </header>
  );
};
