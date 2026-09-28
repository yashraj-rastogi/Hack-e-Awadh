import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Store as StoreIcon,
  ShieldCheck,
  QrCode,
  Sparkles,
  Smartphone,
  Scan,
  Mic,
  CreditCard,
} from 'lucide-react';
import { Store } from '../types';
import { getStoreCheckoutUrl, getStoreQRImageUrl } from '../services/db';

interface StoreStandeeModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
}

export const StoreStandeeModal: React.FC<StoreStandeeModalProps> = ({ store, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const checkoutUrl = getStoreCheckoutUrl(store.id);
  const qrImageUrl = getStoreQRImageUrl(store.id, 320);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#001D47]/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#E0E6ED] overflow-hidden my-auto print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Modal Top Bar - Hidden during print */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#002E6E] text-white print:hidden">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#00BAF2]" />
            <span className="font-bold text-sm">Store QR Standee Generator</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Standee Sheet */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center bg-white print:p-8 print:m-0 print:w-full">
          {/* Standee Acrylic Card Frame */}
          <div className="w-full border-4 border-[#002E6E] rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/20 shadow-md relative overflow-hidden print:border-4 print:shadow-none print:rounded-2xl">
            {/* Top Paytm / FinBuddy Branding Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#002E6E]/15">
              <div className="flex items-center gap-2 text-left">
                <img
                  src="/finbuddy-icon.png"
                  alt="FinBuddy"
                  className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white shadow-xs border border-sky-100"
                />
                <div>
                  <div className="flex items-center gap-1 font-black text-xl text-[#002E6E] tracking-tight">
                    <span>Fin</span>
                    <span className="text-[#00BAF2]">Buddy</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#6B7A90]">
                    Smart Self-Checkout
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00BAF2] text-white shadow-xs">
                  AI Retail Automation
                </span>
                <p className="text-[10px] text-[#002E6E] font-bold mt-0.5">Paytm Gateway Accepted</p>
              </div>
            </div>

            {/* Store Identification */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-[#00BAF2] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 mb-1">
                <StoreIcon className="w-3 h-3" />
                <span>Instant Self-Billing Counter</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#002E6E] tracking-tight">
                {store.name}
              </h2>
              <p className="text-xs text-[#6B7A90] font-medium mt-0.5">
                {store.location} {store.upiVpa ? `· UPI: ${store.upiVpa}` : ''}
              </p>
            </div>

            {/* Physical Standee QR Box */}
            <div className="relative inline-block mx-auto p-4 bg-white rounded-2xl border-2 border-[#00BAF2] shadow-sm mb-5">
              <img
                src={qrImageUrl}
                alt={`${store.name} Checkout QR`}
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
              />
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#002E6E]">
                <Smartphone className="w-3.5 h-3.5 text-[#00BAF2]" />
                <span>Scan with Camera to Start Shopping</span>
              </div>
            </div>

            {/* 3 Step Instructions For In-Store Customers */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-white rounded-xl border border-[#E0E6ED] text-left mb-4 shadow-xs">
              <div className="flex flex-col items-center text-center p-1.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center font-bold text-xs mb-1">
                  <Scan className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#002E6E] leading-tight">1. Scan QR</span>
                <span className="text-[9px] text-[#6B7A90] leading-tight mt-0.5">फोन कैमरा से खोलें</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5 border-x border-[#E0E6ED]">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center font-bold text-xs mb-1">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#002E6E] leading-tight">2. Scan & Speak</span>
                <span className="text-[9px] text-[#6B7A90] leading-tight mt-0.5">बारकोड स्कैन करें</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#21C17A] flex items-center justify-center font-bold text-xs mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#002E6E] leading-tight">3. Pay via UPI</span>
                <span className="text-[9px] text-[#6B7A90] leading-tight mt-0.5">डिजिटल बिल पाएं</span>
              </div>
            </div>

            {/* Accepted Methods Strip */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-[#002E6E] pt-2 border-t border-[#002E6E]/10">
              <span className="text-[#6B7A90] font-medium">Accepted:</span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#E0E6ED] text-[10px]">UPI</span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#E0E6ED] text-[10px]">Paytm</span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#E0E6ED] text-[10px]">GPay</span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#E0E6ED] text-[10px]">PhonePe</span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#E0E6ED] text-[10px]">Cards</span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls - Hidden during print */}
        <div className="p-4 sm:p-5 bg-[#F5F7FA] border-t border-[#E0E6ED] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none h-10 px-4 rounded-lg bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Printer className="w-4 h-4 text-[#00BAF2]" />
              <span>Print Standee (A4/A5)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="h-10 px-3.5 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] border border-[#E0E6ED] text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy checkout web link"
            >
              {copied ? <Check className="w-4 h-4 text-[#21C17A]" /> : <Copy className="w-4 h-4 text-[#6B7A90]" />}
              <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none h-10 px-4 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <span>Test Customer Checkout</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
