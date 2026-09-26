import { Receipt } from '../types';

export interface WhatsAppSendResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  needsSandboxJoin?: boolean;
}

export async function sendWhatsAppReceipt(
  receipt: Receipt,
  recipientPhone: string
): Promise<WhatsAppSendResult> {
  const sid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const token = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const fromNumber = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || '+14155238886';

  if (!sid || !token) {
    return {
      success: false,
      error: 'Twilio Account SID or Auth Token missing in environment.',
    };
  }

  // Format recipient phone to E.164 (e.g. +919876543210)
  let cleanPhone = recipientPhone.replace(/\D/g, '');
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const toWhatsApp = `whatsapp:+${cleanPhone}`;
  const fromWhatsApp = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;

  // Format Rich Digital Receipt Message
  const formattedDate = new Date(receipt.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const totalRupees = (receipt.totalPaise / 100).toFixed(2);

  const itemsList = receipt.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} (₹${((item.lineTotalPaise || item.unitPricePaise * item.quantity) / 100).toFixed(2)})`
    )
    .join('\n');

  const receiptUrl = `${window.location.origin}/s/${receipt.storeId}/receipt/${receipt.id}`;

  const messageBody = `🧾 *${receipt.storeName} — Digital Receipt*
📅 ${formattedDate}
🔖 Ref: *${receipt.paymentReference}*

*Purchased Items:*
${itemsList}

💰 *Total Paid: ₹${totalRupees}*
✅ *Payment Verified via Paytm Gateway*

🔗 *View your online digital bill:*
${receiptUrl}

_Thank you for using FinBuddy Self-Checkout! 🙏_`;

  try {
    const postData = new URLSearchParams({
      From: fromWhatsApp,
      To: toWhatsApp,
      Body: messageBody,
    }).toString();

    const authHeader = 'Basic ' + btoa(`${sid}:${token}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
      }
    );

    const json = await response.json();

    if (response.ok && json.sid) {
      return {
        success: true,
        messageSid: json.sid,
      };
    } else {
      const code = json.code;
      const needsJoin = code === 21608 || code === 63015;
      return {
        success: false,
        error: json.message || 'Failed to send message via Twilio.',
        needsSandboxJoin: needsJoin,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Twilio network request failed.';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
