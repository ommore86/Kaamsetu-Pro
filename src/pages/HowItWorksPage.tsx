import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  FileCheck,
  FileText,
  Lock,
  MessageSquare,
  Phone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          Transparent Operational Blueprint
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How KaamSetu Pro Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Designed specifically for Mumbai's local services ecosystem. We respect direct customer relationships while empowering service professionals with modern SaaS management software.
        </p>
      </div>

      {/* Part 1: For Homeowners */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">For Homeowners & Customers</h2>
            <p className="text-xs text-slate-500">How you find, compare, and book reliable service providers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="font-extrabold text-teal-700 text-sm">Step 1: Submit Your Problem</div>
            <p className="text-slate-600 leading-relaxed">
              Describe what needs to be fixed. Our built-in Gemini AI diagnosis tool helps formulate technical checklists, so technicians understand the job before arriving.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="font-extrabold text-teal-700 text-sm">Step 2: Compare Transparent Quotes</div>
            <p className="text-slate-600 leading-relaxed">
              Nearby verified technicians inspect your description and send itemised quotations breaking down genuine parts and technician labour. No unexpected hidden charges.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="font-extrabold text-teal-700 text-sm">Step 3: Direct Relationship</div>
            <p className="text-slate-600 leading-relaxed">
              Once you accept a quotation, the provider’s contact number is unlocked. You can communicate over phone or WhatsApp freely. We never lock you into paying middleman commissions.
            </p>
          </div>
        </div>
      </section>

      {/* Part 2: For Service Professionals */}
      <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">For Service Professionals & Technicians</h2>
            <p className="text-xs text-slate-400">Why KaamSetu Pro is your complete business management workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-extrabold text-teal-400 text-sm">1. Manage Direct Clients</div>
            <p className="text-slate-300 leading-relaxed">
              Add customers acquired independently through WhatsApp, personal contacts, or society referrals. Keep their complete service history and contact notes in one secure place.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-extrabold text-teal-400 text-sm">2. Professional Quotations & Invoices</div>
            <p className="text-slate-300 leading-relaxed">
              Create GST-compliant invoices and itemised estimates with mathematically verified totals. Record cash and UPI payments manually in your official business ledger.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-extrabold text-teal-400 text-sm">3. Repeat Service & Warranty Reminders</div>
            <p className="text-slate-300 leading-relaxed">
              Track warranties on parts replaced and set automated reminders for annual AC servicing or RO filter replacement. Turn one-off jobs into recurring annual income.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setCurrentView('pro-dashboard')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
          >
            Open Professional Workspace
          </button>
        </div>
      </section>
    </div>
  );
};
