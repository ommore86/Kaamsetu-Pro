import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Shield, Wrench, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
                <Wrench className="w-4 h-4 text-teal-400 -rotate-12" />
              </div>
              <span className="text-white text-lg font-bold tracking-tight">KaamSetu Pro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering India's independent service professionals with trusted customer discovery and complete business operations software.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                Pilot Locations
              </div>
              <p className="text-xs text-slate-400">
                Andheri • Powai • Ghatkopar • Thane • Navi Mumbai
              </p>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('discover')} className="hover:text-white transition">
                  Find Local Professionals
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('customer-dashboard')} className="hover:text-white transition">
                  Request a Quotation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-white transition">
                  How KaamSetu Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms-privacy')} className="hover:text-white transition">
                  Customer Safety Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Pro SaaS Suite */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">KaamSetu Pro SaaS</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('pro-dashboard')} className="hover:text-white transition">
                  Professional Business Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('pricing')} className="hover:text-white transition">
                  Subscription Plans (₹399/mo)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('pro-dashboard')} className="hover:text-white transition">
                  Offline Client CRM & Invoicing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('pro-dashboard')} className="hover:text-white transition">
                  Gemini AI Job & Quotation Drafter
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('terms-privacy')} className="hover:text-white transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms-privacy')} className="hover:text-white transition">
                  Privacy & Data Protection Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms-privacy')} className="hover:text-white transition">
                  Scope of Provider Verification
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-rose-400 transition text-slate-500">
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Disclaimer Box */}
        <div className="border-t border-slate-800 pt-6 pb-2 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-start gap-2 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Statutory and Compliance Disclaimer:</strong> KaamSetu Pro is a technology platform connecting independent trade professionals with consumers, and providing business management software. Provider verification reviews submitted government trade licenses and identity records; it does not constitute an absolute guarantee of workmanship or physical site safety. All financial reports represent recorded business entries and should not substitute chartered accountancy or tax advice.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-400 pt-4 gap-2">
            <div>
              © 2026 KaamSetu Pro Technologies Pvt Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              Built with precision for Indian Service Entrepreneurs
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
