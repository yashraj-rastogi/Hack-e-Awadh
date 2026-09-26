import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  CreditCard,
  Sparkles,
  Send,
  RefreshCw,
  ShoppingBag,
  Volume2,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  getStore,
  getProducts,
  getTransactions,
  getFeedback,
  getInsights,
  subscribeToStoreUpdates,
  resetToSeedData,
  updateProductStock,
} from '../services/db';
import { askMerchantCopilot } from '../services/aiService';
import { Product, Transaction, Feedback, Insight, CopilotMessage } from '../types';
import { soundFX } from '../utils/audio';

export const MerchantDashboardPage: React.FC = () => {
  const [store, setStore] = useState(getStore());
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions(undefined, 20));
  const [feedback, setFeedback] = useState<Feedback[]>(getFeedback());
  const [insights, setInsights] = useState<Insight[]>(getInsights());

  const [activeTab, setActiveTab] = useState<'overview' | 'copilot' | 'inventory' | 'feedback'>('overview');
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! Main aapka FinBuddy AI Copilot hoon. Aap mujhse aaj ki sales, inventory status, customer feedback ya promotional combo offers ke baare mein pooch sakte hain.',
      timestamp: Date.now() - 60000,
    },
  ]);

  const [inventorySearch, setInventorySearch] = useState('');
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  // Real-time listener for live sync when checkout completes (Section 25)
  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      setStore(getStore());
      setProducts(getProducts());
      setTransactions(getTransactions(undefined, 20));
      setFeedback(getFeedback());
      setInsights(getInsights());
    });
    return () => unsubscribe();
  }, []);

  // Compute Today's Key Metrics (Section 27)
  const now = new Date();
  const todayTxns = transactions.filter((t) => {
    const d = new Date(t.createdAt);
    return d.toDateString() === now.toDateString();
  });

  const todayRevenuePaise = todayTxns.reduce((sum, t) => sum + t.totalPaise, 0);
  const todayRevenueRupees = (todayRevenuePaise / 100).toLocaleString('en-IN');
  const todayCount = todayTxns.length;
  const avgBillRupees = todayCount > 0 ? (todayRevenuePaise / todayCount / 100).toFixed(0) : '0';
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const lowStockCount = lowStockProducts.length;

  const handleAskCopilot = async (q: string) => {
    if (!q.trim()) return;
    const userMsg: CopilotMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: Date.now(),
    };
    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotQuestion('');
    setCopilotLoading(true);

    try {
      const assistantMsg = await askMerchantCopilot(q, store.id);
      setCopilotMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.warn('Copilot error:', e);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    setIsSpeaking(true);
    soundFX.speakText(text);
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const handleResetData = () => {
    resetToSeedData();
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 2500);
  };

  // Suggested questions in Hindi & English (Section 55)
  const quickCopilotPrompts = [
    'Aaj sales kaisi rahi?',
    'Sabse zyada kya bika?',
    'Stock kahan low hai?',
    'Snack aur drink combo recommendation?',
    'Customer feedback kya bol raha hai?',
    'Should I take a 10 lakh business loan?', // Guardrail test
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col pb-16">
      {/* Sub-header Navigation Bar (Section 10 & 26) */}
      <div className="bg-white border-b border-[#E0E6ED] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#21C17A] animate-pulse" />
            <span className="text-xs font-bold text-[#002E6E] uppercase tracking-wider">
              Real-Time Store Sync Active
            </span>
            <span className="text-xs text-[#6B7A90]">· Updates instantly on checkout</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              title="Reset stock and transaction history to clean seed state"
              className="px-3 py-1.5 rounded-md bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] hover:text-[#00BAF2] text-xs font-semibold flex items-center gap-1.5 border border-[#E0E6ED] transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Reset Demo Data</span>
            </button>

            <a
              href={`/s/${store.id}/checkout`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-md bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Open Customer App</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="max-w-7xl mx-auto flex gap-4 sm:gap-8 pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'overview'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#00BAF2]" />
            <span>Today's Business</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'copilot'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#00BAF2]" />
            <span>Ask FinBuddy (Copilot)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-50 text-[#002E6E] border border-sky-100">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'inventory'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <Package className="w-4 h-4 text-[#00BAF2]" />
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 text-[#FD5C63] border border-rose-100">
                {lowStockCount} Low
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'feedback'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#00BAF2]" />
            <span>Customer Feedback</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Reset Confirmation Toast */}
        {resetSuccessToast && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-[#21C17A] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pristine demo state restored: 15 FMCG items, reset stock, and 25-day historical dataset.</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW (Section 26: 1. Today's Business, 2. AI Attention, 3. Transactions) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 1. Today's Business KPI Cards (Section 27: White surfaces, navy headings, green trend) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="paytm-card p-5">
                <span className="text-xs font-semibold text-[#6B7A90]">Today's Sales</span>
                <p className="text-3xl font-black text-[#002E6E] mt-1">₹{todayRevenueRupees}</p>
                <span className="text-[11px] text-[#21C17A] font-semibold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>↑ 18% vs last 7-day average</span>
                </span>
              </div>

              <div className="paytm-card p-5">
                <span className="text-xs font-semibold text-[#6B7A90]">Total Transactions</span>
                <p className="text-3xl font-black text-[#002E6E] mt-1">{todayCount}</p>
                <span className="text-[11px] text-[#00BAF2] font-semibold mt-1 block">
                  Self-checkout powered
                </span>
              </div>

              <div className="paytm-card p-5">
                <span className="text-xs font-semibold text-[#6B7A90]">Average Bill Value</span>
                <p className="text-3xl font-black text-[#002E6E] mt-1">₹{avgBillRupees}</p>
                <span className="text-[11px] text-[#6B7A90] mt-1 block">Per customer basket</span>
              </div>

              <div className="paytm-card p-5">
                <span className="text-xs font-semibold text-[#6B7A90]">Active Stock Alerts</span>
                <p className="text-3xl font-black text-[#FD5C63] mt-1">{lowStockCount} Items</p>
                <span className="text-[11px] text-[#FD5C63] font-semibold mt-1 block">
                  Maggi Noodles critical (3 left)
                </span>
              </div>
            </div>

            {/* 2. AI Attention / Alerts Section (Section 28 & 31: Dedicated white cards) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#002E6E] uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#FFA800]" />
                  <span>AI Attention & Operational Insights</span>
                </h3>
                <span className="text-xs text-[#6B7A90]">Plain-language operational guidance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.slice(0, 2).map((ins) => (
                  <div key={ins.id} className="paytm-card p-5 relative overflow-hidden bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          ins.type === 'low_stock'
                            ? 'bg-rose-50 text-[#FD5C63] border border-rose-100'
                            : 'bg-amber-50 text-[#FFA800] border border-amber-100'
                        }`}
                      >
                        {ins.type === 'low_stock' ? 'Critical Alert' : 'Growth Opportunity'}
                      </span>
                      <span className="text-[11px] text-[#6B7A90]">
                        {new Date(ins.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#002E6E] mb-1">{ins.title}</h4>
                    <p className="text-xs text-[#4A5568] mb-3 leading-relaxed">{ins.explanation}</p>

                    {/* 3-Part Insight: What could be done? (Section 31) */}
                    <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E0E6ED] text-xs text-[#002E6E] font-medium mb-3">
                      <strong className="text-[#00BAF2]">Recommended Action:</strong> {ins.recommendation}
                    </div>

                    {ins.type === 'sales_trend' && (
                      <button
                        onClick={() => {
                          setActiveTab('copilot');
                          handleAskCopilot('Draft the snack and drink combo offer for evening rush');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#FFA800] hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Create Combo Offer Draft</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recent Real-Time Transactions Feed (Section 34: Clean white table) */}
            <div className="paytm-card p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#002E6E] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#00BAF2]" />
                  <span>Real-Time Sales Activity Feed</span>
                </h3>
                <span className="text-xs text-[#6B7A90]">Live transactions appear instantly</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E0E6ED] text-[#6B7A90] font-semibold">
                      <th className="pb-2.5">Time</th>
                      <th className="pb-2.5">Items Purchased</th>
                      <th className="pb-2.5">Paytm Reference</th>
                      <th className="pb-2.5 text-right">Amount</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E6ED]">
                    {transactions.slice(0, 8).map((txn) => {
                      const timeStr = new Date(txn.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const amountRupees = (txn.totalPaise / 100).toFixed(2);
                      const itemsSummary = txn.items.map((i) => `${i.name} (x${i.quantity})`).join(', ');

                      return (
                        <tr key={txn.id} className="hover:bg-[#F9FBFE] transition">
                          <td className="py-2.5 text-[#6B7A90] whitespace-nowrap">{timeStr}</td>
                          <td className="py-2.5 font-medium text-[#002E6E] max-w-xs truncate" title={itemsSummary}>
                            {itemsSummary}
                          </td>
                          <td className="py-2.5 text-[#6B7A90] font-mono text-[11px]">{txn.paymentReference}</td>
                          <td className="py-2.5 text-right font-black text-[#002E6E]">₹{amountRupees}</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#21C17A] border border-emerald-100">
                              Paid
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI COPILOT (Section 29: Ask Your Business) */}
        {activeTab === 'copilot' && (
          <div className="paytm-card p-6 bg-white flex flex-col h-[700px] shadow-[0_2px_12px_rgba(0,46,110,0.08)]">
            {/* Copilot Header */}
            <div className="border-b border-[#E0E6ED] pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#002E6E] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  🎙
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#002E6E]">FinBuddy Merchant Copilot</h3>
                  <p className="text-xs text-[#6B7A90]">
                    Ask your business partner in Hindi, Hinglish, or English
                  </p>
                </div>
              </div>

              {/* Equalizer animation when speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#00BAF2] text-xs font-semibold">
                  <div className="flex items-center gap-0.5 h-4">
                    <div className="w-0.5 bg-[#00BAF2] eq-bar-1" />
                    <div className="w-0.5 bg-[#00BAF2] eq-bar-2" />
                    <div className="w-0.5 bg-[#002E6E] eq-bar-3" />
                    <div className="w-0.5 bg-[#00BAF2] eq-bar-4" />
                  </div>
                  <span>Speaking...</span>
                </div>
              )}
            </div>

            {/* Suggested Question Chips (Section 55) */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#6B7A90] block mb-2 uppercase tracking-wider">
                Suggested Questions (Tap to ask):
              </span>
              <div className="flex flex-wrap gap-2">
                {quickCopilotPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleAskCopilot(prompt)}
                    disabled={copilotLoading}
                    className="px-3 py-1.5 rounded-md bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] hover:text-[#00BAF2] text-xs font-semibold border border-[#E0E6ED] transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Stream (Section 31: 3-part layout) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {copilotMessages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isAssistant
                          ? 'bg-[#F9FBFE] border border-[#E0E6ED] text-[#1C2D42]'
                          : 'bg-[#00BAF2] text-white font-semibold'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Supporting Metrics Panel */}
                      {msg.metrics && (
                        <div className="mt-3 pt-3 border-t border-[#E0E6ED] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {Object.entries(msg.metrics).map(([k, v]) => (
                            <div key={k} className="bg-white p-2 rounded border border-[#E0E6ED]">
                              <span className="text-[10px] text-[#6B7A90] block truncate">{k}</span>
                              <span className="font-extrabold text-[#002E6E]">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendation Card (Section 32: #FFA800) */}
                      {msg.recommendation && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFA800] block">
                              Growth Recommendation
                            </span>
                            <h5 className="font-bold text-[#002E6E] text-xs">{msg.recommendation.title}</h5>
                            <p className="text-[11px] text-[#4A5568] mt-0.5">{msg.recommendation.details}</p>
                          </div>
                          <button
                            onClick={() => alert(`Executed: ${msg.recommendation?.title}`)}
                            className="px-3 py-1.5 rounded-md bg-[#FFA800] hover:bg-amber-500 text-white text-xs font-bold shrink-0 transition"
                          >
                            Apply Offer
                          </button>
                        </div>
                      )}

                      {/* TTS Speak Button (Section 30) */}
                      {isAssistant && (
                        <div className="mt-2.5 flex justify-end">
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="text-[11px] text-[#6B7A90] hover:text-[#00BAF2] flex items-center gap-1 font-semibold transition"
                            title="Speak answer out loud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen in Hindi/English</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {copilotLoading && (
                <div className="flex items-center gap-2 text-xs text-[#00BAF2] font-semibold animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing store transaction and inventory signals...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCopilot(copilotQuestion);
              }}
              className="flex items-center gap-2 pt-2 border-t border-[#E0E6ED]"
            >
              <input
                type="text"
                placeholder="Ask about sales trends, low stock, or operational recommendations..."
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-[#E0E6ED] rounded-lg text-xs sm:text-sm text-[#1C2D42] placeholder-[#6B7A90] focus:outline-none focus:border-[#00BAF2]"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotQuestion.trim()}
                className="h-11 px-5 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] disabled:opacity-50 text-white font-bold text-xs shadow-sm transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: INVENTORY (Section 33: Operational table) */}
        {activeTab === 'inventory' && (
          <div className="paytm-card p-5 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#002E6E]">Live Store Inventory</h3>
                <p className="text-xs text-[#6B7A90]">
                  Stock decrements automatically when customer checkouts are verified
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E0E6ED] text-[#6B7A90] font-semibold">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Barcode</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3 text-center">Stock</th>
                    <th className="pb-3 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E6ED]">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .map((prod) => {
                      const isLowStock = prod.stock <= prod.lowStockThreshold;
                      const priceRupees = (prod.pricePaise / 100).toFixed(2);

                      return (
                        <tr key={prod.id} className="hover:bg-[#F9FBFE] transition">
                          <td className="py-3 font-semibold text-[#002E6E]">{prod.name}</td>
                          <td className="py-3 text-[#6B7A90] font-mono text-[11px]">{prod.barcode}</td>
                          <td className="py-3 text-[#4A5568]">{prod.category}</td>
                          <td className="py-3 font-bold text-[#002E6E]">₹{priceRupees}</td>
                          <td className="py-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isLowStock
                                  ? 'bg-rose-50 text-[#FD5C63] border border-rose-200 animate-pulse'
                                  : 'bg-emerald-50 text-[#21C17A] border border-emerald-100'
                              }`}
                            >
                              {prod.stock} {isLowStock ? '(LOW)' : 'Healthy'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => updateProductStock(store.id, prod.id, prod.stock - 1)}
                                className="w-7 h-7 rounded bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] flex items-center justify-center transition border border-[#E0E6ED]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => updateProductStock(store.id, prod.id, prod.stock + 10)}
                                className="px-2 py-1 rounded bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-[11px] flex items-center gap-1 transition shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+10</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER FEEDBACK (Section 35) */}
        {activeTab === 'feedback' && (
          <div className="paytm-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#002E6E]">Customer Checkout Feedback</h3>
                <p className="text-xs text-[#6B7A90]">Captured post-receipt from customers</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6B7A90] block">Overall Rating</span>
                <span className="text-xl font-black text-[#002E6E]">4.8 / 5.0 ⭐</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedback.map((fb) => (
                <div key={fb.id} className="p-4 rounded-xl bg-[#F9FBFE] border border-[#E0E6ED]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">
                      {fb.rating === 'great' ? '🙂' : fb.rating === 'okay' ? '😐' : '☹'}
                    </span>
                    <span className="text-[10px] text-[#6B7A90]">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#002E6E] font-medium mb-1">
                    "{fb.text || 'No comment provided'}"
                  </p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      fb.sentiment === 'positive'
                        ? 'text-[#21C17A]'
                        : fb.sentiment === 'neutral'
                        ? 'text-amber-600'
                        : 'text-[#FD5C63]'
                    }`}
                  >
                    {fb.sentiment} Experience
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
