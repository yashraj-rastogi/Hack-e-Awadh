# FinBuddy — User Flows

## Actors

- **Customer:** self-checks out from a physical store.
- **Merchant:** manages the store and uses the AI Copilot.
- **System:** handles catalog, payment, receipt, inventory and data.
- **AI Copilot:** explains trusted merchant data and produces operational recommendations.

---

# Customer — Guest

```text
Scan store QR
 ↓
Open FinBuddy checkout
 ↓
Continue as Guest
 ↓
Scan barcode
 ↓
Product found?
 ├── Yes → Add to cart
 └── No → Manual product search
 ↓
Continue scanning
 ↓
Optional voice command
 ↓
Review cart
 ↓
Generate exact payment
 ↓
Customer confirms
 ↓
Paytm payment flow
 ↓
Payment result
 ├── Failed → Retry / cancel
 ├── Pending → Wait / refresh
 └── Paid → Continue
 ↓
Digital receipt
 ↓
Persist transaction
 ↓
Update inventory
 ↓
Feedback
 ↓
END
```

---

# Customer — Registered

```text
Scan store QR
 ↓
Login
 ↓
Checkout
 ↓
Scan products
 ↓
Voice commands
 ↓
Cart
 ↓
Payment
 ↓
Receipt
 ↓
Save receipt to history
 ↓
Optional authorized WhatsApp receipt
```

---

# Customer Voice

Voice is **not required to operate simultaneously with scanning**. The customer can scan first and then use voice to modify or inspect the cart.

### MVP intents

```text
ADD_ITEM
REMOVE_ITEM
CHANGE_QUANTITY
GET_TOTAL
SHOW_CART
CLEAR_CART
GENERATE_PAYMENT
```

Examples:

> "Do aur Pepsi add kar do."

> "Ek Maggi hata do."

> "Total kitna hua?"

> "Cart dikhao."

> "Payment generate karo."

---

# Barcode Failure

```text
Scan
 ↓
Barcode not found
 ↓
Manual search
 ↓
Select product
 ↓
Add to cart
```

---

# Duplicate Scan

If the barcode already exists in the cart:

```text
Existing item?
 → Yes
    ↓
Increase quantity by 1
```

Do not create duplicate product rows in the cart.

---

# Payment

```text
Cart total = ₹160
 ↓
Generate payment
 ↓
Create payment attempt
 ↓
Paytm adapter
 ↓
Payment state
 ├── created
 ├── pending
 ├── success
 ├── failed
 └── expired
```

Only verified success can finalize the transaction.

---

# Payment Success

```text
Verified payment
 ↓
Idempotent transaction finalization
 ↓
Receipt
 ↓
Inventory decrement once
 ↓
Customer history
 ↓
WhatsApp if authorized
 ↓
Feedback
```

---

# Payment Failure

```text
Payment failed
 ↓
Clear explanation
 ↓
Retry payment
 OR
Cancel checkout
```

---

# WhatsApp Receipt

```text
Paid
 ↓
Customer opted in?
 ├── No → finish
 └── Yes
      ↓
Generate receipt link
      ↓
Twilio
      ↓
Send receipt
```

MVP scope: receipt only.

---

# Merchant Onboarding — Minimal

```text
Register
 ↓
Merchant role
 ↓
Create store
 ↓
Business details
 ↓
Use pre-seeded catalog / add products
 ↓
Set low-stock threshold
 ↓
Generate store QR
 ↓
Dashboard
```

The final demo should start from a pre-seeded store when practical.

---

# Merchant Dashboard

```text
Login
 ↓
Today's business
 ↓
Alerts
 ↓
Transactions
 ↓
Inventory
 ↓
Feedback
 ↓
Ask Copilot
```

---

# Merchant Copilot

```text
Merchant question
 ↓
Intent detection
 ↓
Relevant data tool
 ↓
Deterministic facts
 ↓
Gemini explanation
 ↓
Recommendation
 ↓
Display + voice response
```

### Example

```text
"Aaj ka business kaisa raha?"
        ↓
getTodaySales()
        ↓
Facts: sales / transactions / top category
        ↓
Gemini summary
        ↓
Plain-language answer
```

---

# Proactive Alerts

```text
Transaction history
 ↓
Deterministic analytics
 ↓
Alert candidate
 ↓
Merchant alert card
 ↓
Optional AI explanation
```

Examples:
- low stock,
- strong/weak sales trend,
- customer feedback issue.

---

# Feedback

```text
Receipt
 ↓
Rating + text
 ↓
Store feedback
 ↓
Aggregate themes
 ↓
Merchant Copilot summary
```

MVP uses **rating + text**.

---

# Cross-Side Flow

```text
CUSTOMER
Scan QR → Scan + Voice → Cart → Payment → Receipt
                           │
                           ▼
                       TRANSACTION
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          Sales         Inventory      Feedback
                           │
                           ▼
                    MERCHANT COPILOT
                           │
                    Insight → Action
```

---

# Error States

| State | Recovery |
|---|---|
| Unknown barcode | Manual product search |
| Voice not understood | Retry / examples |
| Payment pending | Wait / refresh |
| Payment failed | Retry |
| Payment expired | Create new payment |
| Product out of stock | Prevent add / explain |
| Network error | Retry; preserve cart where practical |
| WhatsApp failed | Digital receipt remains available |
