import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, Store } from 'lucide-react';

export const MerchantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('yashraj@awadhmart.in');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/merchant/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E0E6ED] rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,46,110,0.08)] relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#002E6E] flex items-center justify-center mx-auto mb-3 border border-sky-100 shadow-sm">
            <Store className="w-6 h-6 text-[#00BAF2]" />
          </div>
          <h1 className="text-2xl font-black text-[#002E6E]">Merchant Sign In</h1>
          <p className="text-xs text-[#6B7A90] mt-1">Access Awadh Mart (Hazratganj) Hub</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-[#002E6E] mb-6 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#00BAF2] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Hackathon Demo Mode:</span>
            <p className="text-[11px] text-[#6B7A90] mt-0.5">
              Credentials are pre-filled for one-click access to the seeded store.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#002E6E] block mb-1">Merchant Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#002E6E] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2] transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <span>Sign In to Merchant Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-[#6B7A90]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#21C17A]" />
          <span>Paytm-for-Business Certified Demo</span>
        </div>
      </div>
    </div>
  );
};
