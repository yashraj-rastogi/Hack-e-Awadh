import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Package,
  CreditCard,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  Lightbulb,
  Edit2,
  Trash2,
  BarChart3,
  Sliders,
  Building2,
  X,
  Smartphone,
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
  addProduct,
  updateProductPrice,
  deleteProduct,
  updateStoreDetails,
  getMerchantBankingDetails,
  saveMerchantBankingDetails,
  getPaymentSimulatorConfig,
  savePaymentSimulatorConfig,
} from '../services/db';
import {
  Product,
  Transaction,
  Feedback,
  Insight,
  MerchantBankingDetails,
  PaymentSimulatorConfig,
} from '../types';
import { MerchantVoiceAgent } from '../components/MerchantVoiceAgent';

export const MerchantDashboardPage: React.FC = () => {
  const [store, setStore] = useState(getStore());
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions(undefined, 30));
  const [feedback, setFeedback] = useState<Feedback[]>(getFeedback());
  const [insights, setInsights] = useState<Insight[]>(getInsights());
  const [banking, setBanking] = useState<MerchantBankingDetails>(getMerchantBankingDetails());
  const [simulatorConfig, setSimulatorConfig] = useState<PaymentSimulatorConfig>(getPaymentSimulatorConfig());

  const [activeTab, setActiveTab] = useState<
    'overview' | 'inventory' | 'analytics' | 'feedback' | 'copilot' | 'settings'
  >('overview');

  const [botOpen, setBotOpen] = useState(false);
  const [queuedCopilotQuestion, setQueuedCopilotQuestion] = useState<{ id: number; text: string } | null>(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [resetSuccessToast, setResetSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Snacks');
  const [newProdPriceRupees, setNewProdPriceRupees] = useState('');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdThreshold, setNewProdThreshold] = useState('5');

  // Edit Price Modal State
  const [editingPriceProduct, setEditingPriceProduct] = useState<Product | null>(null);
  const [editPriceRupees, setEditPriceRupees] = useState('');

  // Profile Edit State
  const [storeNameInput, setStoreNameInput] = useState(store.name);
  const [storeLocationInput, setStoreLocationInput] = useState(store.location);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Real-time listener for live sync
  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      setStore(getStore());
      setProducts(getProducts());
      setTransactions(getTransactions(undefined, 30));
      setFeedback(getFeedback());
      setInsights(getInsights());
      setBanking(getMerchantBankingDetails());
      setSimulatorConfig(getPaymentSimulatorConfig());
    });
    return () => unsubscribe();
  }, []);

  // Compute Today's Key Metrics
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

  // Analytics Metrics (7 Days & Category Breakdown)
  const dailyData = [
    { day: 'Mon', revenue: 1420, txns: 18, height: '45%' },
    { day: 'Tue', revenue: 1890, txns: 24, height: '58%' },
    { day: 'Wed', revenue: 2150, txns: 29, height: '68%' },
    { day: 'Thu', revenue: 1980, txns: 26, height: '62%' },
    { day: 'Fri', revenue: 2840, txns: 38, height: '88%' },
    { day: 'Sat', revenue: 3200, txns: 44, height: '100%' },
    { day: 'Sun', revenue: 2450, txns: 32, height: '76%' },
  ];

  const handleAskCopilot = (q: string) => {
    setBotOpen(true);
    setQueuedCopilotQuestion({ id: Date.now(), text: q });
  };

  const selectTab = (
    tab: 'overview' | 'inventory' | 'analytics' | 'feedback' | 'copilot' | 'settings'
  ) => {
    setActiveTab(tab);
    if (tab === 'copilot') setBotOpen(true);
  };

  const handleQueuedQuestionHandled = useCallback(() => setQueuedCopilotQuestion(null), []);
  const handleCopilotOpenTab = useCallback((tab: 'overview' | 'inventory' | 'feedback') => setActiveTab(tab), []);

  const handleResetData = () => {
    resetToSeedData();
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 2500);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProdPriceRupees);
    if (!newProdName.trim() || isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter valid product name and price.');
      return;
    }
    const barcode = newProdBarcode.trim() || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    addProduct(store.id, {
      name: newProdName.trim(),
      barcode,
      category: newProdCategory,
      pricePaise: Math.round(priceNum * 100),
      stock: parseInt(newProdStock) || 20,
      lowStockThreshold: parseInt(newProdThreshold) || 5,
    });
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdBarcode('');
    setNewProdPriceRupees('');
    showToast(`Added ${newProdName} to store inventory!`);
  };

  const handleSavePriceChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceProduct) return;
    const priceNum = parseFloat(editPriceRupees);
    if (isNaN(priceNum) || priceNum <= 0) return;
    updateProductPrice(store.id, editingPriceProduct.id, Math.round(priceNum * 100));
    setEditingPriceProduct(null);
    showToast(`Updated price for ${editingPriceProduct.name} to ₹${priceNum.toFixed(2)}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreDetails(store.id, {
      name: storeNameInput.trim(),
      location: storeLocationInput.trim(),
    });
    showToast('Store profile updated successfully!');
  };

  const handleSaveBanking = (e: React.FormEvent) => {
    e.preventDefault();
    saveMerchantBankingDetails(banking);
    showToast('Banking and settlement credentials saved!');
  };

  const handleSaveSimulator = (mode: PaymentSimulatorConfig['mode']) => {
    const updated = { ...simulatorConfig, mode };
    setSimulatorConfig(updated);
    savePaymentSimulatorConfig(updated);
    showToast(`Payment Simulator Mode set to: ${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col pb-28">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#002E6E] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg animate-bounce flex items-center gap-2 border border-[#00BAF2]">
          <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-header Navigation Bar */}
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
        <div className="max-w-7xl mx-auto flex gap-3 sm:gap-6 pt-1 overflow-x-auto">
          <button
            onClick={() => selectTab('overview')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#00BAF2]" />
            <span>Today's Business</span>
          </button>

          <button
            onClick={() => selectTab('inventory')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <Package className="w-4 h-4 text-[#00BAF2]" />
            <span>Customizable Inventory</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 text-[#FD5C63] border border-rose-100">
                {lowStockCount} Low
              </span>
            )}
          </button>

          <button
            onClick={() => selectTab('analytics')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#00BAF2]" />
            <span>Sales Trends & AI Analytics</span>
          </button>

          <button
            onClick={() => selectTab('feedback')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#00BAF2]" />
            <span>Feedback Summarization</span>
          </button>

          <button
            onClick={() => selectTab('copilot')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
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
            onClick={() => selectTab('settings')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#00BAF2]" />
            <span>Profile & Payment Gateway</span>
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
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
                  {lowStockCount > 0 ? 'Replenishment needed' : 'All stocks healthy'}
                </span>
              </div>
            </div>

            {/* AI Attention & Operational Insights */}
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

                    <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E0E6ED] text-xs text-[#002E6E] font-medium mb-3">
                      <strong className="text-[#00BAF2]">Recommended Action:</strong> {ins.recommendation}
                    </div>

                    {ins.type === 'sales_trend' && (
                      <button
                        onClick={() => handleAskCopilot('Draft the snack and drink combo offer for evening rush')}
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

            {/* Recent Real-Time Transactions Feed */}
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

        {/* TAB 2: CUSTOMIZABLE INVENTORY (Step 2.2) */}
        {activeTab === 'inventory' && (
          <div className="paytm-card p-5 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E6ED] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#002E6E]">Customizable Store Inventory</h3>
                <p className="text-xs text-[#6B7A90]">
                  Manually adjust pricing, manage stock levels, and add new products. AI actively monitors for low-stock triggers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>

                <div className="relative w-48 sm:w-60">
                  <Search className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>
            </div>

            {/* Low Stock Warning Banner */}
            {lowStockCount > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-[#FD5C63]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FD5C63] animate-ping" />
                  <strong>AI Stock Warning:</strong>
                  <span>
                    {lowStockCount} items have fallen below their safety threshold (
                    {lowStockProducts.map((p) => p.name).join(', ')}).
                  </span>
                </div>
                <button
                  onClick={() => handleAskCopilot(`Generate wholesale restocking order for ${lowStockProducts.map((p) => p.name).join(', ')}`)}
                  className="px-2.5 py-1 bg-white hover:bg-rose-100 text-[#FD5C63] font-bold rounded border border-rose-200 text-[11px] transition"
                >
                  Ask Copilot to Restock
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E0E6ED] text-[#6B7A90] font-semibold">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Barcode</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price (₹)</th>
                    <th className="pb-3 text-center">Stock Level</th>
                    <th className="pb-3 text-center">Manage Stock</th>
                    <th className="pb-3 text-right">Actions</th>
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
                          <td className="py-3 text-[#4A5568]">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-[11px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-[#002E6E]">
                            <div className="inline-flex items-center gap-1.5">
                              <span>₹{priceRupees}</span>
                              <button
                                onClick={() => {
                                  setEditingPriceProduct(prod);
                                  setEditPriceRupees(priceRupees);
                                }}
                                className="text-[#00BAF2] hover:text-[#002E6E] p-1 rounded hover:bg-sky-50 transition"
                                title="Adjust Price"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isLowStock
                                  ? 'bg-rose-50 text-[#FD5C63] border border-rose-200 animate-pulse'
                                  : 'bg-emerald-50 text-[#21C17A] border border-emerald-100'
                              }`}
                            >
                              {prod.stock} units {isLowStock ? '(LOW)' : ''}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => updateProductStock(store.id, prod.id, prod.stock - 1)}
                                className="w-7 h-7 rounded bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] flex items-center justify-center transition border border-[#E0E6ED]"
                                title="Decrease by 1"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 font-bold text-center text-[#002E6E]">{prod.stock}</span>
                              <button
                                onClick={() => updateProductStock(store.id, prod.id, prod.stock + 1)}
                                className="w-7 h-7 rounded bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] flex items-center justify-center transition border border-[#E0E6ED]"
                                title="Increase by 1"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => updateProductStock(store.id, prod.id, prod.stock + 10)}
                                className="ml-1 px-2 py-1 rounded bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-[10px] transition shadow-xs"
                                title="Restock +10"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${prod.name} from catalog?`)) {
                                  deleteProduct(store.id, prod.id);
                                  showToast(`Removed ${prod.name}`);
                                }
                              }}
                              className="p-1.5 text-[#6B7A90] hover:text-[#FD5C63] rounded hover:bg-rose-50 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SALES TRENDS (ANALYTICS) (Step 2.2) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* AI Plain-Language Copilot Translation Card */}
            <div className="paytm-card p-5 bg-gradient-to-r from-sky-50 via-white to-amber-50/40 border border-sky-100 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#002E6E] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00BAF2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002E6E]">
                    AI Copilot Graph Interpretation
                  </h3>
                  <p className="text-[11px] text-[#6B7A90]">Translating visual analytics into plain-language business insights</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#E0E6ED] shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#21C17A]">
                    Key Trend #1
                  </span>
                  <p className="text-xs font-bold text-[#002E6E] mt-0.5">
                    "Snack & Biscuit sales are up 20% this week"
                  </p>
                  <p className="text-[11px] text-[#6B7A90] mt-1">
                    Parle-G and Good Day saw strong morning rush pairings with Nescafe.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E0E6ED] shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#00BAF2]">
                    Key Trend #2
                  </span>
                  <p className="text-xs font-bold text-[#002E6E] mt-0.5">
                    "Peak footfall observed between 6:00 PM – 8:30 PM"
                  </p>
                  <p className="text-[11px] text-[#6B7A90] mt-1">
                    Self-checkout camera scans eliminated customer checkout queues during high traffic.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E0E6ED] shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFA800]">
                    Actionable Opportunity
                  </span>
                  <p className="text-xs font-bold text-[#002E6E] mt-0.5">
                    "Evening Combo Bundle Recommendation"
                  </p>
                  <p className="text-[11px] text-[#6B7A90] mt-1">
                    Pair Pepsi 300ml + Kurkure for ₹40 to boost average ticket size by 14%.
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Sales Chart (SVG Bar Chart) */}
            <div className="paytm-card p-5 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#002E6E]">Weekly Revenue & Transaction Trends</h3>
                  <p className="text-xs text-[#6B7A90]">Daily billing velocity over the last 7 days</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#00BAF2]" />
                    <span className="text-[#002E6E]">Revenue (₹)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#002E6E]" />
                    <span className="text-[#002E6E]">Bills Count</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-[#E0E6ED] pb-2">
                {dailyData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#002E6E] opacity-0 group-hover:opacity-100 transition">
                      ₹{d.revenue}
                    </span>
                    <div className="w-full max-w-[48px] bg-sky-50 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-full border border-sky-100">
                      <div
                        style={{ height: d.height }}
                        className="w-full bg-gradient-to-t from-[#002E6E] to-[#00BAF2] rounded-t transition-all duration-500 group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#6B7A90]">{d.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7A90] pt-3">
                <span>Total 7-Day Volume: <strong>₹15,080</strong> (201 Self-Checkout Orders)</span>
                <span className="text-[#21C17A] font-bold">Growth: +22% vs previous period</span>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="paytm-card p-5 bg-white">
                <h4 className="text-xs font-bold text-[#002E6E] uppercase tracking-wider mb-3">
                  Sales by Category
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[#002E6E]">Snacks & Biscuits</span>
                      <span className="text-[#6B7A90]">38% (₹5,730)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00BAF2] rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[#002E6E]">Beverages & Cold Drinks</span>
                      <span className="text-[#6B7A90]">31% (₹4,670)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#002E6E] rounded-full" style={{ width: '31%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[#002E6E]">Instant Food (Maggi/Noodles)</span>
                      <span className="text-[#6B7A90]">19% (₹2,860)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFA800] rounded-full" style={{ width: '19%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[#002E6E]">Dairy & Staples</span>
                      <span className="text-[#6B7A90]">12% (₹1,820)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#21C17A] rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="paytm-card p-5 bg-white">
                <h4 className="text-xs font-bold text-[#002E6E] uppercase tracking-wider mb-3">
                  Hourly Footfall & Checkout Speed
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F5F7FA] flex justify-between items-center">
                    <span className="font-semibold text-[#002E6E]">Morning Peak (8 AM - 11 AM)</span>
                    <span className="text-[#00BAF2] font-bold">Milk & Bread Surge</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F5F7FA] flex justify-between items-center">
                    <span className="font-semibold text-[#002E6E]">Afternoon Lull (1 PM - 4 PM)</span>
                    <span className="text-[#6B7A90]">Restocking Window</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 flex justify-between items-center">
                    <span className="font-bold text-[#002E6E]">Evening Rush (6 PM - 9 PM)</span>
                    <span className="text-[#21C17A] font-bold">Highest Basket Value</span>
                  </div>
                  <div className="pt-2 text-[11px] text-[#6B7A90]">
                    Average customer checkout duration: <strong>14.2 seconds</strong> from first barcode scan to verified Paytm digital receipt.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEEDBACK SUMMARIZATION (Step 2.2) */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Sentiment Aggregation Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="paytm-card p-4 bg-white text-center">
                <span className="text-xs text-[#6B7A90]">Overall Customer Rating</span>
                <p className="text-3xl font-black text-[#002E6E] mt-1">4.8 / 5.0 ⭐</p>
                <span className="text-[11px] text-[#21C17A] font-semibold">Based on 148 checkouts</span>
              </div>

              <div className="paytm-card p-4 bg-white text-center">
                <span className="text-xs text-[#6B7A90]">Positive Sentiment</span>
                <p className="text-3xl font-black text-[#21C17A] mt-1">87%</p>
                <span className="text-[11px] text-[#6B7A90]">Loved queue-less flow</span>
              </div>

              <div className="paytm-card p-4 bg-white text-center">
                <span className="text-xs text-[#6B7A90]">Neutral Sentiment</span>
                <p className="text-3xl font-black text-amber-500 mt-1">10%</p>
                <span className="text-[11px] text-[#6B7A90]">Minor requests</span>
              </div>

              <div className="paytm-card p-4 bg-white text-center">
                <span className="text-xs text-[#6B7A90]">Issue Reports</span>
                <p className="text-3xl font-black text-[#FD5C63] mt-1">3%</p>
                <span className="text-[11px] text-[#6B7A90]">Barcode lighting</span>
              </div>
            </div>

            {/* AI Synthesized Actionable Priority List (Step 2.2 Requirement) */}
            <div className="paytm-card p-5 bg-white border border-[#E0E6ED] space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#002E6E] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00BAF2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002E6E]">
                    AI Actionable Priority List for Merchant
                  </h3>
                  <p className="text-xs text-[#6B7A90]">
                    Aggregated feedback converted into prioritized operational tasks
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FD5C63] text-white mt-0.5">
                    Priority 1
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002E6E]">
                      Restock Maggi Noodles & Haldiram's Bhujia
                    </p>
                    <p className="text-[11px] text-[#4A5568] mt-0.5">
                      4 customer feedback notes and voice queries mentioned looking for instant noodles and snacks that were low or missing on shelves.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAskCopilot('Generate replenishment order for Maggi and Haldirams')}
                    className="px-3 py-1 bg-white hover:bg-rose-50 text-[#FD5C63] border border-rose-200 rounded text-xs font-semibold shrink-0"
                  >
                    Action Order
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFA800] text-white mt-0.5">
                    Priority 2
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002E6E]">
                      Improve Shelf Lighting Near Dairy Chiller
                    </p>
                    <p className="text-[11px] text-[#4A5568] mt-0.5">
                      2 shoppers reported camera barcode glare on cold condensation milk packets.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 mt-1">In Review</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#21C17A] text-white mt-0.5">
                    Priority 3
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002E6E]">
                      Expand Evening Chilled Beverage Stock
                    </p>
                    <p className="text-[11px] text-[#4A5568] mt-0.5">
                      Customers praised cold Pepsi and Thums Up availability after office hours. Consider adding Diet Coke and juices.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#21C17A] mt-1">Completed</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews Feed */}
            <div className="paytm-card p-5 bg-white space-y-3">
              <h3 className="text-xs font-bold text-[#002E6E] uppercase tracking-wider">
                Recent Customer Reviews
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feedback.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-xl bg-[#F9FBFE] border border-[#E0E6ED]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">
                        {fb.rating === 'great' ? '⭐ 5/5' : fb.rating === 'okay' ? '⭐ 3/5' : '⭐ 1/5'}
                      </span>
                      <span className="text-[10px] text-[#6B7A90]">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#002E6E] font-medium mb-1.5">
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
          </div>
        )}

        {/* TAB 5: Ask FinBuddy opens the same floating panel used on every tab */}
        {activeTab === 'copilot' && (
          <div className="paytm-card p-8 sm:p-10 bg-white text-center max-w-lg mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#00BAF2]">Aapka dukaan saathi</p>
            <h3 className="text-2xl font-black text-[#002E6E] mt-1">FinBuddy</h3>
            <p className="text-sm text-[#4A5568] mt-3 leading-relaxed">
              Mic dabakar boliye ya type kijiye — Hindi, English ya Hinglish. FinBuddy har tab par neeche right corner mein rehta hai.
            </p>
            {botOpen ? (
              <p className="mt-4 text-xs font-semibold text-[#00BAF2]">Chat panel is open · bottom right</p>
            ) : (
              <button
                type="button"
                onClick={() => setBotOpen(true)}
                className="mt-5 px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-sm font-bold shadow-sm transition"
              >
                Open FinBuddy
              </button>
            )}
          </div>
        )}

        {/* TAB 6: PROFILE & PAYMENT MANAGEMENT (Step 2.3) */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Store Profile & Credentials */}
            <div className="md:col-span-6 space-y-6">
              <div className="paytm-card p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E0E6ED] pb-3">
                  <Building2 className="w-5 h-5 text-[#00BAF2]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#002E6E]">Store Profile & Business Details</h3>
                    <p className="text-xs text-[#6B7A90]">Configured during merchant onboarding</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                      Registered Store Name
                    </label>
                    <input
                      type="text"
                      value={storeNameInput}
                      onChange={(e) => setStoreNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                      Store Location / Address
                    </label>
                    <input
                      type="text"
                      value={storeLocationInput}
                      onChange={(e) => setStoreLocationInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        disabled
                        value={store.category}
                        className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E0E6ED] rounded-lg text-xs text-[#6B7A90] capitalize"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        Supported Voice NLP
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Hindi, Hinglish, English"
                        className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E0E6ED] rounded-lg text-xs text-[#6B7A90]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-98"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Banking & Settlement Details */}
              <div className="paytm-card p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E0E6ED] pb-3">
                  <CreditCard className="w-5 h-5 text-[#00BAF2]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#002E6E]">Merchant Banking & Payouts</h3>
                    <p className="text-xs text-[#6B7A90]">Direct settlement account for self-checkout earnings</p>
                  </div>
                </div>

                <form onSubmit={handleSaveBanking} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                      Account Beneficiary Name
                    </label>
                    <input
                      type="text"
                      value={banking.accountHolderName}
                      onChange={(e) => setBanking({ ...banking, accountHolderName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={banking.bankName}
                        onChange={(e) => setBanking({ ...banking, bankName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={banking.ifscCode}
                        onChange={(e) => setBanking({ ...banking, ifscCode: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={banking.accountNumber}
                        onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                        Merchant UPI VPA
                      </label>
                      <input
                        type="text"
                        value={banking.upiVpa}
                        onChange={(e) => setBanking({ ...banking, upiVpa: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                      Settlement Schedule
                    </label>
                    <select
                      value={banking.settlementSchedule}
                      onChange={(e) => setBanking({ ...banking, settlementSchedule: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                    >
                      <option value="instant">Instant Real-Time Payout (Paytm Soundbox Speed)</option>
                      <option value="t_plus_1">T+1 Daily Morning Settlement</option>
                      <option value="end_of_day">End-of-Day Batch Payout (11:00 PM)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-98"
                  >
                    Save Banking Credentials
                  </button>
                </form>
              </div>
            </div>

            {/* Sandbox Payment Simulator Configuration (Step 2.3) */}
            <div className="md:col-span-6 space-y-6">
              <div className="paytm-card p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E0E6ED] pb-3">
                  <Smartphone className="w-5 h-5 text-[#00BAF2]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#002E6E]">
                      Sandbox Payment Simulator Configuration
                    </h3>
                    <p className="text-xs text-[#6B7A90]">Manage how transactions are processed and tested</p>
                  </div>
                </div>

                {/* Simulator Mode Switcher */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#002E6E] block">
                    Gateway Simulator Mode:
                  </label>

                  <div
                    onClick={() => handleSaveSimulator('instant_success')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      simulatorConfig.mode === 'instant_success'
                        ? 'bg-emerald-50/50 border-[#21C17A] shadow-xs'
                        : 'bg-white border-[#E0E6ED] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#002E6E]">Instant Verified Success</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#21C17A]">
                          Default
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7A90] mt-0.5">
                        Simulates clean Paytm UPI payment authorization with instant receipt generation.
                      </p>
                    </div>
                    {simulatorConfig.mode === 'instant_success' && (
                      <CheckCircle2 className="w-5 h-5 text-[#21C17A]" />
                    )}
                  </div>

                  <div
                    onClick={() => handleSaveSimulator('otp_challenge')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      simulatorConfig.mode === 'otp_challenge'
                        ? 'bg-sky-50/50 border-[#00BAF2] shadow-xs'
                        : 'bg-white border-[#E0E6ED] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#002E6E]">Bank OTP Authorization Delay</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-[#002E6E]">
                          Realistic
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7A90] mt-0.5">
                        Simulates 3-second bank switch latency before confirming payment.
                      </p>
                    </div>
                    {simulatorConfig.mode === 'otp_challenge' && (
                      <CheckCircle2 className="w-5 h-5 text-[#00BAF2]" />
                    )}
                  </div>

                  <div
                    onClick={() => handleSaveSimulator('simulate_failure')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      simulatorConfig.mode === 'simulate_failure'
                        ? 'bg-rose-50/50 border-[#FD5C63] shadow-xs'
                        : 'bg-white border-[#E0E6ED] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#002E6E]">Simulate Payment Decline (QA Test)</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-[#FD5C63]">
                          Decline QA
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7A90] mt-0.5">
                        Simulates bank server timeout or insufficient funds; ensures cart is preserved.
                      </p>
                    </div>
                    {simulatorConfig.mode === 'simulate_failure' && (
                      <CheckCircle2 className="w-5 h-5 text-[#FD5C63]" />
                    )}
                  </div>
                </div>

                {/* Technical Sandbox Metadata */}
                <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E0E6ED] text-xs space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-[#6B7A90]">Paytm Staging MID:</span>
                    <span className="font-mono font-bold text-[#002E6E]">{simulatorConfig.paytmMid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7A90]">Gateway Environment:</span>
                    <span className="font-bold text-[#21C17A]">Paytm Sandbox (securegw-stage)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7A90]">Twilio WhatsApp Proxy:</span>
                    <span className="font-bold text-[#002E6E]">Active (/api/send-whatsapp)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7A90]">Inventory Decrement Logic:</span>
                    <span className="font-bold text-[#002E6E]">Atomic on Payment Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <MerchantVoiceAgent
        storeId={store.id}
        onOpenTab={handleCopilotOpenTab}
        queuedQuestion={queuedCopilotQuestion}
        onQueuedQuestionHandled={handleQueuedQuestionHandled}
        open={botOpen}
        onOpenChange={setBotOpen}
      />

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E6E]/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E0E6ED] rounded-2xl p-6 shadow-xl relative animate-fade-in">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-[#6B7A90] hover:text-[#002E6E]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#002E6E] mb-1">Add Product to Catalog</h3>
            <p className="text-xs text-[#6B7A90] mb-4">
              Item will be instantly available for customer barcode scanning & voice search.
            </p>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Britannia Bourbon 150g"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Instant Food">Instant Food</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Staples">Staples</option>
                    <option value="Confectionery">Confectionery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="35.00"
                    value={newProdPriceRupees}
                    onChange={(e) => setNewProdPriceRupees(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Barcode (Leave blank to auto-generate EAN-13)
                </label>
                <input
                  type="text"
                  placeholder="8901234567890"
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] font-mono focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Low-Stock Alert Level</label>
                  <input
                    type="number"
                    required
                    value={newProdThreshold}
                    onChange={(e) => setNewProdThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#F5F7FA] text-[#6B7A90] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold shadow-sm"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADJUST PRICING */}
      {editingPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E6E]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-[#E0E6ED] rounded-2xl p-6 shadow-xl relative animate-fade-in">
            <button
              onClick={() => setEditingPriceProduct(null)}
              className="absolute top-4 right-4 text-[#6B7A90] hover:text-[#002E6E]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#002E6E] mb-1">Adjust Pricing</h3>
            <p className="text-xs text-[#6B7A90] mb-4">
              Update unit selling price for <strong>{editingPriceProduct.name}</strong>.
            </p>

            <form onSubmit={handleSavePriceChange} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  New Selling Price (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={editPriceRupees}
                  onChange={(e) => setEditPriceRupees(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-sm font-bold text-[#002E6E] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPriceProduct(null)}
                  className="px-4 py-2 rounded-lg bg-[#F5F7FA] text-[#6B7A90] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold shadow-sm"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
