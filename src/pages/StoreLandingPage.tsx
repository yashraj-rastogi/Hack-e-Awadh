import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Mic,
  Zap,
  ArrowRight,
  ExternalLink,
  Store as StoreIcon,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { getStore } from '../services/db';

export const StoreLandingPage: React.FC = () => {
  const store = getStore();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col justify-between">
      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex-1 flex flex-col items-center text-center">
        {/* Official FinBuddy Logo */}
        <div className="flex justify-center mb-5">
          <img
            src="/finbuddy-logo.png"
            alt="FinBuddy Logo"
            className="h-12 sm:h-14 object-contain mix-blend-multiply"
          />
        </div>

        {/* Hackathon PS-02 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0E6ED] text-xs font-semibold text-[#002E6E] mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#00BAF2]" />
          <span>Hack-e-Awadh 2026 · PS-02: Merchant Growth AI (Paytm Track)</span>
        </div>

        {/* Store Greeting & Heading (Section 12) */}
        <div className="mb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-[#00BAF2] block mb-1">
            Store Check-In
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#002E6E] tracking-tight leading-tight">
            Welcome to {store.name}
          </h1>
        </div>

        <p className="text-[#6B7A90] text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
          Skip billing queues with Paytm-style self-checkout. Scan product barcodes with your camera,
          update your cart by voice, and pay in seconds.
        </p>

        {/* Store Standee QR Card (Section 12 & 43) */}
        <div className="paytm-card p-6 sm:p-8 flex flex-col items-center shadow-[0_2px_12px_rgba(0,46,110,0.08)] mb-8 max-w-sm w-full">
          <div className="w-48 h-48 bg-white border border-[#E0E6ED] rounded-xl p-3 flex flex-col items-center justify-center shadow-inner mb-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                window.location.origin + '/s/' + store.id + '/checkout'
              )}`}
              alt="Store Checkout QR Standee"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#002E6E]">
            <StoreIcon className="w-4 h-4 text-[#00BAF2]" />
            <span>{store.name} · QR Standee</span>
          </div>
          <p className="text-[11px] text-[#6B7A90] mt-0.5">Scan from phone camera to launch checkout</p>
        </div>

        {/* Primary Action Buttons (Section 9: Height 48px, Radius 8px) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-8">
          <Link
            to={`/s/${store.id}/checkout`}
            className="w-full sm:flex-1 h-12 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-lg shadow-[0_2px_8px_rgba(0,186,242,0.3)] flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Scan className="w-4 h-4" />
            <span>Start Self Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/merchant/dashboard"
            className="w-full sm:flex-1 h-12 bg-white hover:bg-sky-50 text-[#002E6E] hover:text-[#00BAF2] border border-[#00BAF2] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Zap className="w-4 h-4 text-[#00BAF2]" />
            <span>Merchant Hub</span>
          </Link>
        </div>

        {/* Barcode Testing Sheet Link for Judges */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E0E6ED] flex items-center justify-between w-full max-w-md text-left shadow-sm mb-12">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#002E6E]">Demo Barcodes Sheet</p>
              <p className="text-[11px] text-[#6B7A90]">Open test barcodes on a secondary screen</p>
            </div>
          </div>
          <a
            href="/test_barcodes.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-semibold flex items-center gap-1 transition"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 3 Step Workflow (Section 12: How?) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          <div className="paytm-card p-4">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-2.5">
              <Scan className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#002E6E] mb-1">1. Scan Barcodes</h3>
            <p className="text-[11px] text-[#6B7A90]">
              Align your phone camera over product barcodes. Instant beep and automatic cart addition.
            </p>
          </div>

          <div className="paytm-card p-4">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-2.5">
              <Mic className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#002E6E] mb-1">2. Talk in Hindi</h3>
            <p className="text-[11px] text-[#6B7A90]">
              Say "Do aur Pepsi add kar do" or "Maggi hatao". Gemini extracts intent and updates totals.
            </p>
          </div>

          <div className="paytm-card p-4">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4 text-[#21C17A]" />
            </div>
            <h3 className="text-xs font-bold text-[#002E6E] mb-1">3. Pay & Bill</h3>
            <p className="text-[11px] text-[#6B7A90]">
              Authorize with Paytm test gateway, receive digital receipt and optional WhatsApp delivery.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white py-4 text-center text-xs text-[#6B7A90]">
        <p>FinBuddy · Hack-e-Awadh 2026 · Built by Team Byte-Bandits</p>
      </footer>
    </div>
  );
};
