import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, QrCode, PlusCircle, Menu, X, User, Home } from 'lucide-react';
import { getStore, subscribeToStoreUpdates } from '../services/db';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.pathname.startsWith('/merchant');
  const [store, setStore] = useState(getStore());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStoreUpdates(() => {
      setStore(getStore());
    });
    return () => unsub();
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Merchant Header (Section 11: Deep Navy #002E6E)
  if (isMerchant) {
    return (
      <header className="sticky top-0 z-40 bg-[#002E6E] text-white border-b border-[#001D47] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/merchant/dashboard" className="flex items-center gap-2.5">
              <img
                src="/finbuddy-icon.png"
                alt="FinBuddy"
                className="w-9 h-9 object-contain rounded-lg p-0.5 bg-white shadow-xs"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white">
                    Fin<span className="text-[#00BAF2]">Buddy</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#00BAF2] text-white">
                    Merchant
                  </span>
                </div>
                <span className="text-[11px] text-blue-200 truncate max-w-[140px] sm:max-w-xs">{store.name}</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/merchant/onboard"
              className="px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-[#21C17A] hover:bg-[#1eb06f] text-white transition flex items-center gap-1.5 shadow-xs"
              title="Add a new business or store"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Onboard Store</span>
              <span className="sm:hidden">New</span>
            </Link>

            <Link
              to="/merchant/dashboard"
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00BAF2]" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to={`/s/${store.id}/checkout`}
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-[#00BAF2] hover:bg-[#00a4d6] text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Customer Checkout</span>
              <span className="md:hidden">Checkout</span>
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
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Store Name */}
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <img
            src="/finbuddy-icon.png"
            alt="FinBuddy"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg p-0.5 bg-white shadow-xs group-hover:scale-105 transition shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-[#002E6E]">
                Fin<span className="text-[#00BAF2]">Buddy</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-50 text-[#002E6E] border border-sky-100 shrink-0">
                Self-Checkout
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#6B7A90] font-medium truncate hidden xs:block sm:block">
              Awadh Mart (Hazratganj)
            </p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              location.pathname === '/'
                ? 'text-[#002E6E] bg-[#F5F7FA] font-bold border border-[#E0E6ED]'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            Overview
          </Link>

          <Link
            to="/customer"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              location.pathname === '/customer'
                ? 'text-[#002E6E] bg-[#F5F7FA] font-bold border border-[#E0E6ED]'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            Customer Hub
          </Link>

          <Link
            to={`/s/${store.id}/checkout`}
            className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#00BAF2] hover:bg-[#00a4d6] text-white shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Scan & Pay</span>
          </Link>

          <a
            href="/test_barcodes.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Open printable demo barcode sheet"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6B7A90] hover:text-[#002E6E] bg-white border border-[#E0E6ED] transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Barcodes</span>
          </a>
        </div>

        {/* Mobile Nav Action Bar */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            to={`/s/${store.id}/checkout`}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00BAF2] hover:bg-[#00a4d6] text-white shadow-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Scan & Pay</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#002E6E] hover:bg-[#F5F7FA] transition active:scale-95 border border-[#E0E6ED]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E0E6ED] bg-white px-4 py-3 shadow-lg space-y-1 animate-fade-in">
          <div className="pb-2 mb-2 border-b border-[#F0F3F7]">
            <span className="text-[10px] uppercase font-bold text-[#6B7A90] tracking-wider block">
              Active Store
            </span>
            <p className="text-xs font-bold text-[#002E6E] truncate">{store.name}</p>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
              location.pathname === '/'
                ? 'bg-sky-50 text-[#002E6E] border border-sky-100'
                : 'text-[#4A5568] hover:bg-[#F5F7FA]'
            }`}
          >
            <Home className="w-4 h-4 text-[#00BAF2]" />
            <span>Store Check-In / Welcome</span>
          </Link>

          <Link
            to="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
              location.pathname === '/customer'
                ? 'bg-sky-50 text-[#002E6E] border border-sky-100'
                : 'text-[#4A5568] hover:bg-[#F5F7FA]'
            }`}
          >
            <User className="w-4 h-4 text-[#00BAF2]" />
            <span>Customer Hub (Lists & Receipts)</span>
          </Link>

          <Link
            to={`/s/${store.id}/checkout`}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
              location.pathname.includes('/checkout')
                ? 'bg-sky-50 text-[#002E6E] border border-sky-100'
                : 'text-[#4A5568] hover:bg-[#F5F7FA]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#00BAF2]" />
            <span>In-Store Self-Checkout</span>
          </Link>

          <a
            href="/test_barcodes.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-[#4A5568] hover:bg-[#F5F7FA] transition"
          >
            <QrCode className="w-4 h-4 text-[#00BAF2]" />
            <span>Demo Barcodes Sheet</span>
          </a>
        </div>
      )}
    </header>
  );
};

