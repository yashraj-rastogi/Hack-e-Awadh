import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  Mic,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  ArrowRight,
  QrCode,
  Check,
  ListPlus,
  ChevronRight,
  X,
} from 'lucide-react';
import { CameraScanner } from '../components/CameraScanner';
import { ProductPickerModal } from '../components/ProductPickerModal';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { PaymentModal } from '../components/PaymentModal';
import {
  getStore,
  getProducts,
  findProductByBarcode,
  findProductByName,
  getCurrentCustomerUser,
  getCustomerShoppingLists,
  submitCustomerFeedback,
} from '../services/db';
import { CartItem, Product, VoiceIntentResult, CustomerUser, ShoppingList } from '../types';

export const CheckoutPage: React.FC = () => {
  const { storeId = 'store-awadh-01' } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const store = getStore(storeId);
  const products = getProducts(storeId);

  const [customer, setCustomer] = useState<CustomerUser | null>(getCurrentCustomerUser());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [scannerActive] = useState<boolean>(true);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Shopping List Drawer
  const [showListDrawer, setShowListDrawer] = useState<boolean>(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Check for pre-filled cart or shopping lists
  useEffect(() => {
    setCustomer(getCurrentCustomerUser());
    const lists = getCustomerShoppingLists();
    setShoppingLists(lists);

    const prefillRaw = sessionStorage.getItem('finbuddy_prefill_cart');
    if (prefillRaw) {
      try {
        const list = JSON.parse(prefillRaw);
        list.forEach((item: { name: string; productId?: string; quantity?: number }) => {
          const p =
            findProductByName(item.name, storeId) ||
            products.find((x) => x.id === item.productId);
          if (p) {
            addItemToCart(p, item.quantity || 1);
          }
        });
        showToast(`Loaded ${list.length} item(s) from pre-built shopping list!`);
        sessionStorage.removeItem('finbuddy_prefill_cart');
      } catch (e) {
        console.warn('Error reading prefill cart:', e);
      }
    }
  }, [storeId]);

  const handleBarcodeScan = (barcode: string) => {
    const product = findProductByBarcode(barcode, storeId);
    if (product) {
      addItemToCart(product);
      showToast(`Added: ${product.name}`);
    } else {
      showToast(`Unknown barcode (${barcode}). Search manually.`);
    }
  };

  const addItemToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          barcode: product.barcode,
          unitPricePaise: product.pricePaise,
          quantity,
          category: product.category,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleVoiceIntent = (intent: VoiceIntentResult) => {
    if (intent.intent === 'add_item' && intent.productQuery) {
      const prod = findProductByName(intent.productQuery, storeId);
      if (prod) {
        addItemToCart(prod, intent.quantity || 1);
        showToast(`Voice added: ${intent.quantity || 1}x ${prod.name}`);
      } else {
        showToast(`Could not identify "${intent.productQuery}". Please pick from catalog.`);
        setPickerOpen(true);
      }
    } else if (intent.intent === 'remove_item' && intent.productQuery) {
      const prod = findProductByName(intent.productQuery, storeId);
      if (prod) {
        updateQuantity(prod.id, -(intent.quantity || 1));
        showToast(`Voice removed: ${prod.name}`);
      }
    } else if (intent.intent === 'remove_last') {
      if (cartItems.length > 0) {
        const last = cartItems[cartItems.length - 1];
        removeItem(last.productId);
        showToast(`Removed: ${last.name}`);
      }
    } else if (intent.intent === 'clear_cart') {
      setCartItems([]);
      showToast('Cart cleared.');
    } else if (intent.intent === 'start_payment') {
      if (cartItems.length > 0) {
        setPaymentOpen(true);
      } else {
        showToast('Your cart is empty. Scan an item first.');
      }
    } else if (
      (intent.intent === 'check_stock' || intent.intent === 'product_info') &&
      intent.productQuery
    ) {
      const prod = findProductByName(intent.productQuery, storeId);
      if (prod) {
        showToast(
          `Stock Info: ${prod.name} (₹${(prod.pricePaise / 100).toFixed(2)}) · ${prod.stock} units left`
        );
      } else {
        showToast(`Stock query: "${intent.productQuery}" was not found in catalog.`);
      }
    } else if (intent.intent === 'voice_feedback') {
      submitCustomerFeedback(
        storeId,
        'voice_session',
        intent.quantity >= 3 ? 'great' : 'problem',
        intent.reply
      );
      showToast('Real-time voice feedback recorded!');
    }
  };

  const totalPaise = cartItems.reduce((acc, curr) => acc + curr.unitPricePaise * curr.quantity, 0);
  const totalRupees = (totalPaise / 100).toFixed(2);
  const totalItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col pb-28 md:pb-12">
      {/* Checkout Header */}
      <div className="bg-white border-b border-[#E0E6ED] px-4 py-3 sticky top-16 z-30 shadow-[0_1px_3px_rgba(0,46,110,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#00BAF2] uppercase tracking-wider block">
                  Self-Checkout Cashier
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    customer?.isGuest
                      ? 'bg-amber-50 text-amber-700'
                      : customer
                      ? 'bg-emerald-50 text-[#21C17A]'
                      : 'bg-gray-100 text-[#6B7A90]'
                  }`}
                >
                  {customer ? (customer.isGuest ? 'Guest' : customer.name) : 'Guest Mode'}
                </span>
              </div>
              <h1 className="text-sm font-bold text-[#002E6E] truncate">{store.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Shopping List Drawer Button */}
            <button
              onClick={() => setShowListDrawer(!showListDrawer)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-sky-50 text-[#002E6E] text-xs font-semibold border border-[#E0E6ED] transition"
              title="View pre-built shopping list"
            >
              <ListPlus className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="hidden sm:inline">Shopping List</span>
            </button>

            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>

            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] text-xs font-semibold border border-[#E0E6ED] transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-4xl mx-auto px-4 py-6 w-full grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Barcode Scanner & Voice Prompt */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#002E6E] uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Barcode Scanner</span>
            </span>
            <a
              href="/test_barcodes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-[#00BAF2] hover:underline flex items-center gap-1"
            >
              <span>Barcodes Sheet</span>
              <QrCode className="w-3 h-3" />
            </a>
          </div>

          {/* Active Camera Viewport */}
          <CameraScanner onScan={handleBarcodeScan} active={scannerActive} />

          {/* Voice Prompt Action Card */}
          <div
            onClick={() => setVoiceOpen(true)}
            className="p-3.5 rounded-xl bg-white border border-[#E0E6ED] hover:border-[#00BAF2] flex items-center justify-between cursor-pointer transition shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-50 text-[#00BAF2] flex items-center justify-center group-hover:bg-[#00BAF2] group-hover:text-white transition">
                <Mic className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#002E6E]">Voice Assistant (Hindi / Hinglish / English)</p>
                <p className="text-[11px] text-[#6B7A90]">Say: "Do aur Pepsi add kar do" or ask stock</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#00BAF2] group-hover:translate-x-0.5 transition flex items-center gap-1">
              <span>Speak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Column: Cart Experience */}
        <div className="md:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#002E6E] uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Current Cart ({totalItemCount})</span>
            </span>
            {cartItems.length > 0 && (
              <button
                onClick={() => setCartItems([])}
                className="text-[11px] font-semibold text-[#FD5C63] hover:underline transition"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Card */}
          <div className="flex-1 bg-white border border-[#E0E6ED] rounded-xl p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,46,110,0.06)] min-h-[340px]">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#6B7A90]">
                <div className="w-12 h-12 rounded-full bg-[#F5F7FA] border border-[#E0E6ED] flex items-center justify-center text-[#002E6E] mb-3">
                  <ShoppingCart className="w-6 h-6 opacity-60" />
                </div>
                <h4 className="text-sm font-bold text-[#002E6E] mb-1">Your cart is empty</h4>
                <p className="text-xs text-[#6B7A90] max-w-xs mb-4">
                  Scan a product barcode or tap search below to add items.
                </p>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-sky-50 text-[#00BAF2] border border-[#00BAF2] text-xs font-semibold transition"
                >
                  Search Store Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                {cartItems.map((item) => {
                  const lineTotal = ((item.unitPricePaise * item.quantity) / 100).toFixed(2);
                  const unitPrice = (item.unitPricePaise / 100).toFixed(2);

                  return (
                    <div
                      key={item.productId}
                      className="bg-[#F9FBFE] border border-[#E0E6ED] rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#002E6E] truncate">{item.name}</h4>
                        <p className="text-[11px] text-[#6B7A90]">
                          ₹{unitPrice} each · {item.category}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-[#E0E6ED] rounded-md p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-6 h-6 rounded bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] flex items-center justify-center transition active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#002E6E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-6 h-6 rounded bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] flex items-center justify-center transition active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total & Remove */}
                      <div className="text-right min-w-[60px]">
                        <p className="text-sm font-extrabold text-[#002E6E]">₹{lineTotal}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-[10px] text-[#6B7A90] hover:text-[#FD5C63] transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cart Bottom Summary & Payment Action */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E0E6ED]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-[#6B7A90] block">Total Amount</span>
                    <p className="text-3xl font-black text-[#002E6E]">₹{totalRupees}</p>
                  </div>

                  <button
                    onClick={() => setPaymentOpen(true)}
                    className="h-12 px-6 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-lg shadow-[0_2px_8px_rgba(0,186,242,0.3)] flex items-center gap-2 transition active:scale-[0.98]"
                  >
                    <span>Generate Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar on Mobile when items exist */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E6ED] p-4 shadow-[0_-2px_10px_rgba(0,46,110,0.08)]">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div>
              <span className="text-[11px] text-[#6B7A90]">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
              <p className="text-2xl font-black text-[#002E6E]">₹{totalRupees}</p>
            </div>
            <button
              onClick={() => setPaymentOpen(true)}
              className="h-11 px-6 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-1.5 active:scale-95 transition"
            >
              <span>Pay Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Shopping List Drawer Modal */}
      {showListDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E6E]/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#E0E6ED] rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setShowListDrawer(false)}
              className="absolute top-4 right-4 text-[#6B7A90] hover:text-[#002E6E]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <ListPlus className="w-5 h-5 text-[#00BAF2]" />
              <h3 className="text-sm font-bold text-[#002E6E]">Your Pre-Built Shopping List</h3>
            </div>

            {shoppingLists.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-[#6B7A90]">
                  Items from <strong>{shoppingLists[0].title}</strong>. Tap any item to add directly to your current cart!
                </p>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {shoppingLists[0].items.map((item) => {
                    const inCart = cartItems.some((c) => c.name.toLowerCase() === item.name.toLowerCase());
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-[#F5F7FA] border border-[#E0E6ED] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#002E6E]">{item.name}</p>
                          <p className="text-[11px] text-[#6B7A90]">Quantity: {item.quantity}</p>
                        </div>
                        {inCart ? (
                          <span className="text-[10px] font-bold text-[#21C17A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>In Cart</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const p = findProductByName(item.name, storeId);
                              if (p) {
                                addItemToCart(p, item.quantity);
                                showToast(`Added ${item.name} to cart`);
                              }
                            }}
                            className="px-2.5 py-1 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold rounded text-[11px] transition shadow-xs"
                          >
                            + Add to Cart
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#6B7A90] py-4 text-center">No shopping lists created yet.</p>
            )}

            <div className="mt-4 pt-3 border-t border-[#E0E6ED] flex justify-between items-center">
              <Link
                to="/customer?tab=lists"
                className="text-xs text-[#00BAF2] font-bold hover:underline flex items-center gap-1"
              >
                <span>Manage Lists in Customer Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setShowListDrawer(false)}
                className="px-3 py-1.5 bg-[#F5F7FA] text-[#002E6E] rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#002E6E] text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#21C17A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ProductPickerModal
        products={products}
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectProduct={(prod) => {
          addItemToCart(prod);
          showToast(`Added: ${prod.name}`);
        }}
      />

      <VoiceAssistantModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onExecuteIntent={handleVoiceIntent}
        storeId={storeId}
      />

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        cartItems={cartItems}
        storeId={storeId}
        customerPhone={customer?.phone}
        onPaymentSuccess={(receiptId) => {
          navigate(`/s/${storeId}/receipt/${receiptId}`);
        }}
      />
    </div>
  );
};
