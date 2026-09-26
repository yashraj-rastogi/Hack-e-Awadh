import { Product, Store, Transaction, Feedback, Insight } from '../types';

export const SEED_STORE: Store = {
  id: 'store-awadh-01',
  ownerId: 'merchant-yashraj-01',
  name: 'Awadh Mart (Hazratganj)',
  category: 'grocery',
  location: 'Hazratganj, Lucknow, UP',
  supportedLanguages: ['hi', 'hinglish', 'en'],
  qrSlug: 'awadh-mart-hazratganj',
  isDemoData: true,
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Pepsi 500ml Pet Bottle',
    barcode: '8901491101837',
    pricePaise: 4000, // ₹40.00
    stock: 14,
    lowStockThreshold: 10,
    category: 'Beverages',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=80',
    description: 'Chilled refreshing carbonated cola beverage',
  },
  {
    id: 'prod-002',
    name: 'Maggi 2-Minute Masala Noodles 70g',
    barcode: '8901058852332',
    pricePaise: 1400, // ₹14.00
    stock: 3, // CRITICAL LOW STOCK
    lowStockThreshold: 15,
    category: 'Instant Food',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    description: 'India favourite instant masala noodles pack',
  },
  {
    id: 'prod-003',
    name: 'Nestle KitKat 4 Finger 38g',
    barcode: '8901058859706',
    pricePaise: 3000, // ₹30.00
    stock: 22,
    lowStockThreshold: 10,
    category: 'Confectionery',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&auto=format&fit=crop&q=80',
    description: 'Crisp wafer finger covered in milk chocolate',
  },
  {
    id: 'prod-004',
    name: 'Thums Up Charged 500ml',
    barcode: '8901030018541',
    pricePaise: 4000, // ₹40.00
    stock: 18,
    lowStockThreshold: 12,
    category: 'Beverages',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&auto=format&fit=crop&q=80',
    description: 'Strong spicy fizzy Indian cola',
  },
  {
    id: 'prod-005',
    name: "Lay's India's Magic Masala 50g",
    barcode: '8901491501019',
    pricePaise: 2000, // ₹20.00
    stock: 25,
    lowStockThreshold: 15,
    category: 'Snacks',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80',
    description: 'Crispy potato chips with authentic spicy Indian masala',
  },
  {
    id: 'prod-006',
    name: 'Amul Taaza Toned Milk 500ml',
    barcode: '8901262010053',
    pricePaise: 2700, // ₹27.00
    stock: 8,
    lowStockThreshold: 10,
    category: 'Dairy',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    description: 'Fresh homogenized toned pasteurized milk',
  },
  {
    id: 'prod-007',
    name: 'Parle-G Gold Biscuits 100g',
    barcode: '8901719101037',
    pricePaise: 1000, // ₹10.00
    stock: 45, // Slump in sales
    lowStockThreshold: 15,
    category: 'Snacks',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80',
    description: 'Iconic glucose biscuits with milk and wheat',
  },
  {
    id: 'prod-008',
    name: 'Britannia Good Day Butter 120g',
    barcode: '8901063012721',
    pricePaise: 2500, // ₹25.00
    stock: 38, // Declining sales
    lowStockThreshold: 15,
    category: 'Snacks',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=80',
    description: 'Rich buttery cookies with cashew hints',
  },
  {
    id: 'prod-009',
    name: 'Red Bull Energy Drink 250ml',
    barcode: '8901030383830',
    pricePaise: 12500, // ₹125.00
    stock: 15,
    lowStockThreshold: 6,
    category: 'Beverages',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    description: 'Vitalizes body and mind premium energy can',
  },
  {
    id: 'prod-010',
    name: 'Kurkure Masala Munch 80g',
    barcode: '8901491361118',
    pricePaise: 2000, // ₹20.00
    stock: 24,
    lowStockThreshold: 10,
    category: 'Snacks',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80',
    description: 'Crunchy tedhe-medhe corn puffs',
  },
  {
    id: 'prod-011',
    name: 'Nescafe Classic Instant Coffee 50g',
    barcode: '8901058862416',
    pricePaise: 16500, // ₹165.00
    stock: 7,
    lowStockThreshold: 5,
    category: 'Beverages',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    description: '100% pure natural coffee granules jar',
  },
  {
    id: 'prod-012',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    barcode: '8904004400588',
    pricePaise: 2800, // ₹28.00
    stock: 30,
    lowStockThreshold: 10,
    category: 'Staples',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&auto=format&fit=crop&q=80',
    description: 'Desh Ka Namak iodized vacuum evaporated salt',
  },
  {
    id: 'prod-013',
    name: 'Cadbury Dairy Milk Silk 60g',
    barcode: '8901058863116',
    pricePaise: 8000, // ₹80.00
    stock: 16,
    lowStockThreshold: 8,
    category: 'Confectionery',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
    description: 'Silky smooth melt-in-mouth milk chocolate bar',
  },
  {
    id: 'prod-014',
    name: "Haldiram's Nagpur Bhujia Sev 200g",
    barcode: '8901233024881',
    pricePaise: 5500, // ₹55.00
    stock: 19,
    lowStockThreshold: 10,
    category: 'Snacks',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    description: 'Crispy spicy tepary bean and gram flour noodles',
  },
  {
    id: 'prod-015',
    name: 'Fortune Sunlite Refined Sunflower Oil 1L',
    barcode: '8906007280014',
    pricePaise: 14500, // ₹145.00
    stock: 11,
    lowStockThreshold: 5,
    category: 'Staples',
    isActive: true,
    updatedAt: Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    description: 'Light and healthy enriched sunflower cooking oil',
  },
];

// Helper to generate 25 days of realistic historical transactions
export function generateSeedTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Generate ~120 transactions over the past 25 days
  for (let day = 25; day >= 0; day--) {
    const dayStart = now - day * dayMs;
    // More transactions in the last 7 days; peak evening sales
    const countThisDay = day === 0 ? 8 : Math.floor(4 + (Math.sin(day) + 1) * 3);

    for (let i = 0; i < countThisDay; i++) {
      // Skew times towards evening: 17:00 - 21:00
      const hour = 11 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      const txnTime = new Date(dayStart).setHours(hour, minute, 0, 0);

      // Evening purchases favor beverages and snacks
      const isEvening = hour >= 17 && hour <= 21;
      const items = [];

      if (isEvening) {
        // High beverage probability
        items.push({
          productId: 'prod-001',
          name: 'Pepsi 500ml Pet Bottle',
          unitPricePaise: 4000,
          quantity: Math.random() > 0.5 ? 2 : 1,
          lineTotalPaise: Math.random() > 0.5 ? 8000 : 4000,
          category: 'Beverages',
        });
        if (Math.random() > 0.4) {
          items.push({
            productId: 'prod-005',
            name: "Lay's India's Magic Masala 50g",
            unitPricePaise: 2000,
            quantity: 1,
            lineTotalPaise: 2000,
            category: 'Snacks',
          });
        }
      } else {
        // General day purchases
        items.push({
          productId: 'prod-002',
          name: 'Maggi 2-Minute Masala Noodles 70g',
          unitPricePaise: 1400,
          quantity: 2,
          lineTotalPaise: 2800,
          category: 'Instant Food',
        });
        if (Math.random() > 0.5) {
          items.push({
            productId: 'prod-006',
            name: 'Amul Taaza Toned Milk 500ml',
            unitPricePaise: 2700,
            quantity: 1,
            lineTotalPaise: 2700,
            category: 'Dairy',
          });
        }
      }

      // Add Parle-G occasionally in older days, rarely in recent 7 days (declining trend)
      if (day > 7 && Math.random() > 0.6) {
        items.push({
          productId: 'prod-007',
          name: 'Parle-G Gold Biscuits 100g',
          unitPricePaise: 1000,
          quantity: 1,
          lineTotalPaise: 1000,
          category: 'Snacks',
        });
      }

      const subtotal = items.reduce((sum, item) => sum + item.lineTotalPaise, 0);

      txns.push({
        id: `txn-${day}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        storeId: 'store-awadh-01',
        paymentId: `pay-${day}-${i}`,
        items,
        subtotalPaise: subtotal,
        discountPaise: 0,
        totalPaise: subtotal,
        paymentStatus: 'paid',
        paymentReference: `PAYTM_${day}${i}_${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: txnTime,
        isSynthetic: true,
      });
    }
  }

  return txns.sort((a, b) => b.createdAt - a.createdAt);
}

export const SEED_FEEDBACK: Feedback[] = [
  {
    id: 'fb-01',
    storeId: 'store-awadh-01',
    transactionId: 'txn-demo-1',
    rating: 'great',
    text: 'Billing was super fast! Camera barcode scan worked immediately.',
    sentiment: 'positive',
    createdAt: Date.now() - 2 * 3600 * 1000,
  },
  {
    id: 'fb-02',
    storeId: 'store-awadh-01',
    transactionId: 'txn-demo-2',
    rating: 'great',
    text: 'Voice Hindi feature bahut achha hai. "Do Pepsi" bola aur cart mein aa gaya.',
    sentiment: 'positive',
    createdAt: Date.now() - 5 * 3600 * 1000,
  },
  {
    id: 'fb-03',
    storeId: 'store-awadh-01',
    transactionId: 'txn-demo-3',
    rating: 'okay',
    text: 'Camera took 2 seconds to focus in low lighting, but manual search helped.',
    sentiment: 'neutral',
    createdAt: Date.now() - 26 * 3600 * 1000,
  },
  {
    id: 'fb-04',
    storeId: 'store-awadh-01',
    transactionId: 'txn-demo-4',
    rating: 'great',
    text: 'Zero queue! Paid directly with Paytm test simulator.',
    sentiment: 'positive',
    createdAt: Date.now() - 48 * 3600 * 1000,
  },
];

export const SEED_INSIGHTS: Insight[] = [
  {
    id: 'ins-01',
    storeId: 'store-awadh-01',
    type: 'low_stock',
    title: 'Critical Inventory Alert: Maggi Noodles',
    explanation: 'Only 3 units of Maggi 2-Minute Masala Noodles remaining against a threshold of 15.',
    recommendation: 'Restock at least 48 units before evening rush (5-8 PM) when instant snacks demand peaks.',
    supportingMetrics: { currentStock: 3, threshold: 15, avgDailySale: 12 },
    generatedAt: Date.now() - 10 * 60 * 1000,
    isSynthetic: true,
  },
  {
    id: 'ins-02',
    storeId: 'store-awadh-01',
    type: 'sales_trend',
    title: 'Category Opportunity: Snack + Cold Drink Combo',
    explanation: 'Beverage sales are up +24% during 5-8 PM, while Biscuit sales dipped -28% over the past 7 days.',
    recommendation: 'Bundle slow-moving biscuits with chilled Pepsi at a ₹5 combo discount to clear biscuit inventory.',
    supportingMetrics: { beverageGrowthPct: '+24%', biscuitSlumpPct: '-28%' },
    generatedAt: Date.now() - 30 * 60 * 1000,
    isSynthetic: true,
  },
];
