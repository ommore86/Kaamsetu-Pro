import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Zap, Sparkles, CreditCard, Lock, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { currentUser, userSubscriptions, updateSubscriptionPlan, setCurrentView } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [simulatedGatewayOpen, setSimulatedGatewayOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const activeSub = userSubscriptions[currentUser.id] || {
    planId: 'pro',
    status: 'active',
  };

  const handleUpgradeClick = () => {
    setSimulatedGatewayOpen(true);
  };

  const handleCompleteSimulatedPayment = () => {
    updateSubscriptionPlan(currentUser.id, 'pro');
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSimulatedGatewayOpen(false);
      setCurrentView('pro-dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          Fair, Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Keep 100% of Your Hard-Earned Customer Fees
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Unlike legacy aggregator apps that penalise you with 15-25% commissions on every tap or wire you fix, KaamSetu Pro charges a simple, predictable software subscription.
        </p>

        {/* Billing cycle toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              billingCycle === 'monthly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              billingCycle === 'annual' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Annual Billing <span className="text-emerald-500 font-extrabold">(Save 16%)</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plan 1: Free Starter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Free Forever
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Starter Professional</h3>
              <p className="text-xs text-slate-500 mt-1">
                Essential discovery profile for newly launched tradespeople in Mumbai.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-slate-900">
              ₹0 <span className="text-xs font-normal text-slate-400">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Public listing on KaamSetu Mumbai directory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Receive customer quotation requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 5 active jobs concurrently</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Customer contact directory (up to 20 clients)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic calendar & scheduling</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => updateSubscriptionPlan(currentUser.id, 'free')}
            className={`w-full text-xs font-bold py-3 rounded-xl border transition ${
              activeSub.planId === 'free'
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
            }`}
          >
            {activeSub.planId === 'free' ? 'Currently Active Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Plan 2: KaamSetu Pro */}
        <div className="bg-slate-900 text-white rounded-3xl border-2 border-teal-500 p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="bg-teal-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Recommended
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Full Business Operations SaaS
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">KaamSetu Pro Plan</h3>
              <p className="text-xs text-slate-300 mt-1">
                For independent technicians and small contractors growing a sustainable business.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-white">
              {billingCycle === 'monthly' ? '₹399' : '₹3,990'}
              <span className="text-xs font-normal text-slate-400">
                {billingCycle === 'monthly' ? ' / month' : ' / year'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Verified Provider Badge</strong> with higher marketplace rank</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Unlimited jobs, estimates & invoices</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Full CRM for WhatsApp, referral & direct clients</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Automated service & warranty expiry reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Gemini AI Job & Quotation Drafter</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>AI Business Assistant</strong> for schedule & revenue tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Full export of your business records anytime</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgradeClick}
            className={`w-full text-xs font-bold py-3 rounded-xl transition shadow-md ${
              activeSub.planId === 'pro'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold'
            }`}
          >
            {activeSub.planId === 'pro' ? 'Current Active Subscription' : 'Upgrade to Pro Now'}
          </button>
        </div>
      </div>

      {/* Payment Gateway Integration Point Simulation Modal */}
      {simulatedGatewayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Razorpay Integration Point (Test Mode)</h3>
              </div>
              <button
                onClick={() => setSimulatedGatewayOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">Subscription Activated!</h4>
                <p className="text-[11px] text-slate-500">
                  Welcome to KaamSetu Pro. Your business workspace has been unlocked with unlimited features.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <strong>Explicit Gateway Disclosure:</strong> This flow simulates the Indian payment gateway (Razorpay API integration). In a production environment, this is authenticated via server-side webhook signature verification. No raw credit/debit card numbers are ever stored on this server.
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Order:</span>
                    <span>KaamSetu Pro Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold text-slate-900">₹399.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Beneficiary:</span>
                    <span>KaamSetu Technologies Mumbai</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteSimulatedPayment}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition shadow-xs text-xs"
                >
                  Simulate Successful UPI / Card Payment (₹399)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
