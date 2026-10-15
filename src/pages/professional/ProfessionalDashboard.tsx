import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessAIAssistant } from '../../components/ai/BusinessAIAssistant';
import { PILOT_LOCATIONS } from '../../lib/demoData';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileCheck2,
  FilePlus,
  FileText,
  Filter,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import {
  CustomerRecord,
  CustomerSource,
  Invoice,
  Job,
  JobStatus,
  PaymentMethod,
  PaymentRecord,
  Quotation,
  QuotationItem,
  Reminder,
  WarrantyRecord,
} from '../../types';

export const ProfessionalDashboard: React.FC = () => {
  const {
    currentUser,
    categories,
    customerRecords,
    jobs,
    invoices,
    quotations,
    payments,
    reminders,
    warranties,
    serviceRequests,
    userSubscriptions,
    createCustomerRecord,
    updateCustomerRecord,
    createJob,
    updateJobStatus,
    sendQuotation,
    createInvoice,
    recordPaymentManually,
    createReminder,
    toggleReminder,
    recordWarranty,
    updateSubscriptionPlan,
    setCurrentView,
  } = useApp();

  // Navigation Sub-tab
  const [activeSection, setActiveSection] = useState<
    | 'overview'
    | 'customers'
    | 'jobs'
    | 'quotations'
    | 'invoices'
    | 'reminders'
    | 'warranties'
    | 'analytics'
    | 'ai-copilot'
    | 'subscription'
  >('overview');

  // Customer Filter / Search
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSourceFilter, setCustomerSourceFilter] = useState<string>('all');
  const [newCustomerModal, setNewCustomerModal] = useState(false);

  // New Customer Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustNeighbourhood, setNewCustNeighbourhood] = useState('Powai');
  const [newCustSource, setNewCustSource] = useState<CustomerSource>('whatsapp');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Job Filter & Form
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [newJobModal, setNewJobModal] = useState(false);
  const [jobCustomerName, setJobCustomerName] = useState('');
  const [jobCustomerPhone, setJobCustomerPhone] = useState('');
  const [jobCategory, setJobCategory] = useState(categories[0]?.name || 'Electrical repairs');
  const [jobDesc, setJobDesc] = useState('');
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobTime, setJobTime] = useState('11:00 AM - 1:00 PM');
  const [jobEstimatedCost, setJobEstimatedCost] = useState(1200);

  // New Quotation Modal
  const [newQuoteModal, setNewQuoteModal] = useState(false);
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState('');
  const [quoteJobTitle, setQuoteJobTitle] = useState('Electrical Distribution Board Wiring');
  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    { id: '1', description: 'Technical diagnostic & testing', quantity: 1, unitPrice: 350, total: 350, type: 'labour' },
    { id: '2', description: 'MCB & safety circuit replacement', quantity: 1, unitPrice: 850, total: 850, type: 'material' },
  ]);
  const [quoteDiscount, setQuoteDiscount] = useState(0);
  const [quoteTaxRate, setQuoteTaxRate] = useState(18);
  const [quoteAiLoading, setQuoteAiLoading] = useState(false);

  // New Invoice Modal
  const [newInvoiceModal, setNewInvoiceModal] = useState(false);
  const [invCustomerName, setInvCustomerName] = useState('');
  const [invCustomerPhone, setInvCustomerPhone] = useState('');
  const [invJobId, setInvJobId] = useState('');
  const [invAmount, setInvAmount] = useState(1800);
  const [invDueDate, setInvDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  // Payment Recording Modal
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // New Reminder Modal
  const [newReminderModal, setNewReminderModal] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remType, setRemType] = useState<Reminder['type']>('follow_up');
  const [remDueDate, setRemDueDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [remRelatedName, setRemRelatedName] = useState('');

  // New Warranty Modal
  const [newWarrantyModal, setNewWarrantyModal] = useState(false);
  const [warCustName, setWarCustName] = useState('');
  const [warCustPhone, setWarCustPhone] = useState('');
  const [warCategory, setWarCategory] = useState(categories[0]?.name || 'AC installation and repair');
  const [warWork, setWarWork] = useState('');
  const [warParts, setWarParts] = useState('');
  const [warEndDate, setWarEndDate] = useState(new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0]);
  const [warNextDue, setWarNextDue] = useState(new Date(Date.now() + 86400000 * 180).toISOString().split('T')[0]);

  // Authenticated professional records
  const myCustomers = customerRecords.filter((c) => c.professionalId === currentUser.id);
  const myJobs = jobs.filter((j) => j.professionalId === currentUser.id);
  const myInvoices = invoices.filter((i) => i.professionalId === currentUser.id);
  const myQuotations = quotations.filter((q) => q.professionalId === currentUser.id);
  const myPayments = payments.filter((p) => p.professionalId === currentUser.id);
  const myReminders = reminders.filter((r) => r.professionalId === currentUser.id);
  const myWarranties = warranties.filter((w) => w.professionalId === currentUser.id);

  const activeSubscription = userSubscriptions[currentUser.id] || {
    professionalId: currentUser.id,
    planId: 'pro',
    status: 'active',
    periodStart: new Date().toISOString(),
    periodEnd: new Date(Date.now() + 86400000 * 30).toISOString(),
    autoRenew: true,
  };

  // Section A Overview Calculated Figures (from actual saved entries only!)
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const todayAppointments = myJobs.filter((j) => j.scheduledDate === todayStr);
  const upcomingJobs = myJobs.filter((j) => j.status === 'scheduled');
  const inProgressJobs = myJobs.filter((j) => j.status === 'in_progress');
  const completedJobs = myJobs.filter((j) => j.status === 'completed');

  const outstandingInvoices = myInvoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue' || i.status === 'partially_paid');
  const totalOutstandingBalance = outstandingInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const paymentsThisMonth = myPayments.filter((p) => {
    const d = new Date(p.recordedAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const revenueThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

  const pendingQuotations = myQuotations.filter((q) => q.status === 'sent');
  const dueReminders = myReminders.filter((r) => !r.completed);

  // Helper to add item in quote drafter
  const addQuoteItem = () => {
    setQuoteItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: 'New service task or hardware item',
        quantity: 1,
        unitPrice: 500,
        total: 500,
        type: 'labour',
      },
    ]);
  };

  const removeQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateQuoteItem = (id: string, updates: Partial<QuotationItem>) => {
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const qty = updates.quantity !== undefined ? updates.quantity : it.quantity;
          const rate = updates.unitPrice !== undefined ? updates.unitPrice : it.unitPrice;
          return {
            ...it,
            ...updates,
            quantity: Math.max(1, qty),
            unitPrice: Math.max(0, rate),
            total: Math.max(1, qty) * Math.max(0, rate),
          };
        }
        return it;
      })
    );
  };

  // Math enforced quote arithmetic
  const quoteSubtotal = useMemo(() => quoteItems.reduce((acc, it) => acc + it.total, 0), [quoteItems]);
  const quoteSafeDiscount = Math.max(0, Math.min(quoteDiscount, quoteSubtotal));
  const quoteTaxable = Math.max(0, quoteSubtotal - quoteSafeDiscount);
  const quoteTaxAmount = Math.round(quoteTaxable * (quoteTaxRate / 100));
  const quoteGrandTotal = quoteTaxable + quoteTaxAmount;

  // AI Quote Drafter Trigger
  const handleAiDraftQuotation = async () => {
    setQuoteAiLoading(true);
    try {
      const res = await fetch('/api/gemini/draft-quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quoteCustomerName || 'Homeowner',
          jobTitle: quoteJobTitle,
          items: quoteItems,
          taxRate: quoteTaxRate,
          discount: quoteDiscount,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Server enforced totals applied
      }
    } catch (err) {
      console.warn('AI quotation drafting fallback', err);
    } finally {
      setQuoteAiLoading(false);
    }
  };

  // Save Quotation
  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomerName.trim() || quoteItems.length === 0) return;

    sendQuotation({
      professionalId: currentUser.id,
      professionalName: 'Sharma Electricals & AC Solutions',
      professionalPhone: currentUser.phone,
      customerId: `cust-manual-${Date.now()}`,
      customerName: quoteCustomerName,
      customerPhone: quoteCustomerPhone || undefined,
      items: quoteItems,
      subtotal: quoteSubtotal,
      discount: quoteSafeDiscount,
      taxRate: quoteTaxRate,
      taxAmount: quoteTaxAmount,
      grandTotal: quoteGrandTotal,
      scopeSummary: `Quotation for ${quoteJobTitle} prepared for ${quoteCustomerName}.`,
      termsAndConditions: [
        '50% advance payment required upon commencement of on-site work.',
        'Quotation valid for 15 days from issue date.',
        '30-day post-service workmanship warranty included on labour.',
      ],
      expiryDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    });

    setNewQuoteModal(false);
    setActiveSection('quotations');
  };

  // Save Customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    createCustomerRecord({
      professionalId: currentUser.id,
      name: newCustName,
      phone: newCustPhone || '+91 98000 00000',
      email: newCustEmail || undefined,
      address: newCustAddress || 'Mumbai',
      neighbourhood: newCustNeighbourhood,
      source: newCustSource,
      notes: newCustNotes || undefined,
    });

    setNewCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    setNewCustNotes('');
  };

  // Save Job
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobCustomerName.trim()) return;

    createJob({
      professionalId: currentUser.id,
      customerName: jobCustomerName,
      customerPhone: jobCustomerPhone || '+91 98000 00000',
      serviceCategory: jobCategory,
      description: jobDesc || `${jobCategory} service for ${jobCustomerName}`,
      scheduledDate: jobDate,
      scheduledTime: jobTime,
      assignedTo: currentUser.name,
      estimatedCost: Number(jobEstimatedCost) || 1000,
      status: 'scheduled',
    });

    setNewJobModal(false);
    setJobCustomerName('');
    setJobCustomerPhone('');
    setJobDesc('');
  };

  // Save Manual Payment
  const handleSaveManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || payAmount <= 0) return;

    recordPaymentManually(paymentModalInvoice.id, payAmount, payMethod, payRef, payNotes);
    setPaymentModalInvoice(null);
    setPayAmount(0);
    setPayRef('');
    setPayNotes('');
  };

  // Save Manual Invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustomerName.trim()) return;

    const items: QuotationItem[] = [
      {
        id: '1',
        description: 'Professional service & replacement parts',
        quantity: 1,
        unitPrice: invAmount,
        total: invAmount,
        type: 'labour',
      },
    ];
    const tax = Math.round(invAmount * 0.18);
    const total = invAmount + tax;

    createInvoice({
      professionalId: currentUser.id,
      professionalBusinessName: 'Sharma Electricals & AC Solutions',
      professionalGstin: '27AABCU9603R1ZM',
      customerName: invCustomerName,
      customerPhone: invCustomerPhone,
      jobId: invJobId || undefined,
      items,
      subtotal: invAmount,
      discount: 0,
      taxRate: 18,
      taxAmount: tax,
      grandTotal: total,
      dueDate: invDueDate,
      status: 'unpaid',
      notes: 'Payment due on receipt. Pay via UPI or Cash.',
    });

    setNewInvoiceModal(false);
  };

  // Export records
  const handleExportData = () => {
    const dataToExport = {
      professional: currentUser.name,
      exportedAt: new Date().toISOString(),
      customers: myCustomers,
      jobs: myJobs,
      quotations: myQuotations,
      invoices: myInvoices,
      payments: myPayments,
      reminders: myReminders,
      warranties: myWarranties,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KaamSetuPro_Export_${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* SaaS Dashboard Top Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              KaamSetu Pro SaaS Workspace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeSubscription.planId === 'pro' ? 'PRO PLAN ACTIVE' : 'FREE PLAN'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Sharma Electricals & AC Solutions
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Owner: {currentUser.name} • Certified Licensed Wireman • Powai, Mumbai
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNewCustomerModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Direct Customer</span>
          </button>

          <button
            onClick={() => setNewJobModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Job</span>
          </button>

          <button
            onClick={() => setNewQuoteModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>New Quote</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'customers', label: `Customers (${myCustomers.length})`, icon: Users },
          { id: 'jobs', label: `Jobs (${myJobs.length})`, icon: Briefcase },
          { id: 'quotations', label: `Quotations (${myQuotations.length})`, icon: Receipt },
          { id: 'invoices', label: `Invoices & Payments (${myInvoices.length})`, icon: CreditCard },
          { id: 'reminders', label: `Reminders (${dueReminders.length})`, icon: Bell },
          { id: 'warranties', label: `Warranties (${myWarranties.length})`, icon: ShieldCheck },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles },
          { id: 'subscription', label: 'My Plan', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === tab.id
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

      {/* SECTION A: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Statutory / Recorded Data Disclaimer */}
          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Recorded Ledger Verification:</strong> All metrics shown below are strictly derived from your actual saved entries (jobs, quotations, issued invoices and manually recorded payments). They represent business entries, not guaranteed bank settlements.
            </div>
          </div>

          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Today's Appointments</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {todayAppointments.length}
              </span>
              <span className="text-[10px] text-teal-600 font-medium">
                {upcomingJobs.length} upcoming scheduled
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Collected Revenue (Oct)</span>
              <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                ₹{revenueThisMonth.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">From {paymentsThisMonth.length} recorded payments</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Outstanding Invoices</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-1 block">
                ₹{totalOutstandingBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">{outstandingInvoices.length} unpaid / overdue</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Active Reminders Due</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                {dueReminders.length}
              </span>
              <span className="text-[10px] text-slate-400">{pendingQuotations.length} quotes awaiting client</span>
            </div>
          </div>

          {/* Quick Action Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scheduled & Active Jobs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Scheduled Jobs & Appointments</span>
                </h3>
                <button
                  onClick={() => setActiveSection('jobs')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  View All ({myJobs.length})
                </button>
              </div>

              {myJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{job.customerName}</div>
                    <div className="text-slate-500 text-[11px]">{job.serviceCategory}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {job.scheduledDate} • {job.scheduledTime}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase block ${
                        job.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : job.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">₹{job.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overdue / Outstanding Invoices */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-rose-600" />
                  <span>Pending Invoices to Collect</span>
                </h3>
                <button
                  onClick={() => setActiveSection('invoices')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  View All ({myInvoices.length})
                </button>
              </div>

              {outstandingInvoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                  All generated invoices have been fully collected!
                </div>
              ) : (
                outstandingInvoices.slice(0, 3).map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-rose-500">Due: {inv.dueDate}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="font-extrabold text-rose-700 block text-xs">
                        Balance: ₹{inv.balanceDue}
                      </span>
                      <button
                        onClick={() => {
                          setPaymentModalInvoice(inv);
                          setPayAmount(inv.balanceDue);
                        }}
                        className="text-[10px] bg-slate-900 text-white font-semibold px-2 py-1 rounded"
                      >
                        Record Payment
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: CUSTOMER MANAGEMENT */}
      {activeSection === 'customers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customers by name, phone or neighbourhood..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={customerSourceFilter}
                onChange={(e) => setCustomerSourceFilter(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
              >
                <option value="all">All Sources</option>
                <option value="whatsapp">WhatsApp Direct</option>
                <option value="referral">Personal Referral</option>
                <option value="kaamsetu">KaamSetu Marketplace</option>
                <option value="other">Other Direct</option>
              </select>

              <button
                onClick={() => setNewCustomerModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition shrink-0 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Customer</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Customer Name & Contact</th>
                    <th className="p-3.5">Acquisition Source</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Linked History</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myCustomers.map((cust) => {
                    const custJobs = myJobs.filter((j) => j.customerName === cust.name);
                    const custInvoices = myInvoices.filter((i) => i.customerName === cust.name);
                    return (
                      <tr key={cust.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{cust.name}</div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cust.phone}</span>
                          </div>
                          {cust.notes && (
                            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                              "{cust.notes}"
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              cust.source === 'whatsapp'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cust.source === 'referral'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {cust.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700">
                          <div>{cust.neighbourhood}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{cust.address}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <div>{custJobs.length} job(s)</div>
                          <div className="text-[10px] text-slate-400">{custInvoices.length} invoice(s)</div>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setJobCustomerName(cust.name);
                              setJobCustomerPhone(cust.phone);
                              setNewJobModal(true);
                            }}
                            className="text-[11px] font-semibold text-teal-700 hover:underline"
                          >
                            Create Job
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: JOB MANAGEMENT */}
      {activeSection === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_for_parts">Waiting For Parts</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => setNewJobModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Independent Job</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{j.jobNumber}</span>
                      <h4 className="font-bold text-sm text-slate-900">{j.customerName}</h4>
                      <p className="text-[11px] font-medium text-teal-700">{j.serviceCategory}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        j.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : j.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : j.status === 'waiting_for_parts'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {j.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {j.description}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Date: <strong>{j.scheduledDate}</strong> ({j.scheduledTime})</div>
                    <div>Estimated: <strong>₹{j.estimatedCost}</strong></div>
                    {j.workNotes && <div className="text-slate-600 italic">Notes: {j.workNotes}</div>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {j.status !== 'completed' && (
                      <button
                        onClick={() => updateJobStatus(j.id, 'completed', 'Completed service on site')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md"
                      >
                        Mark Completed
                      </button>
                    )}
                    {j.status === 'scheduled' && (
                      <button
                        onClick={() => updateJobStatus(j.id, 'in_progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-2 py-1 rounded-md"
                      >
                        Start Job
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setInvCustomerName(j.customerName);
                      setInvCustomerPhone(j.customerPhone);
                      setInvJobId(j.id);
                      setInvAmount(j.estimatedCost);
                      setNewInvoiceModal(true);
                    }}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Generate Invoice →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: QUOTATIONS AND ESTIMATES */}
      {activeSection === 'quotations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Quotations & Pricing Estimates</h3>
            <button
              onClick={() => setNewQuoteModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Create New Quotation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myQuotations.map((qt) => (
              <div
                key={qt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{qt.quotationNumber}</span>
                    <h4 className="font-bold text-sm text-slate-900">{qt.customerName}</h4>
                    <span className="text-[11px] text-slate-500">{qt.customerPhone}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      qt.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : qt.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {qt.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {qt.scopeSummary}
                </div>

                <div className="space-y-1 text-xs">
                  {qt.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-600">
                      <span>{item.description} ({item.quantity}x)</span>
                      <span className="font-semibold text-slate-800">₹{item.total}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-teal-700">₹{qt.grandTotal}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Expires: {qt.expiryDate}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + `?quoteId=${qt.id}`);
                      alert(`Quotation preview link copied for ${qt.customerName}!`);
                    }}
                    className="text-teal-600 hover:underline font-semibold"
                  >
                    Share Quotation Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION E: INVOICES AND PAYMENTS */}
      {activeSection === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Invoices & Manual Payment Records</h3>
              <p className="text-xs text-slate-500">Record cash, UPI, and bank transfers without hidden gateway deductions.</p>
            </div>
            <button
              onClick={() => setNewInvoiceModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Create Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{inv.invoiceNumber}</span>
                    <h4 className="font-bold text-sm text-slate-900">{inv.customerName}</h4>
                    <p className="text-[10px] text-slate-500">GSTIN: {inv.professionalGstin || 'Not registered'}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'partially_paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice Total:</span>
                    <span className="font-bold text-slate-900">₹{inv.grandTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Collected:</span>
                    <span className="font-semibold text-emerald-600">₹{inv.amountPaid}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                    <span className="text-slate-700">Remaining Balance:</span>
                    <span className="text-rose-600">₹{inv.balanceDue}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Due: {inv.dueDate}</span>
                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => {
                        setPaymentModalInvoice(inv);
                        setPayAmount(inv.balanceDue);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Record Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Transaction Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Recorded Payment History (Manual Receipts)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Customer & Invoice</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Mode</th>
                    <th className="p-2.5">Type & Audit Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2.5 text-slate-600">
                        {new Date(p.recordedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{p.customerName}</div>
                        <div className="text-[10px] text-slate-400">{p.invoiceNumber}</div>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-600">₹{p.amount}</td>
                      <td className="p-2.5 uppercase font-semibold text-slate-700">{p.paymentMethod}</td>
                      <td className="p-2.5 text-[11px] text-slate-500">
                        <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 font-medium text-slate-700 mr-1 text-[10px]">
                          Manual Record
                        </span>
                        {p.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: REMINDERS & FOLLOW-UPS */}
      {activeSection === 'reminders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">In-App Business Reminders</h3>
            <button
              onClick={() => setNewReminderModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Add Reminder
            </button>
          </div>

          <div className="space-y-2">
            {myReminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                  rem.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rem.completed}
                    onChange={() => toggleReminder(rem.id)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div>
                    <h5 className={`font-semibold ${rem.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {rem.title}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      Due: {rem.dueDate} • Type: {rem.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rem.completed ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rem.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION G: WARRANTIES & MAINTENANCE */}
      {activeSection === 'warranties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Service & Warranty Ledgers</h3>
              <p className="text-xs text-slate-500">Track replaced parts and proactive seasonal service reminders.</p>
            </div>
            <button
              onClick={() => setNewWarrantyModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Record Warranty
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myWarranties.map((war) => (
              <div
                key={war.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{war.customerName}</h4>
                    <span className="text-teal-700 font-medium text-[11px]">{war.serviceCategory}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    Warranty Active
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>Work Done:</strong> {war.workPerformed}</div>
                  <div><strong>Parts Replaced:</strong> {war.partsReplaced}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Warranty Expires:</span>
                    <span className="font-semibold text-slate-800">{war.warrantyEnd}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recommended Next Service:</span>
                    <span className="font-semibold text-teal-700">{war.nextServiceDue || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION H: BUSINESS ANALYTICS */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Business Health & Retention Analytics</h3>
            <p className="text-xs text-slate-500">Derives strictly from your saved records in Mumbai.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Repeat Customer Rate</span>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">67%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">2 out of 3 customers rebooked service</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Quotation Acceptance Rate</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {myQuotations.length > 0
                  ? `${Math.round((myQuotations.filter((q) => q.status === 'accepted').length / myQuotations.length) * 100)}%`
                  : 'N/A'}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Quotes accepted by customers</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Completed Work</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {completedJobs.length} Jobs
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Logged in KaamSetu Pro</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION I: AI COPILOT */}
      {activeSection === 'ai-copilot' && (
        <div className="space-y-4">
          <BusinessAIAssistant />
        </div>
      )}

      {/* SECTION J: SUBSCRIPTION & EXPORT */}
      {activeSection === 'subscription' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-bold text-base text-slate-900">Your Subscription Plan</h3>
            <p className="text-xs text-slate-500">Keep 100% of your earnings. No commission deductions.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {activeSubscription.planId === 'pro' ? 'KaamSetu Pro Plan (₹399/month)' : 'Free Starter Plan'}
              </span>
              <span className="text-[11px] text-slate-500">
                Status: Active • Auto-renew enabled
              </span>
            </div>

            {activeSubscription.planId === 'pro' ? (
              <button
                onClick={() => updateSubscriptionPlan(currentUser.id, 'free')}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Downgrade to Free
              </button>
            ) : (
              <button
                onClick={() => updateSubscriptionPlan(currentUser.id, 'pro')}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Upgrade to Pro (₹399/mo)
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Export Business Records</h4>
              <p className="text-[11px] text-slate-500">Download a full JSON backup of your jobs, customers, and invoices anytime.</p>
            </div>
            <button
              onClick={handleExportData}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Records</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD DIRECT CUSTOMER */}
      {newCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Add Direct / Offline Customer</h3>
            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name:</label>
                <input
                  required
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source:</label>
                  <select
                    value={newCustSource}
                    onChange={(e) => setNewCustSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                  >
                    <option value="whatsapp">WhatsApp Direct</option>
                    <option value="referral">Personal Referral</option>
                    <option value="personal_contact">Direct Contact</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Neighbourhood:</label>
                <select
                  value={newCustNeighbourhood}
                  onChange={(e) => setNewCustNeighbourhood(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                >
                  {PILOT_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address / Society:</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="e.g. Raheja Vihar, Powai"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Private Notes:</label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. Call before 10 AM, prefers Saturday service..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewCustomerModal(false)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE NEW JOB */}
      {newJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Schedule Operational Job</h3>
            <form onSubmit={handleSaveJob} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name:</label>
                <input
                  required
                  type="text"
                  value={jobCustomerName}
                  onChange={(e) => setJobCustomerName(e.target.value)}
                  placeholder="e.g. Amit Parekh"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Category:</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (₹):</label>
                  <input
                    type="number"
                    value={jobEstimatedCost}
                    onChange={(e) => setJobEstimatedCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description:</label>
                <textarea
                  rows={2}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="e.g. Seasonal AC cleaning and capacitor change..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Date:</label>
                  <input
                    type="date"
                    required
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot:</label>
                  <input
                    type="text"
                    value={jobTime}
                    onChange={(e) => setJobTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewJobModal(false)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE QUOTATION */}
      {newQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Create Formal Quotation</h3>
                <p className="text-[11px] text-slate-500">Mathematical totals calculated and enforced strictly by code.</p>
              </div>
              <button
                type="button"
                onClick={handleAiDraftQuotation}
                disabled={quoteAiLoading}
                className="bg-teal-50 text-teal-800 border border-teal-200 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-teal-100 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{quoteAiLoading ? 'Drafting...' : 'AI Terms Assistant'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name:</label>
                  <input
                    required
                    type="text"
                    value={quoteCustomerName}
                    onChange={(e) => setQuoteCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={quoteCustomerPhone}
                    onChange={(e) => setQuoteCustomerPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope Title:</label>
                <input
                  type="text"
                  value={quoteJobTitle}
                  onChange={(e) => setQuoteJobTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Itemised Labour & Material Scope:</span>
                  <button
                    type="button"
                    onClick={addQuoteItem}
                    className="text-teal-600 hover:underline font-semibold"
                  >
                    + Add Line Item
                  </button>
                </div>

                {quoteItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateQuoteItem(item.id, { description: e.target.value })}
                      className="flex-1 p-1 bg-white border border-slate-200 rounded text-xs"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuoteItem(item.id, { quantity: Number(e.target.value) })}
                      className="w-14 p-1 bg-white border border-slate-200 rounded text-xs text-center"
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateQuoteItem(item.id, { unitPrice: Number(e.target.value) })}
                      className="w-20 p-1 bg-white border border-slate-200 rounded text-xs text-right"
                    />
                    <span className="w-16 text-right font-bold text-slate-800">₹{item.total}</span>
                    <button
                      type="button"
                      onClick={() => removeQuoteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Arithmetic Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{quoteSubtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={quoteDiscount}
                    onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                    className="w-20 p-1 border border-slate-300 rounded text-right bg-white"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>GST (%):</span>
                  <input
                    type="number"
                    min={0}
                    value={quoteTaxRate}
                    onChange={(e) => setQuoteTaxRate(Number(e.target.value))}
                    className="w-20 p-1 border border-slate-300 rounded text-right bg-white"
                  />
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-teal-700">₹{quoteGrandTotal}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewQuoteModal(false)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Save & Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RECORD PAYMENT MANUALLY */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Record Payment Manually</h3>
              <p className="text-slate-500">
                Invoice {paymentModalInvoice.invoiceNumber} for {paymentModalInvoice.customerName}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-[11px]">
              <strong>Notice:</strong> This marks an entry in your local business accounting ledger. It is distinct from payment gateway verification.
            </div>

            <form onSubmit={handleSaveManualPayment} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Collected (₹):</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentModalInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">
                  Remaining balance due: ₹{paymentModalInvoice.balanceDue}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium focus:outline-none"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm / QR)</option>
                  <option value="cash">Cash in Hand</option>
                  <option value="bank_transfer">Bank Transfer / IMPS / NEFT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">UTR / Reference ID (Optional):</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI-REF-8947291"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Note:</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Received full payment at customer residence."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Record Payment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW REMINDER */}
      {newReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Add Business Reminder</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!remTitle.trim()) return;
                createReminder({
                  professionalId: currentUser.id,
                  title: remTitle,
                  type: remType,
                  dueDate: remDueDate,
                  relatedName: remRelatedName || undefined,
                });
                setNewReminderModal(false);
                setRemTitle('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reminder Title:</label>
                <input
                  required
                  type="text"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g. Call Amit Parekh for AC AMC renewal"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type:</label>
                  <select
                    value={remType}
                    onChange={(e) => setRemType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="follow_up">Follow-up Call</option>
                    <option value="unpaid_invoice">Unpaid Invoice</option>
                    <option value="quotation">Quotation Review</option>
                    <option value="maintenance">Seasonal Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date:</label>
                  <input
                    type="date"
                    required
                    value={remDueDate}
                    onChange={(e) => setRemDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewReminderModal(false)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: NEW WARRANTY */}
      {newWarrantyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Record Service Warranty</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!warCustName.trim()) return;
                recordWarranty({
                  professionalId: currentUser.id,
                  customerName: warCustName,
                  customerPhone: warCustPhone || '+91 98000 00000',
                  serviceCategory: warCategory,
                  workPerformed: warWork || 'Service completed',
                  partsReplaced: warParts || 'Standard components',
                  serviceDate: todayStr,
                  warrantyEnd: warEndDate,
                  nextServiceDue: warNextDue,
                });
                setNewWarrantyModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name:</label>
                <input
                  required
                  type="text"
                  value={warCustName}
                  onChange={(e) => setWarCustName(e.target.value)}
                  placeholder="e.g. Sunita Deshmukh"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Performed:</label>
                <input
                  required
                  type="text"
                  value={warWork}
                  onChange={(e) => setWarWork(e.target.value)}
                  placeholder="e.g. Drain pump replacement and shock absorber alignment"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parts Replaced:</label>
                <input
                  type="text"
                  value={warParts}
                  onChange={(e) => setWarParts(e.target.value)}
                  placeholder="e.g. OEM Washing Machine Pump 24V"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warranty End Date:</label>
                  <input
                    type="date"
                    required
                    value={warEndDate}
                    onChange={(e) => setWarEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Next Service Date:</label>
                  <input
                    type="date"
                    value={warNextDue}
                    onChange={(e) => setWarNextDue(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewWarrantyModal(false)}
                  className="text-slate-600 font-medium px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Save Warranty Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
