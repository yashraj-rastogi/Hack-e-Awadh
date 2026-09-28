import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store as StoreIcon,
  Package,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  QrCode,
  Download,
  AlertCircle,
  FileText,
  Sliders,
  DollarSign,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Store, Product } from '../types';
import {
  createStore,
  getStoreCheckoutUrl,
  getStoreQRImageUrl,
} from '../services/db';
import {
  CATALOG_PRESET_CATEGORIES,
  getPresetForCategory,
  CatalogPresetItem,
} from '../data/catalogPresets';

interface EditableProductItem extends CatalogPresetItem {
  id?: string;
  selected: boolean;
}

export const MerchantOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Step: 1 = Business Profile, 2 = Inventory, 3 = FinBuddy Setup, 4 = QR Standee Ready
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // --- Step 1 State: Store & Proprietor Profile ---
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState<Store['category']>('kirana');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [upiVpa, setUpiVpa] = useState('');
  const [gstin, setGstin] = useState('');

  // --- Step 2 State: Inventory & Catalog ---
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kirana');
  const [catalogItems, setCatalogItems] = useState<EditableProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Add Item Form State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickBarcode, setQuickBarcode] = useState('');
  const [quickCategory, setQuickCategory] = useState<Product['category']>('Snacks');
  const [quickPriceRupees, setQuickPriceRupees] = useState('');
  const [quickStock, setQuickStock] = useState('25');
  const [quickThreshold, setQuickThreshold] = useState('5');

  // CSV Import State
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);

  // --- Step 3 State: FinBuddy & Store Preferences ---
  const [copilotLanguage, setCopilotLanguage] = useState<'hi' | 'hinglish' | 'en'>('hi');
  const [targetRevenueRupees, setTargetRevenueRupees] = useState<number>(15000);
  const [enableWhatsAppAlerts, setEnableWhatsAppAlerts] = useState<boolean>(true);
  const [enableSoundboxNotification, setEnableSoundboxNotification] = useState<boolean>(true);
  const [lowStockWarningThreshold, setLowStockWarningThreshold] = useState<number>(5);

  // --- Step 4 State: Final Created Store & Standee ---
  const [createdStore, setCreatedStore] = useState<Store | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-fill UPI VPA when store name or phone changes
  useEffect(() => {
    if (storeName && !upiVpa) {
      const slug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (slug) setUpiVpa(`${slug}@paytm`);
    }
  }, [storeName, upiVpa]);

  // Load starter items when category or preset selection changes
  useEffect(() => {
    const preset = getPresetForCategory(selectedPresetId);
    setCatalogItems(
      preset.map((p) => ({
        ...p,
        selected: true,
      }))
    );
  }, [selectedPresetId]);

  // Sync preset tab when category in Step 1 is chosen
  const handleCategorySelect = (cat: Store['category']) => {
    setCategory(cat);
    if (cat === 'kirana' || cat === 'grocery') setSelectedPresetId('kirana');
    else if (cat === 'supermarket' || cat === 'fmcg' || cat === 'general-store') setSelectedPresetId('supermarket');
    else if (cat === 'convenience') setSelectedPresetId('convenience');
    else if (cat === 'bakery-cafe') setSelectedPresetId('bakery-cafe');
  };

  // Step 1 Validation
  const canProceedStep1 = storeName.trim().length >= 2 && location.trim().length >= 3 && ownerPhone.trim().length >= 10;

  // Step 2 Item Handlers
  const handleToggleItem = (index: number) => {
    setCatalogItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleUpdatePrice = (index: number, newRupees: string) => {
    const num = parseFloat(newRupees);
    if (isNaN(num) || num < 0) return;
    setCatalogItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, pricePaise: Math.round(num * 100) } : item))
    );
  };

  const handleUpdateStock = (index: number, newStockStr: string) => {
    const num = parseInt(newStockStr);
    if (isNaN(num) || num < 0) return;
    setCatalogItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, stock: num } : item))
    );
  };

  const handleUpdateThreshold = (index: number, newThreshStr: string) => {
    const num = parseInt(newThreshStr);
    if (isNaN(num) || num < 0) return;
    setCatalogItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, lowStockThreshold: num } : item))
    );
  };

  const handleDeleteItem = (index: number) => {
    setCatalogItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuickProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(quickPriceRupees);
    if (!quickName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    const barcode = quickBarcode.trim() || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newItem: EditableProductItem = {
      name: quickName.trim(),
      barcode,
      category: quickCategory,
      pricePaise: Math.round(priceNum * 100),
      stock: parseInt(quickStock) || 20,
      lowStockThreshold: parseInt(quickThreshold) || 5,
      selected: true,
    };

    setCatalogItems((prev) => [newItem, ...prev]);
    setQuickName('');
    setQuickBarcode('');
    setQuickPriceRupees('');
    setShowQuickAdd(false);
  };

  // CSV Bulk Upload Handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    setCsvSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          setCsvError('CSV file is empty or missing headers.');
          return;
        }

        // Expected format: Name, Barcode, Price, Stock, Threshold, Category
        const newProducts: EditableProductItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const [name, barcode, priceStr, stockStr, thresholdStr, catStr] = cols;
            const price = parseFloat(priceStr);
            if (name && !isNaN(price)) {
              newProducts.push({
                name,
                barcode: barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                category: (catStr as Product['category']) || 'Staples',
                pricePaise: Math.round(price * 100),
                stock: parseInt(stockStr) || 25,
                lowStockThreshold: parseInt(thresholdStr) || 5,
                selected: true,
              });
            }
          }
        }

        if (newProducts.length === 0) {
          setCsvError('Could not find valid product rows in CSV.');
          return;
        }

        setCatalogItems((prev) => [...newProducts, ...prev]);
        setCsvSuccess(`Successfully imported ${newProducts.length} items from CSV!`);
      } catch (err) {
        setCsvError('Failed to parse CSV file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Barcode,Price,Stock,Threshold,Category\n' +
      'Aashirvaad Atta 5kg,8901030383847,260,20,5,Staples\n' +
      'Tata Salt 1kg,8901030383854,28,40,10,Staples\n' +
      'Pepsi Can 300ml,8901491101837,40,24,6,Beverages\n' +
      'Maggi 70g,8901058852332,14,35,10,Instant Food\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'finbuddy_sample_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Final Submission Handler: Creates Store, Injects Products, Generates QR Standee
  const handleCompleteOnboarding = () => {
    const selectedProducts: Product[] = catalogItems
      .filter((i) => i.selected)
      .map((item, idx) => ({
        id: `prod_${Date.now()}_${idx + 1}`,
        name: item.name,
        barcode: item.barcode,
        pricePaise: item.pricePaise,
        stock: item.stock,
        lowStockThreshold: item.lowStockThreshold || lowStockWarningThreshold,
        category: item.category,
        isActive: true,
        imageUrl: item.imageUrl,
        description: item.description,
        updatedAt: Date.now(),
      }));

    const newStore = createStore(
      {
        name: storeName.trim(),
        category,
        location: location.trim(),
        ownerName: ownerName.trim() || undefined,
        ownerPhone: ownerPhone.trim() || undefined,
        ownerEmail: ownerEmail.trim() || undefined,
        upiVpa: upiVpa.trim() || undefined,
        gstin: gstin.trim() || undefined,
        targetDailyRevenueRupees: targetRevenueRupees,
        supportedLanguages: [copilotLanguage, 'en'],
      },
      selectedProducts
    );

    setCreatedStore(newStore);
    setCurrentStep(4);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00BAF2', '#002E6E', '#21C17A', '#FFA800'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleCopyCheckoutLink = () => {
    if (!createdStore) return;
    const url = getStoreCheckoutUrl(createdStore.id);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeCatalogCount = catalogItems.filter((i) => i.selected).length;
  const filteredCatalogItems = catalogItems.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.barcode.includes(searchQuery) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col justify-between">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-[#E0E6ED] px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/finbuddy-icon.png"
              alt="FinBuddy"
              className="w-8 h-8 object-contain rounded-lg p-0.5 bg-white border border-[#E0E6ED]"
            />
            <div className="flex items-center gap-1.5 font-black text-lg text-[#002E6E]">
              <span>Fin</span>
              <span className="text-[#00BAF2]">Buddy</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00BAF2] text-white ml-1">
                Merchant Onboarding
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/merchant/login"
              className="text-xs font-semibold text-[#6B7A90] hover:text-[#002E6E] transition hidden sm:inline"
            >
              Sign In Existing Store
            </Link>
            <span className="text-xs text-[#6B7A90]">Need Help? +91 98765-43210</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E0E6ED] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#00BAF2] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 1
                    ? 'bg-[#002E6E] text-white ring-4 ring-sky-100'
                    : 'bg-white border-2 border-[#E0E6ED] text-[#6B7A90]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 text-[#00BAF2]" /> : '1'}
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-[#002E6E]">Store Profile</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 2
                    ? 'bg-[#002E6E] text-white ring-4 ring-sky-100'
                    : 'bg-white border-2 border-[#E0E6ED] text-[#6B7A90]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 text-[#00BAF2]" /> : '2'}
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-[#002E6E]">Inventory Setup</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 3
                    ? 'bg-[#002E6E] text-white ring-4 ring-sky-100'
                    : 'bg-white border-2 border-[#E0E6ED] text-[#6B7A90]'
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4 text-[#00BAF2]" /> : '3'}
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-[#002E6E]">FinBuddy Copilot</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep === 4
                    ? 'bg-[#21C17A] text-white ring-4 ring-emerald-100'
                    : 'bg-white border-2 border-[#E0E6ED] text-[#6B7A90]'
                }`}
              >
                {currentStep === 4 ? <Check className="w-4 h-4" /> : '4'}
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-[#002E6E]">Store QR Standee</span>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: BUSINESS PROFILE ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-[#E0E6ED] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-1">
                Step 1 of 4 · Identity & Location
              </span>
              <h1 className="text-2xl font-black text-[#002E6E]">Register Your Business Store</h1>
              <p className="text-xs text-[#6B7A90] mt-1">
                Tell us about your offline shop, location, and owner contact details to initialize your smart checkout.
              </p>
            </div>

            <div className="space-y-5">
              {/* Store Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                    Store / Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <StoreIcon className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Lucknow Supermarket or Gupta Kirana"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                    Store Business Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => handleCategorySelect(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs font-medium"
                    >
                      <option value="kirana">Kirana & Daily Grocery</option>
                      <option value="supermarket">Supermarket & FMCG Mart</option>
                      <option value="fmcg">Convenience & Fast Moving Goods</option>
                      <option value="general-store">General Departmental Store</option>
                      <option value="bakery-cafe">Bakery, Cafe & Confectionery</option>
                      <option value="other">Other Offline Retail</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Store Location */}
              <div>
                <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                  Store Location / Street Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shop 14, Main Market, Hazratganj, Lucknow, UP"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                  />
                </div>
              </div>

              {/* Owner / Contact Details */}
              <div className="border-t border-[#E0E6ED] pt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A90] block mb-3">
                  Proprietor & Billing Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                      Proprietor / Store Manager Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                      Business Mobile / WhatsApp Phone <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                      Merchant UPI VPA (For Direct Customer Settlements)
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        placeholder="store@paytm"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                      GSTIN (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="09AAACA1234A1Z5"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="mt-8 pt-5 border-t border-[#E0E6ED] flex items-center justify-between">
              <Link
                to="/merchant/login"
                className="text-xs font-semibold text-[#6B7A90] hover:text-[#002E6E] transition"
              >
                Cancel & Return
              </Link>

              <button
                type="button"
                disabled={!canProceedStep1}
                onClick={() => setCurrentStep(2)}
                className={`h-11 px-6 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition ${
                  canProceedStep1
                    ? 'bg-[#00BAF2] hover:bg-[#00a4d6] text-white active:scale-98 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Inventory Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: INVENTORY & CATALOG SETUP ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-[#E0E6ED] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-1">
                  Step 2 of 4 · Product Catalog
                </span>
                <h1 className="text-2xl font-black text-[#002E6E]">Setup Store Inventory</h1>
                <p className="text-xs text-[#6B7A90] mt-1">
                  Choose a starter FMCG pack, add custom barcode items, or upload a CSV file.
                </p>
              </div>

              {/* Starter Summary Pill */}
              <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-2 text-xs font-bold text-[#002E6E]">
                <Package className="w-4 h-4 text-[#00BAF2]" />
                <span>{activeCatalogCount} Items Selected for Launch</span>
              </div>
            </div>

            {/* Catalog Starter Preset Tabs */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[#002E6E] block mb-2">
                1-Click Catalog Starter Packs:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATALOG_PRESET_CATEGORIES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedPresetId === preset.id
                        ? 'border-[#00BAF2] bg-sky-50/50 shadow-xs'
                        : 'border-[#E0E6ED] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#002E6E] block leading-tight">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-[#6B7A90] mt-1 block">
                      {preset.itemCountDescription}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar: Search, Quick Add, CSV Upload */}
            <div className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter catalog by name or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="px-3 py-1.5 rounded-lg bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] border border-[#E0E6ED] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Import CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  title="Download sample CSV template"
                  className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#6B7A90] hover:text-[#002E6E] border border-[#E0E6ED] transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CSV Notification Toasts */}
            {csvSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#21C17A]" />
                <span>{csvSuccess}</span>
              </div>
            )}
            {csvError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>{csvError}</span>
              </div>
            )}

            {/* Quick Add Product Inline Drawer */}
            {showQuickAdd && (
              <form
                onSubmit={handleAddQuickProduct}
                className="mb-5 p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002E6E] flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#00BAF2]" />
                    <span>Quick Add Custom Barcode Item</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="text-xs text-[#6B7A90] hover:text-rose-500"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parle Hide & Seek 120g"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Barcode (EAN-13 or leave blank for auto)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8901030383847"
                      value={quickBarcode}
                      onChange={(e) => setQuickBarcode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Category
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs"
                    >
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Instant Food">Instant Food</option>
                      <option value="Staples">Staples</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Confectionery">Confectionery</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Household">Household</option>
                      <option value="Bakery">Bakery</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      placeholder="e.g. 35.00"
                      value={quickPriceRupees}
                      onChange={(e) => setQuickPriceRupees(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Initial Stock Units
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quickStock}
                      onChange={(e) => setQuickStock(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#002E6E] block mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quickThreshold}
                      onChange={(e) => setQuickThreshold(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0E6ED] rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-8 px-4 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs rounded-lg transition"
                  >
                    Add to Catalog
                  </button>
                </div>
              </form>
            )}

            {/* Editable Catalog Table */}
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden max-h-[380px] overflow-y-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F5F7FA] text-[#002E6E] sticky top-0 z-10 border-b border-[#E0E6ED]">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">Active</th>
                    <th className="py-2.5 px-3 font-bold">Product Name</th>
                    <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Barcode</th>
                    <th className="py-2.5 px-3 font-bold">Price (₹)</th>
                    <th className="py-2.5 px-3 font-bold">Stock</th>
                    <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Min Threshold</th>
                    <th className="py-2.5 px-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E6ED] bg-white">
                  {filteredCatalogItems.map((item, idx) => (
                    <tr
                      key={`${item.barcode}_${idx}`}
                      className={`hover:bg-sky-50/30 transition ${!item.selected ? 'opacity-40 bg-gray-50' : ''}`}
                    >
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleItem(idx)}
                          className="w-4 h-4 rounded text-[#00BAF2] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <span className="font-semibold text-[#1C2D42] block leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#6B7A90]">{item.category}</span>
                      </td>

                      <td className="py-2 px-3 font-mono text-[11px] text-[#6B7A90] hidden sm:table-cell">
                        {item.barcode}
                      </td>

                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <span className="text-[#6B7A90]">₹</span>
                          <input
                            type="number"
                            step="0.5"
                            min="1"
                            value={(item.pricePaise / 100).toFixed(0)}
                            onChange={(e) => handleUpdatePrice(idx, e.target.value)}
                            className="w-16 px-1.5 py-1 bg-white border border-[#E0E6ED] rounded text-xs font-bold text-[#002E6E]"
                          />
                        </div>
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) => handleUpdateStock(idx, e.target.value)}
                          className="w-14 px-1.5 py-1 bg-white border border-[#E0E6ED] rounded text-xs text-center"
                        />
                      </td>

                      <td className="py-2 px-3 hidden sm:table-cell">
                        <input
                          type="number"
                          min="1"
                          value={item.lowStockThreshold}
                          onChange={(e) => handleUpdateThreshold(idx, e.target.value)}
                          className="w-12 px-1.5 py-1 bg-white border border-[#E0E6ED] rounded text-xs text-center"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Step 2 Actions */}
            <div className="mt-8 pt-5 border-t border-[#E0E6ED] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="h-11 px-5 border border-[#E0E6ED] rounded-xl font-bold text-xs text-[#002E6E] hover:bg-[#F5F7FA] flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Profile</span>
              </button>

              <button
                type="button"
                disabled={activeCatalogCount === 0}
                onClick={() => setCurrentStep(3)}
                className={`h-11 px-6 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition ${
                  activeCatalogCount > 0
                    ? 'bg-[#00BAF2] hover:bg-[#00a4d6] text-white active:scale-98 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to FinBuddy Copilot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: FINBUDDY COPILOT CONFIG ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-[#E0E6ED] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#00BAF2] block mb-1">
                Step 3 of 4 · AI & Operational Settings
              </span>
              <h1 className="text-2xl font-black text-[#002E6E]">Configure FinBuddy AI Copilot</h1>
              <p className="text-xs text-[#6B7A90] mt-1">
                Tailor how your in-store assistant communicates, triggers proactive alerts, and assists your staff.
              </p>
            </div>

            <div className="space-y-6">
              {/* Language Preference */}
              <div>
                <label className="text-xs font-bold text-[#002E6E] block mb-2">
                  Merchant Copilot Primary Speech & Text Language
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCopilotLanguage('hi')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      copilotLanguage === 'hi'
                        ? 'border-[#00BAF2] bg-sky-50 text-[#002E6E] font-bold shadow-xs'
                        : 'border-[#E0E6ED] hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm block mb-0.5">🇮🇳 हिंदी (Hindi)</span>
                    <span className="text-[11px] text-[#6B7A90] font-normal">
                      "आज का बिजनेस कैसा रहा?"
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCopilotLanguage('hinglish')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      copilotLanguage === 'hinglish'
                        ? 'border-[#00BAF2] bg-sky-50 text-[#002E6E] font-bold shadow-xs'
                        : 'border-[#E0E6ED] hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm block mb-0.5">Hinglish</span>
                    <span className="text-[11px] text-[#6B7A90] font-normal">
                      "Maggi ka kitna stock bacha hai?"
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCopilotLanguage('en')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      copilotLanguage === 'en'
                        ? 'border-[#00BAF2] bg-sky-50 text-[#002E6E] font-bold shadow-xs'
                        : 'border-[#E0E6ED] hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm block mb-0.5">English</span>
                    <span className="text-[11px] text-[#6B7A90] font-normal">
                      "What were my top sellers today?"
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Daily Revenue Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                    Target Daily Sales Goal (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={targetRevenueRupees}
                      onChange={(e) => setTargetRevenueRupees(parseInt(e.target.value) || 10000)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] font-bold focus:outline-none focus:border-[#00BAF2]"
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7A90] mt-1 block">
                    Copilot calculates daily run rate progress against this goal.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#002E6E] block mb-1.5">
                    Default Low Stock Warning Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockWarningThreshold}
                    onChange={(e) => setLowStockWarningThreshold(parseInt(e.target.value) || 5)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-xl text-xs text-[#1C2D42] font-bold focus:outline-none focus:border-[#00BAF2]"
                  />
                  <span className="text-[10px] text-[#6B7A90] mt-1 block">
                    Triggers instant restocking alerts when units drop below this limit.
                  </span>
                </div>
              </div>

              {/* Automated Proactive Notifications */}
              <div className="border-t border-[#E0E6ED] pt-5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A90] block mb-2">
                  Proactive Telemetry & Voice Soundbox
                </span>

                <label className="p-3.5 rounded-xl border border-[#E0E6ED] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#002E6E] block">
                        Simulated Soundbox Voice Announcements
                      </span>
                      <span className="text-[11px] text-[#6B7A90]">
                        "Paytm par 140 rupaye praapt hue" audio chime on successful customer checkout.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSoundboxNotification}
                    onChange={(e) => setEnableSoundboxNotification(e.target.checked)}
                    className="w-4 h-4 text-[#00BAF2] rounded cursor-pointer"
                  />
                </label>

                <label className="p-3.5 rounded-xl border border-[#E0E6ED] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#21C17A] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#002E6E] block">
                        Real-Time Low Stock & Evening WhatsApp Telemetry
                      </span>
                      <span className="text-[11px] text-[#6B7A90]">
                        Sends prioritized vendor order recommendations when staple items run critically low.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableWhatsAppAlerts}
                    onChange={(e) => setEnableWhatsAppAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#00BAF2] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="mt-8 pt-5 border-t border-[#E0E6ED] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-11 px-5 border border-[#E0E6ED] rounded-xl font-bold text-xs text-[#002E6E] hover:bg-[#F5F7FA] flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="h-11 px-7 bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#00BAF2]" />
                <span>Complete Onboarding & Generate QR Standee</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS & STORE QR STANDEE ================= */}
        {currentStep === 4 && createdStore && (
          <div className="space-y-6">
            {/* Success Celebration Alert */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#21C17A] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-[#002E6E]">
                Congratulations! {createdStore.name} is Live on FinBuddy!
              </h2>
              <p className="text-xs text-[#4A5568] max-w-lg mx-auto mt-1 leading-relaxed">
                Your store inventory is synchronized and your unique checkout link is active. Place this physical QR standee at your payment counter so shoppers can scan and self-checkout.
              </p>
            </div>

            {/* Physical Standee Display Card */}
            <div className="bg-white rounded-3xl border-4 border-[#002E6E] p-6 sm:p-8 max-w-md mx-auto shadow-xl text-center relative overflow-hidden">
              {/* Standee Top Co-branding Strip */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#002E6E]/15">
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

              {/* Store Details */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-[#00BAF2] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 mb-1">
                  <StoreIcon className="w-3 h-3" />
                  <span>Instant Self-Billing Counter</span>
                </span>
                <h3 className="text-2xl font-black text-[#002E6E] tracking-tight">
                  {createdStore.name}
                </h3>
                <p className="text-xs text-[#6B7A90] font-medium mt-0.5">
                  {createdStore.location} {createdStore.upiVpa ? `· UPI: ${createdStore.upiVpa}` : ''}
                </p>
              </div>

              {/* High-definition QR Standee Code */}
              <div className="relative inline-block mx-auto p-4 bg-white rounded-2xl border-2 border-[#00BAF2] shadow-sm mb-4">
                <img
                  src={getStoreQRImageUrl(createdStore.id, 280)}
                  alt={`${createdStore.name} Checkout QR`}
                  className="w-56 h-56 object-contain mx-auto"
                />
                <div className="mt-2 text-xs font-bold text-[#002E6E]">
                  <span>Scan with Phone Camera to Start</span>
                </div>
              </div>

              {/* 3 Step Instruction Guide */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#F5F7FA] rounded-xl border border-[#E0E6ED] text-left mb-4">
                <div className="text-center">
                  <span className="text-[10px] font-black text-[#002E6E] block">1. Scan QR</span>
                  <span className="text-[9px] text-[#6B7A90]">कैमरा से खोलें</span>
                </div>
                <div className="text-center border-x border-[#E0E6ED]">
                  <span className="text-[10px] font-black text-[#002E6E] block">2. Scan Items</span>
                  <span className="text-[9px] text-[#6B7A90]">बारकोड स्कैन करें</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black text-[#002E6E] block">3. UPI Pay</span>
                  <span className="text-[9px] text-[#6B7A90]">डिजिटल रसीद</span>
                </div>
              </div>

              {/* Action Buttons for Standee */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 h-10 px-3 bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Printer className="w-4 h-4 text-[#00BAF2]" />
                  <span>Print Standee</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCheckoutLink}
                  className="h-10 px-3.5 bg-white hover:bg-sky-50 text-[#002E6E] border border-[#E0E6ED] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                  title="Copy direct checkout link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#21C17A]" /> : <Copy className="w-4 h-4 text-[#6B7A90]" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Launch Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getStoreCheckoutUrl(createdStore.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-6 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
              >
                <span>Test Customer Checkout Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => navigate('/merchant/dashboard')}
                className="w-full sm:w-auto h-12 px-7 bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#00BAF2]" />
                <span>Launch Merchant Copilot Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white py-4 text-center text-xs text-[#6B7A90]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FinBuddy · AI-Powered Retail Automation Platform</span>
          <span>End-to-End Encrypted Merchant Onboarding</span>
        </div>
      </footer>
    </div>
  );
};
