import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Smartphone,
  Check,
  ArrowRight,
  ShoppingBag,
  LayoutDashboard,
  MessageSquare,
  Download,
} from 'lucide-react';
import { getReceipt, submitCustomerFeedback } from '../services/db';

export const ReceiptPage: React.FC = () => {
  const { storeId = 'store-awadh-01', receiptId = '' } = useParams<{
    storeId: string;
    receiptId: string;
  }>();

  const receipt = getReceipt(receiptId);

  const [phone, setPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const [rating, setRating] = useState<'great' | 'okay' | 'problem' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!receipt) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[#6B7A90] mb-4">Receipt not found or session expired.</p>
          <Link
            to={`/s/${storeId}/checkout`}
            className="px-4 py-2 rounded-lg bg-[#00BAF2] text-white text-sm font-semibold"
          >
            Back to Checkout
          </Link>
        </div>
      </div>
    );
  }

  const totalRupees = (receipt.totalPaise / 100).toFixed(2);
  const formattedDate = new Date(receipt.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setWhatsappSent(true);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    submitCustomerFeedback(storeId, receipt.transactionId, rating, feedbackText);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-5">
        {/* Success Header (Section 21: Green Check Icon #21C17A) */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#21C17A] flex items-center justify-center mx-auto mb-2 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#002E6E]">Payment Successful</h1>
          <p className="text-xs text-[#6B7A90] mt-0.5">Thank you for shopping at {receipt.storeName}</p>
        </div>

        {/* Transaction Summary Card (Section 21) */}
        <div className="paytm-card p-6 shadow-[0_2px_12px_rgba(0,46,110,0.08)] relative overflow-hidden bg-white">
          <div className="border-b border-[#E0E6ED] pb-4 mb-4 text-center">
            <span className="text-xs text-[#6B7A90] uppercase font-semibold">Total Paid</span>
            <p className="text-3xl sm:text-4xl font-black text-[#002E6E] my-1">₹{totalRupees}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#002E6E] text-[11px] font-semibold">
              <span>Paytm Ref:</span>
              <span className="font-mono font-bold">{receipt.paymentReference}</span>
            </div>
          </div>

          {/* Key Transaction Information (Section 21) */}
          <div className="space-y-1.5 text-xs text-[#6B7A90] mb-4 pb-4 border-b border-[#E0E6ED]">
            <div className="flex justify-between">
              <span>Store</span>
              <span className="font-semibold text-[#002E6E]">{receipt.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID</span>
              <span className="font-mono font-semibold text-[#002E6E]">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time</span>
              <span className="font-semibold text-[#002E6E]">{formattedDate}</span>
            </div>
          </div>

          {/* Itemized Bill Table (Section 21) */}
          <div className="space-y-2 mb-4">
            <span className="text-[11px] font-bold text-[#6B7A90] uppercase tracking-wider block">
              Purchased Items
            </span>
            {receipt.items.map((item, idx) => {
              const lineTotal = ((item.lineTotalPaise || item.unitPricePaise * item.quantity) / 100).toFixed(2);
              return (
                <div key={idx} className="flex justify-between items-center text-xs py-1">
                  <div className="flex-1 pr-2 truncate">
                    <span className="font-semibold text-[#002E6E]">{item.name}</span>
                    <span className="text-[#6B7A90] text-[11px] ml-1.5">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-[#002E6E]">₹{lineTotal}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 rounded-lg bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E0E6ED] transition"
          >
            <Download className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>Download / Print Receipt</span>
          </button>
        </div>

        {/* WhatsApp Receipt Card (Section 22) */}
        <div className="paytm-card p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-[#21C17A]" />
            <h3 className="text-xs font-bold text-[#002E6E]">Send Receipt to WhatsApp</h3>
          </div>

          {whatsappSent ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-[#21C17A] font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#21C17A] shrink-0" />
              <span>Digital receipt sent to WhatsApp (+91 {phone})!</span>
            </div>
          ) : (
            <form onSubmit={handleSendWhatsApp} className="space-y-2.5">
              <input
                type="tel"
                placeholder="+91 Mobile Number..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] placeholder-[#6B7A90] focus:outline-none focus:border-[#00BAF2] transition"
              />
              <label className="flex items-center gap-2 text-[11px] text-[#6B7A90] cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="rounded text-[#00BAF2] focus:ring-0 w-3.5 h-3.5"
                  required
                />
                <span>I agree to receive my digital receipt link on WhatsApp.</span>
              </label>
              <button
                type="submit"
                disabled={!whatsappOptIn || !phone}
                className="w-full h-9 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] disabled:opacity-50 text-white font-bold text-xs transition"
              >
                Send WhatsApp Bill
              </button>
            </form>
          )}
        </div>

        {/* Customer Feedback (Section 35) */}
        <div className="paytm-card p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[#00BAF2]" />
            <h3 className="text-xs font-bold text-[#002E6E]">Rate your checkout experience</h3>
          </div>

          {feedbackSubmitted ? (
            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-[#002E6E] font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00BAF2]" />
              <span>Thank you! Your feedback helps Awadh Mart improve checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRating('great')}
                  className={`py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    rating === 'great'
                      ? 'bg-emerald-50 text-[#21C17A] border-emerald-200 shadow-sm'
                      : 'bg-white border-[#E0E6ED] text-[#6B7A90] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span className="text-base">🙂</span>
                  <span>Great</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('okay')}
                  className={`py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    rating === 'okay'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                      : 'bg-white border-[#E0E6ED] text-[#6B7A90] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span className="text-base">😐</span>
                  <span>Okay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('problem')}
                  className={`py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    rating === 'problem'
                      ? 'bg-rose-50 text-[#FD5C63] border-rose-200 shadow-sm'
                      : 'bg-white border-[#E0E6ED] text-[#6B7A90] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span className="text-base">☹</span>
                  <span>Issue</span>
                </button>
              </div>

              {rating && (
                <>
                  <input
                    type="text"
                    placeholder="Optional: What went well or could be improved?"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] placeholder-[#6B7A90] focus:outline-none focus:border-[#00BAF2]"
                  />
                  <button
                    type="submit"
                    className="w-full h-9 rounded-lg bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs transition"
                  >
                    Submit Feedback
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-2">
          <Link
            to="/merchant/dashboard"
            className="w-full h-11 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Merchant Hub (See Live Sale Update)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to={`/s/${storeId}/checkout`}
            className="w-full h-10 rounded-lg bg-white hover:bg-sky-50 text-[#002E6E] hover:text-[#00BAF2] font-semibold text-xs flex items-center justify-center gap-2 border border-[#E0E6ED] transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>Start Another Checkout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
