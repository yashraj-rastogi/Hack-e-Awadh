# FinBuddy — Paytm-Style UI/UX Guidelines

## Document Status

**Project:** FinBuddy  
**Product:** AI Self-Checkout + AI Merchant Copilot  
**Primary PS:** PS-02 — Merchant Growth AI (Paytm)  
**Design reference:** Paytm website / consumer-business visual language supplied by the team  
**Audience:** Coding agent, UI developer, frontend developer, designer, QA  
**Priority:** The UI must feel familiar, trustworthy, fast and transaction-oriented while remaining clearly a FinBuddy product.

---

# 1. Design Direction

## 1.1 Core visual idea

FinBuddy should feel like a **modern Paytm-style commerce and merchant platform**:

- trustworthy,
- fast,
- clean,
- information-dense without feeling crowded,
- strongly oriented around clear actions,
- comfortable for everyday Indian users,
- easy to understand for non-technical merchants.

The supplied Paytm reference uses a predominantly white canvas, strong navy/blue typography, bright blue CTAs, large rounded content sections, simple line/flat icons, promotional cards, clear navigation, and strong action labels such as **Pay Now**, **Download**, and **View All**.

FinBuddy should use those principles while adapting them to our own product:

> **Customer:** Scan → Talk → Pay → Receipt  
> **Merchant:** Ask → Understand → Act

---

# 2. Brand Personality

The interface should communicate:

### Trust
Payment, receipt and account states must feel secure and unambiguous.

### Speed
The customer should be able to reach scanning and checkout in very few actions.

### Familiarity
Users should immediately understand where to:

- scan,
- view cart,
- pay,
- view receipt,
- talk to the AI.

### Simplicity
Especially on the merchant side, do not make users interpret complex analytics dashboards.

### Indian-first conversational usability
Support English, Hindi and Hinglish naturally.

---

# 3. Visual Language

The reference visual language is:

- white surfaces,
- pale grey/blue page canvas,
- dark blue headings,
- bright cyan/sky-blue actions,
- blue outlined secondary actions,
- generous section spacing,
- large readable headings,
- rounded cards,
- subtle borders,
- extremely light shadows,
- clean utility icons,
- occasional soft promotional color blocks.

FinBuddy should preserve this overall rhythm.

Do not use:

- overly dark SaaS dashboards,
- glassmorphism everywhere,
- excessive gradients,
- neon cyberpunk styling,
- dense data tables as the primary merchant experience,
- excessive animations,
- decorative elements that compete with the CTA.

---

# 4. Color System

Use the previously defined Paytm-inspired palette consistently.

## Primary

| Token | Hex | Usage |
|---|---|---|
| `brand-900` | `#002E6E` | Header/nav, primary text, merchant navigation, high emphasis |
| `brand-500` | `#00BAF2` | Primary CTA, active icon, focus, links, progress |

## Functional

| Token | Hex | Usage |
|---|---|---|
| `success` | `#21C17A` | Payment success, successful scan, positive trend |
| `danger` | `#FD5C63` | Payment failure, invalid barcode, critical low stock |
| `offer` | `#FFA800` | Merchant opportunity / promotion / combo recommendation |
| `canvas` | `#F5F7FA` | Page background |
| `surface` | `#FFFFFF` | Cards, modals, cart, forms |
| `border` | `#E0E6ED` | Input and card borders |

## Color rules

### Use navy for:
- major titles,
- navigation,
- important numeric labels,
- merchant header,
- strong section labels.

### Use Paytm blue for:
- primary buttons,
- interactive links,
- active states,
- scanner targeting,
- progress,
- microphone FAB.

### Use green only for:
- success,
- positive verified state,
- positive trend.

### Use red only for:
- error,
- failure,
- critical alert.

### Use yellow only for:
- opportunities,
- promotional recommendations,
- optional growth offers.

Do not use functional colors as decoration.

---

# 5. Typography

## Recommended font

Use:

**Inter**

Fallback:

**Roboto**, then system sans-serif.

The interface must remain highly legible in:

- English,
- Hindi,
- Hinglish.

## Type hierarchy

### Display / Page title
- 32–44px desktop
- 26–32px mobile
- weight 700
- navy

### Section heading
- 22–28px
- weight 700
- navy

### Card heading
- 16–20px
- weight 600–700

### Body
- 14–16px
- weight 400
- dark neutral/navy

### Supporting text
- 12–14px
- muted neutral

### Money / total amount
- 28–40px
- weight 700
- strong navy
- use larger sizing than surrounding values.

Example:

> **₹428**

not:

> ₹428

buried among 12px labels.

---

# 6. Layout System

## Desktop

Use a centered content container.

Recommended:

```text
max-width: 1280–1440px
horizontal padding: 24–40px
```

## Mobile

Use:

```text
16px horizontal padding
8px minimum internal spacing
full-width primary CTA
```

## Grid

Prefer:

- 12-column desktop grid,
- 1-column mobile,
- 2-column tablet where useful.

Avoid layouts that require horizontal scrolling.

---

# 7. Spacing

Use a consistent 4px/8px rhythm.

Suggested scale:

```text
4
8
12
16
20
24
32
40
48
64
```

Use:

- 12–16px inside compact cards,
- 20–24px in standard cards,
- 24–32px between sections,
- 40–64px around major page sections.

---

# 8. Borders and Cards

## Card

```css
background: #FFFFFF;
border: 1px solid #E0E6ED;
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 46, 110, 0.08);
```

Cards should feel elevated but not floating dramatically.

## Large sections

Use:

- white background,
- 16px radius,
- thin border,
- generous padding.

## Card hierarchy

### Primary card
Contains the most important action/data.

### Supporting card
Secondary information.

### Alert card
Uses functional color only in icon/badge/accent area.

---

# 9. Buttons

## Primary

```text
Background: #00BAF2
Text: #FFFFFF
Radius: 8px
Height: 44–48px
Font: 14–16px / 500–600
```

Examples:

- Start Self Checkout
- Generate Payment
- Pay Now
- Ask FinBuddy
- View Receipt

## Secondary

```text
Background: #FFFFFF
Border: 1px solid #00BAF2
Text: #00BAF2
Radius: 8px
```

Examples:

- Search Product
- View All
- Retry
- View Receipt

## Destructive

Use red sparingly.

Examples:

- Remove item
- Cancel checkout

## Button rules

- One primary CTA per major section.
- Use sentence case.
- Prefer action verbs.
- Do not use vague labels such as **Submit** when a more specific action is possible.
- On mobile, primary checkout/payment buttons should generally be full width.

---

# 10. Navigation

The reference Paytm site uses a familiar business/consumer navigation pattern:

- brand/logo on the left,
- major categories in the center,
- utility/download actions,
- account/sign-in action on the right.

FinBuddy should adapt this rather than copy it literally.

## Customer navigation

Keep it minimal.

```text
FinBuddy | Store Name

[Cart]
[Account]
```

For checkout, do not overload the header.

## Merchant navigation

```text
FinBuddy
Store Name

Overview
Transactions
Inventory
Feedback
Copilot
```

On mobile, convert to:

- bottom navigation,
- compact menu,
- or drawer.

**Copilot** should remain highly discoverable.

---

# 11. Header Style

## Customer header

- white or very light canvas,
- FinBuddy wordmark,
- current store name,
- cart count,
- account entry if logged in.

## Merchant header

Use a Paytm-inspired strong blue header:

```text
#002E6E
```

with:

- white store name,
- profile/account,
- optional notification icon,
- Copilot access.

---

# 12. Customer Home / Store Entry

When a customer scans a store QR, the landing screen should answer immediately:

### Where am I?

> **ABC Store**

### What can I do?

> **Start Self Checkout**

### How?

```text
Scan products with camera
+
Talk to FinBuddy after scanning
```

Primary CTA:

> **Start Self Checkout**

Secondary:

> Continue as Guest

or

> Login

Do not make registration a gate to basic checkout.

---

# 13. AI Self-Checkout

This is the main customer experience.

## Primary screen structure

```text
Store Header

Welcome to ABC Store

[ Scan Product ]    [ 🎙 Talk ]

Current Cart
3 items
₹160

[ View Cart / Checkout ]
```

The scanning action must be visually dominant.

---

# 14. Barcode Scanner

The scanner should take visual inspiration from the familiar Paytm QR scanning experience shown in the reference.

## Scanner

- full-screen or large camera region,
- darkened/translucent overlay,
- bright blue targeting square,
- clear scan zone,
- minimal controls.

Recommended targeting color:

`#00BAF2`

## Scanner states

### Ready
> Point your camera at a barcode

### Detecting
Animated scanning line.

### Success
- brief green confirmation,
- product added,
- return to checkout.

### Failure
> Couldn't identify this product.

Actions:

**Search Product**

**Scan Again**

---

# 15. Customer Voice Interaction

Voice is not required to operate simultaneously with scanning.

The intended behavior is:

```text
Scan
→ Add item
→ Talk to AI
→ Modify cart / ask question
```

## Voice UI

Use a floating or prominent microphone control:

- circular,
- Paytm blue,
- microphone icon,
- clear active state.

### Idle

> 🎙 Talk to FinBuddy

### Listening

Show:

- microphone animation,
- equalizer/waveform,
- "Listening..."

### Processing

> Understanding...

### Response

Show the answer as a compact message card.

Optionally speak the response aloud.

---

# 16. Customer Voice Commands

MVP examples:

> "Do aur Pepsi add kar do."

> "Ek Maggi hata do."

> "Total kitna hua?"

> "Cart dikhao."

> "Payment generate karo."

The UI may provide suggested commands below the microphone:

```text
"Add 2 Pepsi"
"Remove 1 Maggi"
"How much?"
```

This helps low-confidence users discover the feature.

---

# 17. Cart Experience

The cart is a high-priority transactional surface.

## Desktop

Use a card/panel.

## Mobile

Use a sticky bottom-sheet style cart summary.

### Cart contents

```text
Pepsi 500ml
₹40 × 2                      ₹80

Maggi
₹20 × 1                      ₹20

KitKat
₹60 × 1                      ₹60

-----------------------------
Total                       ₹160
```

### Required

- item name,
- unit price,
- quantity,
- line total,
- remove/change quantity,
- final total.

The total should be the most visually prominent value.

---

# 18. Cart Bottom Action

At the bottom:

```text
Total
₹160

[ Generate Payment ]
```

Do not place unrelated actions next to the main payment CTA.

---

# 19. Payment Experience

The payment page should strongly communicate:

### What am I paying?

> **₹160**

### Where?

> **ABC Store**

### How?

Paytm payment flow / supported payment method.

The payment interface should look trustworthy and uncluttered.

Use a clear security cue.

Example:

> 🔒 Secure payment

---

# 20. Payment States

## Preparing

> Preparing payment...

## Awaiting payment

> Complete payment of **₹160**

## Success

Use:

`#21C17A`

Show:

> **Payment Successful**

Then:

> ₹160

and:

> **View Digital Bill**

## Failure

Use:

`#FD5C63`

Show:

> **Payment Failed**

Actions:

- Retry Payment
- Back to Cart

## Pending

Show:

> Payment confirmation pending

Do not show success until the trusted payment result is verified.

---

# 21. Receipt

Receipt screen should feel like a transaction confirmation, not a generic page.

### Success header

Green check icon.

> **Payment Successful**

### Key transaction information

```text
Amount
₹160

Store
ABC Store

Transaction ID
TXN-12345

Date & Time
26 Sep 2026, 2:14 PM
```

### Items

Show the complete itemized bill.

### Actions

Primary:

**View / Download Receipt**

Secondary:

**Send to WhatsApp**

If the user is not authorized for WhatsApp:

> **Enable WhatsApp Receipt**

---

# 22. WhatsApp Receipt

WhatsApp should be positioned as a convenience layer.

When authorized:

> ✅ Receipt sent to WhatsApp

Do not force the user into WhatsApp.

For unauthorized users:

> **Send receipt to WhatsApp**

Then explicitly request opt-in.

MVP WhatsApp scope:

**receipt only.**

---

# 23. Customer Account

Registered customer profile should remain simple.

Sections:

```text
Profile
Receipts
Saved Payment Methods
WhatsApp Preferences
```

## Saved payment methods

Display only safe representations:

```text
UPI ••••1234
Card ••••4821
```

Never show or store raw credentials.

---

# 24. Guest Checkout

The guest flow should never feel second-class.

Guest:

```text
Scan
→ Cart
→ Pay
→ Receipt
```

Registered user gets convenience features such as:

- receipt history,
- profile,
- authorized WhatsApp delivery,
- sandbox/tokenized payment references.

---

# 25. Merchant Dashboard

The merchant experience should borrow the Paytm-for-Business spirit visible in the reference:

- strong blue header,
- white metric cards,
- clear collections/transaction numbers,
- business-first navigation,
- simple operational sections.

However, FinBuddy's main differentiator is the AI Copilot.

---

# 26. Merchant Home Hierarchy

Order content like this:

```text
1. Today's Business
2. AI Attention / Alerts
3. Ask FinBuddy
4. Sales Trends
5. Inventory
6. Customer Feedback
```

The Copilot should not be hidden behind a tiny menu item.

---

# 27. Merchant KPI Cards

Primary metrics:

```text
Today's Sales
Transactions
Average Bill
Active Alerts
```

Example:

```text
₹8,420
Today's Sales
↑ 12%
```

Use green for positive trends.

Do not use large percentage changes without showing the comparison period.

Example:

> **↑ 12% vs last 7-day average**

---

# 28. AI Attention

Use a dedicated card section.

Examples:

### Low stock

**Maggi stock is low**

> 2 units remaining.

### Sales trend

**Beverage sales are up**

> +18% vs last week.

### Customer feedback

**Customers like fast checkout**

> Most positive feedback mentions checkout speed.

### Opportunity

Use offer yellow:

**Consider a snack + beverage combo**

Explain the underlying pattern.

---

# 29. Merchant Copilot

## Entry point

Place a prominent:

> 🎙 **Ask Your Business**

button/FAB.

It should be visually associated with the Paytm-style blue accent.

## Copilot panel

```text
FinBuddy Copilot

🎙 Aaj ka business kaisa raha?

────────────────────

Aaj ₹8,420 ki sales hui...
Beverage sales sabse strong rahi...

[ View Sales ]

💡 Suggested Action
Evening ke liye beverage stock
thoda increase kar sakte hain.
```

---

# 30. Voice Interaction — Merchant

The merchant should be able to ask naturally:

> "Aaj ki sales kaisi rahi?"

> "Kaunsa product sabse zyada bik raha hai?"

> "Mera stock kahan low hai?"

> "Pichhle hafte se kya change hua?"

> "Customer feedback kya bol raha hai?"

> "Mujhe kya action lena chahiye?"

## Voice feedback

Use a subtle equalizer/waveform.

When the AI speaks:

```text
🔊  ▂▅▇▅▂
```

Use the chime/equalizer idea from the supplied Paytm-inspired reference as a **visual interaction cue**, without cloning proprietary audio.

---

# 31. Merchant Insight Card

Every AI insight should have three parts:

### 1. What happened?

> Beverage sales increased.

### 2. Why?

> Most beverage purchases happened from 5–8 PM.

### 3. What could be done?

> Consider keeping more beverage stock available during this period.

This matches the PS-02 requirement for understandable, actionable intelligence.

---

# 32. Recommendation Cards

Use the defined offer color:

`#FFA800`

Example:

```text
💡 Growth Opportunity

Snack + Beverage Combo

Beverage buyers frequently buy snacks.

[ View Recommendation ]
```

Recommendations are suggestions, not autonomous financial decisions.

---

# 33. Merchant Inventory

Inventory should feel operational rather than analytical.

### Table/list

```text
Product      Stock      Status
--------------------------------
Maggi          2        LOW
Pepsi         28        Healthy
KitKat        14        Healthy
Biscuits       5        LOW
```

### Low-stock indicator

Use red only on the status/badge.

---

# 34. Transactions

Merchant transaction list:

```text
TXN-1024
2:14 PM
3 items
₹160
Paid

TXN-1023
2:08 PM
5 items
₹428
Paid
```

Filter/search can be secondary.

Do not make this the primary home dashboard.

---

# 35. Customer Feedback

Show:

```text
Overall
4.5 / 5

Positive themes
• Fast checkout
• Easy payment

Common issues
• Scan button was not obvious
```

Allow the Copilot to summarize rather than forcing the merchant to read every comment.

---

# 36. Alerts

Alerts should answer:

```text
What happened?
Why should I care?
What can I consider doing?
```

Example:

> ⚠ **Maggi stock is low**  
> Only 2 units remain.  
> **Consider restocking.**

---

# 37. Empty States

Every empty state should teach the next action.

Bad:

> No data.

Good:

> **No transactions yet**  
> Your first customer checkout will appear here.

Button:

**Open Customer Checkout**

---

# 38. Loading States

Prefer skeletons over full-page spinners.

Examples:

- metric skeleton,
- transaction skeleton,
- AI response placeholder.

For voice:

```text
Listening...
Processing...
Speaking...
```

---

# 39. Error States

Errors must be actionable.

### Product scan

> **Product not found**

Buttons:

**Search Product**

**Scan Again**

### Payment

> **Payment could not be confirmed**

Buttons:

**Retry**

**Return to Cart**

### AI

> **I couldn't get that business insight right now.**

Button:

**Try Again**

Never expose raw API/server errors to users.

---

# 40. Toasts

Use toasts for lightweight confirmations:

- Product added
- Quantity updated
- Receipt sent
- Preference saved

Do not use toasts for critical payment state.

Payment success/failure belongs to the main page state.

---

# 41. Iconography

Use simple outline/duotone icons.

Recommended visual family:

- user,
- store,
- QR,
- barcode,
- camera,
- microphone,
- cart,
- receipt,
- payment,
- database,
- inventory,
- chart,
- alert,
- lightbulb,
- WhatsApp,
- shield.

Avoid mixing:

- 3D icons,
- cartoon icons,
- photographic icons,
- random icon libraries.

Choose one consistent icon family.

---

# 42. Icon Color Rules

Default:

`#002E6E`

Interactive:

`#00BAF2`

Success:

`#21C17A`

Error:

`#FD5C63`

Opportunity:

`#FFA800`

Use color sparingly.

---

# 43. Illustration Style

Use lightweight vector illustrations only where they help explain a workflow.

Good examples:

- QR → phone,
- scan → cart,
- payment → receipt,
- transaction → merchant insight.

Avoid illustrations on every card.

The supplied Paytm reference relies heavily on product screenshots, iconography and promotional panels rather than decorative artwork; FinBuddy should follow that information-first principle.

---

# 44. Responsive Behavior

## Mobile — Customer

Priority:

1. Store identity
2. Scan
3. Voice
4. Cart
5. Payment

Everything else is secondary.

## Desktop — Merchant

Priority:

1. Business overview
2. Copilot
3. Alerts
4. Inventory
5. Transactions
6. Feedback

---

# 45. Accessibility

FinBuddy must be usable by a broad audience.

## Requirements

- minimum comfortable text size,
- sufficient contrast,
- visible focus state,
- keyboard navigation,
- labels for icon-only buttons,
- microphone status available in text,
- don't rely on color alone,
- error messages must explain recovery,
- voice is an enhancement, not the only way to perform core actions.

## Hindi/Hinglish

Do not shrink Hindi/Hinglish typography.

Use fonts with reliable Devanagari fallback if Hindi is rendered.

---

# 46. Voice Accessibility

Voice should be optional.

Customer can always:

```text
Scan
→ Tap cart controls
→ Pay
```

Merchant can always:

```text
Type question
→ Receive text answer
```

Voice improves speed and accessibility but does not create a hard dependency.

---

# 47. Motion

Use motion only where it communicates state.

Good:

- barcode scan confirmation,
- cart item added,
- payment success check,
- microphone listening pulse,
- skeleton loading,
- Copilot equalizer.

Avoid:

- constant animated backgrounds,
- excessive page transitions,
- distracting loops.

Animation duration:

```text
150–300ms
```

for ordinary UI changes.

---

# 48. Payment Motion

Successful payment:

```text
Processing
→ Green check
→ Payment Successful
```

Keep the success animation short.

Failure:

```text
Processing
→ Red state
→ Payment Failed
→ Retry
```

---

# 49. Form Design

Forms should remain short.

Merchant onboarding MVP:

```text
Store Name
Business Category
Location
Language Preference
```

Then:

**Create Store**

Do not ask for information that the MVP does not use.

---

# 50. Search

Search inputs:

```text
Background: #FFFFFF
Border: #E0E6ED
Radius: 8–10px
Focus: #00BAF2
```

Placeholder examples:

> Search products

> Search transactions

Use an icon on the left only when helpful.

---

# 51. Data Visualization

Charts are supporting elements, not the main merchant experience.

Use simple:

- bar charts,
- line charts,
- category summaries.

Always pair a chart with a sentence.

Example:

```text
Beverage sales
[chart]

"Evening demand was highest this week."
```

Never force the merchant to infer meaning from a chart alone.

---

# 52. Dashboard Density

The reference Paytm site organizes content into clear horizontal modules.

FinBuddy should follow:

```text
Hero / greeting
↓
Key metrics
↓
AI attention
↓
Main business content
↓
Supporting modules
```

Do not put 10 analytics cards side by side.

---

# 53. Customer Checkout Density

Customer checkout should be even simpler:

```text
Store
↓
Scanner
↓
Cart
↓
Payment
```

Remove unrelated navigation while the user is in checkout.

---

# 54. Merchant Copilot UX Principle

The Copilot must feel like an assistant, not a generic ChatGPT clone.

Bad:

```text
Huge empty chat page
"How can I help?"
```

Better:

```text
Today's Business
↓
AI Attention
↓
Ask Your Business
↓
Suggested questions
↓
Answer + evidence + recommendation
```

The merchant should be able to understand useful information before typing anything.

---

# 55. Suggested Questions

Show chips such as:

```text
Today's sales
Top products
Low stock
Slow products
Customer feedback
What should I do?
```

For Hindi/Hinglish:

```text
Aaj ki sales
Sabse zyada kya bika?
Stock kahan low hai?
Customer kya bol rahe hain?
Kya action loon?
```

---

# 56. Trust / Security Cues

Use subtle trust signals:

- lock icon,
- secure payment label,
- payment status,
- transaction ID,
- verified success state.

Do not overuse security badges.

The most important security cue is clarity.

---

# 57. Financial Safety UX

If the merchant asks for regulated financial advice:

> **I can't provide lending, credit, investment or other regulated financial advice.**

Then offer a safe alternative:

> **I can show your sales, inventory and transaction trends for your own business planning.**

Do not add financial recommendations to the refusal.

---

# 58. Paytm Brand Usage

The product should be **Paytm-inspired**, not a visual clone.

Use the Paytm visual conventions supplied by the team as the design reference.

Do not invent or reproduce proprietary Paytm product screens beyond what is necessary for an approved hackathon integration/demo.

For payment integration, use actual Paytm branding only according to the permitted integration/brand usage rules.

FinBuddy itself must remain visually identifiable as **FinBuddy**.

---

# 59. FinBuddy Branding

The project name should appear consistently as:

> **FinBuddy**

Suggested product lockup:

```text
FinBuddy
AI Self-Checkout + Merchant Copilot
```

Avoid the older personal-finance positioning:

> "AI financial assistant for smarter spending"

That is not the canonical product anymore.

---

# 60. Customer Design Hierarchy

Every customer screen should answer in this order:

```text
Where am I?
What am I doing?
What is my current total?
What should I do next?
```

Example:

```text
ABC Store
↓
Scan products
↓
3 items · ₹160
↓
[ Generate Payment ]
```

---

# 61. Merchant Design Hierarchy

Every merchant screen should answer:

```text
How is my business doing?
↓
What needs attention?
↓
Why?
↓
What can I do?
```

Example:

```text
Sales ↑ 12%
↓
Beverage demand strongest 5–8 PM
↓
Stock may be insufficient
↓
Consider increasing beverage stock
```

---

# 62. Component Naming

Use semantic component names.

Examples:

```text
StoreHeader
CheckoutScanner
VoiceAssistantButton
CartSummary
CartItem
PaymentStatus
ReceiptCard

MerchantHeader
BusinessMetricCard
AIInsightCard
CopilotPanel
InventoryTable
TransactionList
FeedbackSummary
AlertCard
RecommendationCard
```

Avoid vague names such as:

```text
BlueBox
Card2
ContainerLarge
Widget
```

---

# 63. Design Tokens

Recommended token structure:

```text
--color-brand-900: #002E6E;
--color-brand-500: #00BAF2;

--color-success: #21C17A;
--color-danger: #FD5C63;
--color-offer: #FFA800;

--color-canvas: #F5F7FA;
--color-surface: #FFFFFF;
--color-border: #E0E6ED;

--radius-sm: 8px;
--radius-md: 12px;

--shadow-card: 0 2px 8px rgba(0,46,110,0.08);
```

---

# 64. Customer Demo Screen Sequence

The live demo should visually flow through:

```text
Store QR
→ Customer Web Checkout
→ Scanner
→ Product Added
→ Voice Command
→ Cart
→ Payment
→ Payment Success
→ Digital Receipt
→ WhatsApp Receipt
```

No screen should visually feel like it belongs to a different product.

---

# 65. Merchant Demo Screen Sequence

```text
Merchant Dashboard
→ AI Attention
→ Ask FinBuddy
→ Insight
→ Recommendation
→ Inventory
→ Transaction
→ Customer Feedback
```

This should make the relationship between checkout data and merchant intelligence obvious.

---

# 66. Visual Consistency Rule

All customer and merchant screens must share:

- same brand colors,
- same font,
- same button system,
- same radius system,
- same icons,
- same spacing scale,
- same success/error language.

The two experiences may have different information architecture, but they must look like one product.

---

# 67. MVP Simplification Rule

When choosing between:

**more features**

and

**clearer user experience**

choose clearer user experience.

The MVP deadline is **4:15 PM internal freeze / 4:30 PM official submission**.

The UI should therefore prioritize:

1. working scan,
2. working cart,
3. working voice commands,
4. working payment flow,
5. working receipt,
6. working merchant Copilot,
7. working insights/alerts.

Everything else is secondary.

---

# 68. QA Visual Checklist

Before the 4:15 PM freeze, verify:

- [ ] all primary CTAs are visually obvious,
- [ ] payment amount is prominent,
- [ ] success state is unmistakable,
- [ ] failure state has a recovery CTA,
- [ ] scanner target is visible on mobile,
- [ ] microphone has listening/processing states,
- [ ] Hindi/Hinglish text does not break layout,
- [ ] customer cart works on a phone,
- [ ] merchant dashboard works on desktop,
- [ ] no horizontal overflow,
- [ ] no raw API/server errors,
- [ ] no placeholder lorem ipsum,
- [ ] no test/debug controls visible.

---

# 69. Final Design Principles

## Principle 1
**Make payment and transaction states impossible to misunderstand.**

## Principle 2
**Make scanning the fastest path to checkout.**

## Principle 3
**Make voice an intuitive shortcut, not a gimmick.**

## Principle 4
**Make merchant analytics conversational.**

## Principle 5
**Explain insights in plain language.**

## Principle 6
**Use color to communicate state, not decoration.**

## Principle 7
**Keep the visual system familiar to Paytm users while maintaining FinBuddy identity.**

## Principle 8
**Never allow visual polish to compromise the 4:15 PM MVP freeze.**

---

# 70. Canonical UI/UX Direction

> **Paytm-inspired trust + FinBuddy intelligence.**

### Customer

> **Scan → Talk → Pay → Receipt**

### Merchant

> **Ask → Understand → Act**

### Visual character

**Clean • Blue-led • White surfaces • Transaction-first • Conversational • Mobile-friendly • Merchant-friendly**

