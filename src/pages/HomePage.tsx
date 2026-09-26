import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Mic,
  ShieldCheck,
  Smartphone,
  Store as StoreIcon,
  ShoppingBag,
  LayoutDashboard,
  QrCode,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Sliders,
  ListPlus,
  Clock,
  UserCheck,
  Check,
  ChevronRight,
} from 'lucide-react';
import { getStore } from '../services/db';

export const HomePage: React.FC = () => {
  const store = getStore();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col justify-between">
      {/* 1. Unified Landing Gateway Hero (Section 1 of Spec) */}
      <section className="bg-white border-b border-[#E0E6ED] relative overflow-hidden">
        {/* Subtle decorative background glow in Paytm brand blues */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BAF2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#002E6E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 relative z-10 text-center">
          {/* Official FinBuddy Logo */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center justify-center px-6 py-2.5 bg-white rounded-2xl border border-[#E0E6ED] shadow-xs">
              <img
                src="/finbuddy-logo.png"
                alt="FinBuddy Logo"
                className="h-11 sm:h-14 object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Hackathon Track Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F7FA] border border-[#E0E6ED] text-xs font-semibold text-[#002E6E] mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-pulse" />
            <span>Hack-e-Awadh 2026 · PS-02: Merchant Growth AI (Paytm Track)</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#002E6E] tracking-tight leading-tight max-w-4xl mx-auto mb-4">
            Smart Kirana Self-Checkout &{' '}
            <span className="text-[#00BAF2]">AI Merchant Copilot</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#6B7A90] text-sm sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Eliminating billing queues for offline Indian stores. Shoppers scan barcodes with their phone camera and talk in Hindi, while merchants unlock real-time inventory telemetry and AI-driven growth.
          </p>

          {/* 2 Clear, Distinct Entry Paths (Step 1 of Prompt) */}
          <div className="text-center mb-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-2">
              Select Your Gateway Path
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left mb-8">
            {/* PATH 1: ENTER AS MERCHANT (Paytm for Business Style) */}
            <div className="paytm-card p-6 bg-gradient-to-br from-[#002E6E] to-[#001D47] text-white rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.18)] flex flex-col justify-between group hover:scale-[1.01] transition border border-[#003882]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#00BAF2] border border-white/10">
                    <StoreIcon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00BAF2] text-white">
                    Paytm for Business Style
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white mb-2">
                  Enter as Merchant
                </h2>
                <p className="text-xs text-blue-200 leading-relaxed mb-5">
                  Actionable, data-rich copilot dashboard to empower offline store owners with AI telemetry and automated stock intelligence.
                </p>

                {/* Merchant Core Capabilities Checklist */}
                <div className="space-y-2.5 border-t border-white/10 pt-4 mb-6">
                  <div className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    <span><strong>Step 2.1: Business Onboarding:</strong> Register store name, category, and location</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    <span><strong>Customizable Inventory:</strong> Manage stock, add products & adjust pricing</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    <span><strong>Sales Trends & AI Analytics:</strong> Plain-language graph translations</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    <span><strong>Feedback Summarization:</strong> Aggregates sentiment into priority lists</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    <span><strong>Profile & Payment Gateway:</strong> Banking setup & sandbox simulator</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/merchant/dashboard"
                  className="w-full h-12 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Launch Merchant Copilot Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/merchant/login"
                  className="w-full h-9 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <span>Business Onboarding & Store Credentials</span>
                </Link>
              </div>
            </div>

            {/* PATH 2: ENTER AS CUSTOMER (Paytm Consumer Style) */}
            <div className="paytm-card p-6 bg-white border border-[#E0E6ED] hover:border-[#00BAF2] rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.08)] flex flex-col justify-between group hover:scale-[1.01] transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#00BAF2] border border-sky-100">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-[#002E6E]">
                    Paytm Consumer Style
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#002E6E] mb-2">
                  Enter as Customer
                </h2>
                <p className="text-xs text-[#6B7A90] leading-relaxed mb-5">
                  Mobile-first, queue-less self-checkout. Walk into the shop, scan barcodes with your phone, speak in Hindi, and pay in seconds.
                </p>

                {/* Customer Core Capabilities Checklist */}
                <div className="space-y-2.5 border-t border-[#E0E6ED] pt-4 mb-6">
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Step 3.1: Zero-Barrier Entry:</strong> In-store QR scan or instant Guest User mode</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>0-Latency Barcode Scanner:</strong> Instant camera recognition of items</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Voice Agent Integration:</strong> Hindi, Hinglish & English command & stock NLP</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Checkout & WhatsApp Delivery:</strong> Itemized digital receipt messaged directly</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Customer Account Features:</strong> Past order receipts & pre-built shopping lists</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to={`/s/${store.id}/checkout`}
                  className="w-full h-12 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Scan className="w-4 h-4" />
                  <span>Start In-Store Self-Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/customer"
                  className="w-full h-9 bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition border border-[#E0E6ED]"
                >
                  <ListPlus className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Customer Hub (Shopping Lists & Past Orders)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Barcode Testing Sheet Quick Banner for Hackathon Judges */}
          <div className="max-w-4xl mx-auto p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-[#00BAF2] flex items-center justify-center shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#002E6E]">Hackathon Evaluator Barcode Sheet</p>
                <p className="text-[11px] text-[#6B7A90]">Open printable test barcodes on a secondary screen or phone to test camera scanner.</p>
              </div>
            </div>
            <a
              href="/test_barcodes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#002E6E] hover:bg-[#001D47] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0"
            >
              <span>Open Barcodes Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Platform Architecture Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#00BAF2] block mb-1">
            End-to-End Synergy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002E6E]">
            How Merchant & Customer Workflows Connect
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A90] mt-1 max-w-lg mx-auto">
            Zero latency, cross-device synchronization between offline retail floor and back-office management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="paytm-card p-5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-3">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#002E6E] mb-1">1. Customer Scans in Aisle</h3>
            <p className="text-xs text-[#6B7A90] leading-relaxed">
              Customer picks item from shelf, scans barcode with phone camera. Can speak in Hindi: <em>"२ और पेप्सी जोड़ो"</em> to update quantity.
            </p>
          </div>

          <div className="paytm-card p-5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#21C17A] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#002E6E] mb-1">2. Paytm Test Payment & WhatsApp</h3>
            <p className="text-xs text-[#6B7A90] leading-relaxed">
              Customer authorizes transaction via Paytm sandbox. Instant digital receipt dispatched to customer's WhatsApp with full itemization.
            </p>
          </div>

          <div className="paytm-card p-5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002E6E] flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#002E6E] mb-1">3. Atomic Stock Decrement & AI Alerts</h3>
            <p className="text-xs text-[#6B7A90] leading-relaxed">
              Merchant's screen updates in real time without refreshing. AI Copilot triggers restocking alerts when inventory drops below safety threshold.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white py-6 text-center text-xs text-[#6B7A90]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002E6E]">FinBuddy</span>
            <span>· Hack-e-Awadh 2026 (Paytm PS-02: Merchant Growth AI)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/merchant/dashboard" className="hover:text-[#00BAF2] transition">
              Merchant Hub
            </Link>
            <Link to="/customer" className="hover:text-[#00BAF2] transition">
              Customer Hub
            </Link>
            <Link to={`/s/${store.id}/checkout`} className="hover:text-[#00BAF2] transition">
              Self-Checkout
            </Link>
            <a href="/test_barcodes.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#00BAF2] transition">
              Barcodes Sheet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
