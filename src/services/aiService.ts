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
// Known catalog products with Hindi and English keyword mappings
const KNOWN_CATALOG_PRODUCTS = [
  { name: 'Pepsi', keys: ['pepsi', 'पेप्सी', 'पेप्सि'] },
  { name: 'Maggi', keys: ['maggi', 'मैगी', 'मेगी', 'नूडल्स', 'नूडल'] },
  { name: 'KitKat', keys: ['kitkat', 'kit kat', 'किटकैट', 'किटकेट', 'किट कैट'] },
  { name: 'Thums Up', keys: ['thums up', 'thumbs up', 'थम्स अप', 'थम्सअप', 'थम्स'] },
  { name: "Lay's", keys: ['lays', 'lay', 'chips', 'चिप्स', 'चिप', 'लेज', 'लेज़'] },
  { name: 'Amul Milk', keys: ['amul', 'milk', 'doodh', 'दूध', 'अमुल', 'अमूल'] },
  { name: 'Parle-G', keys: ['parle', 'parleg', 'parle-g', 'biscuit', 'बिस्कुट', 'बिस्किट', 'पारले'] },
  { name: 'Britannia Good Day', keys: ['good day', 'goodday', 'गुड डे', 'गुडडे'] },
  { name: 'Red Bull', keys: ['red bull', 'redbull', 'रेड बुल', 'रेडबुल', 'रेडबूल'] },
  { name: 'Kurkure', keys: ['kurkure', 'कुरकुरे', 'कुरकुरा'] },
  { name: 'Nescafe', keys: ['nescafe', 'coffee', 'कॉफी', 'कॉफ़ी', 'नेस्कैफे'] },
  { name: 'Tata Salt', keys: ['tata salt', 'salt', 'namak', 'नमक', 'टाटा नमक'] },
  {
    name: 'Cadbury Dairy Milk',
    keys: ['dairy milk', 'silk', 'chocolate', 'डेयरी मिल्क', 'सिल्क', 'चॉकलेट', 'डेयरीमिल्क'],
  },
  {
    name: "Haldiram's Bhujia",
    keys: ['bhujia', 'bhoojia', 'haldiram', 'भुजिया', 'भुजिया हल्दीराम', 'हल्दीराम'],
  },
  { name: 'Fortune Oil', keys: ['fortune', 'oil', 'tel', 'तेल', 'फॉर्च्यून', 'फार्च्यून'] },
];

function extractQuantity(clean: string): number {
  // Check if "एक" or "1" or "१" or "one" is specified
  const isOne =
    /(^|\s)(एक|ek|one|1|१)(\s|$)/i.test(clean) ||
    clean.startsWith('एक') ||
    clean.startsWith('१');

  // Devanagari numerals
  const devanagariDigits: Record<string, number> = {
    '२': 2,
    '३': 3,
    '४': 4,
    '५': 5,
    '६': 6,
    '७': 7,
    '८': 8,
    '९': 9,
    '१०': 10,
  };
  for (const [d, val] of Object.entries(devanagariDigits)) {
    if (clean.includes(d)) return val;
  }

  // Western digits > 1
  const numMatch = clean.match(/\b([2-9]|10)\b/);
  if (numMatch) return parseInt(numMatch[1], 10);

  // Check 3, 4, 5, 6 first
  if (/(^|\s)(तीन|teen|three|3|३)(\s|$)/i.test(clean) || clean.includes('तीन')) return 3;
  if (/(^|\s)(चार|chaar|four|4|४)(\s|$)/i.test(clean) || clean.includes('चार')) return 4;
  if (
    /(^|\s)(पांच|पाँच|paanch|five|5|५)(\s|$)/i.test(clean) ||
    clean.includes('पांच') ||
    clean.includes('पाँच')
  )
    return 5;
  if (/(^|\s)(छह|छः|chhe|six|6|६)(\s|$)/i.test(clean) || clean.includes('छह')) return 6;

  // Check if "दो" or "do" is used as auxiliary verb at end (e.g. "हटा दो", "कर दो", "दे दो", "hata do", "kar do")
  const isVerbSuffixDo =
    /(हटा\s*दो|कर\s*दो|दे\s*दो|डाल\s*दो|ऐड\s*दो|जोड़\s*दो|hata\s*do|kar\s*do|de\s*do|dal\s*do|add\s*do)/i.test(
      clean
    );

  if (isOne) return 1;

  // Check 2: if it has "दो" or "do" or "two", and it's either at the beginning, or NOT just a verb suffix
  if (
    clean.startsWith('दो') ||
    clean.startsWith('do ') ||
    clean.includes('दो और') ||
    clean.includes('do aur') ||
    (/(^|\s)(दो|two)(\s|$)/i.test(clean) && !isVerbSuffixDo)
  ) {
    return 2;
  }

  // If "do" is in the text and NOT part of verb suffix
  if (/\b(do|two)\b/i.test(clean) && !isVerbSuffixDo) {
    return 2;
  }

  return 1;
}

export async function parseVoiceCommand(
  utterance: string,
  _storeId: string = 'store-awadh-01'
): Promise<VoiceIntentResult> {
  const clean = utterance.trim().toLowerCase();

  // If valid Google AI Studio API Key is available, try Gemini
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10 && GEMINI_API_KEY.startsWith('AIza')) {
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
                    text: `You are FinBuddy Checkout Voice Command Parser. The user speaks Hindi (Devanagari script), Hinglish, or English.
Available products: Pepsi, Maggi, KitKat, Thums Up, Lay's, Amul Milk, Parle-G, Britannia Good Day, Red Bull, Kurkure, Nescafe, Tata Salt, Cadbury Dairy Milk, Haldiram's Bhujia, Fortune Oil.
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
  const isHindi = /[\u0900-\u097F]/.test(clean);

  // Check for Payment Intent (strict word boundaries / explicit phrases to avoid matching "पे" in "पेप्सी")
  const isPayment =
    /\b(pay|checkout|payment)\b/i.test(clean) ||
    clean.includes('पेमेंट') ||
    clean.includes('भुगतान') ||
    clean.includes('बिल बना') ||
    clean.includes('बिल भरो') ||
    clean.includes('पैसे दे') ||
    clean.includes('paise de') ||
    clean.includes('पे करो') ||
    clean.includes('पे करना');

  if (isPayment) {
    return {
      intent: 'start_payment',
      productQuery: null,
      quantity: 1,
      requiresConfirmation: true,
      reply: isHindi
        ? 'पेमेंट शुरू किया जा रहा है। कृपया बिल राशि की पुष्टि करें।'
        : 'Starting payment. Please confirm your bill amount.',
    };
  }

  // Check for Total Bill inquiry
  if (
    clean.includes('total') ||
    clean.includes('kitna hua') ||
    clean.includes('kitne paise') ||
    clean.includes('bill kitna') ||
    clean.includes('how much') ||
    clean.includes('टोटल') ||
    clean.includes('कुल') ||
    clean.includes('कितना हुआ') ||
    clean.includes('कितने पैसे') ||
    clean.includes('बिल बताओ') ||
    clean.includes('कितना बिल')
  ) {
    return {
      intent: 'get_total',
      productQuery: null,
      quantity: 1,
      requiresConfirmation: false,
      reply: isHindi
        ? 'कार्ट का कुल बिल चेक किया जा रहा है।'
        : 'Checking current cart total.',
    };
  }

  // Check for Clear Cart
  if (
    clean.includes('clear') ||
    clean.includes('sab hata') ||
    clean.includes('khali kar') ||
    clean.includes('empty cart') ||
    clean.includes('खाली करो') ||
    clean.includes('सब हटाओ') ||
    clean.includes('साफ करो') ||
    clean.includes('कार्ट खाली')
  ) {
    return {
      intent: 'clear_cart',
      productQuery: null,
      quantity: 0,
      requiresConfirmation: true,
      reply: isHindi
        ? 'क्या आप पूरा कार्ट खाली करना चाहते हैं?'
        : 'Are you sure you want to clear your entire cart?',
    };
  }

  const quantity = extractQuantity(clean);

  // Check for Remove Intent
  const isRemove =
    clean.includes('remove') ||
    clean.includes('hata') ||
    clean.includes('delete') ||
    clean.includes('minus') ||
    clean.includes('kam kar') ||
    clean.includes('nikal') ||
    clean.includes('हटाओ') ||
    clean.includes('हटा') ||
    clean.includes('कम करो') ||
    clean.includes('निकालो') ||
    clean.includes('निकाल') ||
    clean.includes('डिलीट') ||
    clean.includes('माइनस');

  // Match Product in Catalog
  let matchedProduct: { name: string; keys: string[] } | null = null;
  for (const prod of KNOWN_CATALOG_PRODUCTS) {
    for (const key of prod.keys) {
      if (clean.includes(key.toLowerCase())) {
        matchedProduct = prod;
        break;
      }
    }
    if (matchedProduct) break;
  }

  if (matchedProduct) {
    if (isRemove) {
      return {
        intent: 'remove_item',
        productQuery: matchedProduct.name,
        quantity,
        requiresConfirmation: false,
        reply: isHindi
          ? `${quantity} ${matchedProduct.name} कार्ट से हटा दिया गया।`
          : `Removed ${quantity} ${matchedProduct.name} from your cart.`,
      };
    } else {
      return {
        intent: 'add_item',
        productQuery: matchedProduct.name,
        quantity,
        requiresConfirmation: false,
        reply: isHindi
          ? `${quantity} ${matchedProduct.name} कार्ट में जोड़ दिया गया।`
          : `Added ${quantity} ${matchedProduct.name} to your cart.`,
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
      reply: isHindi
        ? 'कार्ट से पिछला आइटम हटाया जा रहा है।'
        : 'Removing the last added item from your cart.',
    };
  }

  return {
    intent: 'unknown',
    productQuery: clean,
    quantity: 1,
    requiresConfirmation: false,
    reply: isHindi
      ? "माफ़ कीजिये, प्रोडक्ट समझ नहीं आया। कृपया '२ पेप्सी जोड़ो' बोलें या स्कैनर का उपयोग करें।"
      : "I couldn't identify the product. Please try saying 'Add 2 Pepsi' or use the scanner.",
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
