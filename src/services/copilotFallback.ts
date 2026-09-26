import type { CopilotLanguage, CopilotMessage, Product } from '../types';
import type { StoreSnapshot } from './storeFacts';
import { formatINR } from './storeFacts';

type Reply = Omit<CopilotMessage, 'id' | 'sender' | 'timestamp'>;

function pick<T>(lang: CopilotLanguage, v: { en: T; hi: T; hinglish: T }): T {
  return v[lang];
}

// -------------------------------------------------------------
// Guardrail (deterministic, always checked before any LLM call)
// -------------------------------------------------------------

const GUARDRAIL_PATTERNS = [
  /\bloans?\b/i, /\bcredit\b/i, /\bborrow/i, /\binsurance\b/i, /\binterest rate/i, /\binvest(ment|ing)?\b/i,
  /\bmutual fund/i, /\bemi\b/i, /\bkarz[a]?\b/i, /\bkarj[a]?\b/i, /\budh[a]+r\b/i, /\bbyaaj\b/i, /\bbyaj\b/i,
  /\bshare market\b/i, /\bstocks? market\b/i,
  /लोन/, /क़र्ज़/, /कर्ज/, /उधार/, /ब्याज/, /बीमा/, /निवेश/, /क्रेडिट/,
];

export function isRegulatedFinanceQuestion(q: string): boolean {
  return GUARDRAIL_PATTERNS.some((re) => re.test(q));
}

export function guardrailReply(lang: CopilotLanguage): Reply {
  const text = pick(lang, {
    en: "I can't provide lending, credit, investment or other regulated financial advice. I can show your recent sales, inventory and transaction trends for your own business planning.",
    hi: 'मैं लोन, कर्ज़, निवेश या किसी भी तरह की वित्तीय सलाह नहीं दे सकता। मैं आपकी दुकान की बिक्री, स्टॉक और ग्राहकों के रुझान बता सकता हूँ, ताकि आप खुद अच्छी प्लानिंग कर सकें।',
    hinglish:
      'Main loan, credit, investment ya koi bhi financial advice nahi de sakta. Main aapki dukaan ki bikri, stock aur grahak trends bata sakta hoon, taaki aap khud planning kar sakein.',
  });
  const speech = pick(lang, {
    en: "Sorry, I can't give loan or investment advice. I can help with your sales and stock numbers.",
    hi: 'माफ़ कीजिए, मैं लोन या निवेश की सलाह नहीं दे सकता। मैं आपकी बिक्री और स्टॉक के बारे में मदद कर सकता हूँ।',
    hinglish: 'Maaf kijiye, main loan ya investment ki salah nahi de sakta. Main aapki bikri aur stock mein madad kar sakta hoon.',
  });
  return { text, speech, language: lang, action: null, source: 'local' };
}

// -------------------------------------------------------------
// Product resolution (English, Hinglish and Devanagari aliases)
// -------------------------------------------------------------

const PRODUCT_ALIASES: { match: RegExp; nameIncludes: string }[] = [
  { match: /maggi|मैगी|noodle|नूडल/i, nameIncludes: 'maggi' },
  { match: /pepsi|पेप्सी/i, nameIncludes: 'pepsi' },
  { match: /kit\s?kat|किटकैट/i, nameIncludes: 'kitkat' },
  { match: /thums\s?up|थम्स/i, nameIncludes: 'thums up' },
  { match: /lays|lay's|chips|चिप्स|लेज़?/i, nameIncludes: "lay's" },
  { match: /\bmilk\b|doodh|dudh|दूध|amul|अमूल/i, nameIncludes: 'amul' },
  { match: /parle|पारले/i, nameIncludes: 'parle' },
  { match: /good\s?day|गुड\s?डे/i, nameIncludes: 'good day' },
  { match: /red\s?bull|रेड\s?बुल/i, nameIncludes: 'red bull' },
  { match: /kurkure|कुरकुरे/i, nameIncludes: 'kurkure' },
  { match: /coffee|nescafe|कॉफ़?ी/i, nameIncludes: 'nescafe' },
  { match: /\bsalt\b|namak|नमक/i, nameIncludes: 'salt' },
  { match: /dairy\s?milk|silk|chocolate|cadbury|चॉकलेट/i, nameIncludes: 'cadbury' },
  { match: /bhujia|haldiram|भुजिया/i, nameIncludes: 'bhujia' },
  { match: /\boil\b|\btel\b|fortune|तेल/i, nameIncludes: 'oil' },
  { match: /biscuit|बिस्किट|बिस्कुट/i, nameIncludes: 'parle' },
];

export function resolveProduct(text: string, products: Product[]): Product | undefined {
  const t = text.toLowerCase();
  for (const alias of PRODUCT_ALIASES) {
    if (alias.match.test(t)) {
      const p = products.find((x) => x.name.toLowerCase().includes(alias.nameIncludes));
      if (p) return p;
    }
  }
  const exact = products.find((p) => t.includes(p.name.toLowerCase()));
  if (exact) return exact;
  return undefined;
}

export function resolveProductByName(name: string, products: Product[]): Product | undefined {
  const n = name.toLowerCase().trim();
  return (
    products.find((p) => p.name.toLowerCase() === n) ||
    products.find((p) => p.name.toLowerCase().includes(n) || n.includes(p.name.toLowerCase())) ||
    resolveProduct(name, products)
  );
}

function shortName(name: string): string {
  return name
    .replace(/\s\d+(\.\d+)?\s?(ml|g|kg|l|L)\b.*$/i, '')
    .replace(/\s(pet bottle|vacuum evaporated|refined sunflower)\b.*$/i, '')
    .trim();
}

const HINDI_NUMBERS: Record<string, number> = {
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  bees: 20, tees: 30, chalis: 40, pachas: 50, sau: 100,
  एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, पाँच: 5, छह: 6, सात: 7, आठ: 8, नौ: 9, दस: 10, बीस: 20, तीस: 30, पचास: 50, सौ: 100,
};

function extractQuantity(text: string): number | null {
  const digits = text.match(/\b(\d{1,4})\b/) || text.match(/([०-९]{1,4})/);
  if (digits) {
    const normalized = digits[1].replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)));
    const n = parseInt(normalized, 10);
    if (n > 0 && n <= 500) return n;
  }
  const words = text.toLowerCase().split(/[\s,.?!।]+/);
  for (const w of words) {
    if (w !== 'do' && HINDI_NUMBERS[w]) return HINDI_NUMBERS[w];
  }
  return null;
}

// -------------------------------------------------------------
// Offline copilot answers grounded in the store snapshot
// -------------------------------------------------------------

const has = (q: string, words: (string | RegExp)[]) =>
  words.some((w) => (typeof w === 'string' ? q.includes(w) : w.test(q)));

const RESTOCK_WORDS = [
  'restock', 'reorder', 're-order', 'badhao', 'badha do', 'badhana', 'mangwa', 'mangao', 'order kar', 'add stock',
  'increase stock', 'stock add', 'add kar', 'बढ़ा', 'मंगवा', 'मंगा', 'ऑर्डर',
];

export function isRestockRequest(question: string): boolean {
  return has(question.toLowerCase(), RESTOCK_WORDS);
}

export function isAffirmation(question: string): boolean {
  return /^\s*(haan|han|ha|yes|ok|okay|theek hai|thik hai|kar do|kardo|sure|confirm|हाँ|हां|ठीक है|कर दो)\b/i.test(question.trim());
}

export function restockProposalReply(lang: CopilotLanguage, product: Product, qty: number): Reply {
  const name = shortName(product.name);
  return {
    text: pick(lang, {
      en: `${name} has ${product.stock} units in stock (alert level ${product.lowStockThreshold}).\n\nShall I add ${qty} units? Tap "Confirm restock" to update the inventory.`,
      hi: `${name} का स्टॉक अभी ${product.stock} पीस है (अलर्ट लेवल ${product.lowStockThreshold})।\n\nक्या मैं ${qty} पीस जोड़ दूँ? इन्वेंटरी अपडेट करने के लिए "हाँ, स्टॉक बढ़ाओ" दबाइए।`,
      hinglish: `${name} ka stock abhi ${product.stock} piece hai (alert level ${product.lowStockThreshold}).\n\nKya main ${qty} piece add kar doon? Inventory update karne ke liye "Haan, stock badhao" dabaiye.`,
    }),
    speech: pick(lang, {
      en: `${name} has ${product.stock} units left. Shall I add ${qty} more? Please confirm on screen.`,
      hi: `${name} के ${product.stock} पीस बचे हैं। क्या ${qty} पीस और जोड़ दूँ? स्क्रीन पर कन्फ़र्म कीजिए।`,
      hinglish: `${name} ke ${product.stock} piece bache hain. Kya ${qty} piece aur add kar doon? Screen par confirm kijiye.`,
    }),
    language: lang,
    action: { type: 'restock', productName: product.name, quantity: qty },
    source: 'local',
  };
}

function lastMentionedProduct(history: CopilotMessage[], products: Product[]): Product | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const p = resolveProduct(history[i].text, products);
    if (p) return p;
  }
  return undefined;
}

export function localCopilotReply(
  question: string,
  lang: CopilotLanguage,
  snapshot: StoreSnapshot,
  history: CopilotMessage[] = []
): Reply {
  const q = question.toLowerCase();
  const { facts, products, productStats } = snapshot;

  if (isRegulatedFinanceQuestion(question)) return guardrailReply(lang);

  const refersBack = has(q, ['uska', 'uski', 'iska', 'iski', 'उसका', 'उसकी', 'इसका', 'इसकी', ' it ', 'its ', 'that item']);
  let product = resolveProduct(question, products);
  if (!product && refersBack) product = lastMentionedProduct(history, products);

  // Restock proposal (never executed here; UI asks the merchant to confirm)
  if (isRestockRequest(question) && product) {
    const low = facts.lowStock.find((l) => l.name === product.name);
    const qty = extractQuantity(question) || low?.suggestedReorderQty || Math.max(10, product.lowStockThreshold);
    return restockProposalReply(lang, product, qty);
  }

  // Tab navigation
  const wantsOpen = has(q, ['open', 'show', 'dikhao', 'kholo', 'dikha', 'खोलो', 'दिखाओ']);
  if (wantsOpen && has(q, ['inventory', 'इन्वेंटरी']) && !product) {
    return {
      text: pick(lang, { en: 'Opening the Inventory tab.', hi: 'इन्वेंटरी टैब खोल रहा हूँ।', hinglish: 'Inventory tab khol raha hoon.' }),
      language: lang,
      action: { type: 'open_tab', tab: 'inventory' },
      source: 'local',
    };
  }
  if (wantsOpen && has(q, ['feedback', 'review', 'फीडबैक'])) {
    return {
      text: pick(lang, { en: 'Opening Customer Feedback.', hi: 'ग्राहक फीडबैक खोल रहा हूँ।', hinglish: 'Customer feedback khol raha hoon.' }),
      language: lang,
      action: { type: 'open_tab', tab: 'feedback' },
      source: 'local',
    };
  }

  // Specific product question
  if (product) {
    const stat = productStats.find((s) => s.name === product.name);
    const isLow = product.stock <= product.lowStockThreshold;
    const name = shortName(product.name);
    const units = stat?.units7d ?? 0;
    return {
      text: pick(lang, {
        en: `${name}: ${product.stock} units in stock (alert level ${product.lowStockThreshold}), price ${formatINR(product.pricePaise)}.\nSold ${units} units in the last 7 days (previous 7 days: ${stat?.unitsPrev7d ?? 0}).${isLow ? '\n\nSuggestion: stock is low, consider reordering before the evening rush.' : ''}`,
        hi: `${name}: स्टॉक ${product.stock} पीस (अलर्ट लेवल ${product.lowStockThreshold}), दाम ${formatINR(product.pricePaise)}।\nपिछले 7 दिन में ${units} पीस बिके (उससे पहले के 7 दिन: ${stat?.unitsPrev7d ?? 0})।${isLow ? '\n\nसुझाव: स्टॉक कम है, शाम की भीड़ से पहले ऑर्डर कर दीजिए।' : ''}`,
        hinglish: `${name}: stock ${product.stock} piece (alert level ${product.lowStockThreshold}), daam ${formatINR(product.pricePaise)}.\nPichhle 7 din mein ${units} piece bike (usse pehle ke 7 din: ${stat?.unitsPrev7d ?? 0}).${isLow ? '\n\nSuggestion: stock kam hai, shaam ki bheed se pehle order kar dijiye.' : ''}`,
      }),
      speech: pick(lang, {
        en: `${name} has ${product.stock} units in stock. ${units} sold in the last 7 days.${isLow ? ' Stock is low, please reorder.' : ''}`,
        hi: `${name} का स्टॉक ${product.stock} पीस है। पिछले हफ़्ते ${units} पीस बिके।${isLow ? ' स्टॉक कम है, ऑर्डर कर दीजिए।' : ''}`,
        hinglish: `${name} ka stock ${product.stock} piece hai. Pichhle hafte ${units} piece bike.${isLow ? ' Stock kam hai, order kar dijiye.' : ''}`,
      }),
      language: lang,
      metrics: { 'In Stock': product.stock, 'Alert Level': product.lowStockThreshold, 'Sold (7d)': units },
      source: 'local',
    };
  }

  // Low stock
  if (has(q, ['stock', 'low', 'inventory', 'reorder', 'khatam', 'kam hai', 'running out', 'स्टॉक', 'ख़त्म', 'खत्म', 'कम है', 'कम हो'])) {
    const items = facts.lowStock;
    if (items.length === 0) {
      return {
        text: pick(lang, {
          en: 'Good news: no item is below its stock alert level right now.',
          hi: 'अच्छी खबर: अभी कोई भी सामान अलर्ट लेवल से नीचे नहीं है।',
          hinglish: 'Achhi khabar: abhi koi bhi maal alert level se neeche nahi hai.',
        }),
        language: lang,
        source: 'local',
      };
    }
    const top = items[0];
    const list = items.map((i) => `• ${shortName(i.name)}: ${i.stock} (alert ${i.threshold})`).join('\n');
    const topName = shortName(top.name);
    return {
      text: pick(lang, {
        en: `${items.length} item(s) are at or below their alert level:\n${list}\n\nMost urgent: ${topName} with only ${top.stock} left. ${top.unitsSoldLast7d} sold in the last 7 days.\nSuggestion: reorder about ${top.suggestedReorderQty} units.`,
        hi: `${items.length} सामान अलर्ट लेवल पर या उससे नीचे हैं:\n${list}\n\nसबसे ज़रूरी: ${topName}, सिर्फ़ ${top.stock} बचे हैं। पिछले 7 दिन में ${top.unitsSoldLast7d} बिके।\nसुझाव: लगभग ${top.suggestedReorderQty} पीस मंगवा लीजिए।`,
        hinglish: `${items.length} item alert level par ya usse neeche hain:\n${list}\n\nSabse zaroori: ${topName}, sirf ${top.stock} bache hain. Pichhle 7 din mein ${top.unitsSoldLast7d} bike.\nSuggestion: lagbhag ${top.suggestedReorderQty} piece mangwa lijiye.`,
      }),
      speech: pick(lang, {
        en: `${items.length} items are running low. ${topName} is most urgent with only ${top.stock} left. I suggest reordering ${top.suggestedReorderQty} units.`,
        hi: `${items.length} सामान का स्टॉक कम है। ${topName} सबसे ज़रूरी है, सिर्फ़ ${top.stock} बचे हैं। ${top.suggestedReorderQty} पीस मंगवा लीजिए।`,
        hinglish: `${items.length} item ka stock kam hai. ${topName} sabse zaroori hai, sirf ${top.stock} bache hain. ${top.suggestedReorderQty} piece mangwa lijiye.`,
      }),
      language: lang,
      metrics: { 'Low Stock Items': items.length, [`${topName} left`]: top.stock, 'Suggested Reorder': top.suggestedReorderQty },
      recommendation: {
        actionType: 'reorder_stock',
        title: `Reorder ${topName}`,
        details: `${top.stock} left vs alert level ${top.threshold}; suggested ${top.suggestedReorderQty} units`,
      },
      action: { type: 'restock', productName: top.name, quantity: top.suggestedReorderQty },
      source: 'local',
    };
  }

  // Top sellers
  if (has(q, ['top', 'best', 'sabse zyada', 'sabse jyada', 'most', 'bika', 'bike', 'selling', 'popular', 'सबसे ज़्यादा', 'सबसे ज्यादा', 'बिका'])) {
    const top = facts.topProductsByUnits7d.slice(0, 3);
    if (!top.length) return noDataReply(lang);
    const list = top.map((t, i) => `${i + 1}. ${shortName(t.name)}: ${t.units} units (${t.revenue})`).join('\n');
    const first = shortName(top[0].name);
    return {
      text: pick(lang, {
        en: `Top sellers in the last 7 days:\n${list}\n\nSuggestion: keep ${first} well stocked, especially for the evening peak.`,
        hi: `पिछले 7 दिन में सबसे ज़्यादा बिकने वाले सामान:\n${list}\n\nसुझाव: ${first} का स्टॉक भरपूर रखिए, ख़ासकर शाम के समय के लिए।`,
        hinglish: `Pichhle 7 din mein sabse zyada bikne wala maal:\n${list}\n\nSuggestion: ${first} ka stock bharpoor rakhiye, khaaskar shaam ke time ke liye.`,
      }),
      speech: pick(lang, {
        en: `${first} sold the most this week, ${top[0].units} units worth ${top[0].revenue}.`,
        hi: `इस हफ़्ते सबसे ज़्यादा ${first} बिका, ${top[0].units} पीस, कुल ${top[0].revenue}।`,
        hinglish: `Is hafte sabse zyada ${first} bika, ${top[0].units} piece, total ${top[0].revenue}.`,
      }),
      language: lang,
      metrics: Object.fromEntries(top.map((t) => [shortName(t.name), `${t.units} units`])),
      source: 'local',
    };
  }

  // Combo / slow movers / trends
  if (has(q, ['combo', 'offer', 'slow', 'trend', 'growth', 'discount', 'idea', 'ऑफ़र', 'ऑफर', 'कॉम्बो', 'धीमा'])) {
    const drink = productStats.filter((s) => s.category === 'Beverages').sort((a, b) => b.units7d - a.units7d)[0];
    const snack = productStats
      .filter((s) => s.category === 'Snacks' || s.category === 'Confectionery')
      .sort((a, b) => a.units7d - b.units7d || b.stock - a.stock)[0];
    if (!drink || !snack) return noDataReply(lang);
    const comboPaise = drink.pricePaise + snack.pricePaise - 500;
    const d = shortName(drink.name);
    const s = shortName(snack.name);
    return {
      text: pick(lang, {
        en: `${d} is your strongest drink (${drink.units7d} sold in 7 days), while ${s} is slow (${snack.units7d} sold, ${snack.stock} in stock).\n\nWhy: pairing a fast seller with a slow item helps clear stock.\nSuggestion: "${d} + ${s}" combo for ${formatINR(comboPaise)} (₹5 off) during 5-8 PM.`,
        hi: `${d} सबसे ज़्यादा बिकने वाली ड्रिंक है (7 दिन में ${drink.units7d}), जबकि ${s} धीमा चल रहा है (${snack.units7d} बिके, ${snack.stock} स्टॉक में)।\n\nक्यों: तेज़ बिकने वाले सामान के साथ धीमा सामान जोड़ने से स्टॉक निकलता है।\nसुझाव: शाम 5 से 8 बजे "${d} + ${s}" कॉम्बो ${formatINR(comboPaise)} में (₹5 की छूट)।`,
        hinglish: `${d} sabse zyada bikne wali drink hai (7 din mein ${drink.units7d}), jabki ${s} slow chal raha hai (${snack.units7d} bike, ${snack.stock} stock mein).\n\nKyun: fast item ke saath slow item jodne se stock nikalta hai.\nSuggestion: shaam 5 se 8 baje "${d} + ${s}" combo ${formatINR(comboPaise)} mein (₹5 off).`,
      }),
      speech: pick(lang, {
        en: `Try a ${d} and ${s} combo for ${formatINR(comboPaise)}, five rupees off, in the evening.`,
        hi: `शाम को ${d} और ${s} का कॉम्बो ${formatINR(comboPaise)} में रखिए, पाँच रुपये की छूट के साथ।`,
        hinglish: `Shaam ko ${d} aur ${s} ka combo ${formatINR(comboPaise)} mein rakhiye, paanch rupaye off ke saath.`,
      }),
      language: lang,
      metrics: { [`${d} (7d)`]: `${drink.units7d} units`, [`${s} (7d)`]: `${snack.units7d} units`, 'Combo Price': formatINR(comboPaise) },
      recommendation: {
        actionType: 'combo_offer',
        title: `${d} + ${s} combo`,
        details: `${drink.price} + ${snack.price} → ${formatINR(comboPaise)} (₹5 off), 5-8 PM`,
      },
      source: 'local',
    };
  }

  // Feedback
  if (has(q, ['feedback', 'customer', 'review', 'rating', 'grahak', 'ग्राहक', 'फीडबैक', 'बोल रहे'])) {
    const f = facts.feedback;
    return {
      text: pick(lang, {
        en: `${f.positivePct}% of ${f.total} feedback entries are positive (${f.positive} positive, ${f.neutral} neutral, ${f.negative} negative).\n\nSuggestion: read the neutral/negative comments in the Feedback tab and fix the most common issue first.`,
        hi: `${f.total} में से ${f.positivePct}% फीडबैक अच्छे हैं (${f.positive} अच्छे, ${f.neutral} ठीक-ठाक, ${f.negative} ख़राब)।\n\nसुझाव: फीडबैक टैब में ठीक-ठाक और ख़राब कमेंट पढ़िए और सबसे आम दिक्कत पहले ठीक कीजिए।`,
        hinglish: `${f.total} mein se ${f.positivePct}% feedback achhe hain (${f.positive} positive, ${f.neutral} theek-thaak, ${f.negative} kharab).\n\nSuggestion: Feedback tab mein neutral aur negative comments padhiye aur sabse common dikkat pehle theek kijiye.`,
      }),
      speech: pick(lang, {
        en: `${f.positivePct} percent of customer feedback is positive, out of ${f.total} reviews.`,
        hi: `${f.total} में से ${f.positivePct} प्रतिशत ग्राहक खुश हैं।`,
        hinglish: `${f.total} mein se ${f.positivePct} percent grahak khush hain.`,
      }),
      language: lang,
      metrics: { 'Positive': `${f.positivePct}%`, 'Total Reviews': f.total, 'Negative': f.negative },
      action: { type: 'open_tab', tab: 'feedback' },
      source: 'local',
    };
  }

  // Peak hours
  if (has(q, ['peak', 'busy', 'rush', 'time', 'bheed', 'samay', 'भीड़', 'समय'])) {
    const peak = facts.peakHours7d;
    if (!peak.length) return noDataReply(lang);
    const list = peak.map((p) => `${p.window} (${p.transactions})`).join(', ');
    return {
      text: pick(lang, {
        en: `Busiest hours in the last 7 days: ${list}.\n\nSuggestion: keep fast sellers and change ready before ${peak[0].window}.`,
        hi: `पिछले 7 दिन में सबसे ज़्यादा भीड़ का समय: ${list}।\n\nसुझाव: ${peak[0].window} से पहले तेज़ बिकने वाला सामान भरकर रखिए।`,
        hinglish: `Pichhle 7 din mein sabse zyada bheed ka time: ${list}.\n\nSuggestion: ${peak[0].window} se pehle fast bikne wala maal bhar kar rakhiye.`,
      }),
      speech: pick(lang, {
        en: `Your busiest time is ${peak[0].window}.`,
        hi: `सबसे ज़्यादा भीड़ ${peak[0].window} के बीच होती है।`,
        hinglish: `Sabse zyada bheed ${peak[0].window} ke beech hoti hai.`,
      }),
      language: lang,
      source: 'local',
    };
  }

  // Sales summary (also the default for "aaj", "today", "bikri")
  if (has(q, ['sale', 'revenue', 'kamai', 'bikri', 'aaj', 'today', 'business', 'dhanda', 'बिक्री', 'कमाई', 'आज', 'धंधा', 'week', 'hafte', 'हफ़्ते', 'हफ्ते'])) {
    return salesReply(lang, snapshot);
  }

  return helpReply(lang, snapshot);
}

function salesReply(lang: CopilotLanguage, snapshot: StoreSnapshot): Reply {
  const { facts } = snapshot;
  const t = facts.today;
  const wow = facts.weekOverWeekRevenueChange;
  const bestCat = facts.categoryTrends7dVsPrev7d[0];
  const peak = facts.peakHours7d[0];
  return {
    text: pick(lang, {
      en: `Today's sales: ${t.revenue} from ${t.transactions} bills (average bill ${t.averageBill}). Yesterday: ${facts.yesterday.revenue}.\nLast 7 days: ${facts.last7Days.revenue} (${wow} vs the previous 7 days).${bestCat ? `\n\nWhy: ${bestCat.category} is your strongest category (${bestCat.revenue7d} in 7 days, ${bestCat.change}).` : ''}${peak ? `\nSuggestion: keep ${bestCat?.category ?? 'fast sellers'} well stocked before ${peak.window}.` : ''}`,
      hi: `आज की बिक्री: ${t.revenue}, ${t.transactions} बिल (औसत बिल ${t.averageBill})। कल: ${facts.yesterday.revenue}।\nपिछले 7 दिन: ${facts.last7Days.revenue} (उससे पहले के 7 दिनों के मुक़ाबले ${wow})।${bestCat ? `\n\nक्यों: ${bestCat.category} सबसे मज़बूत कैटेगरी रही (7 दिन में ${bestCat.revenue7d}, ${bestCat.change})।` : ''}${peak ? `\nसुझाव: ${peak.window} से पहले ${bestCat?.category ?? 'तेज़ बिकने वाला'} सामान भरकर रखिए।` : ''}`,
      hinglish: `Aaj ki bikri: ${t.revenue}, ${t.transactions} bill (average bill ${t.averageBill}). Kal: ${facts.yesterday.revenue}.\nPichhle 7 din: ${facts.last7Days.revenue} (usse pehle ke 7 din ke mukable ${wow}).${bestCat ? `\n\nKyun: ${bestCat.category} sabse strong category rahi (7 din mein ${bestCat.revenue7d}, ${bestCat.change}).` : ''}${peak ? `\nSuggestion: ${peak.window} se pehle ${bestCat?.category ?? 'fast'} maal bhar kar rakhiye.` : ''}`,
    }),
    speech: pick(lang, {
      en: `Today's sales are ${t.revenue} from ${t.transactions} bills. The last 7 days are ${wow} compared to the week before.`,
      hi: `आज की बिक्री ${t.revenue} रही, ${t.transactions} बिल बने। पिछले हफ़्ते के मुक़ाबले ${wow}।`,
      hinglish: `Aaj ki bikri ${t.revenue} rahi, ${t.transactions} bill bane. Pichhle hafte ke mukable ${wow}.`,
    }),
    language: lang,
    metrics: {
      'Today Revenue': t.revenue,
      Transactions: t.transactions,
      'Avg Bill': t.averageBill,
      'Last 7 Days': facts.last7Days.revenue,
      'Week vs Prev': wow,
    },
    source: 'local',
  };
}

function noDataReply(lang: CopilotLanguage): Reply {
  return {
    text: pick(lang, {
      en: "I don't have enough recent sales data to answer that yet.",
      hi: 'इसका जवाब देने के लिए अभी पर्याप्त बिक्री डेटा नहीं है।',
      hinglish: 'Iska jawab dene ke liye abhi kaafi bikri data nahi hai.',
    }),
    language: lang,
    source: 'local',
  };
}

function helpReply(lang: CopilotLanguage, snapshot: StoreSnapshot): Reply {
  const t = snapshot.facts.today;
  const low = snapshot.facts.lowStock.length;
  return {
    text: pick(lang, {
      en: `Today so far: ${t.revenue} from ${t.transactions} bills, and ${low} item(s) are low on stock.\n\nYou can ask me about today's sales, top sellers, low stock, combo offers, peak hours or customer feedback.`,
      hi: `आज अब तक: ${t.revenue}, ${t.transactions} बिल, और ${low} सामान का स्टॉक कम है।\n\nआप मुझसे आज की बिक्री, सबसे ज़्यादा बिकने वाला सामान, कम स्टॉक, कॉम्बो ऑफ़र, भीड़ का समय या ग्राहकों का फीडबैक पूछ सकते हैं।`,
      hinglish: `Aaj abhi tak: ${t.revenue}, ${t.transactions} bill, aur ${low} item ka stock kam hai.\n\nAap mujhse aaj ki bikri, top selling maal, low stock, combo offer, bheed ka time ya grahak feedback pooch sakte hain.`,
    }),
    speech: pick(lang, {
      en: `Today's sales are ${t.revenue}. Ask me about sales, stock, offers or feedback.`,
      hi: `आज की बिक्री ${t.revenue} है। आप बिक्री, स्टॉक, ऑफ़र या फीडबैक के बारे में पूछ सकते हैं।`,
      hinglish: `Aaj ki bikri ${t.revenue} hai. Aap bikri, stock, offer ya feedback ke baare mein pooch sakte hain.`,
    }),
    language: lang,
    source: 'local',
  };
}
