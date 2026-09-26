# FinBuddy — API & Service Specification

## Architecture

Firebase-centric application with Vercel frontend, Firebase Auth/Firestore/Functions, Paytm Payment Gateway API and Twilio WhatsApp.

Sensitive integrations stay server-side.

---

# Authentication

Use Firebase Authentication.

Roles:
```text
customer
merchant
```

Server functions must validate identity, role and store ownership.

---

# Store

## Create store
```text
POST /api/store/create
```

```json
{
  "name": "ABC General Store",
  "category": "grocery",
  "locationLabel": "Lucknow",
  "languagePreferences": ["hi", "en"]
}
```

## Get store
```text
GET /api/store/:storeId
```

Returns public store information used by customer checkout.

---

# Products

## Barcode lookup
```text
GET /api/products/barcode/:barcode
```

Example response:

```json
{
  "productId": "p1",
  "name": "Pepsi 500ml",
  "price": 40,
  "stockAvailable": 28
}
```

Unknown:
`404 PRODUCT_NOT_FOUND`

## Search
```text
GET /api/products/search?q=pepsi
```

Fallback when scanning fails.

---

# Checkout

## Create checkout session
```text
POST /api/checkout/session
```

```json
{
  "storeId": "store_123",
  "customerId": null
}
```

## Update cart
```text
POST /api/checkout/:sessionId/cart
```

```json
{
  "productId": "p1",
  "quantityDelta": 2
}
```

Response contains the authoritative cart and total.

```json
{
  "items": [],
  "subtotal": 160,
  "discount": 0,
  "total": 160
}
```

The client is not the source of truth for final amount.

---

# Payment

## Create payment
```text
POST /api/payment/create
```

```json
{
  "checkoutSessionId": "session_123",
  "customerConfirmation": true
}
```

Server workflow:
1. load cart,
2. recalculate total,
3. create payment attempt,
4. call Paytm adapter,
5. store payment state,
6. return safe client state.

## Payment status
```text
GET /api/payment/:attemptId/status
```

```json
{
  "status": "pending",
  "amount": 160,
  "reference": "safe-reference"
}
```

## Provider callback/webhook

The exact Paytm endpoint/verification mechanism must follow the credentials and provider documentation available during implementation.

Architecture requirement:

```text
Paytm result
 ↓
Server verification
 ↓
Idempotent finalization
 ↓
Firestore
```

Never trust a browser-only success signal.

---

# Transaction Finalization

Conceptual operation:

```text
finalizePaidTransaction(transactionId)
```

Checks:

```text
Already finalized?
 ├── Yes → return existing result
 └── No
      ↓
payment verified?
      ↓
create/update receipt
      ↓
decrement inventory once
      ↓
mark transaction paid
```

---

# Receipts

## Get receipt
```text
GET /api/receipts/:receiptId
```

Customer can read their own receipt; merchant can read receipts belonging to their store.

---

# WhatsApp

## Send receipt
```text
POST /api/notifications/whatsapp/receipt
```

```json
{
  "receiptId": "receipt_123"
}
```

Server verifies `customer.whatsappOptIn == true` before calling Twilio.

Unauthorized:
`403 WHATSAPP_NOT_AUTHORIZED`

---

# Merchant Analytics

## Dashboard summary
```text
GET /api/merchant/:storeId/dashboard
```

Example:

```json
{
  "todaySales": 8420,
  "transactions": 63,
  "averageBill": 134,
  "alerts": []
}
```

## Sales trend
```text
GET /api/merchant/:storeId/sales?range=7d
```

## Inventory alerts
```text
GET /api/merchant/:storeId/inventory/alerts
```

## Feedback summary
```text
GET /api/merchant/:storeId/feedback/summary
```

---

# AI

## Merchant Copilot
```text
POST /api/ai/merchant-copilot
```

```json
{
  "storeId": "store_123",
  "message": "Aaj ka business kaisa raha?",
  "language": "hinglish"
}
```

Workflow:

```text
Validate user/store
 ↓
Intent
 ↓
Deterministic tools
 ↓
Structured facts
 ↓
Gemini
 ↓
Answer + facts + recommendation
```

Example response:

```json
{
  "answer": "Aaj ₹8,420 ki sales hui...",
  "facts": [
    {"label": "Today's Sales", "value": "₹8,420"}
  ],
  "recommendation": "..."
}
```

## Customer checkout assistant
```text
POST /api/ai/customer-checkout
```

Input includes checkout session + transcript; output is a structured intent/action request for application validation.

---

# Error Codes

```text
AUTH_REQUIRED
FORBIDDEN
STORE_NOT_FOUND
PRODUCT_NOT_FOUND
OUT_OF_STOCK
INVALID_CART
PAYMENT_FAILED
PAYMENT_PENDING
PAYMENT_EXPIRED
PAYMENT_NOT_VERIFIED
DUPLICATE_FINALIZATION
WHATSAPP_NOT_AUTHORIZED
RATE_LIMITED
SERVICE_UNAVAILABLE
```

---

# Security

Never expose in the frontend:
- Paytm secrets,
- Twilio secrets,
- Gemini server keys.

Store secrets in server-side environment configuration.
