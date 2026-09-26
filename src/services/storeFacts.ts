import type { Product, Transaction, Feedback } from '../types';
import { getProducts, getTransactions, getFeedback, getStore } from './db';

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatINR(paise: number): string {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatPct(p: number | null): string {
  if (p === null) return 'new (no sales in previous period)';
  return `${p > 0 ? '+' : ''}${p}%`;
}

function hourLabel(h: number): string {
  const fmt = (x: number) => {
    const hh = x % 24;
    const suffix = hh >= 12 ? 'PM' : 'AM';
    return `${hh % 12 === 0 ? 12 : hh % 12} ${suffix}`;
  };
  return `${fmt(h)}-${fmt(h + 1)}`;
}

export interface ProductStat {
  name: string;
  category: string;
  units7d: number;
  revenue7d: string;
  revenue7dPaise: number;
  unitsPrev7d: number;
  stock: number;
  lowStockThreshold: number;
  price: string;
  pricePaise: number;
}

export interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
  unitsSoldLast7d: number;
  suggestedReorderQty: number;
}

export interface StoreFacts {
  storeName: string;
  generatedAt: string;
  today: { revenue: string; revenuePaise: number; transactions: number; averageBill: string };
  yesterday: { revenue: string; transactions: number };
  last7Days: { revenue: string; revenuePaise: number; transactions: number; averageBill: string };
  previous7Days: { revenue: string; revenuePaise: number; transactions: number };
  weekOverWeekRevenueChange: string;
  topProductsByUnits7d: { name: string; units: number; revenue: string }[];
  topProductsByRevenue7d: { name: string; units: number; revenue: string }[];
  slowMovers7d: { name: string; units: number; unitsPrev7d: number; stock: number }[];
  lowStock: LowStockItem[];
  peakHours7d: { window: string; transactions: number }[];
  categoryTrends7dVsPrev7d: { category: string; revenue7d: string; revenuePrev7d: string; change: string }[];
  feedback: {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
    positivePct: number;
    recentComments: string[];
  };
  catalog: { name: string; category: string; price: string; stock: number; threshold: number }[];
}

export interface StoreSnapshot {
  facts: StoreFacts;
  products: Product[];
  productStats: ProductStat[];
}

function inRange(t: Transaction, from: number, to: number) {
  return t.createdAt >= from && t.createdAt < to;
}

function sumPaise(txns: Transaction[]) {
  return txns.reduce((s, t) => s + t.totalPaise, 0);
}

function avgBill(txns: Transaction[]) {
  return txns.length ? formatINR(sumPaise(txns) / txns.length) : '₹0';
}

export function buildStoreSnapshot(storeId: string = 'store-awadh-01'): StoreSnapshot {
  const store = getStore(storeId);
  const products = getProducts(storeId).filter((p) => p.isActive !== false);
  const txns = getTransactions(storeId);
  const feedback: Feedback[] = getFeedback(storeId);

  const now = Date.now();
  const startToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  const endToday = startToday + DAY_MS;
  const start7 = startToday - 6 * DAY_MS;
  const startPrev7 = start7 - 7 * DAY_MS;

  const todayTx = txns.filter((t) => inRange(t, startToday, endToday));
  const yesterdayTx = txns.filter((t) => inRange(t, startToday - DAY_MS, startToday));
  const last7Tx = txns.filter((t) => inRange(t, start7, endToday));
  const prev7Tx = txns.filter((t) => inRange(t, startPrev7, start7));

  const unitsBy = (list: Transaction[]) => {
    const map = new Map<string, { units: number; revenue: number }>();
    for (const t of list) {
      for (const item of t.items) {
        const cur = map.get(item.productId) || { units: 0, revenue: 0 };
        cur.units += item.quantity;
        cur.revenue += item.lineTotalPaise;
        map.set(item.productId, cur);
      }
    }
    return map;
  };
  const cur = unitsBy(last7Tx);
  const prev = unitsBy(prev7Tx);

  const productStats: ProductStat[] = products.map((p) => {
    const c = cur.get(p.id) || { units: 0, revenue: 0 };
    const pr = prev.get(p.id) || { units: 0, revenue: 0 };
    return {
      name: p.name,
      category: p.category,
      units7d: c.units,
      revenue7d: formatINR(c.revenue),
      revenue7dPaise: c.revenue,
      unitsPrev7d: pr.units,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      price: formatINR(p.pricePaise),
      pricePaise: p.pricePaise,
    };
  });

  const byUnits = [...productStats].filter((s) => s.units7d > 0).sort((a, b) => b.units7d - a.units7d);
  const byRevenue = [...productStats].filter((s) => s.revenue7dPaise > 0).sort((a, b) => b.revenue7dPaise - a.revenue7dPaise);
  const slow = [...productStats]
    .sort((a, b) => a.units7d - b.units7d || b.stock - a.stock)
    .slice(0, 4);

  const lowStock: LowStockItem[] = products
    .filter((p) => p.stock <= p.lowStockThreshold)
    .sort((a, b) => a.stock / Math.max(1, a.lowStockThreshold) - b.stock / Math.max(1, b.lowStockThreshold))
    .map((p) => {
      const sold = cur.get(p.id)?.units || 0;
      const target = Math.max(p.lowStockThreshold * 2, Math.ceil(sold * 1.5));
      return {
        name: p.name,
        stock: p.stock,
        threshold: p.lowStockThreshold,
        unitsSoldLast7d: sold,
        suggestedReorderQty: Math.max(6, target - p.stock),
      };
    });

  const hourCounts = new Map<number, number>();
  for (const t of last7Tx) {
    const h = new Date(t.createdAt).getHours();
    hourCounts.set(h, (hourCounts.get(h) || 0) + 1);
  }
  const peakHours7d = [...hourCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h, n]) => ({ window: hourLabel(h), transactions: n }));

  const catRevenue = (list: Transaction[]) => {
    const map = new Map<string, number>();
    for (const t of list) for (const i of t.items) map.set(i.category, (map.get(i.category) || 0) + i.lineTotalPaise);
    return map;
  };
  const catCur = catRevenue(last7Tx);
  const catPrev = catRevenue(prev7Tx);
  const categories = new Set([...catCur.keys(), ...catPrev.keys()]);
  const categoryTrends = [...categories]
    .map((c) => ({
      category: c,
      cur: catCur.get(c) || 0,
      prev: catPrev.get(c) || 0,
    }))
    .sort((a, b) => b.cur - a.cur)
    .map((c) => ({
      category: c.category,
      revenue7d: formatINR(c.cur),
      revenuePrev7d: formatINR(c.prev),
      change: formatPct(pctChange(c.cur, c.prev)),
    }));

  const positive = feedback.filter((f) => f.sentiment === 'positive').length;
  const neutral = feedback.filter((f) => f.sentiment === 'neutral').length;
  const negative = feedback.filter((f) => f.sentiment === 'negative').length;

  const facts: StoreFacts = {
    storeName: store.name,
    generatedAt: new Date(now).toLocaleString('en-IN'),
    today: {
      revenue: formatINR(sumPaise(todayTx)),
      revenuePaise: sumPaise(todayTx),
      transactions: todayTx.length,
      averageBill: avgBill(todayTx),
    },
    yesterday: { revenue: formatINR(sumPaise(yesterdayTx)), transactions: yesterdayTx.length },
    last7Days: {
      revenue: formatINR(sumPaise(last7Tx)),
      revenuePaise: sumPaise(last7Tx),
      transactions: last7Tx.length,
      averageBill: avgBill(last7Tx),
    },
    previous7Days: {
      revenue: formatINR(sumPaise(prev7Tx)),
      revenuePaise: sumPaise(prev7Tx),
      transactions: prev7Tx.length,
    },
    weekOverWeekRevenueChange: formatPct(pctChange(sumPaise(last7Tx), sumPaise(prev7Tx))),
    topProductsByUnits7d: byUnits.slice(0, 5).map((s) => ({ name: s.name, units: s.units7d, revenue: s.revenue7d })),
    topProductsByRevenue7d: byRevenue.slice(0, 5).map((s) => ({ name: s.name, units: s.units7d, revenue: s.revenue7d })),
    slowMovers7d: slow.map((s) => ({ name: s.name, units: s.units7d, unitsPrev7d: s.unitsPrev7d, stock: s.stock })),
    lowStock,
    peakHours7d,
    categoryTrends7dVsPrev7d: categoryTrends,
    feedback: {
      total: feedback.length,
      positive,
      neutral,
      negative,
      positivePct: feedback.length ? Math.round((positive / feedback.length) * 100) : 0,
      recentComments: feedback
        .filter((f) => f.text)
        .slice(0, 5)
        .map((f) => `[${f.rating}] ${(f.text || '').replace(/\s+/g, ' ').slice(0, 140)}`),
    },
    catalog: products.map((p) => ({
      name: p.name,
      category: p.category,
      price: formatINR(p.pricePaise),
      stock: p.stock,
      threshold: p.lowStockThreshold,
    })),
  };

  return { facts, products, productStats };
}
