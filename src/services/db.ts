import {
  Store,
  Product,
  Transaction,
  Feedback,
  Insight,
  Receipt,
  CartItem,
  TransactionItem,
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
