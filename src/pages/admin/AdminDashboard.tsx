import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Lock,
  Plus,
  Receipt,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react';
import { ProfessionalProfile } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    profiles,
    categories,
    serviceRequests,
    bookings,
    complaints,
    subscriptionPlans,
    auditLogs,
    verifyProvider,
    rejectProvider,
    suspendProvider,
    addCategory,
    toggleCategory,
    resetToInitialDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'categories' | 'complaints' | 'plans' | 'audit'>('overview');

  // Provider Verification Modal
  const [selectedPro, setSelectedPro] = useState<ProfessionalProfile | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');

  // Metrics
  const pendingPros = profiles.filter((p) => p.verificationStatus === 'pending_review');
  const verifiedPros = profiles.filter((p) => p.verificationStatus === 'verified');
  const openComplaints = complaints.filter((c) => c.status !== 'resolved');

  // Security guard check
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600">
          This portal requires verified administrative privileges. Your current active role is{' '}
          <strong>{currentUser.role}</strong>.
        </p>
        <div className="text-[11px] text-slate-500">
          To switch to the Administrator persona for evaluation, use the persona switcher in the top navigation bar.
        </div>
      </div>
    );
  }

  const handleVerify = () => {
    if (selectedPro) {
      verifyProvider(
        selectedPro.id,
        verificationNotes || 'Aadhaar identity and municipal trade license verified by administrator.'
      );
      setSelectedPro(null);
      setVerificationNotes('');
    }
  };

  const handleReject = () => {
    if (selectedPro) {
      rejectProvider(
        selectedPro.id,
        verificationNotes || 'Incomplete documentation. Please resubmit valid trade registration.'
      );
      setSelectedPro(null);
      setVerificationNotes('');
    }
  };

  const handleSuspend = (id: string) => {
    suspendProvider(id, 'Account suspended by administrator pending audit.');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatDesc || `${newCatName} household services`, newCatIcon);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              KaamSetu Pro Governance
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              SUPERADMIN: {currentUser.email}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Administrator Command Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Provider verification, category lifecycle management, dispute investigation & immutable audit logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToInitialDemoData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
          >
            Reset Pristine Demo Records
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'providers', label: `Provider Applications (${pendingPros.length} pending)`, icon: UserCheck },
          { id: 'categories', label: `Service Categories (${categories.length})`, icon: Tag },
          { id: 'complaints', label: `Complaints & Disputes (${openComplaints.length})`, icon: ShieldAlert },
          { id: 'plans', label: `Subscription Plans (${subscriptionPlans.length})`, icon: Award },
          { id: 'audit', label: `Security & Audit Logs (${auditLogs.length})`, icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Service Providers</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {profiles.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                {verifiedPros.length} verified badges active
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Pending Applications</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                {pendingPros.length}
              </span>
              <span className="text-[10px] text-slate-400">Awaiting credential audit</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Marketplace Bookings</span>
              <span className="text-2xl font-extrabold text-teal-700 mt-1 block">
                {bookings.length}
              </span>
              <span className="text-[10px] text-slate-400">{serviceRequests.length} requests posted</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Open Dispute Tickets</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-1 block">
                {openComplaints.length}
              </span>
              <span className="text-[10px] text-slate-400">Zero unattended escalations</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Administrator Security Directives</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Server-Side Role Protection:</strong> Client-side privilege modifications are strictly rejected by Firestore security rules.
              </li>
              <li>
                <strong>Bootstrap Identity:</strong> Bootstrapped superadmin email is mapped to <code>omgmore2005@gmail.com</code>.
              </li>
              <li>
                <strong>Verification Policy:</strong> Providers cannot self-assign verification status. Badge issuance requires explicit review and is recorded in immutable audit logs.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDER APPLICATIONS */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Professional Onboarding & Verification</h3>
            <span className="text-xs text-slate-500">{profiles.length} total profiles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((pro) => (
              <div
                key={pro.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.profileImage}
                      alt={pro.businessName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{pro.businessName}</h4>
                      <p className="text-xs text-slate-500">
                        {pro.ownerName} • {pro.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      pro.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pro.verificationStatus === 'pending_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pro.verificationStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>Services:</strong> {pro.servicesOffered.join(', ')}</div>
                  <div><strong>Coverage:</strong> {pro.serviceArea.join(', ')}</div>
                  {pro.verificationNotes && (
                    <div className="text-[11px] text-teal-800 italic pt-1 border-t border-slate-200">
                      Audit Notes: "{pro.verificationNotes}"
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedPro(pro);
                      setVerificationNotes(pro.verificationNotes || '');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    Review Credentials
                  </button>

                  {pro.verificationStatus === 'verified' && (
                    <button
                      onClick={() => handleSuspend(pro.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Suspend Badge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs max-w-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Add New Service Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Title:</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Solar Inverter Installation"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief overview of services included..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
              >
                + Add Category to Marketplace
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
              Active Service Categories ({categories.length})
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {categories.map((c) => (
                <div key={c.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-slate-500 text-[11px]">{c.description}</p>
                  </div>
                  <button
                    onClick={() => toggleCategory(c.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.active ? 'Active' : 'Deactivated'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Complaints & Dispute Resolution</h3>
            <span className="text-xs text-slate-500">{complaints.length} tickets recorded</span>
          </div>

          <div className="space-y-3">
            {complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{cmp.id}</span>
                    <h4 className="font-bold text-sm text-slate-900">{cmp.subject}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Reporter: {cmp.reporterName} ({cmp.reporterRole}) • Against: {cmp.respondentName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      cmp.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cmp.status}
                  </span>
                </div>

                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {cmp.description}
                </p>

                {cmp.resolutionNotes && (
                  <div className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-100">
                    <strong>Admin Resolution:</strong> {cmp.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{plan.name}</h4>
                    <span className="text-xl font-extrabold text-teal-700 mt-1 block">
                      ₹{plan.priceMonthly} / month
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                    Configured
                  </span>
                </div>

                <ul className="text-xs text-slate-600 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Immutable Administrative Action Logs</h3>
            <span className="text-xs text-slate-500">Security audit records</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Admin</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3 text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">{log.adminEmail}</td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 capitalize text-slate-700">{log.targetType}: {log.targetId}</td>
                      <td className="p-3 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW PROVIDER CREDENTIALS */}
      {selectedPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Audit Provider: {selectedPro.businessName}</h3>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <div><strong>Owner:</strong> {selectedPro.ownerName} ({selectedPro.phone})</div>
              <div><strong>Experience:</strong> {selectedPro.experienceYears} years</div>
              <div><strong>Services:</strong> {selectedPro.servicesOffered.join(', ')}</div>
              <div><strong>Areas:</strong> {selectedPro.serviceArea.join(', ')}</div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Verification Findings / Audit Notes:
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="State verified trade licenses, Aadhaar hash match, physical shop check..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPro(null)}
                className="text-slate-600 font-medium px-3 py-1.5"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg transition"
                >
                  Approve & Issue Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
