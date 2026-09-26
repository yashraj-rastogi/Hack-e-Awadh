export type UserRole = 'merchant' | 'customer';

export interface User {
  uid: string;
  role: UserRole;
  displayName: string;
  phone?: string;
  createdAt: number;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  category: 'grocery' | 'general-store';
  location: string;
  supportedLanguages: ('en' | 'hi' | 'hinglish')[];
  qrSlug: string;
  isDemoData: true;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  pricePaise: number; // e.g. 2000 paise = ₹20.00
  stock: number;
  lowStockThreshold: number;
  category: 'Beverages' | 'Instant Food' | 'Snacks' | 'Dairy' | 'Staples' | 'Confectionery';
  isActive: boolean;
  updatedAt: number;
  imageUrl?: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  barcode: string;
  unitPricePaise: number;
  quantity: number;
  category: string;
}

export type CheckoutStatus = 'active' | 'payment_pending' | 'completed' | 'abandoned';

export interface CheckoutSession {
  id: string;
  storeId: string;
  customerId?: string;
  guestSessionId?: string;
  items: CartItem[];
  status: CheckoutStatus;
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  createdAt: number;
  updatedAt: number;
}

export type PaymentStatus = 'created' | 'awaiting_payment' | 'paid' | 'failed' | 'expired';

export interface Payment {
  id: string;
  checkoutSessionId: string;
  storeId: string;
  provider: 'paytm_test' | 'simulator';
  providerOrderId: string;
  amountPaise: number;
  status: PaymentStatus;
  verifiedAt?: number;
  idempotencyKey: string;
  createdAt: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  category: string;
}

export interface Transaction {
  id: string;
  storeId: string;
  paymentId: string;
  customerId?: string;
  items: TransactionItem[];
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  paymentStatus: 'paid';
  paymentReference: string;
  createdAt: number;
  isSynthetic: true;
}

export interface Receipt {
  id: string;
  transactionId: string;
  storeId: string;
  storeName: string;
  customerPhone?: string;
  whatsappOptIn: boolean;
  whatsappStatus: 'not_requested' | 'queued' | 'sent' | 'failed';
  publicToken: string;
  items: TransactionItem[];
  totalPaise: number;
  paymentReference: string;
  createdAt: number;
}

export type FeedbackRating = 'great' | 'okay' | 'problem';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Feedback {
  id: string;
  storeId: string;
  transactionId: string;
  rating: FeedbackRating;
  text?: string;
  sentiment: Sentiment;
  createdAt: number;
}

export type InsightType = 'low_stock' | 'sales_trend' | 'top_product' | 'feedback';

export interface Insight {
  id: string;
  storeId: string;
  type: InsightType;
  title: string;
  explanation: string;
  recommendation: string;
  supportingMetrics: Record<string, number | string>;
  generatedAt: number;
  isSynthetic: true;
}

export type VoiceAction =
  | 'add_item'
  | 'remove_item'
  | 'remove_last'
  | 'get_total'
  | 'clear_cart'
  | 'start_payment'
  | 'unknown';

export interface VoiceIntentResult {
  intent: VoiceAction;
  productQuery: string | null;
  quantity: number;
  requiresConfirmation: boolean;
  reply: string;
}

export type CopilotLanguage = 'en' | 'hi' | 'hinglish';

export type CopilotAction =
  | { type: 'restock'; productName: string; quantity: number }
  | { type: 'open_tab'; tab: 'overview' | 'inventory' | 'feedback' };

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  speech?: string;
  language?: CopilotLanguage;
  action?: CopilotAction | null;
  /** 'gemini' when answered by the LLM, 'local' for the deterministic offline engine */
  source?: 'gemini' | 'local';
  recommendation?: {
    actionType: 'combo_offer' | 'reorder_stock' | 'flash_sale';
    title: string;
    details: string;
    actionPayload?: Record<string, unknown>;
  };
  metrics?: Record<string, string | number>;
}
