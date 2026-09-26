# FinBuddy — Smart Kirana Self-Checkout & AI Merchant Copilot

> **Hack-e-Awadh 2026 · Problem Statement 02: Merchant Growth AI (Paytm Track)**  
> **Team Byte-Bandits (Lucknow)**: Yashraj Rastogi (Lead) · Gaurav Kumar · Vineet Shukla

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_Flash-8E75C2.svg?logo=google)](https://ai.google.dev/)
[![Paytm](https://img.shields.io/badge/Paytm-Sandbox_Simulator-002E6E.svg)](https://developer.paytm.com/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Digital_Receipts-25D366.svg?logo=whatsapp)](https://www.whatsapp.com/)

---

## 🏆 Project Vision & Pitch

**"A voice-and-vision self-checkout system that turns every retail transaction into actionable business intelligence for small merchants."**

India's 12M+ neighborhood kirana stores process millions of transactions daily, but suffer from two critical pain points:
1. **Long Peak-Hour Checkout Queues:** Customers abandon purchases due to slow manual billing and single-cashier bottlenecks.
2. **Missing Operational Intelligence:** Small store owners lack dedicated analysts to forecast stockouts, adjust prices dynamically, or summarize customer sentiment.

**FinBuddy bridges this gap through a closed, two-sided real-time loop:**
- **Shoppers Self-Checkout:** Walk in $\rightarrow$ scan store QR $\rightarrow$ scan item barcodes via mobile camera $\rightarrow$ speak Hindi/Hinglish voice commands $\rightarrow$ pay in 1 tap via Paytm sandbox $\rightarrow$ receive instant digital GST receipt on WhatsApp.
- **Merchants AI Copilot:** Every checkout atomically decrements inventory in real time and feeds an interactive, voice-enabled AI copilot that forecasts demand, triggers restocking alerts, and translates sales graphs into plain-language business advice.

---

## 🗺️ System Architecture & Workflow Synergy

```
       ┌────────────────────────────────────────────────────────┐
       │                 SHOPPER (AISLE FLOOR)                  │
       │  • Zero-install mobile browser scanning                │
       │  • Hindi/Hinglish voice cart updates                   │
       │  • Pre-built grocery baskets & guest checkout          │
       └──────────────────────────┬─────────────────────────────┘
                                  │ Barcode Scan / Voice Intent
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                FINBUDDY REAL-TIME ENGINE               │
       │  • Browser Barcode Engine (Camera + POS Beep)          │
       │  • Gemini Flash Bilingual Intent Classifier            │
       │  • Atomic In-Memory / Cloud Firestore State Machine    │
       └──────────────┬───────────────────────────┬─────────────┘
                      │                           │
  1-Tap Paytm Sandbox │                           │ Atomic Stock Decrement
  Payment Transition  │                           │ & Sales Telemetry
                      ▼                           ▼
       ┌───────────────────────────┐ ┌──────────────────────────┐
       │    PAYTM PAYMENT &        │ │   MERCHANT BACK-OFFICE   │
       │   WHATSAPP DISPATCH       │ │  • Real-Time Sales Feed  │
       │ • Soundbox confirmation   │ │  • Dynamic Inventory     │
       │ • Instant GST Tax Receipt │ │  • 7-Day Sales Trends    │
       │ • WhatsApp digital bill   │ │  • Sentiment Priority    │
       │ • Verifiable exit pass    │ │  • AI Copilot Assistant  │
       └───────────────────────────┘ └──────────────────────────┘
```

---

## ✨ Platform Features

### 🛍️ For Customers (Shopper Experience)
- **Zero-Install Web App:** No app download required. Shoppers open FinBuddy in any mobile browser or scan the store entrance QR.
- **Sub-Second Camera Barcode Scanner:** High-speed barcode detection right in the browser with audio POS beep feedback and torchlight support.
- **Bilingual Voice Assistant (Hindi & Hinglish):** Speak naturally like with a local shopkeeper (*"२ और पेप्सी जोड़ो"*, *"मैगी का भाव क्या है?"*, *"दूध बचा है क्या?"*). FinBuddy adjusts quantities and speaks back.
- **Guest Checkout & Customer Hub (`/customer`):** Full support for frictionless guest checkout, plus profile creation, pre-built grocery lists (Student Snack Box, Monthly Ration, Chai Party Pack) with 1-click cart push, and past order receipts.
- **Paytm Payment Sandbox:** Experience realistic 1-tap checkout via UPI, Paytm Wallet, Net Banking, and simulated Soundbox audio payment confirmations.
- **Instant WhatsApp Digital Invoices:** Itemized GST breakdown, payment reference, and digital exit QR pass delivered directly to the customer's WhatsApp.

### 🏪 For Merchants (Store Owner Operations)
- **60-Second Business Onboarding (`/merchant/login`):** Quick store setup with store name, category (Kirana, Pharmacy, Mart), and unique customer QR code generation.
- **Customizable Inventory Management:** Add new products with custom barcodes, adjust selling prices on the fly, and set safety restock thresholds.
- **Real-Time Atomic Stock Telemetry:** Transactions immediately drop warehouse stock across all merchant screens and customer shopping lists in real time without refreshing.
- **7-Day Sales Trends & AI Commentary:** Visual analytics translated into plain-language business summaries (e.g., *"Snack category sales grew 24% this week. Sunday afternoon showed the highest footfall"*).
- **Customer Feedback Summarization:** Automatically aggregates customer reviews and sentiment into categorized priority action items.
- **AI Growth Copilot:** Conversational voice-and-text assistant executing allowlisted deterministic functions with strict non-financial guardrails.

---

## 🛠️ Tech Stack & Key Libraries

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite, React Router v7 |
| **Styling & UI** | Tailwind CSS v4, Vanilla CSS Design System, Lucide Icons, Canvas Confetti |
| **Vision & Scanning** | HTML5 Camera API, BarcodeDetector API, ZXing & html5-qrcode fallback |
| **Voice & Speech** | Web Speech API (SpeechRecognition & SpeechSynthesis) + ElevenLabs TTS proxy support |
| **AI Copilot & NLP** | Google Gemini Flash (`@google/genai`), intent classification, allowlisted tool calling |
| **Real-Time Sync & Storage** | Cloud Firestore (`onSnapshot` multi-device listeners) + In-Memory Fallback State |
| **Payments** | Paytm Payment Gateway Sandbox Simulator, checksum validation (`paytmchecksum`) |
| **Messaging** | WhatsApp Digital Receipt Service (`whatsappService.ts`) with direct link generation |

---

## 🚦 Application Routes

| Route | Purpose | Audience |
| :--- | :--- | :--- |
| **`/`** | Unified Landing Page with Step-by-Step Interactive Guides & Feature Matrix | All Users / Evaluators |
| **`/customer`** | Customer Hub: Guest Mode, Pre-Built Shopping Lists, Past Order History | Shoppers |
| **`/s/:storeId/checkout`** | In-Store Self-Checkout with Camera Barcode Scanner & Hindi Voice AI | Shoppers in Aisle |
| **`/merchant/login`** | 60-Second Business Onboarding & Profile Configuration | Store Owners |
| **`/merchant/dashboard`** | Merchant Back-Office: Live Sales, Customizable Inventory, Trends & AI Copilot | Store Owners & Staff |
| **`/test_barcodes.html`** | Printable / Secondary Screen Barcode Sheet for Scanner Testing | Hackathon Judges |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### 2. Installation
```bash
# Clone repository
git clone https://github.com/yashraj-rastogi/Hack-e-Awadh.git
cd Hack-e-Awadh

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini API Key (Required for AI Voice & Copilot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Payment Mode
VITE_ENABLE_MOCK_PAYMENT=true
VITE_PAYTM_MID=YOUR_PAYTM_MID
VITE_PAYTM_MERCHANT_KEY=YOUR_PAYTM_KEY

# Optional: ElevenLabs Voice Integration
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_TTS_MODEL=
```

### 4. Seed Demo Data & Run
```bash
# Seed initial store catalog and sales transactions
npm run seed

# Start Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📋 Idea Workflow

Follow this step-by-step script for live evaluation:

1. **Dual Screen Setup:**
   - Screen A (Laptop / Evaluator Screen): Open **Merchant Dashboard** at `http://localhost:5173/merchant/dashboard`.
   - Screen B (Mobile Phone or Split Window): Open **Customer Self-Checkout** at `http://localhost:5173/s/store-awadh-01/checkout`.
   - Screen C (Secondary Tab / Phone): Open **Test Barcodes Sheet** at `http://localhost:5173/test_barcodes.html`.

2. **Step 1 — Zero-Install Camera Scan:**
   - On the customer phone, allow camera access.
   - Point the camera at **Pepsi 500ml** on the test barcodes sheet.
   - Hear the crisp POS beep! Pepsi is added to the cart instantly with running total and savings.

3. **Step 2 — Bilingual Voice Command (Hindi / Hinglish):**
   - Tap the microphone button in the checkout screen.
   - Speak in everyday Hindi: *"दो और मैगी जोड़ो"* (or English: *"Add 2 more Maggi"*).
   - FinBuddy recognizes the intent and adds 2 packs of Maggi Noodles to the cart automatically!

4. **Step 3 — 1-Tap Paytm Sandbox Pay & WhatsApp Bill:**
   - Tap **"Proceed to Pay (Paytm)"**.
   - Select Paytm UPI or Wallet $\rightarrow$ Click **"Confirm & Pay"**.
   - Observe the celebratory confetti, verified transaction state, Soundbox audio confirmation, and click **"Send Bill to WhatsApp"** to preview the digital tax invoice.

5. **Step 4 — Real-Time Atomic Sync on Merchant Dashboard:**
   - Look at the Merchant Dashboard **without refreshing**.
   - Today's Gross Sales ticks up immediately.
   - The transaction appears in the live sales feed.
   - Maggi stock decrements atomically and triggers a **Low Stock Alert** on the merchant's screen!

6. **Step 5 — Conversational AI Copilot:**
   - On the Merchant Dashboard, click the AI Copilot microphone or sample chip: *"Aaj sales kaisi rahi aur abhi kya karna chahiye?"*
   - Copilot analyzes real-time store telemetry and explains today's revenue, peak beverage demand, and advises restocking Maggi before the evening rush in fluent Hindi/English.

7. **Step 6 — Ethical AI Guardrails Trap:**
   - Ask Copilot: *"Should I take a ₹10 Lakh business loan for this store?"*
   - Copilot gracefully declines financial underwriting advice and redirects to store operational metrics, demonstrating safe, production-grade AI guardrails.

---

## 🛡️ Non-Negotiable Guardrails & Responsible AI

- **Synthetic Demonstration Data:** All merchant revenues, store details, and product catalogs are synthetic demonstration data for hackathon evaluation.
- **No Regulated Financial Advice:** The AI copilot assists strictly with store operational planning (inventory reorders, combo suggestions, pricing simulation). It is hard-coded to refuse lending, debt, and credit underwriting advice.
- **Deterministic Business Operations:** LLMs never directly compute final basket prices or execute database balance updates. All billing and stock logic is deterministic and verifiably audited in TypeScript.

---

## 👥 Team Byte-Bandits (Lucknow)

- **Yashraj Rastogi** — Lead & Full-Stack Architect
- **Gaurav Kumar** — Backend & AI Integration
- **Vineet Shukla** — UI/UX & Voice Engineering

*Developed with passion for Hack-e-Awadh 2026 (Paytm Track PS-02).*
