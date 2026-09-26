import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Store as StoreIcon,
  CheckCircle2,
  Building2,
  MapPin,
  Tag,
  Lock,
  Mail,
  User,
  Phone,
} from 'lucide-react';
import { getStore, updateStoreDetails } from '../services/db';

export const MerchantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const currentStore = getStore();

  const [mode, setMode] = useState<'signin' | 'onboard'>('signin');

  // Sign In State
  const [email, setEmail] = useState('yashraj@awadhmart.in');
  const [password, setPassword] = useState('demo1234');

  // Business Onboarding State (Step 2.1)
  const [storeName, setStoreName] = useState(currentStore.name || 'Awadh Mart');
  const [category, setCategory] = useState<'grocery' | 'general-store' | 'supermarket' | 'fmcg' | 'kirana'>('kirana');
  const [location, setLocation] = useState(currentStore.location || 'Hazratganj, Lucknow');
  const [ownerName, setOwnerName] = useState('Yashraj Sharma');
  const [ownerEmail, setOwnerEmail] = useState('yashraj@awadhmart.in');
  const [ownerPhone, setOwnerPhone] = useState('9876543210');
  const [gstin, setGstin] = useState('09AAACA1234A1Z5');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/merchant/dashboard');
  };

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreDetails(currentStore.id, {
      name: storeName.trim(),
      category: category,
      location: location.trim(),
      ownerEmail: ownerEmail.trim(),
      ownerPhone: ownerPhone.trim(),
    });
    navigate('/merchant/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1C2D42] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-[#E0E6ED] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,46,110,0.08)] relative">
        <div className="text-center mb-6">
          <img
            src="/finbuddy-logo.png"
            alt="FinBuddy Logo"
            className="h-12 object-contain mx-auto mb-2 mix-blend-multiply"
          />
          <h1 className="text-2xl font-black text-[#002E6E]">
            {mode === 'signin' ? 'Merchant Portal Login' : 'Business Onboarding'}
          </h1>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            {mode === 'signin'
              ? 'Paytm for Business · Kirana Copilot Dashboard'
              : 'Register your offline store credentials & location profile'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#F5F7FA] p-1 rounded-xl mb-6 border border-[#E0E6ED]">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signin'
                ? 'bg-white text-[#002E6E] shadow-xs'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            Sign In (Demo Store)
          </button>
          <button
            type="button"
            onClick={() => setMode('onboard')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'onboard'
                ? 'bg-white text-[#002E6E] shadow-xs'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            Onboard New Business
          </button>
        </div>

        {mode === 'signin' ? (
          <div>
            {/* Demo Credentials Box */}
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-[#002E6E] mb-5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#00BAF2] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Hack-e-Awadh Staging Access:</span>
                <p className="text-[11px] text-[#6B7A90] mt-0.5 leading-relaxed">
                  Pre-configured merchant credentials for <strong>Awadh Mart (Hazratganj)</strong> with 15 seeded FMCG items and live telemetry.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Merchant Business Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#00BAF2] hover:bg-[#00a4d6] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Sign In to Merchant Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Step 2.1: Business Onboarding & Account Creation Form */
          <form onSubmit={handleOnboard} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Store / Business Name
                </label>
                <div className="relative">
                  <StoreIcon className="w-3.5 h-3.5 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Awadh Mart"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Business Category
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  >
                    <option value="kirana">Kirana & Grocery</option>
                    <option value="fmcg">FMCG & Convenience</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="general-store">General Retail</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                Store Location / Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hazratganj, Lucknow"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Proprietor / Owner Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner Full Name"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Business Mobile / UPI
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#6B7A90] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="contact@store.in"
                  className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#002E6E] block mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="09AAACA1234A1Z5"
                  className="w-full px-3 py-2 bg-white border border-[#E0E6ED] rounded-lg text-xs text-[#1C2D42] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#002E6E] hover:bg-[#001D47] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00BAF2]" />
              <span>Register Business & Launch Copilot</span>
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7A90]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#21C17A]" />
          <span>Paytm for Business · End-to-End Encrypted Merchant Hub</span>
        </div>
      </div>
    </div>
  );
};
