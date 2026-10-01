import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  ListPlus,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Sparkles,
  QrCode,
  Check,
  Receipt as ReceiptIcon,
  LogOut,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import {
  getCurrentCustomerUser,
  loginOrRegisterCustomer,
  startGuestCustomer,
  logoutCustomer,
  getCustomerShoppingLists,
  createShoppingList,
  saveShoppingList,
  deleteShoppingList,
  getCustomerReceipts,
  getProducts,
  getStore,
} from '../services/db';
import { CustomerUser, ShoppingList, ShoppingListItem, Product, Receipt } from '../types';

export const CustomerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = getStore();
  const catalogProducts = getProducts();

  const [customer, setCustomer] = useState<CustomerUser | null>(getCurrentCustomerUser());
  const [activeTab, setActiveTab] = useState<'lists' | 'orders' | 'profile'>('lists');

  // Login / Register Form State
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [addressInput, setAddressInput] = useState('Hazratganj, Lucknow');

  // Shopping Lists State
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('');

  // Orders State
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const user = getCurrentCustomerUser();
    setCustomer(user);

    // Hydrate form fields from existing customer data
    if (user && !user.isGuest) {
      if (user.name) setNameInput(user.name);
      if (user.phone) setPhoneInput(user.phone);
      if (user.email) setEmailInput(user.email);
      if (user.address) setAddressInput(user.address);
    }

    const initialTab = searchParams.get('tab');
    if (initialTab === 'orders' || initialTab === 'lists' || initialTab === 'profile') {
      setActiveTab(initialTab);
    }

    if (user) {
      const lists = getCustomerShoppingLists(user.id);
      setShoppingLists(lists);
      if (lists.length > 0) setSelectedListId(lists[0].id);
      setReceipts(getCustomerReceipts(user.phone || user.id));
    } else {
      const defaultLists = getCustomerShoppingLists();
      setShoppingLists(defaultLists);
      if (defaultLists.length > 0) setSelectedListId(defaultLists[0].id);
      setReceipts(getCustomerReceipts());
    }
  }, [searchParams]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || !nameInput.trim()) return;
    const user = loginOrRegisterCustomer(nameInput, phoneInput, emailInput, addressInput);
    setCustomer(user);
    const lists = getCustomerShoppingLists(user.id);
    setShoppingLists(lists);
    if (lists.length > 0) setSelectedListId(lists[0].id);
    setReceipts(getCustomerReceipts(user.phone));
    showToast(`Welcome, ${user.name}!`);
  };

  const handleStartGuest = () => {
    const guest = startGuestCustomer();
    setCustomer(guest);
    showToast('Browsing in Guest Mode (Zero app install required)');
  };

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    showToast('Signed out from profile');
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const customerId = customer ? customer.id : 'demo_customer';
    const newList = createShoppingList(customerId, newListName.trim(), []);
    setShoppingLists(getCustomerShoppingLists(customerId));
    setSelectedListId(newList.id);
    setNewListName('');
    showToast(`Created list: ${newList.title}`);
  };

  const handleDeleteList = (id: string) => {
    deleteShoppingList(id);
    const customerId = customer ? customer.id : 'demo_customer';
    const updated = getCustomerShoppingLists(customerId);
    setShoppingLists(updated);
    if (selectedListId === id && updated.length > 0) {
      setSelectedListId(updated[0].id);
    }
    showToast('Shopping list deleted');
  };

  const selectedList = shoppingLists.find((l) => l.id === selectedListId) || shoppingLists[0];

  const handleToggleItem = (itemId: string) => {
    if (!selectedList) return;
    const updatedItems = selectedList.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedList = { ...selectedList, items: updatedItems };
    saveShoppingList(updatedList);
    const customerId = customer ? customer.id : 'demo_customer';
    setShoppingLists(getCustomerShoppingLists(customerId));
  };

  const handleAddItemToList = (product: Product) => {
    if (!selectedList) return;
    const existing = selectedList.items.find((i) => i.productId === product.id);
    let updatedItems: ShoppingListItem[];
    if (existing) {
      updatedItems = selectedList.items.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [
        ...selectedList.items,
        {
          id: `item_${Date.now()}`,
          name: product.name,
          quantity: 1,
          completed: false,
          estimatedPaise: product.pricePaise,
          productId: product.id,
        },
      ];
    }
    const updatedList = { ...selectedList, items: updatedItems };
    saveShoppingList(updatedList);
    const customerId = customer ? customer.id : 'demo_customer';
    setShoppingLists(getCustomerShoppingLists(customerId));
    showToast(`Added ${product.name} to ${selectedList.title}`);
  };

  const handleRemoveItemFromList = (itemId: string) => {
    if (!selectedList) return;
    const updatedItems = selectedList.items.filter((i) => i.id !== itemId);
    const updatedList = { ...selectedList, items: updatedItems };
    saveShoppingList(updatedList);
    const customerId = customer ? customer.id : 'demo_customer';
    setShoppingLists(getCustomerShoppingLists(customerId));
  };

  const handleTransferListToCart = () => {
    if (!selectedList || selectedList.items.length === 0) {
      showToast('Your shopping list is empty.');
      return;
    }
    // Encode items into localStorage for checkout consumption
    const prefillItems = selectedList.items.map((item) => ({
      productId: item.productId || 'custom',
      name: item.name,
      quantity: item.quantity,
    }));
    sessionStorage.setItem('finbuddy_prefill_cart', JSON.stringify(prefillItems));
    navigate(`/s/${store.id}/checkout?prefilled=true`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#002E6E] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg animate-toast flex items-center gap-2 border border-[#00BAF2]">
          <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-header Navigation */}
      <div className="bg-white border-b border-[#E0E6ED] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-[#00BAF2] flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#002E6E]">
                  {customer ? customer.name : 'Customer Hub'}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                    customer?.isGuest
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : customer
                      ? 'bg-emerald-50 text-[#21C17A] border border-emerald-100'
                      : 'bg-gray-100 text-[#6B7A90]'
                  }`}
                >
                  {customer?.isGuest ? 'Guest User' : customer ? 'Registered Profile' : 'Not Signed In'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7A90]">
                {customer?.phone ? `+91 ${customer.phone}` : 'Paytm Consumer Self-Checkout Portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/s/${store.id}/checkout`}
              className="px-3.5 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Launch Store Cashier</span>
            </Link>

            {customer && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-rose-50 text-[#6B7A90] hover:text-[#FD5C63] text-xs font-semibold flex items-center gap-1 border border-[#E0E6ED] transition"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="max-w-6xl mx-auto flex gap-3 sm:gap-6 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('lists')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition ${
              activeTab === 'lists'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <ListPlus className="w-4 h-4 text-[#00BAF2] shrink-0" />
            <span className="hidden sm:inline">Pre-Build Shopping Lists</span>
            <span className="sm:hidden">Shopping Lists</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-50 text-[#002E6E]">
              {shoppingLists.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition ${
              activeTab === 'orders'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#00BAF2] shrink-0" />
            <span className="hidden sm:inline">Past Orders & Receipts</span>
            <span className="sm:hidden">Orders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-50 text-[#002E6E]">
              {receipts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition ${
              activeTab === 'profile'
                ? 'border-[#00BAF2] text-[#002E6E]'
                : 'border-transparent text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            <User className="w-4 h-4 text-[#00BAF2] shrink-0" />
            <span className="hidden sm:inline">Profile & Zero-Barrier Mode</span>
            <span className="sm:hidden">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Onboarding Callout if Guest / Not Logged In */}
        {!customer && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-white border border-[#00BAF2]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002E6E] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#00BAF2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002E6E]">
                  Direct Platform Entry · 2 Flexible Options
                </h3>
                <p className="text-xs text-[#6B7A90] mt-0.5">
                  Create a profile to sync shopping lists & WhatsApp digital receipts, or browse instantly as a Guest.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-3.5 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold transition shadow-xs"
              >
                Create Account
              </button>
              <button
                onClick={handleStartGuest}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] border border-[#E0E6ED] text-xs font-bold transition"
              >
                Proceed as Guest
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: SHOPPING LISTS */}
        {activeTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Lists Selector & Create */}
            <div className="md:col-span-4 space-y-4">
              <div className="paytm-card p-4 bg-white">
                <h3 className="text-xs font-bold text-[#002E6E] uppercase tracking-wider mb-3">
                  My Shopping Lists
                </h3>

                <div className="space-y-2 mb-4">
                  {shoppingLists.map((list) => (
                    <div
                      key={list.id}
                      onClick={() => setSelectedListId(list.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        selectedList?.id === list.id
                          ? 'bg-sky-50 border-[#00BAF2] shadow-xs'
                          : 'bg-white border-[#E0E6ED] hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#002E6E]">{list.title}</p>
                        <p className="text-[11px] text-[#6B7A90]">
                          {list.items.length} items · {list.items.filter((i) => i.completed).length} checked
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#00BAF2]" />
                    </div>
                  ))}
                </div>

                {/* Create New List */}
                <form onSubmit={handleCreateList} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New list title..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#002E6E] hover:bg-[#001D47] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create</span>
                  </button>
                </form>
              </div>

              {/* Zero-Barrier Standee Card */}
              <div className="paytm-card p-4 bg-gradient-to-br from-white to-sky-50 border border-sky-100">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-[#00BAF2]" />
                  <span className="text-xs font-bold text-[#002E6E]">Ready to Visit Shop?</span>
                </div>
                <p className="text-[11px] text-[#6B7A90] mb-3 leading-relaxed">
                  When you arrive at {store.name}, scan the store QR code at the standee to automatically open your cashier.
                </p>
                <Link
                  to={`/s/${store.id}/checkout`}
                  className="w-full py-2 bg-[#00BAF2] hover:bg-[#00a4d6] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Open In-Store Cashier</span>
                </Link>
              </div>
            </div>

            {/* Right: Active List Detail & Item Management */}
            <div className="md:col-span-8 space-y-4">
              {selectedList ? (
                <div className="paytm-card p-5 bg-white space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E6ED] pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#00BAF2] uppercase tracking-wider">
                        Active Pre-Built List
                      </span>
                      <h2 className="text-lg font-black text-[#002E6E]">{selectedList.title}</h2>
                      <p className="text-xs text-[#6B7A90]">
                        {selectedList.items.length} items planned · Pre-built before visiting store
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTransferListToCart}
                        className="px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Transfer All to In-Store Cart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteList(selectedList.id)}
                        className="p-2 rounded-lg text-[#6B7A90] hover:text-[#FD5C63] hover:bg-rose-50 transition"
                        title="Delete list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add Product from Catalog */}
                  <div className="bg-[#F5F7FA] border border-[#E0E6ED] rounded-xl p-3">
                    <span className="text-[11px] font-bold text-[#002E6E] block mb-2">
                      Quick Add from Awadh Mart Catalog:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {catalogProducts.slice(0, 12).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleAddItemToList(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] hover:text-[#00BAF2] border border-[#E0E6ED] text-[11px] font-medium flex items-center gap-1 transition shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3 h-3 text-[#00BAF2]" />
                          <span>{p.name} (₹{(p.pricePaise / 100).toFixed(0)})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items Checklist */}
                  <div className="space-y-2">
                    {selectedList.items.length === 0 ? (
                      <div className="py-8 text-center text-[#6B7A90] text-xs">
                        No items added yet. Click any product above to add to this list.
                      </div>
                    ) : (
                      selectedList.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            item.completed
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-white border-[#E0E6ED] hover:bg-[#F9FBFE]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleItem(item.id)}
                              className={`w-6 h-6 rounded-md flex items-center justify-center transition border ${
                                item.completed
                                  ? 'bg-[#21C17A] border-[#21C17A] text-white'
                                  : 'bg-white border-[#CBD5E1] text-transparent hover:border-[#00BAF2]'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                            <div>
                              <p
                                className={`text-xs font-bold ${
                                  item.completed
                                    ? 'line-through text-[#6B7A90]'
                                    : 'text-[#002E6E]'
                                }`}
                              >
                                {item.name}
                              </p>
                              <p className="text-[11px] text-[#6B7A90]">
                                Quantity: {item.quantity} · Est. ₹
                                {item.estimatedPaise ? ((item.estimatedPaise * item.quantity) / 100).toFixed(0) : '—'}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItemFromList(item.id)}
                            className="text-[#6B7A90] hover:text-[#FD5C63] p-1.5 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="paytm-card p-8 bg-white text-center text-xs text-[#6B7A90]">
                  Select or create a shopping list on the left.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PAST ORDERS & RECEIPTS */}
        {activeTab === 'orders' && (
          <div className="paytm-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#002E6E]">Customer Order History</h2>
                <p className="text-xs text-[#6B7A90]">
                  Itemized digital receipts for all your FinBuddy self-checkout transactions
                </p>
              </div>
              <span className="text-xs font-bold text-[#00BAF2]">
                {receipts.length} Total Receipts
              </span>
            </div>

            {receipts.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <ReceiptIcon className="w-12 h-12 text-[#CBD5E1] mb-2" />
                <p className="text-xs font-bold text-[#002E6E]">No past orders recorded yet</p>
                <p className="text-[11px] text-[#6B7A90] max-w-xs mt-1 mb-4">
                  Complete your first scan & pay checkout in store to see your verified receipt here.
                </p>
                <Link
                  to={`/s/${store.id}/checkout`}
                  className="px-4 py-2 bg-[#00BAF2] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Start Self-Checkout
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {receipts.map((rcpt) => {
                  const dateStr = new Date(rcpt.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const totalRupees = (rcpt.totalPaise / 100).toFixed(2);

                  return (
                    <div
                      key={rcpt.id}
                      className="p-4 rounded-xl border border-[#E0E6ED] hover:border-[#00BAF2] bg-white transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#002E6E]">{rcpt.storeName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-50 text-[#002E6E] border border-sky-100">
                            {rcpt.paymentReference}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-[#21C17A] border border-emerald-100">
                            Paid via Paytm
                          </span>
                        </div>
                        <p className="text-xs text-[#4A5568]">
                          {rcpt.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>
                        <p className="text-[11px] text-[#6B7A90]">{dateStr}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                        <span className="text-base font-black text-[#002E6E]">₹{totalRupees}</span>
                        <Link
                          to={`/s/${rcpt.storeId}/receipt/${rcpt.id}`}
                          className="px-3 py-1.5 bg-[#F5F7FA] hover:bg-sky-50 text-[#002E6E] hover:text-[#00BAF2] rounded-lg text-xs font-semibold border border-[#E0E6ED] flex items-center gap-1 transition"
                        >
                          <span>View Digital Bill</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & ZERO-BARRIER GUEST MODE */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Account Form */}
            <div className="md:col-span-7 paytm-card p-6 bg-white space-y-4">
              <div className="border-b border-[#E0E6ED] pb-3">
                <h2 className="text-sm font-bold text-[#002E6E]">Customer Profile Credentials</h2>
                <p className="text-xs text-[#6B7A90]">
                  Saved details for one-touch checkout and instant WhatsApp receipts
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-sm text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                    WhatsApp Phone Number (for Digital Receipts)
                  </label>
                  <div className="flex">
                    <span className="px-3.5 py-2.5 bg-[#F5F7FA] border border-r-0 border-[#E0E6ED] rounded-l-lg text-sm text-[#6B7A90] font-semibold flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-r-lg text-sm text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-sm text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#002E6E] block mb-1">Delivery / Home Location</label>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Hazratganj, Lucknow"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-sm text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Registered Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartGuest}
                    className="px-4 h-11 bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] text-xs sm:text-sm font-semibold rounded-lg border border-[#E0E6ED] transition"
                  >
                    Switch to Guest
                  </button>
                </div>
              </form>
            </div>

            {/* Zero-Barrier Info Box */}
            <div className="md:col-span-5 space-y-4">
              <div className="paytm-card p-5 bg-white space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#21C17A]" />
                  <h3 className="text-xs font-bold text-[#002E6E] uppercase tracking-wider">
                    Zero-Barrier Consumer Philosophy
                  </h3>
                </div>
                <p className="text-xs text-[#6B7A90] leading-relaxed">
                  FinBuddy requires <strong>zero app downloads</strong>. Shoppers can walk into Awadh Mart, scan the QR code at the entrance standee, and immediately scan items and checkout as a Guest without creating a password.
                </p>

                <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-[#002E6E] space-y-1">
                  <span className="font-bold block">Guest Mode vs Registered:</span>
                  <p className="text-[11px] text-[#4A5568]">
                    • <strong>Guest:</strong> Fast in-and-out checkout with temporary session.
                  </p>
                  <p className="text-[11px] text-[#4A5568]">
                    • <strong>Registered:</strong> Automatically remembers your phone for WhatsApp receipts, keeps all past bills, and lets you pre-build shopping lists.
                  </p>
                </div>
              </div>

              {/* Standee QR Card */}
              <div className="paytm-card p-5 bg-white text-center flex flex-col items-center">
                <span className="text-[11px] font-bold text-[#002E6E] block mb-2">
                  In-Store Standee QR Code
                </span>
                <div className="w-36 h-36 bg-white border border-[#E0E6ED] rounded-xl p-2 flex items-center justify-center mb-2 shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      window.location.origin + '/s/' + store.id + '/checkout'
                    )}`}
                    alt="Checkout QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-[#6B7A90]">
                  Scan from phone camera in store to open web cashier instantly.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
