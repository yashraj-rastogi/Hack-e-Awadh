# Hack-e-Awadh 2026 - Paytm-Themed UI/UX Guidelines

## 1. Core Brand Philosophy (The Paytm Way)

Since this project is sponsored by Paytm, the interface must evoke **trust, speed, and financial security**. The design language should be a direct extension of the "Paytm for Business" and consumer Paytm app ecosystems. 

* **Familiarity is Key:** Users and merchants should feel like they are using a native Paytm product. 
* **High Contrast, Clean Layouts:** Avoid clutter. Emphasize transaction values, success states, and clear calls-to-action (CTAs).
* **Audio-Visual Synergy:** Mimic the iconic "Paytm Soundbox" experience in the Merchant Copilot feedback loop (e.g., instant voice confirmations).

## 2. Color Palette (Paytm Identity)

Strict adherence to Paytm's color hex codes is required to establish brand authenticity.

### Primary Brand Colors
* **Paytm Dark Blue:** `#002E6E` - Use for headers, primary text, merchant dashboard backgrounds, and emphasis.
* **Paytm Light Blue:** `#00BAF2` - Use for primary buttons, active icons, links, and progress indicators.

### Functional Colors (States & Backgrounds)
* **Success Green:** `#21C17A` - Used for successful scans, completed payments, and positive merchant trends.
* **Alert/Error Red:** `#FD5C63` - Used for payment failures, invalid barcodes, or critical low-stock alerts.
* **Cashback/Offer Yellow:** `#FFA800` - Used to highlight AI-suggested combo offers or merchant growth opportunities.
* **Background Canvas:** `#F5F7FA` - A very light greyish-blue to make white component cards pop.
* **Surface/Card:** `#FFFFFF` - Clean white for all interactive cards and cart items.

## 3. Typography

Paytm uses clean, highly readable sans-serif fonts to ensure legibility across all demographics and languages (especially Hinglish/Hindi).

* **Primary Font:** `Inter` (or `Roboto`).
* **Weights:** 
  * **Bold (700):** For total amounts (e.g., **₹450**), major headlines, and critical alerts.
  * **Medium (500):** For product names, button text, and subheadings.
  * **Regular (400):** For secondary text, timestamps, and Copilot explanations.

## 4. Component Style Guide

Components should look and feel like they belong in the Paytm component library.

* **Buttons:**
  * **Primary:** Background `#00BAF2`, Text `#FFFFFF`, Border-Radius `8px` (slightly rounded). Full width on mobile views.
  * **Secondary:** Background `#FFFFFF`, Border `1px solid #00BAF2`, Text `#00BAF2`. 
* **Cards & Containers:**
  * Background: `#FFFFFF`
  * Border-Radius: `12px` (soft corners)
  * Shadow: `0 2px 8px rgba(0, 46, 110, 0.08)` (very subtle, soft shadow to lift the card off the grey background).
* **Inputs & Search:**
  * Border: `1px solid #E0E6ED`
  * Focus State: Border changes to `#00BAF2` with a subtle blue ring.

## 5. Customer Experience (Paytm Consumer App Vibe)

* **The "Scan Any QR" Feel:** The camera scanner overlay should mimic Paytm's QR scanner—a clean, semi-transparent dark overlay with a pulsing blue (`#00BAF2`) targeting square in the center.
* **Cart Sheet:** A crisp white bottom-sheet that slides up. Totals should be massive and bold, replicating the checkout screen of Paytm Mall or Paytm ticketing.
* **Payment Simulator:** Design the mock payment screen to look exactly like the Paytm payment gateway. Include the trusted Paytm shield icon, a secure PIN entry mock-up, and the iconic green checkmark animation (`#21C17A`) upon success.

## 6. Merchant Copilot (Paytm for Business Vibe)

* **Dashboard Header:** Use the Paytm Dark Blue (`#002E6E`) for the top navigation bar, featuring the merchant's store name in white, similar to the Paytm Business app.
* **Metric Cards (Khata/Ledger Style):** Display today's collections, total items sold, and active alerts in crisp, white cards. Use large green fonts for positive revenue growth.
* **Voice-First AI Copilot:** 
  * The Copilot chat button should be a floating action button (FAB) with a microphone icon, styled in Paytm Light Blue.
  * **Audio Feedback:** When the AI provides an insight, use a visual equalizer animation. Include an audio chime similar to the Paytm Soundbox before the AI speaks ("*AI Copilot insight: Biscuit category ki sales...*").
* **Actionable Insights:** AI recommendations (like bundling products) should be presented as "Offers," utilizing the Cashback Yellow (`#FFA800`) to highlight them as revenue-generating opportunities.