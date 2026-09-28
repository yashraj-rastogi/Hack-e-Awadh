import React, { useState } from 'react';
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
  Plus,
  Clock,
  UserCheck,
  Check,
  ChevronRight,
  Receipt,
  Zap,
  Bot,
  CreditCard,
  Package,
  PackageCheck,
  ArrowDown,
  RefreshCw,
  ShoppingBasket,
  Layers,
  Sparkle,
  Radio,
  FileText
} from 'lucide-react';
import { getStore } from '../services/db';

export const HomePage: React.FC = () => {
  const store = getStore();
  const [activeGuideTab, setActiveGuideTab] = useState<'customer' | 'merchant' | 'synergy'>('customer');

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

          {/* CodeBlitz 2.0 Track Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0E6ED] text-xs font-semibold text-[#002E6E] mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-pulse" />
            <span>CodeBlitz 2.0 · Primary Track: AI & Automation</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[10px] text-[#00BAF2] font-bold border border-sky-100">
              ElevenLabs + Gemini AI
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#002E6E] tracking-tight leading-tight max-w-4xl mx-auto mb-3">
            FinBuddy — <span className="text-[#00BAF2]">AI-Powered Retail Automation</span>
          </h1>

          {/* Subtitle / Core Product Promise */}
          <p className="text-base sm:text-lg font-bold text-[#002E6E] max-w-2xl mx-auto mb-2">
            AI Self-Checkout + Conversational Merchant Copilot
          </p>
          <p className="text-[#6B7A90] text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
            Customers self-checkout using camera barcode scanning and natural voice, while completed transactions automatically become structured business data powering a conversational AI merchant copilot.
          </p>

          {/* Core System Loop: Purchase → Payment → Data → Insight → Recommendation */}
          <div className="max-w-3xl mx-auto bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 mb-8 shadow-2xs">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#002E6E] block mb-1.5">
              Closed System Automation Loop
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold text-[#002E6E]">
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E0E6ED] shadow-xs">1. Purchase</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E0E6ED] shadow-xs">2. Payment</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E0E6ED] shadow-xs">3. Structured Data</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E0E6ED] shadow-xs">4. Real-Time Insight</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E0E6ED] shadow-xs text-[#00BAF2]">5. Recommendation</span>
            </div>
          </div>

          {/* 2 Clear, Distinct Entry Paths (Step 1 of Prompt) */}
          <div className="text-center mb-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-2">
              Select Your Gateway Path
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left mb-8">
            {/* PATH 1: ENTER AS MERCHANT (Merchant Operations & Copilot) */}
            <div className="paytm-card p-6 bg-white border border-[#E0E6ED] hover:border-[#00BAF2] rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.08)] flex flex-col justify-between group hover:scale-[1.01] transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#00BAF2] border border-sky-100">
                    <StoreIcon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-[#002E6E]">
                    Merchant Operations · Ask → Understand → Act
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#002E6E] mb-2">
                  Enter as Merchant
                </h2>
                <p className="text-xs text-[#6B7A90] leading-relaxed mb-5">
                  Actionable, data-rich copilot dashboard to empower offline store owners with AI telemetry and automated stock intelligence.
                </p>

                {/* Merchant Core Capabilities Checklist */}
                <div className="space-y-2.5 border-t border-[#E0E6ED] pt-4 mb-6">
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Step 2.1: Business Onboarding:</strong> Register store name, category, and location</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Customizable Inventory:</strong> Manage stock, add products & adjust pricing</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Sales Trends & AI Analytics:</strong> Plain-language graph translations</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                    <span><strong>Feedback Summarization:</strong> Aggregates sentiment into priority lists</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
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
                  to="/merchant/onboard"
                  className="w-full h-9 bg-emerald-50 hover:bg-emerald-100 text-[#002E6E] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition border border-emerald-200"
                >
                  <Plus className="w-3.5 h-3.5 text-[#21C17A]" />
                  <span>Onboard New Business / Store</span>
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
                    Shopper Checkout · Scan → Talk → Pay → Receipt
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

      {/* 2. Interactive Step-by-Step Guide: How to Use FinBuddy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-1">
            HOW IT WORKS · STEP-BY-STEP
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#002E6E] tracking-tight">
            How to Use FinBuddy: Simple, Fast & Queue-Free
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A90] mt-2 max-w-xl mx-auto leading-relaxed">
            Choose your role below to explore the visual step-by-step workflow with simple language, live animations, and seamless synergy.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-[#E0E6ED] shadow-sm inline-flex flex-wrap justify-center gap-1.5 max-w-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveGuideTab('customer')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeGuideTab === 'customer'
                  ? 'bg-[#00BAF2] text-white shadow-md shadow-sky-500/20 scale-102'
                  : 'text-[#4A5568] hover:text-[#002E6E] hover:bg-[#F5F7FA]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>🛍️ As a Customer (Shopper)</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('merchant')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeGuideTab === 'merchant'
                  ? 'bg-[#002E6E] text-white shadow-md shadow-indigo-900/20 scale-102'
                  : 'text-[#4A5568] hover:text-[#002E6E] hover:bg-[#F5F7FA]'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>🏪 As a Merchant (Store Owner)</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('synergy')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeGuideTab === 'synergy'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                  : 'text-[#4A5568] hover:text-[#002E6E] hover:bg-[#F5F7FA]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Live Sync (Synergy)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Customer Journey Workflow */}
        {activeGuideTab === 'customer' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Visual Step-by-Step Diagram Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              {/* Step 1 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#00BAF2] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-sky-100 text-[#00BAF2] font-black text-xs flex items-center justify-center border border-sky-200">
                      01
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-[#00BAF2] border border-sky-100">
                      No App Needed
                    </span>
                  </div>

                  {/* Visual Diagram: Phone QR Scanner */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:border-sky-300 transition">
                    <div className="w-14 h-14 bg-white rounded-lg border border-[#E0E6ED] flex items-center justify-center shadow-xs relative">
                      <QrCode className="w-9 h-9 text-[#002E6E]" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00BAF2] rounded-full flex items-center justify-center text-white">
                        <Smartphone className="w-3 h-3" />
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#002E6E] mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#21C17A] animate-ping" />
                      Scan Store Entry QR
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    1. Scan In-Store QR
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Walk in, open your phone browser, and scan the store QR at the door. FinBuddy loads instantly — zero app download required.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-[#00BAF2]">
                  <span>Instant Browser Access</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#00BAF2] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-sky-100 text-[#00BAF2] font-black text-xs flex items-center justify-center border border-sky-200">
                      02
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                      Scan or Speak
                    </span>
                  </div>

                  {/* Visual Diagram: Barcode with Laser + Hindi Voice Wave */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:border-purple-300 transition">
                    <div className="w-32 h-12 bg-white rounded border border-[#E0E6ED] flex items-center justify-center relative px-2 shadow-xs">
                      {/* Barcode Mock lines */}
                      <div className="flex items-center gap-0.5 h-7">
                        <span className="w-1 h-full bg-[#1C2D42]" />
                        <span className="w-0.5 h-full bg-[#1C2D42]" />
                        <span className="w-1.5 h-full bg-[#1C2D42]" />
                        <span className="w-0.5 h-full bg-[#1C2D42]" />
                        <span className="w-1 h-full bg-[#1C2D42]" />
                        <span className="w-2 h-full bg-[#1C2D42]" />
                        <span className="w-0.5 h-full bg-[#1C2D42]" />
                        <span className="w-1 h-full bg-[#1C2D42]" />
                      </div>
                      {/* Red laser scanning animation line */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 shadow-sm shadow-red-500 animate-paytm-scan" />
                    </div>

                    {/* Hindi voice badge */}
                    <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-full">
                      <Mic className="w-2.5 h-2.5 text-purple-600" />
                      <span className="text-[9px] font-bold text-purple-700">"२ और पेप्सी जोड़ो"</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="w-0.5 bg-purple-500 eq-bar-1" />
                        <span className="w-0.5 bg-purple-500 eq-bar-2" />
                        <span className="w-0.5 bg-purple-500 eq-bar-3" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    2. Scan Shelf Barcode or Speak
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Point your camera at any item to hear a crisp POS beep! Or tap the mic and speak naturally in Hindi or Hinglish.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-purple-600">
                  <span>Hindi Voice NLP Support</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#00BAF2] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-sky-100 text-[#00BAF2] font-black text-xs flex items-center justify-center border border-sky-200">
                      03
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Live Total
                    </span>
                  </div>

                  {/* Visual Diagram: Live Cart Bill & Offers */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-2.5 flex flex-col justify-between relative overflow-hidden group-hover:border-amber-300 transition">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="font-semibold text-[#002E6E]">Maggi Noodles x2</span>
                        <span className="font-bold text-[#1C2D42]">₹28</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="font-semibold text-[#002E6E]">Tata Salt 1kg</span>
                        <span className="font-bold text-[#1C2D42]">₹25</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-[10px]">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        Offer: ₹10 Off
                      </span>
                      <span className="font-extrabold text-[#002E6E]">Total: ₹43</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    3. Review Live Cart & Offers
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Watch your bill calculate taxes and instant savings in real-time. FinBuddy alerts you to valid discounts and matching combos.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-amber-600">
                  <span>Transparent Pricing & Deals</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#21C17A] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#21C17A] font-black text-xs flex items-center justify-center border border-emerald-200">
                      04
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#21C17A] border border-emerald-200">
                      1-Tap Pay
                    </span>
                  </div>

                  {/* Visual Diagram: Paytm UPI + WhatsApp Receipt */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-2.5 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-emerald-300 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2.5 py-1 bg-white rounded-lg border border-[#E0E6ED] flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00BAF2]" />
                        <span className="text-[10px] font-black text-[#002E6E]">Paytm UPI</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">✓ Paid</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span className="text-[9px] font-bold text-emerald-800">Bill Sent on WhatsApp</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    4. Paytm Pay & WhatsApp Bill
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Pay in 1 tap via Paytm UPI or Wallet. A full itemized GST receipt lands on your WhatsApp with an exit pass. Skip the cashier line completely!
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-emerald-600">
                  <span>Zero-Queue Store Exit</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>
            </div>

            {/* Quick Action Banner for Customers */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00BAF2] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#002E6E]">Ready to experience self-checkout?</h4>
                  <p className="text-xs text-[#6B7A90]">Test camera scanning on live products or open the customer grocery lists hub.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to={`/s/${store.id}/checkout`}
                  className="w-full sm:w-auto px-4 py-2 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Start Self-Checkout Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/customer"
                  className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-slate-50 text-[#002E6E] font-semibold text-xs rounded-lg border border-[#E0E6ED] flex items-center justify-center gap-1 transition"
                >
                  <ListPlus className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Customer Hub</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Merchant Journey Workflow */}
        {activeGuideTab === 'merchant' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Visual Step-by-Step Diagram Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              {/* Step 1 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#002E6E] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#002E6E] font-black text-xs flex items-center justify-center border border-indigo-100">
                      01
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-[#002E6E] border border-indigo-100">
                      60-Sec Onboarding
                    </span>
                  </div>

                  {/* Visual Diagram: Store Setup */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-3 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-indigo-200 transition">
                    <div className="w-full bg-white p-2 rounded-lg border border-[#E0E6ED] shadow-xs">
                      <div className="flex items-center gap-2">
                        <StoreIcon className="w-4 h-4 text-[#002E6E]" />
                        <span className="text-xs font-bold text-[#002E6E] truncate">Sharma Kirana Store</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                        <span className="px-1.5 py-0.5 bg-sky-50 text-[#00BAF2] rounded font-semibold">Grocery</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">Hazratganj, Lucknow</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    1. Instant Business Setup
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Enter your shop name, choose your category (Kirana, Pharmacy, Mart), and get an instant custom customer QR code for your store.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-[#002E6E]">
                  <span>Instant Store Go-Live</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#002E6E] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#002E6E] font-black text-xs flex items-center justify-center border border-indigo-100">
                      02
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-[#00BAF2] border border-sky-100">
                      Inventory Control
                    </span>
                  </div>

                  {/* Visual Diagram: Catalog & Price Adjuster */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-2.5 flex flex-col justify-between relative overflow-hidden group-hover:border-sky-200 transition">
                    <div className="bg-white p-2 rounded border border-[#E0E6ED] shadow-xs flex items-center justify-between text-[10px]">
                      <div>
                        <p className="font-bold text-[#002E6E]">Amul Taaza Milk</p>
                        <p className="text-[9px] text-[#6B7A90]">Stock: 14 units</p>
                      </div>
                      <div className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-[#002E6E] font-extrabold rounded">
                        ₹32.00
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] px-2 py-1 bg-white rounded border border-[#E0E6ED]">
                      <span className="text-[#6B7A90]">Safety Stock Threshold</span>
                      <span className="font-bold text-amber-600">Alert at 5 units</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    2. Add Stock & Adjust Prices
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Easily add products with barcode codes, edit selling prices on the fly, and set safety restock thresholds in one click.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-[#00BAF2]">
                  <span>Customizable Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#002E6E] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#002E6E] font-black text-xs flex items-center justify-center border border-indigo-100">
                      03
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#21C17A] border border-emerald-200">
                      Atomic Decrement
                    </span>
                  </div>

                  {/* Visual Diagram: Live Revenue & Atomic Telemetry */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-2.5 flex flex-col justify-between relative overflow-hidden group-hover:border-emerald-200 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#6B7A90]">Today's Sales</span>
                      <span className="flex items-center gap-1 text-[9px] text-[#21C17A] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#21C17A] animate-ping" />
                        Live Feed
                      </span>
                    </div>
                    <div className="text-base font-black text-[#002E6E]">
                      ₹12,480.00
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-[9px] text-emerald-800 font-semibold flex items-center justify-between">
                      <span>Customer scanned: Coca-Cola</span>
                      <span className="font-bold text-red-500">-1 Stock Live</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    3. Live Sales & Stock Sync
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    As shoppers buy in the aisle, stock counts drop immediately and revenue registers on your screen without refreshing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-[#21C17A]">
                  <span>Zero-Lag Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="paytm-card p-5 bg-white relative flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-[#002E6E] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#002E6E] font-black text-xs flex items-center justify-center border border-indigo-100">
                      04
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#002E6E] border border-blue-100">
                      AI Advisor
                    </span>
                  </div>

                  {/* Visual Diagram: AI Copilot Assistant */}
                  <div className="w-full h-28 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-4 p-2.5 flex flex-col justify-center relative overflow-hidden group-hover:border-blue-300 transition">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#002E6E] text-white flex items-center justify-center text-xs">
                        <Bot className="w-3.5 h-3.5 robot-float" />
                      </div>
                      <span className="text-[10px] font-bold text-[#002E6E]">AI Copilot Suggestion</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#E0E6ED] text-[9px] text-[#4A5568] leading-tight">
                      <span className="font-bold text-amber-600">Restock Alert:</span> Lay's Chips running low before Friday evening peak.
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002E6E] mb-1.5">
                    4. AI Copilot Restock & Insights
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    AI analyzes your 7-day sales trends, spots peak hours, summarizes customer feedback, and warns you before key items sell out.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0E6ED]/60 flex items-center text-[11px] font-bold text-[#002E6E]">
                  <span>Plain-Language AI Insights</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>
            </div>

            {/* Quick Action Banner for Merchants */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002E6E] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#002E6E]">Ready to supervise your store operations?</h4>
                  <p className="text-xs text-[#6B7A90]">Access real-time sales telemetry, customize catalog stock, and review AI insights.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to="/merchant/dashboard"
                  className="w-full sm:w-auto px-4 py-2 bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Launch Merchant Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/merchant/login"
                  className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-slate-50 text-[#002E6E] font-semibold text-xs rounded-lg border border-[#E0E6ED] flex items-center justify-center gap-1 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Store Profile Setup</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: End-to-End Synergy Flow Diagram */}
        {activeGuideTab === 'synergy' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Visual Connected System Architecture Diagram */}
            <div className="paytm-card p-6 sm:p-8 bg-white border border-[#E0E6ED] relative overflow-hidden">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 block mb-1">
                  ZERO LATENCY SYNCHRONIZATION
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#002E6E]">
                  How Offline Floor Meets Cloud Intelligence
                </h3>
                <p className="text-xs text-[#6B7A90] mt-1">
                  Every shopper interaction in the aisle instantly updates the store owner's telemetry and inventory.
                </p>
              </div>

              {/* Connected Flow Diagram Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Node 1: Customer Phone */}
                <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E0E6ED] flex flex-col justify-between relative group hover:border-[#00BAF2] transition">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#00BAF2] flex items-center justify-center mb-3 font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00BAF2] block mb-1">
                      Aisle Floor
                    </span>
                    <h4 className="text-sm font-black text-[#002E6E] mb-1.5">
                      1. Customer Scans & Pays
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      Shopper scans barcode via camera, speaks in Hindi for voice quantity updates, and authorizes payment via Paytm sandbox.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-[10px] font-bold text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-ping" />
                    <span>Dispatches transaction payload</span>
                  </div>
                </div>

                {/* Node 2: Real-Time Engine (Center Sync) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 border border-emerald-200 flex flex-col justify-between relative group shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 font-bold">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      FinBuddy Engine
                    </span>
                    <h4 className="text-sm font-black text-[#002E6E] mb-1.5">
                      2. Atomic Sync & WhatsApp Dispatch
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      Zero-latency transaction verification. Atomically reduces product units and triggers WhatsApp API to deliver an itemized digital GST bill.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>Instant WhatsApp tax receipt sent</span>
                  </div>
                </div>

                {/* Node 3: Merchant Dashboard */}
                <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E0E6ED] flex flex-col justify-between relative group hover:border-[#002E6E] transition">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002E6E] flex items-center justify-center mb-3 font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#002E6E] block mb-1">
                      Store Back-Office
                    </span>
                    <h4 className="text-sm font-black text-[#002E6E] mb-1.5">
                      3. Live Telemetry & AI Alerts
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      Dashboard screen increments gross sales, updates inventory count instantly, and alerts the merchant if an item hits the safety threshold.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-[10px] font-bold text-[#002E6E]">
                    <Bot className="w-3 h-3 text-[#00BAF2]" />
                    <span>AI Copilot restock monitor active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Core Platform Features Grid */}
      <section className="bg-white border-t border-b border-[#E0E6ED] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-1">
              ENGINEERED FOR INDIA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#002E6E] tracking-tight">
              Platform Features at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7A90] mt-2 max-w-xl mx-auto leading-relaxed">
              Designed specifically to modernize offline retail with zero setup friction, high-speed camera scanning, and smart AI automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Camera Scanner */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-[#00BAF2] hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">Zero-Install Camera Scanner</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-[#00BAF2]">Fast</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Sub-second barcode recognition right in the mobile browser. Includes audio POS beep verification and torchlight support without installing any app.
              </p>
            </div>

            {/* Feature 2: Hindi/Hinglish Voice */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">Hindi & Hinglish Voice AI</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-700">Voice</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Shoppers can speak naturally in everyday Hindi: <em>"२ और पेप्सी जोड़ो"</em> or ask product prices hands-free. Built with intent classification.
              </p>
            </div>

            {/* Feature 3: Paytm Payment Sandbox */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-[#002E6E] hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002E6E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">Paytm Payment Sandbox</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-[#002E6E]">Paytm</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Realistic 1-tap checkout simulator supporting Paytm UPI, Wallet, Net Banking, and simulated Soundbox audio payment confirmations.
              </p>
            </div>

            {/* Feature 4: WhatsApp Digital Invoices */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#21C17A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">WhatsApp Digital Receipts</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Paperless</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Instant delivery of itemized tax receipts and store exit passes straight to customer WhatsApp. Zero paper waste and verifiable store security.
              </p>
            </div>

            {/* Feature 5: Real-Time Atomic Stock Sync */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">Atomic Stock Decrement</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">Real-Time</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Transactions atomically reduce physical store stock counts in real time. Merchant dashboards update without page reload or sync latency.
              </p>
            </div>

            {/* Feature 6: AI Merchant Copilot */}
            <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-white hover:border-sky-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#002E6E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#002E6E]">AI Merchant Copilot</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-[#002E6E]">AI</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Intelligent 7-day sales commentary, proactive low-stock warnings, catalog price management, and customer review sentiment intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white py-6 text-center text-xs text-[#6B7A90]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002E6E]">FinBuddy</span>
            <span>· CodeBlitz 2.0 (Track: AI & Automation)</span>
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
