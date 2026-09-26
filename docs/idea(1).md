# FinBuddy — Idea & Product Definition

## Project Identity

**Project:** FinBuddy  
**Team:** Byte-Bandits  
**Selected Problem Statement:** PS-02 — Merchant Growth AI (Paytm)  
**Event:** Hack-e-Awadh 2026  
**MVP freeze:** 4:15 PM on 26 Sept 2026  
**Official submission deadline:** 4:30 PM

### Team
- **Yashraj Rastogi** — Full Stack
- **Gaurav Kumar** — Testing / QA
- **Vineet Shukla** — Paytm Payment Integration

---

# Canonical Product Definition

> **FinBuddy is an AI-powered self-checkout and merchant-growth platform for offline stores. Customers self-checkout from their phones using camera-based barcode scanning and voice; every completed transaction updates inventory and becomes structured business data for a conversational AI merchant copilot.**

This is the canonical definition for the MVP and all downstream development documentation.

The product is **not** a personal-finance assistant, loan assistant, insurance assistant, or generic chatbot.

---

# Problem

Small merchants collect transaction information but often do not have an analyst, marketer, or dedicated business-operations team.

Traditional POS systems record sales, but the merchant still needs to determine:
- what is selling,
- what is slowing down,
- which products are low in stock,
- when demand is highest,
- which customers are returning,
- what practical operational action to take next.

### Core question

> **"What is happening in my business, and what should I do next?"**

---

# Why Self-Checkout Belongs in the Product

Self-checkout is the **customer-experience and transaction-generation layer**, not the whole product.

```text
Customer checkout
      ↓
Structured transaction
      ↓
Inventory update
      ↓
Sales + customer + feedback signals
      ↓
Merchant Copilot
      ↓
Insight
      ↓
Operational recommendation
      ↓
Merchant action
```

---

# Customer Experience

The customer scans the store QR and opens a mobile web cashier.

### Core flow

```text
Store QR
→ Guest/Login
→ Scan barcode
→ Voice commands
→ Cart
→ Exact payment
→ Paytm payment flow
→ Payment confirmation
→ Digital receipt
→ Optional WhatsApp receipt
```

### Customer can
- scan product barcodes using the phone camera,
- add/remove products by voice after scanning,
- see quantities and totals,
- manually search when scanning fails,
- use guest checkout,
- use a registered account,
- view previous receipts when registered,
- use represented/tokenized saved-payment references,
- receive a receipt through authorized WhatsApp delivery.

---

# Merchant Experience

The merchant performs minimal onboarding, uses a pre-seeded demo store/catalog, and gets a dashboard with AI Copilot.

```text
Minimal onboarding
→ Store setup
→ Seed/add inventory
→ Store QR
→ Customer transactions
→ Dashboard updates
→ Ask Copilot
→ Insight
→ Recommendation
```

### Example

**Merchant:**  
> "Aaj ka business kaisa raha?"

**FinBuddy:**  
> "Aaj ₹8,420 ki sales hui. Beverage sales sabse strong rahi aur evening mein demand highest thi."

**Merchant:**  
> "Kya karna chahiye?"

**FinBuddy:**  
> "5–8 PM ke beech beverage demand zyada hai. Aap us period ke liye beverage stock thoda badha sakte hain."

---

# PS-02 Alignment

| PS-02 requirement | FinBuddy implementation |
|---|---|
| Merchant-facing AI business partner | AI Merchant Copilot |
| Understand transaction history | Firestore transactions + deterministic analytics |
| Tell merchant what to do next | Operational recommendations |
| Plain-language insights | Conversational summaries |
| Non-technical merchant | Ask instead of navigating analytics |
| Hindi/regional language bonus | Hindi/Hinglish merchant voice |
| Voice-first | Voice-enabled Copilot |
| WhatsApp bonus | Customer-authorized receipt delivery |
| Proactive alerts | Low-stock and trend alerts |
| Synthetic transaction data | Seeded synthetic store history |
| No real merchant data | Demo uses synthetic data |
| No regulated financial advice | Explicit guardrail |

---

# PS-03 Boundary

FinBuddy is **not** being positioned as PS-03.

PS-03 centers on financial-services journeys such as loan, insurance, or claims workflows. FinBuddy's journey is retail commerce:

```text
Product → Cart → Checkout → Payment → Receipt
```

Do not add loan, credit, underwriting, insurance, or financial-product recommendation features to the MVP.

---

# PS-04 Technical Angle

The checkout is also an agentic multi-step workflow:

```text
Start checkout
→ Scan product
→ Resolve product
→ Build cart
→ Calculate total
→ Prepare payment
→ Wait for payment
→ Verify result
→ Generate receipt
→ Update inventory
```

This provides technical depth without changing the selected problem statement.

---

# MVP Scope

## P0 — Non-negotiable before 4:15 PM

### Customer
- Store QR
- Mobile web checkout
- Guest checkout
- Barcode scanning
- Voice add/remove/query commands
- Cart
- Deterministic total calculation
- Exact payment amount
- Paytm Payment Gateway API adapter
- Payment success/failure state
- Digital receipt
- Transaction persistence
- Inventory update

### Merchant
- Merchant login
- Minimal store setup / pre-seeded demo store
- Store QR
- Inventory view
- Transaction history
- Sales overview
- AI Copilot
- Voice/text interaction
- Hindi/Hinglish query handling
- Low-stock alerts
- Core business insights
- Customer feedback summary

## P1 — Only after P0 is stable
- Registered customer account flow
- Receipt history
- Tokenized/sandbox saved payment-method references
- Twilio WhatsApp receipt
- Additional proactive alerts
- Recommendation cards
- Checkout execution trace
- Peak-hour analytics
- Repeat-customer insights
- Settlement summary from synthetic/payment records

## P2 — Second version / spare time
- Execute non-financial merchant actions
- Multi-store/mall management
- Image-based product recognition
- Demand forecasting
- Personalized offers
- WhatsApp receipt-history interaction
- More regional languages

---

# Safety Rules

FinBuddy must never:
- provide regulated financial advice,
- recommend taking a loan,
- make credit/underwriting decisions,
- make insurance claim decisions,
- recommend regulated financial products,
- move real money autonomously,
- allow the LLM to become the source of truth for payment verification or inventory arithmetic.

Merchant actions in MVP are recommendations only.

---

# Data Rules

The prototype uses **synthetic hackathon data only**.

Suggested demo history:
- one primary demo store,
- 100–300 products,
- hundreds of customers,
- 1,000+ transactions,
- 20–30 historical days,
- inventory events,
- feedback,
- deliberate sales patterns.

### Core Product Loop

> **Purchase → Payment → Data → Insight → Action**

### Customer promise
**Scan → Talk → Pay → Receipt**

### Merchant promise
**Ask → Understand → Act**
