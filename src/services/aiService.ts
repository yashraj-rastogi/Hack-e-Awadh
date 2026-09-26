import {
  VoiceIntentResult,
  Product,
  CopilotMessage,
} from '../types';
import {
  getProducts,
  getTransactions,
  getFeedback,
  findProductByName,
} from './db';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// -------------------------------------------------------------
// 1. Voice Intent Parser (English / Hindi / Hinglish)
// -------------------------------------------------------------
export async function parseVoiceCommand(
  utterance: string,
  _storeId: string = 'store-awadh-01'
): Promise<VoiceIntentResult> {
  const clean = utterance.trim().toLowerCase();

  // If Gemini API Key is available, use Google Gemini
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are FinBuddy Checkout Voice Command Parser. The user speaks English, Hindi, or Hinglish.
Return JSON ONLY matching:
{
  "intent": "add_item" | "remove_item" | "remove_last" | "get_total" | "clear_cart" | "start_payment" | "unknown",
  "productQuery": string | null,
  "quantity": number,
  "requiresConfirmation": boolean,
  "reply": string
}
User said: "${utterance}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text) as VoiceIntentResult;
        }
      }
    } catch (e) {
      console.warn('Gemini voice parse error, falling back to local NLP:', e);
    }
  }

  // Robust Local Hinglish/Hindi NLP Engine (Zero-latency fallback)
  return parseVoiceCommandLocal(clean);
}

function parseVoiceCommandLocal(clean: string): VoiceIntentResult {
  // Check for Payment Intent
  if (
    clean.includes('pay') ||
    clean.includes('checkout') ||
    clean.includes('payment') ||
    clean.includes('paise de') ||
    clean.includes('bill bana') ||
    clean.includes('bharo')
  ) {
    return {
      intent: 'start_payment',
      productQuery: null,
      quantity: 1,
      requiresConfirmation: true,
      reply: 'Starting payment. Please confirm your bill amount.',
    };
  }

  // Check for Total Bill inquiry
  if (
    clean.includes('total') ||
    clean.includes('kitna hua') ||
    clean.includes('kitne paise') ||
    clean.includes('bill kitna')
  ) {
    return {
      intent: 'get_total',
      productQuery: null,
      quantity: 1,
      requiresConfirmation: false,
      reply: 'Checking current cart total.',
    };
  }

  // Check for Clear Cart
  if (
    clean.includes('clear') ||
    clean.includes('sab hata') ||
    clean.includes('khali kar') ||
    clean.includes('empty cart')
  ) {
    return {
      intent: 'clear_cart',
      productQuery: null,
      quantity: 0,
      requiresConfirmation: true,
      reply: 'Are you sure you want to clear your entire cart?',
    };
  }

  // Detect Quantity (Hindi & English numbers)
  let quantity = 1;
  const numMatch = clean.match(/\b(\d+)\b/);
  if (numMatch) {
    quantity = parseInt(numMatch[1], 10);
  } else if (clean.includes('do') || clean.includes('two') || clean.includes('2')) {
    quantity = 2;
  } else if (clean.includes('teen') || clean.includes('three') || clean.includes('3')) {
    quantity = 3;
  } else if (clean.includes('chaar') || clean.includes('four') || clean.includes('4')) {
    quantity = 4;
  } else if (clean.includes('paanch') || clean.includes('five') || clean.includes('5')) {
    quantity = 5;
  } else if (clean.includes('ek') || clean.includes('one') || clean.includes('1')) {
    quantity = 1;
  }

  // Check for Remove Intent
  const isRemove =
    clean.includes('remove') ||
    clean.includes('hata') ||
    clean.includes('delete') ||
    clean.includes('minus') ||
    clean.includes('kam kar') ||
    clean.includes('nikal');

  // Identify known product keywords
  const knownKeywords = [
    { key: 'pepsi', name: 'Pepsi' },
    { key: 'maggi', name: 'Maggi' },
    { key: 'kitkat', name: 'KitKat' },
    { key: 'thums up', name: 'Thums Up' },
    { key: 'lays', name: "Lay's" },
    { key: 'chips', name: "Lay's" },
    { key: 'milk', name: 'Amul Milk' },
    { key: 'doodh', name: 'Amul Milk' },
    { key: 'amul', name: 'Amul Milk' },
    { key: 'biscuit', name: 'Parle-G' },
    { key: 'parle', name: 'Parle-G' },
    { key: 'good day', name: 'Britannia Good Day' },
    { key: 'red bull', name: 'Red Bull' },
    { key: 'kurkure', name: 'Kurkure' },
    { key: 'coffee', name: 'Nescafe' },
    { key: 'salt', name: 'Tata Salt' },
    { key: 'namak', name: 'Tata Salt' },
    { key: 'chocolate', name: 'Cadbury Dairy Milk' },
    { key: 'dairy milk', name: 'Cadbury Dairy Milk' },
    { key: 'silk', name: 'Cadbury Dairy Milk' },
    { key: 'bhujia', name: "Haldiram's Bhujia" },
  ];

  const matched = knownKeywords.find((kw) => clean.includes(kw.key));

  if (matched) {
    if (isRemove) {
      return {
        intent: 'remove_item',
        productQuery: matched.name,
        quantity,
        requiresConfirmation: false,
        reply: `Removed ${quantity} ${matched.name} from your cart.`,
      };
    } else {
      return {
        intent: 'add_item',
        productQuery: matched.name,
        quantity,
        requiresConfirmation: false,
        reply: `Added ${quantity} ${matched.name} to your cart.`,
      };
    }
  }

  // Fallback if remove was requested without naming an item
  if (isRemove) {
    return {
      intent: 'remove_last',
      productQuery: null,
      quantity: 1,
      requiresConfirmation: false,
      reply: 'Removing the last added item from your cart.',
    };
  }

  return {
    intent: 'unknown',
    productQuery: clean,
    quantity: 1,
    requiresConfirmation: false,
    reply: "I couldn't identify the product. Please try saying 'Add 2 Pepsi' or use the scanner.",
  };
}

// -------------------------------------------------------------
// 2. Merchant Copilot Tools & Agent (docs/ai_prompt_spec.md)
// -------------------------------------------------------------

export interface CopilotTools {
  getSalesSummary: (period?: string) => {
    totalRevenue: string;
    totalTransactions: number;
    averageBill: string;
    period: string;
  };
  getLowStock: () => Product[];
  getSalesTrend: () => {
    fastestGrowing: string;
    slowestMoving: string;
    beverageGrowth: string;
    biscuitSlump: string;
  };
  getFeedbackSummary: () => {
    positivePct: number;
    totalFeedback: number;
    topTheme: string;
  };
}

export function executeCopilotTools(storeId: string = 'store-awadh-01'): CopilotTools {
  return {
    getSalesSummary: (period: string = 'today') => {
      const txns = getTransactions(storeId);
      const now = new Date();
      const isToday = (t: number) => {
        const d = new Date(t);
        return d.toDateString() === now.toDateString();
      };

      const filtered = period === 'today' ? txns.filter((t) => isToday(t.createdAt)) : txns;
      const count = filtered.length;
      const revenuePaise = filtered.reduce((sum, t) => sum + t.totalPaise, 0);
      const avgPaise = count > 0 ? Math.round(revenuePaise / count) : 0;

      return {
        totalRevenue: `₹${(revenuePaise / 100).toLocaleString('en-IN')}`,
        totalTransactions: count,
        averageBill: `₹${(avgPaise / 100).toFixed(0)}`,
        period,
      };
    },

    getLowStock: () => {
      const products = getProducts(storeId);
      return products.filter((p) => p.stock <= p.lowStockThreshold);
    },

    getSalesTrend: () => {
      return {
        fastestGrowing: 'Beverages (+24% in evening 5-8 PM)',
        slowestMoving: 'Biscuits & Cookies (-28% over 7 days)',
        beverageGrowth: '+24%',
        biscuitSlump: '-28%',
      };
    },

    getFeedbackSummary: () => {
      const fbs = getFeedback(storeId);
      const positiveCount = fbs.filter((f) => f.sentiment === 'positive').length;
      const pct = fbs.length > 0 ? Math.round((positiveCount / fbs.length) * 100) : 100;
      return {
        positivePct: pct,
        totalFeedback: fbs.length,
        topTheme: 'Customers love the live camera barcode speed and Hindi voice search.',
      };
    },
  };
}

export async function askMerchantCopilot(
  question: string,
  storeId: string = 'store-awadh-01'
): Promise<CopilotMessage> {
  const q = question.toLowerCase();
  const tools = executeCopilotTools(storeId);

  // 1. Guardrail Check: Regulated financial / loan / underwriting advice
  if (
    q.includes('loan') ||
    q.includes('credit') ||
    q.includes('borrow') ||
    q.includes('insurance') ||
    q.includes('interest rate') ||
    q.includes('karz') ||
    q.includes('udhaar')
  ) {
    return {
      id: `copilot_${Date.now()}`,
      sender: 'assistant',
      text: 'Main regulated financial ya loan advice nahi de sakta. Main aapki store sales, inventory aur customer trends summarize karke business growth planning mein help kar sakta hoon.',
      timestamp: Date.now(),
    };
  }

  // 2. Query Handling via Deterministic Tools
  if (
    q.includes('sale') ||
    q.includes('revenue') ||
    q.includes('kamai') ||
    q.includes('aaj') ||
    q.includes('today')
  ) {
    const summary = tools.getSalesSummary('today');
    return {
      id: `copilot_${Date.now()}`,
      sender: 'assistant',
      text: `Aaj aapki total sales ${summary.totalRevenue} rahi hai (${summary.totalTransactions} transactions, average bill ${summary.averageBill}).\n\nWhy: 5 PM se 8 PM ke dauran chilled beverages aur snacks ki demand sabse zyada rahi.\n\nRecommended Action: Evening rush ke liye cold drinks ka fridge well-stocked rakhein.`,
      timestamp: Date.now(),
      metrics: {
        'Today Revenue': summary.totalRevenue,
        'Transactions': summary.totalTransactions,
        'Avg Bill': summary.averageBill,
      },
    };
  }

  if (
    q.includes('stock') ||
    q.includes('low') ||
    q.includes('inventory') ||
    q.includes('reorder') ||
    q.includes('khatam') ||
    q.includes('maggi')
  ) {
    const lowStock = tools.getLowStock();
    const itemsList = lowStock.map((p) => `${p.name} (${p.stock} left)`).join(', ');
    return {
      id: `copilot_${Date.now()}`,
      sender: 'assistant',
      text: `Aapke pass ${lowStock.length} items low stock alert par hain: ${itemsList}.\n\nWhy: Maggi Noodles ka stock sirf 3 units reh gaya hai jabki safe threshold 15 units hai.\n\nRecommended Action: Sham ke peak dinner time se pehle distributor ko 48 units ka reorder order place karein.`,
      timestamp: Date.now(),
      recommendation: {
        actionType: 'reorder_stock',
        title: 'Reorder Maggi Masala Noodles',
        details: 'Vendor: Lucknow FMCG Distributors (Suggested: 48 packs)',
      },
      metrics: {
        'Critical Item': 'Maggi Noodles',
        'Units Left': 3,
        'Minimum Threshold': 15,
      },
    };
  }

  if (
    q.includes('trend') ||
    q.includes('slow') ||
    q.includes('combo') ||
    q.includes('offer') ||
    q.includes('growth') ||
    q.includes('biscuit')
  ) {
    const trends = tools.getSalesTrend();
    return {
      id: `copilot_${Date.now()}`,
      sender: 'assistant',
      text: `Biscuit category sales pichhle 7 din mein 28% down rahi hain, jabki chilled beverages 24% badhi hain.\n\nWhy: Customers single beverage purchase zyada kar rahe hain aur confectionery skip kar rahe hain.\n\nRecommended Action: "Chilled Pepsi + Good Day Biscuit" par ₹5 discount ka combo offer initiate karein taaki biscuit inventory clear ho sake.`,
      timestamp: Date.now(),
      recommendation: {
        actionType: 'combo_offer',
        title: 'Launch "Evening Snack & Sip" Combo',
        details: 'Bundle Pepsi 500ml (₹40) + Britannia Good Day (₹25) at ₹60 total (₹5 Off).',
      },
      metrics: {
        'Beverage Trend': trends.beverageGrowth,
        'Biscuit Slump': trends.biscuitSlump,
      },
    };
  }

  if (q.includes('feedback') || q.includes('customer') || q.includes('rating') || q.includes('review')) {
    const fb = tools.getFeedbackSummary();
    return {
      id: `copilot_${Date.now()}`,
      sender: 'assistant',
      text: `85% customers ne checkout experience ko "Great" rate kiya hai (${fb.totalFeedback} reviews recorded).\n\nWhy: Shoppers live barcode camera scan aur Hindi voice search ki speed appreciate kar rahe hain.\n\nRecommended Action: QR Standee ko store entrance aur billing counter dono jagah prominent display karein.`,
      timestamp: Date.now(),
      metrics: {
        'Positive Rating': `${fb.positivePct}%`,
        'Total Reviews': fb.totalFeedback,
      },
    };
  }

  // Default intelligent assistant response
  const summary = tools.getSalesSummary('today');
  return {
    id: `copilot_${Date.now()}`,
    sender: 'assistant',
    text: `Aapke Awadh Mart ki aaj ki total sale ${summary.totalRevenue} hai across ${summary.totalTransactions} transactions. Maggi noodles currently low stock par hai.\n\nAap mujhse sales summary, low stock alerts, ya promotional combo offers ke baare mein pooch sakte hain.`,
    timestamp: Date.now(),
  };
}
