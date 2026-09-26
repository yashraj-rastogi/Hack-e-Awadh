# Hack-e-Awadh 2026 - Platform Workflow & User Journeys

## 1. Unified Landing Gateway
When any user visits the platform, they are greeted with a clean, Paytm-themed landing page (using Paytm Dark Blue `#002E6E` and Light Blue `#00BAF2`). 
* The user is presented with two clear, distinct entry paths:
  * **Enter as Merchant**
  * **Enter as Customer**

---

## 2. Merchant Workflow (Paytm for Business Style)

The merchant experience is designed as an actionable, data-rich copilot dashboard to empower offline store owners.

### Step 2.1: Business Onboarding & Account Creation
* The merchant creates an account to securely register their business credentials.
* Business details (store name, category, location) are recorded to establish their profile.

### Step 2.2: The Merchant Dashboard
Once authenticated, the merchant accesses the main dashboard, which includes the following core modules:
* **Customizable Inventory:** A dynamic module where the merchant can manually manage stock levels, add new products, and adjust pricing. The AI also actively monitors this to provide low-stock alerts.
* **Sales Trends (Analytics):** Visual representations of daily and weekly sales trends. The AI Copilot translates these graphs into plain-language text (e.g., "Biscuit sales are up 20% this week").
* **Feedback Summarization:** A dedicated tab that aggregates customer sentiment and ratings into actionable priority lists for the merchant to review.

### Step 2.3: Profile & Payment Management
* The merchant profile houses saved credentials and banking details.
* Links directly to the sandbox payment simulator configurations to manage how transactions are processed and recorded.

---

## 3. Customer Workflow (Paytm Consumer Style)

The customer flow is optimized for speed, eliminating checkout queues through a mobile-first, frictionless design.

### Step 3.1: Entry Paths & Onboarding
Customers have two ways to interact with the platform:
* **Direct Platform Entry:** The customer visits the site from home and creates a profile/account.
* **In-Store QR Scan (Zero-Barrier):** The customer walks into the shop, scans the store's unique QR code, and instantly opens the web cashier. 
  * **Guest User Support:** If the customer does not have an account and does not want to make one, they can proceed entirely as a Guest User (no app installation required).

### Step 3.2: Shopping & Multi-Modal Interaction
* **Barcode Scanning:** The customer uses their phone camera to scan product barcodes to add them to their cart.
* **Voice Agent Integration:** During the shopping process, the customer can interact with a natural voice agent (supporting Hindi, Hinglish, and English). They can:
  * Ask about product details or stock availability.
  * Use voice commands to modify cart quantities (e.g., "Add two more Pepsis").
  * Provide real-time feedback via voice.

### Step 3.3: Checkout & Smart Delivery
* The customer proceeds to the sandbox payment simulator (mimicking the secure Paytm payment gateway).
* **WhatsApp Integration:** Upon successful payment, if the user is logged into an account or opts-in by providing their number, the digital receipt and product checkout details are instantly messaged to them via WhatsApp.

### Step 3.4: Account Features (For Registered Users)
If the customer has created a profile, they unlock additional retention features:
* **Past Orders:** A complete history of their previous transactions and digital receipts.
* **Shopping Lists:** A feature to pre-build lists of items they want to purchase before they even arrive at the store.