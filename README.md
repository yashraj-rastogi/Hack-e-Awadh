# FinBuddy

FinBuddy is a Paytm-style self-checkout for a small Indian kirana, plus a merchant copilot that answers from that store's own numbers.

A shopper scans barcodes, talks to the cart in Hindi or English, and pays in a test checkout. The merchant sees the same sale on a dashboard and can ask FinBuddy, a floating bot, what sold, what is low, and what to do next. The demo store is **Awadh Mart (Hazratganj)** in Lucknow. The figures are synthetic demo data, seeded into the browser.

The store landing calls this **Hack-e-Awadh 2026 · PS-02: Merchant Growth AI (Paytm Track)**.

## Tech stack

What the running app actually uses:

| Piece | Role |
| --- | --- |
| React 19, TypeScript, Vite | UI and dev server |
| Tailwind CSS 4 | Layout and Paytm-style colors (`#002E6E`, `#00BAF2`, `#F5F7FA`) |
| React Router | Pages listed below |
| `localStorage` | Demo database. There is no separate app server for store data. |
| Google Gemini (`generateContent` over HTTPS) | Checkout voice intents and merchant answers |
| ElevenLabs | Merchant bot speech and listening, through a Vite proxy |
| Browser Web Speech API | Customer cart voice, and a fallback voice for the merchant bot |
| `html5-qrcode` | Camera barcode scan |
| Paytm staging-shaped simulator | Checkout payment in this demo |
| Twilio WhatsApp | Optional receipt message, through `/api/send-whatsapp` on the Vite dev server |
| `canvas-confetti` | Paid-success animation |
| Lucide | Icons |

`firebase`, `@google/genai`, and `paytmchecksum` are listed in `package.json` but are not imported by the app.

## Routes

Vite serves the app at [http://localhost:5173](http://localhost:5173).

| URL | What it is |
| --- | --- |
| `/` | Home: customer and merchant entry points |
| `/customer` | Customer hub: guest or phone sign-in, shopping lists, past receipts |
| `/s/store-awadh-01` | Store check-in with a QR standee that opens checkout |
| `/s/store-awadh-01/checkout` | Customer self-checkout |
| `/s/store-awadh-01/receipt/:receiptId` | Digital receipt |
| `/merchant/login` | Demo merchant sign-in and store onboarding form |
| `/merchant/dashboard` | Merchant dashboard and floating FinBuddy |
| `/test_barcodes.html` | Printable barcode sheet for the camera demo |

The merchant sign-in form does not check a real account. Submitting it opens the dashboard. Store profile edits on that form are saved in `localStorage`.

## What you see

### Home (`/`)

A landing page that points shoppers to checkout or the customer hub, and merchants to the dashboard or the sign-in form.

### Store landing (`/s/:storeId`)

A check-in screen for the seeded store. It shows a QR code that encodes the checkout URL, a **Start Self Checkout** button, and a link to the merchant hub. The QR is built in the page; it is not a Paytm QR product.

### Barcode scan (checkout)

On checkout, the camera scanner uses `html5-qrcode` to read an EAN-13 barcode and add that product to the cart. A short beep plays on a successful scan. For a laptop demo, open `/test_barcodes.html` on another screen and point the camera at it. If the camera is awkward, use the product picker instead.

### Customer voice cart (checkout)

A centered voice modal, separate from the merchant bot. It uses the browser's speech recognition (`hi-IN` or `en-IN`), then `parseVoiceCommand` in `src/services/aiService.ts`. Gemini turns the sentence into an intent (add, remove, total, pay, stock). If Gemini is missing or fails, a local parser handles the same kinds of phrases, including Hindi and Hinglish such as "2 Pepsi add karo". Suggested chips on the modal run the same path without the mic. Spoken replies here use the browser voice helper in `src/utils/audio.ts`, not ElevenLabs.

### Product picker (checkout)

A search modal over the store catalog. The shopper filters by name, barcode, or category and adds an item. It plays the same scan beep as the camera.

### Payment (checkout)

**Authorize & Pay** opens a Paytm-styled modal. `processPaytmTransaction` in `src/services/paytmService.ts` returns a sandbox result (an order id and a `PTM_…` reference). If `VITE_PAYTM_MID` and `VITE_PAYTM_MERCHANT_KEY` are empty, that sandbox path is used. The current code does not complete a live charge against Paytm; the staging request body is prepared and the demo still resolves as a simulator success. A checkbox on the pay screen, **Simulate payment decline**, fails the attempt and leaves the cart in place. A successful pay writes the transaction, decrements stock, shows confetti, and can send a WhatsApp receipt.

The dashboard **Profile & Payment Gateway** tab can store simulator modes (instant success, OTP challenge, decline). Checkout itself uses the pay-screen checkbox above, not those stored modes.

### Receipt

After pay, the shopper lands on `/s/:storeId/receipt/:receiptId`. The page shows items, the amount, and the payment reference. They can opt in to WhatsApp and send the bill again from this page.

### WhatsApp

`sendWhatsAppReceipt` posts the bill text to `/api/send-whatsapp`. The Vite dev server forwards that to Twilio. If the Twilio SID or token is empty, the send fails with a clear error and the in-app receipt still exists. The proxy only runs in `npm run dev`, not in `vite preview`.

### Customer hub (`/customer`)

A shopper can continue as a guest or save a name and phone in `localStorage`, build shopping lists from the catalog, open checkout with a list, and reopen old receipts.

### Merchant dashboard (`/merchant/dashboard`)

Tabs:

- **Today's Business** — today's sales, bill count, average bill, low-stock count, insight cards, and a live sales table.
- **Customizable Inventory** — search, edit stock and price, add or delete products.
- **Sales Trends & AI Analytics** — a simple week view and plain-language notes from the seeded history.
- **Feedback Summarization** — checkout comments stored with the demo.
- **Ask FinBuddy (Copilot)** — opens the same floating bot used on every tab. It does not mount a second chat.
- **Profile & Payment Gateway** — store name, settlement fields saved locally, and the simulator mode toggles described above.

**Reset Demo Data** in the dashboard header restores the seeded catalog, stock, transactions, feedback, and insights.

Other open tabs in the same browser see updates because pages subscribe to `localStorage` changes. This is not a cloud sync.

## Floating FinBuddy (merchant bot)

FinBuddy sits at the bottom-right of the merchant dashboard on every tab. It is not the customer checkout modal.

- **Launcher.** A round robot button labeled FinBuddy. Click it to open a panel about 380px wide on a desktop, capped so it stays on a phone screen. Close hides the panel and leaves the button.
- **Mic and text.** The merchant can talk or type. Suggested chips send a ready-made question. A live transcript shows while the mic is on.
- **Language toggle.** **हिंदी** rewrites the whole panel into Hindi: status, chips, welcome, placeholder, mic labels, and buttons. Existing chat bubbles are translated. New answers stay in Hindi even if the question was typed in English. **English** converts the same panel back to simple Indian English, including new answers. Spoken audio uses the language on screen.
- **Answers.** Questions go to `askMerchantCopilot`. The app builds a store snapshot (sales, stock, feedback) from `localStorage` and sends those facts to Gemini. The model must quote those numbers, not invent them. If Gemini is unavailable, a local engine answers from the same snapshot. A restock is only a proposal until the merchant taps confirm; the bot does not change stock by itself.
- **Loan and credit.** Questions about loans, credit, insurance, or investments are refused before the model call. The bot offers sales and stock facts instead.
- **Voice.** Speech uses ElevenLabs. The default voice is the premade male voice **Daniel** (`onwK4e9ZLuTAKqWW03F9`) with model **`eleven_multilingual_v2`**. Listening uses ElevenLabs Scribe (`scribe_v1`). If ElevenLabs is down, speaking falls back to a male browser voice (`hi-IN` or `en-IN`). The mic falls back to browser speech recognition in the same locales.
- **Keys stay on the server.** The browser calls `POST /api/tts`, `POST /api/stt`, and `GET /api/voice/health`. The Vite dev and preview servers proxy those to ElevenLabs with `ELEVENLABS_API_KEY`. Do not put that key in a `VITE_` variable. Playback starts from the click so the browser allows the audio to play.

Voice replies default to on. The panel has an **आवाज़ चालू / Voice on** switch.

## One voice question

1. The merchant taps the mic or types in the floating panel. The click also unlocks audio playback.
2. Speech is recorded and sent to `/api/stt` with the selected language (`hi` or `en`). Text skips that step. If Scribe is unavailable, the browser recognizer is used.
3. The selected panel language is the reply language, not only the language detected in the sentence.
4. `buildStoreSnapshot` reads products, transactions, and feedback from `localStorage`.
5. A regulated-finance question gets a fixed refusal. Otherwise Gemini receives the question, recent chat, and the store facts, and returns a short JSON answer. If that fails, the local engine answers from the same facts.
6. The reply is shown in the panel. If voice replies are on, `/api/tts` speaks it in Daniel's voice, in the same language as the text.

## Local setup

```bash
git clone https://github.com/yashraj-rastogi/Hack-e-Awadh.git
cd Hack-e-Awadh
npm install
```

Copy the example env file and fill in only what you need:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Required? | Notes |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | Needed for live AI answers and checkout intent parsing | Any `VITE_` value is bundled into the browser. Do not put a private key you cannot expose. |
| `ELEVENLABS_API_KEY` | Needed for merchant speech and Scribe | **No `VITE_` prefix.** The Vite proxy reads it. The browser never sees it. |
| `ELEVENLABS_VOICE_ID` | Optional | Leave blank to use Daniel. A library voice that the plan cannot synthesize falls back to Daniel. |
| `ELEVENLABS_TTS_MODEL` | Optional | Leave blank to use `eleven_multilingual_v2`. |
| `VITE_ENABLE_MOCK_PAYMENT` | Optional | Read by the Paytm helper. Checkout still uses the sandbox simulator described above. |
| `VITE_PAYTM_MID`, `VITE_PAYTM_MERCHANT_KEY` | Optional | Shown in a shortened form on the pay screen when set. This demo does not complete a live Paytm charge. |
| `VITE_TWILIO_ACCOUNT_SID`, `VITE_TWILIO_AUTH_TOKEN`, `VITE_TWILIO_WHATSAPP_NUMBER` | Optional | WhatsApp receipts. These are `VITE_` keys, so they are visible to the browser bundle. The send itself goes through the dev-server proxy. |
| `VITE_FIREBASE_*` | Not used by the app | Present in `.env.example` only. |

Never commit `.env`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server, including the ElevenLabs and WhatsApp proxies |
| `npm run build` | Typecheck (`tsc -b`) and production build |
| `npm run preview` | Serves the production build. ElevenLabs proxy is included. The WhatsApp proxy is not. |
| `npm run lint` | `oxlint` |
| `npm run seed` and `npm run reset-demo` | Print the demo catalog in the terminal. They do **not** write `localStorage`. The app seeds itself on first load. Use **Reset Demo Data** on the dashboard to restore the browser data. |

## Demo notes

- Data lives in this browser under `localStorage` keys prefixed with `finbuddy_`. Clearing site data, or **Reset Demo Data**, puts back the seeded store: 15 grocery products, history, feedback, and insights.
- Two windows on the same browser profile share that data, so a checkout can update an open dashboard.
- Merchant voice needs `npm run dev` (or `npm run preview`) so `/api/tts` and `/api/stt` exist. A static host without that proxy will fall back to the browser voice.
- Use Chrome or Edge for the microphone. Allow the mic when the browser asks.
- Customer checkout voice and merchant FinBuddy are different. Checkout uses the browser recognizer and the cart intent parser. FinBuddy uses ElevenLabs and store facts.

## Project layout

```
src/pages              Home, store landing, checkout, receipt, customer hub, merchant login and dashboard
src/components         Scanner, product picker, customer voice modal, pay modal, MerchantVoiceAgent
src/services           localStorage db, Gemini, store facts, Paytm simulator, WhatsApp, voice client
src/data/seedData.ts   Demo store, products, history, feedback
server/elevenlabsProxy.ts   /api/tts, /api/stt, /api/voice/health
vite.config.ts         Dev-server proxies for ElevenLabs and WhatsApp
public/test_barcodes.html
```
