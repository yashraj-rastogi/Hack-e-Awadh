# FinBuddy — AI-Powered Retail Automation

> **CodeBlitz 2.0 · Primary Track: AI & Automation**  
> **Team Byte-Bandits**: Yashraj Rastogi (Lead) · Ananya Yadav

[![CodeBlitz 2.0](https://img.shields.io/badge/CodeBlitz_2.0-AI_%26_Automation_Track-00BAF2.svg)](https://codeblitz.dev)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![ElevenLabs](https://img.shields.io/badge/Voice_AI-ElevenLabs_Multilingual-FF6B6B.svg)](https://elevenlabs.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_Flash-8E75C2.svg?logo=google)](https://ai.google.dev/)
[![Paytm](https://img.shields.io/badge/Payment_Gateway-Paytm_Sandbox-002E6E.svg)](https://developer.paytm.com/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Digital_Receipts-25D366.svg?logo=whatsapp)](https://www.whatsapp.com/)

---

## 🎯 Canonical Product Definition

> **FinBuddy combines AI self-checkout with a conversational merchant copilot, turning everyday retail transactions into automated business intelligence.**

FinBuddy is an **AI-powered retail automation platform** where customers can self-checkout using camera-based barcode scanning and natural voice, while every completed transaction automatically becomes structured business data that powers an intelligent conversational merchant copilot.

### 🌟 Core Product Promises

```
  ┌─────────────────────────────────────────────────────────────┐
  │                    CUSTOMER PROMISE                         │
  │              Scan → Talk → Pay → Receipt                    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Every completed transaction feeds
                                 ▼ structured data into the merchant brain
  ┌─────────────────────────────────────────────────────────────┐
  │                    MERCHANT PROMISE                         │
  │                 Ask → Understand → Act                      │
  └─────────────────────────────────────────────────────────────┘
```

### 🔄 The Core System Automation Loop

$$\mathbf{Purchase \longrightarrow Payment \longrightarrow Data \longrightarrow Insight \longrightarrow Recommendation}$$

1. **Purchase**: Customer scans physical barcodes with mobile camera or speaks natural Hindi/Hinglish/English commands.
2. **Payment**: Verified server-side checkout via **Paytm Payment Gateway** (Sandbox UPI/NetBanking or instant fallback).
3. **Data**: Transaction is finalized atomically — inventory drops, sales ledger records, and customer feedback persists.
4. **Insight**: Real-time analytical extractors detect low-stock threats, evening peak demand spikes, and slow-moving items.
5. **Recommendation**: Merchant Copilot delivers conversational, data-backed operational actions (**Observation $\rightarrow$ Explanation $\rightarrow$ Recommendation**) with one-click restock proposals.

---

## ⚡ CodeBlitz 2.0 Positioning: AI & Automation

FinBuddy was engineered specifically for the **AI & Automation** track of **CodeBlitz 2.0**:

1. **AI Vision & Voice Automation**: Camera-based sub-second EAN-13 barcode detection paired with **ElevenLabs Multilingual v2** high-fidelity speech synthesis and **Google Gemini Flash** bilingual intent parsing.
2. **Deterministic Transaction Integrity**: The LLM handles natural language understanding, reasoning, and operational recommendations. Deterministic TypeScript code strictly handles price math, cart totals, atomic inventory decrements, payment state machines, and receipt generation.
3. **Real-World Offline Retail Workflow**: From 4-step merchant onboarding with printable physical QR standees to zero-install mobile shopper self-checkout.
4. **Actionable Business Intelligence**: Merchants can literally **"Ask Your Business"** in everyday language and receive telemetry-backed operational guidance instead of staring at raw dashboards.
5. **Strict Ethical Guardrails**: Hard-coded safety interceptors prevent regulated financial advice (loans, insurance, mutual funds, credit underwriting) and gracefully redirect merchants to operational stock & sales trends.

---

## 🏷️ Branding & Technology Architecture

FinBuddy establishes a clear visual and technological hierarchy:

- **PRIMARY BRAND**: **FinBuddy**
- **SECONDARY DESCRIPTOR**: **AI-Powered Retail Automation** *(AI Self-Checkout + Merchant Copilot)*
- **TECHNOLOGY / INTEGRATION**: **Paytm Payment Gateway** & **ElevenLabs Voice AI**

```
                     ┌─────────────────────────────────────────┐
                     │                 FINBUDDY                │
                     │       AI-Powered Retail Automation      │
                     └────────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   CUSTOMER CHECKOUT    │                      │    MERCHANT COPILOT    │
     │  • Camera Barcode Scan │                      │  • "Ask Your Business" │
     │  • ElevenLabs Voice AI │                      │  • ElevenLabs Speech   │
     │  • Instant Digital Bill│                      │  • Gemini Flash Reason │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
                  │              ┌────────────────┐               │
                  └─────────────►│ Paytm Gateway  │◄──────────────┘
                                 │ UPI / Cards    │
                                 └────────────────┘
```

---

## 🎙️ Voice Architecture: ElevenLabs Integration

**ElevenLabs** is a core pillar of FinBuddy's conversational experience:

- **Customer Voice Assistant**: Shoppers tap the microphone to modify cart quantities, query prices, or check availability (*"Do aur Pepsi add kar do"*, *"Ek Maggi hata do"*, *"Total kitna hua?"*). FinBuddy executes the deterministic cart operation and speaks the confirmation via ElevenLabs.
- **Merchant Copilot**: Store owners talk to their business using spoken natural Hindi, Hinglish, or English (*"Aaj ka business kaisa raha?"*). The Copilot responds with both clear visual metrics and lifelike spoken audio generated via ElevenLabs `eleven_multilingual_v2`.
- **Backend Streaming Proxy**: The Vite server proxies TTS (`/api/tts`) and STT (`/api/stt`) requests directly to ElevenLabs, keeping API keys securely on the server side without leaking secrets to client browsers.
- **Graceful Fallback**: If the ElevenLabs API key is absent or network fails, FinBuddy automatically falls back to browser Web Speech API so demonstrations are never interrupted.

---

## 💳 Payment Gateway: Paytm Integration

FinBuddy treats **Paytm Payment Gateway** as a clean, modular integration layer:

```
PaymentProvider
    ├── PaytmProvider (securegw-stage.paytm.in Sandbox UPI / NetBanking)
    └── Simulator/FallbackProvider (deterministic test mode for evaluation)
```

- **Server-Side Security**: Credentials (`VITE_PAYTM_MID`, `VITE_PAYTM_MERCHANT_KEY`) are kept isolated; orders are verified before finalization.
- **Idempotent Inventory Decoupling**: Inventory is decremented **only once** upon verified payment. Pending, declined, or canceled payments never mutate stock levels.
- **Simulated Soundbox Confirmation**: Plays realistic audio chime (*"Paytm par 140 rupaye praapt hue"*) upon successful checkout completion.

---

## 🛍️ Customer Experience Workflow

1. **Store Entrance QR**: Shopper scans the physical FinBuddy acrylic standee QR placed at the counter.
2. **Zero-Install Web App**: Browser opens directly to `/s/:storeId/checkout` with no app download or login required.
3. **Camera Barcode Scan**: Real-time camera viewfinder identifies EAN-13 barcodes with audio POS beep feedback.
4. **Voice Modification**: Shopper taps mic to speak natural instructions via ElevenLabs.
5. **Deterministic Cart Math**: Sub-totals, taxes, and exact total amounts calculate deterministically.
6. **Paytm Payment**: 1-tap checkout via UPI, NetBanking, or Wallet.
7. **Digital Receipt & Exit Pass**: Instant digital bill generated with store info, transaction ID, items, and optional instant WhatsApp receipt.

---

## 🏪 Merchant Copilot Workflow

The merchant dashboard is built around **"Ask Your Business"**, not just charts:

1. **Today's Business**: Real-time sales, transaction count, average bill size, and stock alerts.
2. **AI Attention & Operational Insights**: Proactive alerts highlighting low-stock risks, category sales spikes, and combo promotion opportunities.
3. **Ask Your Business (Voice & Text)**:
   - *"Aaj ka business kaisa raha?"* $\rightarrow$ Copilot quotes real numbers from the sales ledger.
   - *"Kaunsa product sabse zyada bika?"* $\rightarrow$ Copilot lists top units and revenue.
   - *"Mera stock kahan low hai?"* $\rightarrow$ Copilot lists low-stock items and proposes a 1-click restock action.
   - *"Mujhe kya action lena chahiye?"* $\rightarrow$ Copilot provides operational advice following **Observation $\rightarrow$ Explanation $\rightarrow$ Recommendation**.
4. **Customizable Inventory**: Adjust stock, edit retail prices, or add new items on the fly.
5. **Multi-Store Management**: Onboard new stores via the 4-step wizard and print physical QR standees.

---

## 🚦 Application Routes

| Route | Purpose | Audience |
| :--- | :--- | :--- |
| **`/`** | FinBuddy Platform Home (Overview, System Loop, Architecture, Demo Access) | All Users & Judges |
| **`/merchant/onboard`** | 4-Step Merchant Onboarding Wizard (Profile, Catalog Presets, Standee QR Generator) | Store Owners |
| **`/merchant/login`** | Merchant Portal Login with 1-click CodeBlitz 2.0 Staging Demo Credentials | Store Owners & Evaluators |
| **`/merchant/dashboard`** | Merchant Back-Office: Live Sales, Customizable Inventory, Feedback & AI Copilot | Store Owners |
| **`/s/:storeId/checkout`** | In-Store Self-Checkout with Camera Barcode Scanner & ElevenLabs Voice AI | In-Store Shoppers |
| **`/s/:storeId/receipt/:id`** | Digital Tax Receipt, Verifiable Exit Pass & WhatsApp Delivery Preview | Shoppers |
| **`/customer`** | Customer Hub: Guest Checkout, Pre-Built Shopping Lists, Past Order History | Shoppers |
| **`/test_barcodes.html`** | Printable / Secondary Screen Barcode Sheet for Scanner Testing | Evaluators |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yashraj-rastogi/Hack-e-Awadh.git
cd Hack-e-Awadh

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Google Gemini API Key (Required for AI Intent Classification & Copilot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs Voice AI (For High-Fidelity Multilingual Speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb
ELEVENLABS_TTS_MODEL=eleven_multilingual_v2

# Paytm Payment Gateway Integration
VITE_ENABLE_MOCK_PAYMENT=true
VITE_PAYTM_MID=AWADHMART8927163
VITE_PAYTM_MERCHANT_KEY=YOUR_PAYTM_KEY
```

### 4. Start Development Server
```bash
# Run the local Vite dev server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🎬 Step-by-Step CodeBlitz 2.0 Demo Script

Follow this script for live evaluation:

### Part 1: Customer Self-Checkout (Scan → Talk → Pay → Receipt)
1. **Open Customer Checkout**: Navigate to `http://localhost:5173/s/store-awadh-01/checkout`.
2. **Open Test Barcodes Sheet**: In a secondary tab or phone, open `http://localhost:5173/test_barcodes.html`.
3. **Scan First Product**: Allow camera access and point at **Pepsi 500ml** barcode (`8901764012297`). Hear the POS beep! Pepsi is added to the cart.
4. **Scan Second Product**: Point camera at **Maggi Noodles** barcode (`8901058852448`). Maggi appears in cart.
5. **Modify Cart via Voice**: Tap the microphone icon and speak in Hindi or English:
   > *"Do aur Pepsi add kar do"*
   FinBuddy parses the intent, updates Pepsi quantity to 3, and speaks back via **ElevenLabs**.
6. **Review Exact Total**: Notice the deterministic cart calculation displaying ₹190.00.
7. **Generate Payment**: Tap **"Generate Payment"** $\rightarrow$ select Paytm Gateway Sandbox $\rightarrow$ click **"Confirm & Pay"**.
8. **View Digital Receipt**: Confetti triggers, payment chimes play, and the digital receipt appears with Paytm reference, itemized GST breakdown, and WhatsApp delivery preview.

### Part 2: Merchant AI Copilot (Ask → Understand → Act)
9. **Open Merchant Dashboard**: In another window, navigate to `http://localhost:5173/merchant/dashboard`.
10. **Verify Real-Time Synchronization**: Without refreshing, notice the new transaction in the live sales feed and Maggi's stock decrementing atomically.
11. **Ask Today's Business**: Click the floating FinBuddy Copilot robot and ask (or tap chip):
    > *"Aaj ka business kaisa raha?"*
    Copilot quotes exact sales from the ledger, notes peak beverage demand, and speaks the answer via **ElevenLabs**.
12. **Ask Operational Action**: Ask:
    > *"Mujhe kya action lena chahiye?"*
    Copilot provides an **Observation $\rightarrow$ Explanation $\rightarrow$ Recommendation** response, suggesting an evening snack & drink combo.
13. **Ask Low Stock & Restock**: Ask:
    > *"Kaunsa product low hai?"*
    Copilot identifies Maggi as low stock and presents a **"Confirm restock (+30 units)"** action button that updates inventory upon 1-click merchant confirmation.
14. **Test Ethical Safety Guardrails**: Ask:
    > *"Should I take a 10 lakh business loan?"*
    Copilot safely declines regulated financial underwriting and redirects to sales and inventory trends.

---

## 🛡️ Responsible AI & Engineering Guardrails

- **Zero Synthetic Hallucinations**: Every metric quoted by the Copilot is derived deterministically from the store facts snapshot built from real transactions and inventory.
- **Strict Non-Financial Boundaries**: Hard-coded regular expressions and prompt constraints forbid lending, investment, loan, and insurance recommendations.
- **Deterministic Billing**: LLMs are never used to compute currency, invoice line totals, or execute balances.
- **Atomic Operations**: Inventory decrements execute in isolated transactional boundaries to eliminate race conditions and double-spending.

---

## 👥 Team Byte-Bandits

- **Yashraj Rastogi** — Lead & Full-Stack Architect
- **Ananya Yadav** — UI/UX & Voice Engineering

*Built for CodeBlitz 2.0 — AI & Automation Track.*
