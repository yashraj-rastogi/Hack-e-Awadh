/**
 * agentLoop.ts — FinBuddy Autonomous Agent
 * 
 * Runs on a timer tick (every 5 min) or on-demand.
 * Perceives store state → generates goals → fires alerts → proposes actions.
 * The merchant confirms/dismisses; the agent never executes blindly without audit.
 */

import { buildStoreSnapshot } from './storeFacts';
import { getAgentGoals, saveAgentGoal, saveAgentAlert, getAgentAlerts } from './db';
import { AgentGoal, AgentAlert, DemandSignal, CopilotMessage, CopilotLanguage } from '../types';
import { askMerchantCopilot } from './aiService';

// ─── Demand Signal Generator ─────────────────────────────────────────────

export function computeDemandSignals(storeId: string = 'store-awadh-01'): DemandSignal[] {
  const { productStats } = buildStoreSnapshot(storeId);
  return productStats
    .filter((s) => s.units7d > 0 || s.unitsPrev7d > 0)
    .map((s) => {
      const change =
        s.unitsPrev7d > 0
          ? Math.round(((s.units7d - s.unitsPrev7d) / s.unitsPrev7d) * 100)
          : s.units7d > 0
          ? 100
          : 0;

      const trend: DemandSignal['trend'] =
        change > 15 ? 'rising' : change < -15 ? 'falling' : 'stable';

      const urgency: DemandSignal['urgency'] =
        Math.abs(change) > 40 ? 'high' : Math.abs(change) > 20 ? 'medium' : 'low';

      const suggestion =
        trend === 'rising' && s.stock < s.lowStockThreshold * 2
          ? `High velocity: recommend ordering ${Math.max(10, s.units7d)} units before peak hours.`
          : trend === 'falling'
          ? `Sales velocity dipped ${Math.abs(change)}%: test a combo or shelf banner.`
          : `Stable demand: ${s.units7d} units moving per cycle.`;

      return {
        productId: s.name,
        productName: s.name,
        trend,
        changePercent: change,
        suggestion,
        urgency,
      };
    })
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 6);
}

// ─── Helper: Parse Peak Hour Window ──────────────────────────────────────

function parseWindowStartHour(windowStr: string): number | null {
  const match = windowStr.match(/^(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const ampm = match[2].toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return hour;
}

// ─── Agent Tick: Perceive + Reason + Emit Goals ──────────────────────────

export interface AgentTickResult {
  newAlerts: AgentAlert[];
  newGoals: AgentGoal[];
  demandSignals: DemandSignal[];
  proactiveCopilotMessage?: CopilotMessage;
}

export async function runAgentTick(
  storeId: string = 'store-awadh-01',
  language: CopilotLanguage = 'hi',
  existingMessages: CopilotMessage[] = []
): Promise<AgentTickResult> {
  const snapshot = buildStoreSnapshot(storeId);
  const { facts } = snapshot;
  const existingGoals = getAgentGoals(storeId);
  const now = Date.now();

  const newAlerts: AgentAlert[] = [];
  const newGoals: AgentGoal[] = [];

  // ── Rule 1: Zero-stock critical alert ───────────────────────────────────
  for (const item of facts.lowStock.filter((i) => i.stock === 0)) {
    const goalId = `goal_zero_${item.name.replace(/\s/g, '_')}_${Math.floor(now / 86400000)}`;

    // Only alert once per 6 hours per product
    const alreadyAlerted = getAgentAlerts(storeId).some(
      (a) => a.goalId === goalId && now - a.triggeredAt < 6 * 60 * 60 * 1000
    );
    if (alreadyAlerted) continue;

    const goal: AgentGoal = {
      id: goalId,
      type: 'restock',
      productName: item.name,
      quantity: item.suggestedReorderQty,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      status: 'pending',
      reason: `${item.name} is out of stock. Sold ${item.unitsSoldLast7d} units last week.`,
      followUpCount: 0,
    };

    const existingGoal = existingGoals.find((g) => g.id === goalId);
    if (!existingGoal) {
      saveAgentGoal(storeId, goal);
      newGoals.push(goal);
    }

    const alert: AgentAlert = {
      id: `alert_${goalId}_${now}`,
      severity: 'critical',
      title: `${item.name} — Stock Zero`,
      body:
        language === 'hi'
          ? `${item.name} का स्टॉक शून्य (0) हो गया है! पिछले हफ्ते ${item.unitsSoldLast7d} units बिकी थीं। तुरंत ${item.suggestedReorderQty} units रीस्टॉक करने की सिफारिश है।`
          : `${item.name} has hit 0 stock! Last week velocity was ${item.unitsSoldLast7d} units. Autonomous recommendation: Restock ${item.suggestedReorderQty} units.`,
      productName: item.name,
      goalId,
      triggeredAt: now,
      acknowledged: false,
    };
    saveAgentAlert(storeId, alert);
    newAlerts.push(alert);
  }

  // ── Rule 2: Peak hour approaching alert ─────────────────────────────────
  const currentHour = new Date().getHours();
  const peakHours = facts.peakHours7d;
  const isApproachingPeak = peakHours.some((ph) => {
    const peakH = parseWindowStartHour(ph.window);
    return peakH !== null && peakH - currentHour === 1;
  });

  if (isApproachingPeak && facts.lowStock.length > 0) {
    const alertId = `alert_peak_prep_${Math.floor(now / 3600000)}`;
    const alreadyAlerted = getAgentAlerts(storeId).some((a) => a.id === alertId);
    if (!alreadyAlerted) {
      const alert: AgentAlert = {
        id: alertId,
        severity: 'warning',
        title: 'Peak Rush Approaching',
        body:
          language === 'hi'
            ? `स्टोर का पीक समय अगले 1 घंटे में शुरू हो रहा है। ${facts.lowStock
                .map((i) => i.name)
                .slice(0, 3)
                .join(', ')} का स्टॉक काफी कम है — शेल्फ तुरंत भरें।`
            : `Your high-traffic window begins in ~1 hour. Low stock detected on: ${facts.lowStock
                .map((i) => i.name)
                .slice(0, 3)
                .join(', ')} — replenish shelves now.`,
        triggeredAt: now,
        acknowledged: false,
      };
      saveAgentAlert(storeId, alert);
      newAlerts.push(alert);
    }
  }

  // ── Rule 3: Follow-up on unactioned goals ───────────────────────────────
  const stalePendingGoals = existingGoals.filter(
    (g) =>
      g.status === 'pending' &&
      now - g.createdAt > 4 * 60 * 60 * 1000 &&
      g.followUpCount < 2
  );

  let proactiveCopilotMessage: CopilotMessage | undefined;

  if (newAlerts.length > 0 || stalePendingGoals.length > 0) {
    const triggerContext =
      newAlerts.length > 0
        ? `AGENT_AUTONOMOUS_ALERT: These critical conditions were detected by the autonomous agent: ${newAlerts
            .map((a) => a.title + ': ' + a.body)
            .join('; ')}. Give a direct operational warning and state the exact restock action to take.`
        : `AGENT_FOLLOWUP: The merchant has not acted on the pending restock goal: ${stalePendingGoals
            .map((g) => g.reason)
            .join('; ')}. Remind them with sales data justification.`;

    try {
      proactiveCopilotMessage = await askMerchantCopilot(
        triggerContext,
        storeId,
        existingMessages.slice(-4),
        language
      );
      if (proactiveCopilotMessage) {
        proactiveCopilotMessage.id = `agent_${proactiveCopilotMessage.id}`;
      }

      for (const g of stalePendingGoals) {
        saveAgentGoal(storeId, { ...g, followUpCount: g.followUpCount + 1 });
      }
    } catch (e) {
      console.warn('Agent proactive message generation failed, falling back:', e);
    }
  }

  return {
    newAlerts,
    newGoals,
    demandSignals: computeDemandSignals(storeId),
    proactiveCopilotMessage,
  };
}
