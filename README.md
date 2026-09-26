# FinBuddy — AI Self-Checkout & Merchant Copilot
> **Hack-e-Awadh 2026 · Problem Statement 02: Merchant Growth AI (Paytm Track)**  
> **Team Byte-Bandits (Lucknow)**: Yashraj Rastogi (Lead), Gaurav Kumar, Vineet Shukla

---

## 🏆 Project Vision & Pitch

**"A voice-and-vision self-checkout system that turns every retail transaction into actionable business intelligence for small merchants."**

Small offline merchants generate high transaction volumes but lack dedicated business analysts. Valuable growth opportunities around inventory restocks, category slumps, and customer feedback get missed. 

FinBuddy bridges this gap through a closed two-sided loop:
1. **Shoppers Self-Checkout:** Scan store QR $\rightarrow$ scan barcodes with phone camera $\rightarrow$ speak Hindi/Hinglish cart voice commands $\rightarrow$ pay via Paytm test sandbox $\rightarrow$ receive instant digital receipt & WhatsApp link.
2. **Merchant Growth AI Copilot:** Every checkout immediately updates stock and feeds a conversational, voice-enabled business assistant that explains revenue, triggers low-stock alerts, and recommends operational kirana actions.

---

## 🛠 Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Vision & Barcode:** `@zxing/library` & `html5-qrcode` (HTML5 Camera API with custom laser target overlay).
- **Voice Intelligence:** Web Speech API (STT/TTS) + Google Gemini Flash intent parser (English, Hindi `hi-IN`, Hinglish).
- **Backend & Real-Time Sync:** Firebase Auth, Cloud Firestore (Direct real-time `onSnapshot` listeners for zero-latency multi-device sync), Paytm test gateway state-machine simulator.
- **Deterministic Tool Layer:** Gemini tool-calling executing strictly allowlisted functions (`getSalesSummary`, `getLowStock`, `getSalesTrend`, `getFeedbackSummary`).

---

## 🚀 Quick Start Guide

### 1. Install & Run
```bash
# Clone the repository
git clone https://github.com/yashraj-rastogi/Hack-e-Awadh.git
cd Hack-e-Awadh

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Demo Assets & Routes
- **Store Entrance / Landing:** `http://localhost:5173/`
- **Customer Self-Checkout:** `http://localhost:5173/s/store-awadh-01/checkout`
- **Printable Barcodes Sheet:** `http://localhost:5173/test_barcodes.html`
- **Merchant Dashboard & AI:** `http://localhost:5173/merchant/dashboard`
- **Merchant Login:** `http://localhost:5173/merchant/login`

---

## 📋 The 3-Minute Hackathon Winning Demo Script

1. **The Setup:** Open the **Merchant Dashboard** (`/merchant/dashboard`) on a laptop and the **Customer Self-Checkout** (`/s/store-awadh-01/checkout`) on a smartphone (or adjacent browser window).
2. **Camera Scan:** Point the phone camera at `Pepsi 500ml` on the Barcodes Sheet (`/test_barcodes.html`). Hear the crisp POS scan beep; Pepsi is added to the cart.
3. **Hindi Voice Command:** Tap the microphone and say: *"Do aur Maggi add kar do"*. Watch the cart automatically add 2 Maggi packs!
4. **Paytm Payment:** Tap "Proceed to Pay" $\rightarrow$ confirm the bill. Watch the verified state transition (`Created → AwaitingPayment → Paid`), celebratory confetti, and the digital receipt.
5. **The Real-Time Magic:** Look at the Merchant Dashboard **without refreshing**. In real-time:
   - Today's revenue ticks up.
   - The transaction appears in the live sales feed.
   - Maggi drops to critical stock and triggers a **Low Stock Warning**!
6. **Ask the Copilot:** On the dashboard, tap the Copilot mic or click: *"Aaj sales kaisi rahi aur abhi kya karna chahiye?"*
   - Copilot speaks back in natural Hindi/Hinglish: explains revenue, points out the evening beverage rush, and warns to restock Maggi before dinner peak.
7. **The Guardrail Trap:** Ask: *"Should I take a ₹10 Lakh business loan for this store?"*
   - Copilot gracefully declines financial advice and redirects to operational metrics, proving responsible, non-hallucinatory AI.

---

## 🛡 Non-Negotiable Guardrails
- **Synthetic Data Notice:** All merchant and product figures are synthetic demonstration data.
- **No Regulated Financial Advice:** The AI assists with operational planning (inventory, combos, restocks) and strictly declines lending, credit, or underwriting queries.
- **Deterministic Operations:** LLMs never calculate prices or execute stock decrements directly.
