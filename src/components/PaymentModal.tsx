import React, { useState } from 'react';
import { CartItem } from '../types';
import { finalizeCheckout } from '../services/db';
import { soundFX } from '../utils/audio';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, X, CreditCard, Lock, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  storeId: string;
  onPaymentSuccess: (receiptId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  storeId,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'failed'>('confirm');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (!isOpen) return null;

  const totalPaise = cartItems.reduce((acc, curr) => acc + curr.unitPricePaise * curr.quantity, 0);
  const totalRupees = (totalPaise / 100).toFixed(2);

  const handlePayNow = () => {
    setStep('processing');
    setErrorMessage(null);

    // Simulate Paytm test state machine transition
    setTimeout(() => {
      if (simulateFailure) {
        setStep('failed');
        setErrorMessage('Paytm Payment Simulator: Bank authorization timed out. Your cart is preserved.');
        return;
      }

      const res = finalizeCheckout(storeId, cartItems);
      if (res.success && res.receipt) {
        setStep('success');
        soundFX.playSuccessChime();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          onPaymentSuccess(res.receipt!.id);
        }, 1400);
      } else {
        setStep('failed');
        setErrorMessage(res.error || 'Payment verification conflict. Please retry.');
      }
    }, 1500);
  };

  const handleRetry = () => {
    setSimulateFailure(false);
    setStep('confirm');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E6E]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E0E6ED] rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.18)] p-6 relative flex flex-col">
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#6B7A90] hover:text-[#002E6E] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* STEP 1: CONFIRM PAYMENT (Sections 19 & 20) */}
        {step === 'confirm' && (
          <div>
            {/* Paytm Header & Trust Cue */}
            <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#002E6E] text-white flex items-center justify-center font-bold text-xs">
                  Paytm
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002E6E]">Paytm Payment Gateway</h3>
                  <p className="text-[11px] text-[#6B7A90]">Awadh Mart (Hazratganj)</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#21C17A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <Lock className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>

            {/* What am I paying? (Section 19: Large bold navy amount) */}
            <div className="bg-[#F5F7FA] border border-[#E0E6ED] rounded-xl p-4 mb-4 text-center">
              <span className="text-xs font-semibold text-[#6B7A90] uppercase tracking-wider block">
                Total Amount To Pay
              </span>
              <p className="text-3xl sm:text-4xl font-black text-[#002E6E] my-1">
                ₹{totalRupees}
              </p>
              <span className="text-xs text-[#6B7A90]">
                {cartItems.reduce((a, b) => a + b.quantity, 0)} items in self-checkout basket
              </span>
            </div>

            {/* Payment Method Details */}
            <div className="space-y-2 mb-4">
              <div className="p-3 rounded-xl bg-white border border-[#00BAF2] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00BAF2] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#002E6E]">Paytm Test UPI / Sandbox</p>
                    <p className="text-[11px] text-[#6B7A90]">Instant test state machine authorization</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 text-[#002E6E]">
                  Active
                </span>
              </div>
            </div>

            {/* Judge Failure Simulation Checkbox */}
            <div className="p-2.5 rounded-lg bg-[#F5F7FA] border border-[#E0E6ED] mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6B7A90]">Simulate payment decline (QA test)</span>
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="w-4 h-4 rounded text-[#00BAF2] focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Primary Action Button (Section 9: #00BAF2, 48px height, 8px radius) */}
            <button
              onClick={handlePayNow}
              className="w-full h-12 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-sm rounded-lg shadow-[0_2px_8px_rgba(0,186,242,0.3)] transition active:scale-[0.98]"
            >
              Authorize & Pay ₹{totalRupees}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7A90]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#21C17A]" />
              <span>100% Synthetic Demo Sandbox · No real charges</span>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING (Section 20) */}
        {step === 'processing' && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00BAF2] flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-3 border-[#00BAF2] border-t-transparent animate-spin" />
              <CreditCard className="w-7 h-7 text-[#002E6E]" />
            </div>
            <h3 className="text-base font-bold text-[#002E6E] mb-1">Awaiting Payment Verification...</h3>
            <p className="text-xs text-[#6B7A90] max-w-xs mb-3">
              Processing Paytm test payment of ₹{totalRupees} and writing verified transaction state.
            </p>
            <span className="text-[11px] font-semibold text-[#00BAF2] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              State: AwaitingPayment → Verified
            </span>
          </div>
        )}

        {/* STEP 3: SUCCESS (Section 20: #21C17A) */}
        {step === 'success' && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#21C17A] flex items-center justify-center mb-3 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-[#002E6E] mb-1">Payment Successful</h3>
            <p className="text-2xl font-black text-[#002E6E] mb-2">₹{totalRupees}</p>
            <p className="text-xs text-[#21C17A] font-bold">Verified & Paid via Paytm Gateway</p>
          </div>
        )}

        {/* STEP 4: FAILURE (Section 20: #FD5C63) */}
        {step === 'failed' && (
          <div className="py-6 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-[#FD5C63] flex items-center justify-center mb-3 border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#FD5C63] mb-1">Payment Failed</h3>
            <p className="text-xs text-[#6B7A90] max-w-xs mb-5">
              {errorMessage || 'Payment could not be confirmed. Your cart has been safely preserved.'}
            </p>
            <div className="w-full flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-lg bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] text-xs font-semibold border border-[#E0E6ED] transition"
              >
                Return to Cart
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 h-10 rounded-lg bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Payment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
