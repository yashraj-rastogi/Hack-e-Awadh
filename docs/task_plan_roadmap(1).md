# FinBuddy — Task Plan / Roadmap

## Team of Three

### Yashraj Rastogi — Full Stack
- project foundation,
- customer UI,
- merchant UI,
- Firebase/Auth/Firestore,
- overall integration,
- deployment,
- final merge.

### Gaurav Kumar — Testing / QA
- test plan,
- test cases,
- edge cases,
- regression testing,
- demo data verification,
- final demo rehearsal,
- overflow implementation support after QA checkpoints.

### Vineet Shukla — Paytm Payment Integration
- Paytm Gateway integration,
- payment state handling,
- error/retry path,
- secure server-side payment flow,
- payment lifecycle validation.

---

# Hard Deadline

**Official submission deadline:** 4:30 PM  
**Internal MVP freeze:** 4:15 PM  
**Buffer:** 15 minutes

From 4:15–4:30 PM:
- no new features,
- only critical fixes that do not risk the build,
- final verification,
- repository/deployment/submission checks.

---

# 4:15 PM Definition of Done

```text
Customer
QR → Scan → Voice → Cart → Payment → Receipt

System
Transaction → Inventory update

Merchant
Dashboard → Copilot → Insight → Recommendation
```

No manual database edits should be required for the demo.

---

# Phase 0 — Kickoff

## 9:00–9:15 AM

### All
- confirm scope,
- confirm branches/tasks,
- confirm environment variables/config,
- verify synthetic dataset,
- confirm fallback plan.

### Yashraj
Initialize React/Vite/Tailwind + Firebase + routes.

### Gaurav
Create P0 QA checklist and acceptance matrix.

### Vineet
Initialize Paytm adapter and test configuration.

### Manual team task
Do not expand scope after kickoff unless a P0 blocker appears.

---

# Phase 1 — Customer Foundation

## 9:15–10:45 AM

### Yashraj
Build:
- store QR landing,
- checkout UI,
- camera scanner,
- product lookup,
- cart.

### Vineet
Build:
- payment provider interface,
- payment attempt model,
- Paytm integration skeleton.

### Gaurav
Test:
- QR,
- valid barcode,
- duplicate scan,
- unknown barcode,
- out-of-stock.

### Exit criterion
```text
Open store → Scan → Product → Cart
```

---

# Phase 2 — Voice + Exact Checkout

## 10:45 AM–11:45 AM

### Yashraj
- voice input UI,
- cart state,
- exact totals,
- customer confirmation.

### Vineet
- create-payment call,
- payment-state handling.

### Gaurav
Test:
- add by voice,
- remove,
- change quantity,
- ask total,
- payment confirmation.

### Exit criterion
```text
Scan + Voice → Cart → Exact Total
```

---

# Phase 3 — Payment + Receipt + Inventory

## 11:45 AM–1:15 PM

### Vineet — priority
- Paytm test-mode/sandbox path,
- payment status,
- success/failure,
- retry,
- verification.

### Yashraj
- transaction persistence,
- receipt,
- inventory decrement,
- Firestore integration.

### Gaurav
Full payment QA:
- success,
- failure,
- pending,
- retry,
- duplicate callback/finalization.

### Exit criterion
Successful payment creates:
```text
Transaction + Receipt + Inventory update
```

---

# Phase 4 — Merchant Dashboard

## 1:15–2:15 PM

### Yashraj
- merchant home,
- transactions,
- inventory,
- KPI cards,
- alert cards.

### Vineet
Assist backend/integration debugging.

### Gaurav
Test permissions and data correctness.

### Exit criterion
Customer transaction appears in merchant dashboard without manual DB editing.

---

# Phase 5 — Merchant Copilot

## 2:15–3:00 PM

### Yashraj
- Copilot UI,
- Gemini integration,
- tool-call plumbing.

### Vineet
Assist secure server invocation and data contracts.

### Gaurav
Validate:
- today's sales,
- top products,
- low stock,
- slow products,
- feedback,
- recommendation,
- Hindi/Hinglish.

### P0 demo questions
1. "Aaj ka business kaisa raha?"
2. "Kaunsa product sabse zyada bika?"
3. "Stock kahan low hai?"
4. "Kaunsa product slow chal raha hai?"
5. "Mujhe kya action lena chahiye?"

### Exit criterion
Copilot answers at least 3 high-confidence demo questions correctly.

---

# Phase 6 — WhatsApp + Alerts

## 3:00–3:20 PM

### Vineet
- Twilio WhatsApp receipt path.

### Yashraj
- proactive alert cards,
- feedback summary.

### Gaurav
- opt-in verification,
- message delivery test,
- alert validation.

### Scope rule
If WhatsApp threatens the 4:15 freeze, it becomes P1. Digital receipt remains guaranteed.

---

# Phase 7 — Full QA

## 3:20–3:45 PM

### Gaurav leads
Run the complete scripted demo:

```text
1. Scan QR
2. Guest checkout
3. Scan products
4. Voice modify cart
5. Verify total
6. Pay
7. Receipt
8. Feedback
9. Inventory update
10. Merchant dashboard
11. Copilot question
12. Insight
13. Recommendation
```

### Yashraj
Fix only P0 defects.

### Vineet
Validate payment lifecycle one final time.

---

# Phase 8 — Freeze Preparation

## 3:45–4:05 PM

All members:
- stop feature work as early as practical,
- remove debug UI/logs,
- verify environment variables,
- verify Vercel deployment,
- verify Firebase rules,
- verify demo accounts/data,
- verify public GitHub state,
- verify live URL.

---

# Phase 9 — Rehearsal + Freeze

## 4:05–4:15 PM

Perform one clean rehearsal:

```text
QR → Scan → Voice → Cart → Payment → Receipt
↓
Inventory update
↓
Merchant dashboard
↓
Ask Copilot
↓
Insight
↓
Recommendation
```

## 4:15 PM

> **ENGINEERING FREEZE**

---

# 4:15–4:30 PM — Submission Only

Do not build features.

Checklist:
- final PDF/PPT,
- public repository,
- README,
- live URL,
- submission form,
- screenshots/demo proof,
- final links.

---

# Priority System

## P0
Must work by 4:15 PM.

## P1
Only after P0 is stable.

## P2
Do not touch before P0 + QA + submission readiness.

### If behind schedule, cut in this order
1. P2
2. registered customer extras
3. advanced alerts/analytics
4. WhatsApp
5. decorative animations

Never cut:
- customer checkout,
- payment path,
- transaction persistence,
- inventory update,
- merchant Copilot,
- core merchant insights.

---

# Manual Tasks

Before/at event start:
- create Paytm test configuration,
- configure Firebase project,
- configure Gemini access,
- configure Twilio,
- create Vercel project,
- create public GitHub repo after the hackathon begins,
- add environment variables securely.

During integration:
- approve browser camera/microphone permissions,
- verify Paytm test credentials/config,
- verify Twilio sender,
- verify Vercel production variables.

Before freeze:
- test live URL on phone,
- test payment success/failure,
- test merchant dashboard,
- test Copilot,
- verify no secrets are committed.
