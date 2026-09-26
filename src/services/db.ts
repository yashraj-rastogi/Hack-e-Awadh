import {
  Store,
  Product,
  Transaction,
  Feedback,
  Insight,
  Receipt,
  CartItem,
  TransactionItem,
  CustomerUser,
  ShoppingList,
  ShoppingListItem,
  MerchantBankingDetails,
  PaymentSimulatorConfig,
} from '../types';
import {
  SEED_STORE,
  SEED_PRODUCTS,
  generateSeedTransactions,
  SEED_FEEDBACK,
  SEED_INSIGHTS,
} from '../data/seedData';

// Local storage keys for persistent demo state
const STORAGE_PREFIX = 'finbuddy_';
const STORE_KEY = `${STORAGE_PREFIX}store`;
const PRODUCTS_KEY = `${STORAGE_PREFIX}products`;
const TRANSACTIONS_KEY = `${STORAGE_PREFIX}transactions`;
const FEEDBACK_KEY = `${STORAGE_PREFIX}feedback`;
const INSIGHTS_KEY = `${STORAGE_PREFIX}insights`;
const RECEIPTS_KEY = `${STORAGE_PREFIX}receipts`;
const CUSTOMER_USER_KEY = `${STORAGE_PREFIX}customer_user`;
const CUSTOMER_LISTS_KEY = `${STORAGE_PREFIX}customer_lists`;
const BANKING_KEY = `${STORAGE_PREFIX}merchant_banking`;
const SIMULATOR_CONFIG_KEY = `${STORAGE_PREFIX}simulator_config`;

type StoreChangeListener = () => void;
const listeners: Set<StoreChangeListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in store listener:', e);
    }
  });
}

export function subscribeToStoreUpdates(callback: StoreChangeListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Initializer: check if storage exists or seed default data
export function initStore(): void {
  if (!localStorage.getItem(STORE_KEY)) {
    resetToSeedData();
  }
}

export function resetToSeedData(): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(SEED_STORE));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(generateSeedTransactions()));
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(SEED_FEEDBACK));
  localStorage.setItem(INSIGHTS_KEY, JSON.stringify(SEED_INSIGHTS));
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify([]));
  notifyListeners();
}

// Store Queries
export function getStore(_storeId?: string): Store {
  initStore();
  const raw = localStorage.getItem(STORE_KEY);
  return raw ? JSON.parse(raw) : SEED_STORE;
}

export function getProducts(_storeId?: string): Product[] {
  initStore();
  const raw = localStorage.getItem(PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : SEED_PRODUCTS;
}

export function findProductByBarcode(barcode: string, storeId?: string): Product | undefined {
  const products = getProducts(storeId);
  const clean = barcode.trim();
  return products.find((p) => p.barcode === clean || p.barcode.endsWith(clean) || clean.endsWith(p.barcode));
}

export function findProductByName(nameQuery: string, storeId?: string): Product | undefined {
  const products = getProducts(storeId);
  const query = nameQuery.toLowerCase().trim();

  // 1. Exact match
  const exact = products.find((p) => p.name.toLowerCase() === query);
  if (exact) return exact;

  // 2. Starts with / includes
  const partial = products.find((p) => p.name.toLowerCase().includes(query));
  if (partial) return partial;

  // 3. Keyword matching (e.g. "pepsi", "maggi", "kitkat", "milk", "biscuit", "lays", "chips")
  const keywords = query.split(/\s+/);
  return products.find((p) => {
    const pName = p.name.toLowerCase();
    return keywords.some((kw) => kw.length > 2 && pName.includes(kw));
  });
}

export function getTransactions(_storeId?: string, limit?: number): Transaction[] {
  initStore();
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  const txns: Transaction[] = raw ? JSON.parse(raw) : [];
  return limit ? txns.slice(0, limit) : txns;
}

export function getReceipt(receiptId: string): Receipt | undefined {
  initStore();
  const raw = localStorage.getItem(RECEIPTS_KEY);
  const receipts: Receipt[] = raw ? JSON.parse(raw) : [];
  return receipts.find((r) => r.id === receiptId || r.transactionId === receiptId);
}

export function getFeedback(_storeId?: string): Feedback[] {
  initStore();
  const raw = localStorage.getItem(FEEDBACK_KEY);
  return raw ? JSON.parse(raw) : SEED_FEEDBACK;
}

export function getInsights(_storeId?: string): Insight[] {
  initStore();
  const raw = localStorage.getItem(INSIGHTS_KEY);
  return raw ? JSON.parse(raw) : SEED_INSIGHTS;
}

// Atomic Checkout & Payment Finalization (Deterministic state machine + inventory decrement)
export interface CheckoutResult {
  success: boolean;
  transaction?: Transaction;
  receipt?: Receipt;
  error?: string;
  lowStockAlerts?: string[];
}

export function finalizeCheckout(
  storeId: string,
  cartItems: CartItem[],
  customerPhone?: string,
  whatsappOptIn: boolean = false
): CheckoutResult {
  initStore();
  const products = getProducts(storeId);
  const lowStockAlerts: string[] = [];

  // Check inventory availability
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { success: false, error: `Product ${item.name} not found in catalog.` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Only ${product.stock} units of ${product.name} available in stock.`,
      };
    }
  }

  // Atomically decrement stock
  const updatedProducts = products.map((product) => {
    const cartItem = cartItems.find((ci) => ci.productId === product.id);
    if (cartItem) {
      const newStock = Math.max(0, product.stock - cartItem.quantity);
      if (newStock <= product.lowStockThreshold) {
        lowStockAlerts.push(product.name);
      }
      return {
        ...product,
        stock: newStock,
        updatedAt: Date.now(),
      };
    }
    return product;
  });

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

  // Compute exact totals
  const txnItems: TransactionItem[] = cartItems.map((item) => ({
    productId: item.productId,
    name: item.name,
    unitPricePaise: item.unitPricePaise,
    quantity: item.quantity,
    lineTotalPaise: item.unitPricePaise * item.quantity,
    category: item.category,
  }));

  const subtotalPaise = txnItems.reduce((acc, curr) => acc + curr.lineTotalPaise, 0);
  const totalPaise = subtotalPaise; // 0 discount in base checkout
  const txnId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const paymentRef = `PTM_TEST_${Math.floor(100000 + Math.random() * 900000)}`;

  const newTxn: Transaction = {
    id: txnId,
    storeId,
    paymentId: `pay_${Date.now()}`,
    items: txnItems,
    subtotalPaise,
    discountPaise: 0,
    totalPaise,
    paymentStatus: 'paid',
    paymentReference: paymentRef,
    createdAt: Date.now(),
    isSynthetic: true,
  };

  // Prepend to transactions
  const transactions = getTransactions(storeId);
  transactions.unshift(newTxn);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

  // Create receipt
  const store = getStore(storeId);
  const receiptId = `rcpt_${txnId}`;
  const newReceipt: Receipt = {
    id: receiptId,
    transactionId: txnId,
    storeId,
    storeName: store.name,
    customerPhone,
    whatsappOptIn,
    whatsappStatus: whatsappOptIn ? 'queued' : 'not_requested',
    publicToken: Math.random().toString(36).substring(2, 10),
    items: txnItems,
    totalPaise,
    paymentReference: paymentRef,
    createdAt: Date.now(),
  };

  const receiptsRaw = localStorage.getItem(RECEIPTS_KEY);
  const receipts: Receipt[] = receiptsRaw ? JSON.parse(receiptsRaw) : [];
  receipts.unshift(newReceipt);
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));

  // If low stock alerts triggered, inject real-time alert card to insights
  if (lowStockAlerts.length > 0) {
    const currentInsights = getInsights(storeId);
    const newAlert: Insight = {
      id: `alert_${Date.now()}`,
      storeId,
      type: 'low_stock',
      title: `Low Stock: ${lowStockAlerts.join(', ')}`,
      explanation: `Immediate purchase just dropped stock below safe threshold (${lowStockAlerts.join(', ')}).`,
      recommendation: `Place vendor replenishment order immediately.`,
      supportingMetrics: { trigger: 'Realtime Checkout', count: lowStockAlerts.length },
      generatedAt: Date.now(),
      isSynthetic: true,
    };
    currentInsights.unshift(newAlert);
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify(currentInsights));
  }

  // Fire live update event for merchant dashboard
  notifyListeners();

  return {
    success: true,
    transaction: newTxn,
    receipt: newReceipt,
    lowStockAlerts,
  };
}

export function submitCustomerFeedback(
  storeId: string,
  transactionId: string,
  rating: 'great' | 'okay' | 'problem',
  text?: string
): Feedback {
  const sentiment = rating === 'great' ? 'positive' : rating === 'okay' ? 'neutral' : 'negative';
  const newFb: Feedback = {
    id: `fb_${Date.now()}`,
    storeId,
    transactionId,
    rating,
    text: text?.trim() || undefined,
    sentiment,
    createdAt: Date.now(),
  };

  const feedList = getFeedback(storeId);
  feedList.unshift(newFb);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedList));
  notifyListeners();
  return newFb;
}

// Merchant Stock Update
export function updateProductStock(storeId: string, productId: string, newStock: number): void {
  const products = getProducts(storeId);
  const updated = products.map((p) =>
    p.id === productId ? { ...p, stock: Math.max(0, newStock), updatedAt: Date.now() } : p
  );
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  notifyListeners();
}

// Product Management (Add, Edit Price, Full Edit, Delete)
export function addProduct(
  storeId: string,
  newProductData: Omit<Product, 'id' | 'updatedAt' | 'isActive'> & { isActive?: boolean }
): Product {
  const products = getProducts(storeId);
  const newProduct: Product = {
    ...newProductData,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    isActive: newProductData.isActive ?? true,
    updatedAt: Date.now(),
  };
  products.unshift(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  notifyListeners();
  return newProduct;
}

export function updateProductPrice(storeId: string, productId: string, newPricePaise: number): void {
  const products = getProducts(storeId);
  const updated = products.map((p) =>
    p.id === productId ? { ...p, pricePaise: Math.max(0, newPricePaise), updatedAt: Date.now() } : p
  );
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  notifyListeners();
}

export function updateProductDetails(
  storeId: string,
  productId: string,
  updates: Partial<Omit<Product, 'id'>>
): void {
  const products = getProducts(storeId);
  const updated = products.map((p) =>
    p.id === productId ? { ...p, ...updates, updatedAt: Date.now() } : p
  );
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  notifyListeners();
}

export function deleteProduct(storeId: string, productId: string): void {
  const products = getProducts(storeId);
  const updated = products.filter((p) => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  notifyListeners();
}

// Merchant Store & Onboarding Management
export function updateStoreDetails(storeId: string, updates: Partial<Store>): Store {
  const current = getStore(storeId);
  const updated: Store = {
    ...current,
    ...updates,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  notifyListeners();
  return updated;
}

// Merchant Banking Details
export const DEFAULT_BANKING_DETAILS: MerchantBankingDetails = {
  accountHolderName: 'Awadh Mart Retailers Pvt Ltd',
  bankName: 'Paytm Payments Bank',
  accountNumber: '919876543210',
  ifscCode: 'PYTM0123456',
  upiVpa: 'awadhmart@paytm',
  settlementSchedule: 'instant',
  gstin: '09AAACA1234A1Z5',
};

export function getMerchantBankingDetails(): MerchantBankingDetails {
  initStore();
  const raw = localStorage.getItem(BANKING_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_BANKING_DETAILS;
}

export function saveMerchantBankingDetails(details: MerchantBankingDetails): void {
  localStorage.setItem(BANKING_KEY, JSON.stringify(details));
  notifyListeners();
}

// Payment Simulator Configuration
export const DEFAULT_SIMULATOR_CONFIG: PaymentSimulatorConfig = {
  mode: 'instant_success',
  paytmMid: 'AWADHMART8927163',
  simulatedNetworkDelayMs: 1200,
  sendWebhookNotification: true,
};

export function getPaymentSimulatorConfig(): PaymentSimulatorConfig {
  initStore();
  const raw = localStorage.getItem(SIMULATOR_CONFIG_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_SIMULATOR_CONFIG;
}

export function savePaymentSimulatorConfig(config: PaymentSimulatorConfig): void {
  localStorage.setItem(SIMULATOR_CONFIG_KEY, JSON.stringify(config));
  notifyListeners();
}

// Customer User Authentication & Profile
export function getCurrentCustomerUser(): CustomerUser | null {
  initStore();
  const raw = localStorage.getItem(CUSTOMER_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentCustomerUser(user: CustomerUser | null): void {
  if (user) {
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CUSTOMER_USER_KEY);
  }
  notifyListeners();
}

export function loginOrRegisterCustomer(
  name: string,
  phone: string,
  email?: string,
  address?: string
): CustomerUser {
  const user: CustomerUser = {
    id: `cust_${phone.replace(/\D/g, '').slice(-10) || Date.now()}`,
    name: name.trim() || 'Valued Customer',
    phone: phone.trim(),
    email: email?.trim(),
    address: address?.trim(),
    isGuest: false,
    createdAt: Date.now(),
  };
  setCurrentCustomerUser(user);
  return user;
}

export function startGuestCustomer(): CustomerUser {
  const guestUser: CustomerUser = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: 'Guest Shopper',
    phone: '',
    isGuest: true,
    createdAt: Date.now(),
  };
  setCurrentCustomerUser(guestUser);
  return guestUser;
}

export function logoutCustomer(): void {
  localStorage.removeItem(CUSTOMER_USER_KEY);
  notifyListeners();
}

// Customer Shopping Lists
const DEFAULT_DEMO_LIST: ShoppingList = {
  id: 'list_weekend_kirana',
  customerId: 'demo_customer',
  title: 'Weekend Groceries & Snacks',
  items: [
    { id: 'item_1', name: 'Pepsi Can 300ml', quantity: 2, completed: false, estimatedPaise: 4000, productId: 'prod_pepsi_300' },
    { id: 'item_2', name: 'Maggi 2-Minute Noodles', quantity: 3, completed: false, estimatedPaise: 4200, productId: 'prod_maggi_70g' },
    { id: 'item_3', name: 'Parle-G Gold 100g', quantity: 2, completed: true, estimatedPaise: 2000, productId: 'prod_parleg_100' },
    { id: 'item_4', name: 'Amul Taaza Milk 500ml', quantity: 1, completed: false, estimatedPaise: 2700, productId: 'prod_amul_milk' },
  ],
  createdAt: Date.now() - 86400000 * 2,
  updatedAt: Date.now() - 86400000,
};

export function getCustomerShoppingLists(customerId?: string): ShoppingList[] {
  initStore();
  const raw = localStorage.getItem(CUSTOMER_LISTS_KEY);
  const lists: ShoppingList[] = raw ? JSON.parse(raw) : [DEFAULT_DEMO_LIST];
  if (!customerId) return lists;
  return lists.filter((l) => l.customerId === customerId || l.customerId === 'demo_customer');
}

export function saveShoppingList(list: ShoppingList): void {
  const lists = getCustomerShoppingLists();
  const index = lists.findIndex((l) => l.id === list.id);
  if (index >= 0) {
    lists[index] = { ...list, updatedAt: Date.now() };
  } else {
    lists.unshift({ ...list, updatedAt: Date.now() });
  }
  localStorage.setItem(CUSTOMER_LISTS_KEY, JSON.stringify(lists));
  notifyListeners();
}

export function createShoppingList(
  customerId: string,
  title: string,
  items: ShoppingListItem[] = []
): ShoppingList {
  const newList: ShoppingList = {
    id: `list_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    customerId,
    title: title.trim() || 'My Shopping List',
    items,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveShoppingList(newList);
  return newList;
}

export function deleteShoppingList(listId: string): void {
  const lists = getCustomerShoppingLists();
  const updated = lists.filter((l) => l.id !== listId);
  localStorage.setItem(CUSTOMER_LISTS_KEY, JSON.stringify(updated));
  notifyListeners();
}

// Customer Receipts & Past Orders
export function getCustomerReceipts(phoneOrCustomerId?: string): Receipt[] {
  initStore();
  const raw = localStorage.getItem(RECEIPTS_KEY);
  const receipts: Receipt[] = raw ? JSON.parse(raw) : [];
  if (!phoneOrCustomerId) return receipts;
  const cleanPhone = phoneOrCustomerId.replace(/\D/g, '').slice(-10);
  return receipts.filter(
    (r) =>
      (r.customerPhone && r.customerPhone.replace(/\D/g, '').slice(-10) === cleanPhone) ||
      r.id.includes(phoneOrCustomerId)
  );
}
