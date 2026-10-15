import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPrivacyPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'terms' | 'privacy'>('verification');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          Legal & Safety Framework
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Trust, Safety & Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Clear definitions of platform responsibilities, provider verification scope, and customer data rights.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold pb-1">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'verification' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Scope of Provider Verification
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'terms' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'privacy' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      {/* SECTION 1: VERIFICATION SCOPE */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Explicit Scope of the "Verified Pro" Badge</h3>
              <p className="text-xs text-emerald-800 mt-1">
                A "Verified Pro" badge on KaamSetu Pro signifies that the service professional has submitted identity documentation and that our administrative review team has conducted basic credential audits.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">1. What We Actually Verify:</h4>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>
                <strong>Government Identity:</strong> Indian Aadhaar, PAN card, or Voter ID matching the applicant's real name.
              </li>
              <li>
                <strong>Trade Qualifications:</strong> Government PWD electrical licenses, ITI technician certificates, or commercial trade registrations where applicable.
              </li>
              <li>
                <strong>Operational Pilot Area:</strong> Confirmed presence in Mumbai (Andheri, Powai, Ghatkopar, Thane, or Navi Mumbai).
              </li>
            </ul>

            <h4 className="font-bold text-slate-900 text-sm pt-2">2. What Verification Does NOT Mean:</h4>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Important Safety & Quality Notice</span>
              </div>
              <p className="text-xs text-amber-800">
                Verification does <strong>not</strong> constitute an absolute guarantee of workmanship, personal behavior, or flawless execution. KaamSetu Pro does not employ service professionals as staff members; they are independent trade contractors.
              </p>
              <p className="text-xs text-amber-800">
                Customers are advised to exercise normal household caution, oversee contractor work in residential premises, and demand itemised invoices before making final payments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TERMS OF SERVICE */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-base text-slate-900">Terms of Service</h3>
          <p className="text-slate-500 text-[11px]">Last Updated: October 2026 (Mumbai Pilot Edition)</p>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">1. Marketplace & Platform Relationship</h4>
            <p>
              KaamSetu Pro provides a marketplace discovery layer and business operations software. We do not set arbitrary pricing, nor do we artificially lock customer contact information after a quotation has been accepted.
            </p>

            <h4 className="font-bold text-slate-900 text-xs">2. Independent Contractor Status</h4>
            <p>
              Technicians using KaamSetu Pro operate as independent contractors. Any work warranty on replaced parts or labour is issued directly by the professional in their quotation and invoice.
            </p>

            <h4 className="font-bold text-slate-900 text-xs">3. Cancellation & Acceptance Policy</h4>
            <p>
              Accepting a quotation confirms the booking and locks out other bidders for that single-provider job. Cancellations must be communicated at least 2 hours before the scheduled time window.
            </p>

            <h4 className="font-bold text-slate-900 text-xs">4. SaaS Subscription Terms</h4>
            <p>
              KaamSetu Pro subscriptions (₹399/month) are non-refundable once the billing period has commenced. If an account is suspended due to customer complaints or fraudulent credential submission, access to marketplace discovery may be revoked.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-base text-slate-900">Privacy & Data Protection Policy</h3>
          <p className="text-slate-500 text-[11px]">Designed with zero-spam principles for Indian users</p>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">1. Customer Phone Number Privacy</h4>
            <p>
              Your phone number is never displayed publicly on search engines or marketplace listings. Your contact information is only shared with a specific service professional after you have explicitly reviewed and accepted their quotation.
            </p>

            <h4 className="font-bold text-slate-900 text-xs">2. Professional SaaS Data Ownership</h4>
            <p>
              Professionals who manage direct clients acquired through WhatsApp or word-of-mouth retain full ownership of their contact records. KaamSetu Pro will never market to or solicit your private customer records.
            </p>

            <h4 className="font-bold text-slate-900 text-xs">3. Identity Documents Storage</h4>
            <p>
              Government ID proofs (Aadhaar, trade licenses) submitted for provider verification are stored securely with strict administrative access control and are never exposed publicly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
