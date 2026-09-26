import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Mic,
  Volume2,
  ShieldCheck,
  Smartphone,
  Store,
  ShoppingBag,
  LayoutDashboard,
  QrCode,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Zap,
  Check,
  ChevronRight,
} from 'lucide-react';
import { getStore } from '../services/db';

export const HomePage: React.FC = () => {
  const store = getStore();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col justify-between">
      {/* 1. Hero Section */}
      <section className="bg-white border-b border-[#E0E6ED] relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BAF2]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#002E6E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14 relative z-10 text-center">
          {/* Official FinBuddy Logo */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center px-6 py-2.5 bg-white rounded-2xl border border-[#E0E6ED] shadow-xs">
              <img
                src="/finbuddy-logo.png"
                alt="FinBuddy Logo"
                className="h-11 sm:h-14 object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Hackathon Track Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F7FA] border border-[#E0E6ED] text-xs font-semibold text-[#002E6E] mb-6 shadow-xs">
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
            FinBuddy brings queue-less shopping to neighborhood Indian stores. Customers scan barcodes
            using their phone camera and talk in Hindi, while merchants unlock real-time inventory
            telemetry and AI-powered business growth.
          </p>

          {/* Primary Action Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-10">
            <Link
              to={`/s/${store.id}/checkout`}
              className="w-full sm:w-auto px-6 h-12 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-lg shadow-[0_4px_16px_rgba(0,186,242,0.35)] flex items-center justify-center gap-2 transition transform active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Try Customer Self-Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/merchant/dashboard"
              className="w-full sm:w-auto px-6 h-12 bg-white hover:bg-sky-50 text-[#002E6E] hover:text-[#00BAF2] border border-[#00BAF2] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00BAF2]" />
              <span>Open Merchant Hub</span>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-[#6B7A90]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] border border-[#E0E6ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A]" />
              0-Latency Camera Barcode Scanner
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] border border-[#E0E6ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A]" />
              Hindi Devanagari Voice NLP
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] border border-[#E0E6ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A]" />
              Google TTS Hindi 2 (Men Voice)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] border border-[#E0E6ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A]" />
              Twilio WhatsApp Digital Receipts
            </span>
          </div>
        </div>
      </section>

      {/* 2. Choose Your Path: Role-Based Navigator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#00BAF2] block mb-1">
            Tailored Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002E6E]">
            How Would You Like to Use FinBuddy?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A90] mt-1 max-w-lg mx-auto">
            Select your role below for a tailored walkthrough of the platform features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pathway A: Customer / Shopper */}
          <div className="paytm-card p-6 bg-white flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,46,110,0.12)] transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00BAF2] block mb-1">
                For Shoppers & Customers
              </span>
              <h3 className="text-lg font-bold text-[#002E6E] mb-2">
                Skip the Queue, Scan & Walk Out
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed mb-4">
                Shop friction-free without waiting for a cashier. Scan items with your phone camera,
                speak in Hindi to modify your cart, and pay via Paytm.
              </p>

              {/* 4-Step Checklist */}
              <div className="space-y-2 border-t border-[#E0E6ED] pt-3 mb-5">
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Scan store standee QR or visit direct link</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Align camera over product barcodes for 0ms beep</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Speak: <em>"२ और पेप्सी जोड़ो"</em> or <em>"मैगी हटाओ"</em></span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Pay via Paytm and receive digital bill on WhatsApp</span>
                </div>
              </div>
            </div>

            <Link
              to={`/s/${store.id}/checkout`}
              className="w-full h-11 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Launch Customer Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pathway B: Merchant / Store Owner */}
          <div className="paytm-card p-6 bg-white flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,46,110,0.12)] transition group border-t-4 border-t-[#002E6E]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002E6E] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#002E6E] block mb-1">
                For Kirana Merchants
              </span>
              <h3 className="text-lg font-bold text-[#002E6E] mb-2">
                Real-Time Telemetry & AI Growth Copilot
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed mb-4">
                Empower small retail owners with enterprise-grade intelligence. Live sales updates,
                automatic inventory decrements, and an AI Copilot in Hindi.
              </p>

              {/* 4-Step Checklist */}
              <div className="space-y-2 border-t border-[#E0E6ED] pt-3 mb-5">
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Monitor live customer checkouts as they happen</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Receive instant critical low-stock alerts</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Ask Copilot: <em>"Aaj sales kaisi rahi?"</em></span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <Check className="w-3.5 h-3.5 text-[#21C17A] shrink-0 mt-0.5" />
                  <span>Listen to answers in Google TTS Hindi 2 (Men voice)</span>
                </div>
              </div>
            </div>

            <Link
              to="/merchant/dashboard"
              className="w-full h-11 rounded-lg bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Enter Merchant Copilot</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pathway C: Hackathon Evaluator / Judge */}
          <div className="paytm-card p-6 bg-white flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,46,110,0.12)] transition group border-t-4 border-t-[#FFA800]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6 text-[#FFA800]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                For Hackathon Evaluators
              </span>
              <h3 className="text-lg font-bold text-[#002E6E] mb-2">
                2-Minute Feature Verification Guide
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed mb-4">
                Step-by-step instructions to systematically test and verify every module of the
                Paytm PS-02 submission.
              </p>

              {/* 4-Step Checklist */}
              <div className="space-y-2 border-t border-[#E0E6ED] pt-3 mb-5">
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Open test barcodes sheet on a secondary screen</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Point camera at Pepsi barcode to test 0ms scan</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Speak: <em>"२ और पेप्सी ऐड कर दो"</em> to hear Hindi 2 Men voice</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#4A5568]">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Complete checkout & see stock drop live in Merchant Hub</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="/test_barcodes.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-lg bg-[#FFA800] hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Open Test Barcodes Sheet</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <Link
                to={`/s/${store.id}`}
                className="w-full h-9 rounded-lg bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] font-semibold text-xs flex items-center justify-center gap-1 transition border border-[#E0E6ED]"
              >
                <span>View Store Standee QR</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Platform Capabilities Grid */}
      <section className="bg-white border-y border-[#E0E6ED] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-[#00BAF2] block mb-1">
              Technology Stack & Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002E6E]">
              What Powers FinBuddy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7A90] mt-1 max-w-lg mx-auto">
              Built from the ground up for low-bandwidth Indian environments and neighborhood kirana reality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-3">
                <Scan className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                0-Latency Camera Barcode Scanner
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Powered by ZXing video stream analysis with Paytm-cyan laser guide, high-contrast corner markers,
                and an audible POS scanner chime. Zero hardware cost.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-3">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                Devanagari Hindi Voice Parser
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Dual-script NLP engine processes Hindi speech (<em>"दो और पेप्सी ऐड कर दो"</em>, <em>"मैगी हटाओ"</em>)
                and Hinglish, extracting item names and quantities flawlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                Google TTS Hindi 2 (Men Voice)
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Acoustically tuned masculine timbre (pitch 0.82) confirms cart changes and reads out
                Merchant Copilot business reports with natural cadence.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-[#21C17A]" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                Paytm Staging Payment Gateway
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Seamless test checkout with real MID integration, deterministic state machine, UPI/Card/Wallet
                simulations, and genuine reference generation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#21C17A] flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                Twilio WhatsApp Digital Receipts
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Zero paper waste. Sends rich, itemized digital receipts with digital bill URLs directly
                to shoppers' WhatsApp phones via server-side proxy.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 rounded-xl border border-[#E0E6ED] bg-[#F5F7FA] hover:bg-white hover:border-[#00BAF2] transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#002E6E] flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#002E6E] mb-1.5">
                Live Inventory Decrement & Sync
              </h3>
              <p className="text-xs text-[#6B7A90] leading-relaxed">
                Cross-tab synchronization ensures that customer purchases instantly decrement stock
                and reflect immediately on the merchant's real-time dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: Traditional vs FinBuddy */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#00BAF2] block mb-1">
            Impact & Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002E6E]">
            Traditional Kirana vs. FinBuddy
          </h2>
        </div>

        <div className="paytm-card p-4 sm:p-6 bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E0E6ED] text-[#6B7A90] uppercase font-bold">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3 text-rose-600">Traditional Kirana</th>
                <th className="py-2.5 px-3 text-[#21C17A]">FinBuddy AI Checkout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E6ED] text-[#1C2D42]">
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Checkout Wait Time</td>
                <td className="py-3 px-3 text-[#6B7A90]">3–8 minutes in queue</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">30 seconds (Scan & Go)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Hardware Cost</td>
                <td className="py-3 px-3 text-[#6B7A90]">₹15,000+ for POS terminal & scanners</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">₹0 (Uses customer's phone)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Stock Awareness</td>
                <td className="py-3 px-3 text-[#6B7A90]">Manual counting after stockouts</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">Real-time live decrements & alerts</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Voice Interaction</td>
                <td className="py-3 px-3 text-[#6B7A90]">None</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">Hindi Devanagari Voice NLP</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Bill Receipts</td>
                <td className="py-3 px-3 text-[#6B7A90]">Thermal paper slips (lost easily)</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">Delivered to WhatsApp digitally</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#002E6E]">Business Intelligence</td>
                <td className="py-3 px-3 text-[#6B7A90]">Intuition & gut feeling</td>
                <td className="py-3 px-3 font-bold text-[#21C17A]">AI Copilot with combo offer generation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Bottom Call to Action Banner */}
      <section className="bg-[#002E6E] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Ready to Experience the Demo?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-lg">
              Launch the customer checkout flow or view real-time merchant metrics for Awadh Mart.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to={`/s/${store.id}/checkout`}
              className="px-6 h-11 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <Scan className="w-4 h-4" />
              <span>Start Customer Flow</span>
            </Link>

            <Link
              to="/merchant/dashboard"
              className="px-6 h-11 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00BAF2]" />
              <span>Merchant Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white py-6 text-center text-xs text-[#6B7A90]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/finbuddy-icon.png"
              alt="FinBuddy"
              className="w-6 h-6 object-contain rounded-md"
            />
            <span className="font-bold text-[#002E6E]">FinBuddy</span>
            <span>· Hack-e-Awadh 2026 (PS-02)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to={`/s/${store.id}/checkout`} className="hover:text-[#00BAF2] transition">
              Customer App
            </Link>
            <Link to="/merchant/dashboard" className="hover:text-[#00BAF2] transition">
              Merchant Hub
            </Link>
            <Link to={`/s/${store.id}`} className="hover:text-[#00BAF2] transition">
              Store Standee
            </Link>
            <a
              href="/test_barcodes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00BAF2] transition"
            >
              Barcode Sheet
            </a>
          </div>

          <p className="text-[11px] text-[#6B7A90]">Built for Indian Retail Growth · Team Byte-Bandits</p>
        </div>
      </footer>
    </div>
  );
};
