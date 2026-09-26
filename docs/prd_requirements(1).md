# FinBuddy — PRD Requirements

## Product Goal

Deliver a working MVP by **4:15 PM**, with the official submission deadline at **4:30 PM**. The final 15 minutes are reserved for freeze, verification and submission only.

The MVP must demonstrate:

> **Customer checkout → transaction → inventory update → merchant insight → recommendation**

---

# Functional Requirements

## FR-01 Store QR
Generate a unique QR payload for each store; scanning opens its checkout.

## FR-02 Guest Checkout
Customer can purchase without creating an account.

## FR-03 Registered Customer
P1: receipt history, profile, authorized WhatsApp delivery, tokenized saved-payment references.

## FR-04 Barcode Scanning
Use the phone camera to scan synthetic product barcodes.

## FR-05 Manual Search
If scanning fails, search the catalog manually.

## FR-06 Cart
Support add, remove, quantity change, clear cart, subtotal and total.

## FR-07 Customer Voice
Support add/remove/change quantity/show total/show cart/clear cart/generate payment.

## FR-08 Exact Payment
Use the deterministic server-calculated cart total.

## FR-09 Paytm Gateway
Use a server-side Paytm Payment Gateway API adapter with secure payment state handling.

## FR-10 Receipt
Generate an itemized digital receipt after verified payment.

## FR-11 Inventory Update
Decrement inventory exactly once after verified success.

## FR-12 Transaction Persistence
Persist successful transaction data for merchant analytics.

## FR-13 Merchant Onboarding
Minimal store setup plus pre-seeded catalog.

## FR-14 Store QR
Merchant can view/generate their store QR.

## FR-15 Merchant Dashboard
Show sales, transactions, inventory, alerts and feedback.

## FR-16 Merchant Copilot
Conversational AI for business questions by voice/text.

## FR-17 Plain-Language Insights
Explain what happened, why it matters, and where appropriate suggest a practical action.

## FR-18 Proactive Alerts
At minimum: low-stock and sales/trend alert.

## FR-19 Customer Feedback
Rating + text; merchant receives summary.

## FR-20 WhatsApp Receipt
Twilio WhatsApp receipt for customers with explicit opt-in; P1 if integration threatens the core deadline.

---

# Non-Functional Requirements

- Mobile-first customer experience.
- Desktop-friendly merchant dashboard.
- Secure server-side payment/integration secrets.
- Role-based data access.
- Synthetic demo data only.
- Reliable retries and recoverable errors.
- No regulated financial advice.

---

# Acceptance Criteria — P0

A judge must be able to:

1. Scan a store QR.
2. Enter checkout.
3. Scan synthetic barcodes.
4. Modify the cart by voice.
5. See the exact total.
6. Start the Paytm/sandbox payment path.
7. See success/failure/pending behavior.
8. Receive a digital receipt.
9. See inventory decrease exactly once after payment success.
10. See the transaction in the merchant dashboard.
11. Ask the Merchant Copilot a natural-language question.
12. Receive a plain-language insight.
13. Receive an operational recommendation.
14. See a proactive alert.

---

# Analytics Requirements

Deterministic calculations should provide the facts used by the AI.

| Insight | Deterministic logic |
|---|---|
| Today's sales | Sum paid transactions for date |
| Sales comparison | Current vs comparable range |
| Top products | Sum quantity by product |
| Slow products | Low/declining sales over range |
| Low stock | `stock <= threshold` |
| Peak hours | Group paid transactions by hour |
| Repeat customers | Customer with >= 2 paid transactions in range |
| Feedback | Aggregate rating + themes |
| Category trend | Group sales by category |

---

# Guardrails

Never:
- recommend loans/credit/investments,
- make lending or underwriting decisions,
- make insurance claim decisions,
- recommend regulated financial products,
- move real money autonomously.

MVP merchant actions are recommendations only.

---

# Out of Scope Before P0

- multi-store hierarchy,
- mall management,
- advanced demand forecasting,
- complex loyalty/CRM,
- merchant WhatsApp analytics,
- production-scale payment settlement,
- autonomous financial decisions.
