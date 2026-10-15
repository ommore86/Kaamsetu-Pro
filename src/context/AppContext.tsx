import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AdminAuditLog,
  Booking,
  Complaint,
  CustomerRecord,
  Invoice,
  Job,
  LanguageCode,
  PaymentRecord,
  ProfessionalProfile,
  Quotation,
  Reminder,
  Review,
  ServiceCategory,
  ServiceRequest,
  SubscriptionPlan,
  User,
  UserRole,
  UserSubscription,
  WarrantyRecord,
} from '../types';
import {
  DEMO_PROFILES,
  DEMO_USER_SUBSCRIPTIONS,
  DEMO_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BOOKINGS,
  INITIAL_CATEGORIES,
  INITIAL_COMPLAINTS,
  INITIAL_CUSTOMER_RECORDS,
  INITIAL_INVOICES,
  INITIAL_JOBS,
  INITIAL_PAYMENTS,
  INITIAL_QUOTATIONS,
  INITIAL_REMINDERS,
  INITIAL_REVIEWS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_WARRANTIES,
} from '../lib/demoData';
import { translations } from '../lib/translations';

interface AppContextType {
  // Current user & auth state
  currentUser: User;
  switchUser: (role: UserRole) => void;
  setUser: (user: User) => void;

  // Language & Localization
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Location selector (Mumbai pilot)
  selectedNeighbourhood: string;
  setSelectedNeighbourhood: (neighbourhood: string) => void;

  // Active view routing
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;

  // Data collections
  categories: ServiceCategory[];
  profiles: ProfessionalProfile[];
  serviceRequests: ServiceRequest[];
  quotations: Quotation[];
  bookings: Booking[];
  customerRecords: CustomerRecord[];
  jobs: Job[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  reminders: Reminder[];
  warranties: WarrantyRecord[];
  reviews: Review[];
  complaints: Complaint[];
  subscriptionPlans: SubscriptionPlan[];
  userSubscriptions: Record<string, UserSubscription>;
  auditLogs: AdminAuditLog[];

  // Mutations
  createServiceRequest: (data: Omit<ServiceRequest, 'id' | 'requestNumber' | 'createdAt' | 'status' | 'isDemo'>) => ServiceRequest;
  cancelServiceRequest: (requestId: string, reason?: string) => void;
  sendQuotation: (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'status' | 'isDemo'>) => Quotation;
  acceptQuotation: (quotationId: string) => Booking | null;
  rejectQuotation: (quotationId: string) => void;
  createCustomerRecord: (data: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'isDemo'>) => CustomerRecord;
  updateCustomerRecord: (id: string, updates: Partial<CustomerRecord>) => void;
  createJob: (data: Omit<Job, 'id' | 'jobNumber' | 'createdAt' | 'updatedAt' | 'isDemo'>) => Job;
  updateJobStatus: (jobId: string, status: Job['status'], notes?: string) => void;
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'isDemo' | 'amountPaid' | 'balanceDue'>) => Invoice;
  recordPaymentManually: (invoiceId: string, amount: number, method: PaymentRecord['paymentMethod'], refNumber?: string, notes?: string) => PaymentRecord | null;
  createReminder: (data: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'isDemo'>) => Reminder;
  toggleReminder: (reminderId: string) => void;
  recordWarranty: (data: Omit<WarrantyRecord, 'id' | 'isDemo'>) => WarrantyRecord;
  submitReview: (bookingId: string, rating: number, comment: string) => void;
  submitComplaint: (bookingId: string | undefined, respondentId: string, respondentName: string, subject: string, description: string) => void;
  updateSubscriptionPlan: (professionalId: string, planId: 'free' | 'pro') => void;

  // Admin Actions
  verifyProvider: (profileId: string, notes: string) => void;
  rejectProvider: (profileId: string, notes: string) => void;
  suspendProvider: (profileId: string, notes: string) => void;
  addCategory: (name: string, description: string, iconName: string) => void;
  toggleCategory: (categoryId: string) => void;

  // Reset & Environment
  resetToInitialDemoData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_PREFIX = 'kaamsetu_pro_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & persona
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage('user', DEMO_USERS.professional)
  );

  // Language
  const [language, setLanguageState] = useState<LanguageCode>(() =>
    loadFromStorage('language', 'en')
  );

  // Location
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>('All Mumbai Neighbourhoods');

  // Navigation View
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Core Data
  const [categories, setCategories] = useState<ServiceCategory[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>(() =>
    loadFromStorage('profiles', DEMO_PROFILES)
  );
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() =>
    loadFromStorage('serviceRequests', INITIAL_SERVICE_REQUESTS)
  );
  const [quotations, setQuotations] = useState<Quotation[]>(() =>
    loadFromStorage('quotations', INITIAL_QUOTATIONS)
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadFromStorage('bookings', INITIAL_BOOKINGS)
  );
  const [customerRecords, setCustomerRecords] = useState<CustomerRecord[]>(() =>
    loadFromStorage('customerRecords', INITIAL_CUSTOMER_RECORDS)
  );
  const [jobs, setJobs] = useState<Job[]>(() =>
    loadFromStorage('jobs', INITIAL_JOBS)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadFromStorage('invoices', INITIAL_INVOICES)
  );
  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    loadFromStorage('payments', INITIAL_PAYMENTS)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    loadFromStorage('reminders', INITIAL_REMINDERS)
  );
  const [warranties, setWarranties] = useState<WarrantyRecord[]>(() =>
    loadFromStorage('warranties', INITIAL_WARRANTIES)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage('reviews', INITIAL_REVIEWS)
  );
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadFromStorage('complaints', INITIAL_COMPLAINTS)
  );
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() =>
    loadFromStorage('subscriptionPlans', INITIAL_SUBSCRIPTION_PLANS)
  );
  const [userSubscriptions, setUserSubscriptions] = useState<Record<string, UserSubscription>>(() =>
    loadFromStorage('userSubscriptions', DEMO_USER_SUBSCRIPTIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() =>
    loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS)
  );

  // Sync state to storage
  useEffect(() => saveToStorage('user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('language', language), [language]);
  useEffect(() => saveToStorage('categories', categories), [categories]);
  useEffect(() => saveToStorage('profiles', profiles), [profiles]);
  useEffect(() => saveToStorage('serviceRequests', serviceRequests), [serviceRequests]);
  useEffect(() => saveToStorage('quotations', quotations), [quotations]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('customerRecords', customerRecords), [customerRecords]);
  useEffect(() => saveToStorage('jobs', jobs), [jobs]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('reminders', reminders), [reminders]);
  useEffect(() => saveToStorage('warranties', warranties), [warranties]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('complaints', complaints), [complaints]);
  useEffect(() => saveToStorage('subscriptionPlans', subscriptionPlans), [subscriptionPlans]);
  useEffect(() => saveToStorage('userSubscriptions', userSubscriptions), [userSubscriptions]);
  useEffect(() => saveToStorage('auditLogs', auditLogs), [auditLogs]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const switchUser = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentUser(DEMO_USERS.customer);
      setCurrentView('customer-dashboard');
    } else if (role === 'professional') {
      setCurrentUser(DEMO_USERS.professional);
      setCurrentView('pro-dashboard');
    } else if (role === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
      setCurrentView('admin-dashboard');
    }
  };

  // Log admin actions
  const logAdminAction = (action: string, targetType: AdminAuditLog['targetType'], targetId: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `audit-${Date.now()}`,
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Service Request Creation
  const createServiceRequest = (data: Omit<ServiceRequest, 'id' | 'requestNumber' | 'createdAt' | 'status' | 'isDemo'>): ServiceRequest => {
    const newReq: ServiceRequest = {
      ...data,
      id: `req-${Date.now()}`,
      requestNumber: `REQ-MUM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setServiceRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const cancelServiceRequest = (requestId: string, reason?: string) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'cancelled' } : r))
    );
  };

  // Quotation Management
  const sendQuotation = (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'status' | 'isDemo'>): Quotation => {
    const newQuote: Quotation = {
      ...data,
      id: `qt-${Date.now()}`,
      quotationNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'sent',
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setQuotations((prev) => [newQuote, ...prev]);

    // If attached to a marketplace service request, update its status
    if (data.requestId) {
      setServiceRequests((prev) =>
        prev.map((r) =>
          r.id === data.requestId && r.status === 'submitted'
            ? { ...r, status: 'quotations_received' }
            : r
        )
      );
    }
    return newQuote;
  };

  // Accept Quotation -> Locks other quotes, creates booking, creates operational SaaS job
  const acceptQuotation = (quotationId: string): Booking | null => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) return null;

    const now = new Date().toISOString();

    // 1. Mark this quotation as accepted, and expire other quotes for this request
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quotationId) {
          return { ...q, status: 'accepted', acceptedAt: now };
        }
        if (quote.requestId && q.requestId === quote.requestId && q.status === 'sent') {
          return { ...q, status: 'rejected', rejectedAt: now };
        }
        return q;
      })
    );

    // 2. Find request details if available
    const req = quote.requestId ? serviceRequests.find((r) => r.id === quote.requestId) : null;
    const serviceCategory = req ? req.category : 'General Service';
    const scheduledDate = req ? req.appointmentDate : new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const scheduledTime = req ? req.preferredTime : '10:00 AM - 1:00 PM';
    const address = req ? (req.address || `${req.neighbourhood}, Mumbai`) : 'Mumbai';
    const neighbourhood = req ? req.neighbourhood : 'Powai';

    // 3. Create confirmed Booking
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `BK-MUM-2026-${Math.floor(10 + Math.random() * 90)}`,
      requestId: quote.requestId || `standalone-${Date.now()}`,
      quotationId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone || '+91 98200 00000',
      professionalId: quote.professionalId,
      professionalName: quote.professionalName,
      professionalPhone: quote.professionalPhone || '+91 98000 00000',
      serviceCategory,
      scheduledDate,
      scheduledTime,
      address,
      neighbourhood,
      status: 'confirmed',
      totalAmount: quote.grandTotal,
      notes: `Quotation ${quote.quotationNumber} accepted by customer.`,
      createdAt: now,
      isDemo: true,
    };
    setBookings((prev) => [newBooking, ...prev]);

    // 4. Update request status to booking_confirmed
    if (quote.requestId) {
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === quote.requestId ? { ...r, status: 'booking_confirmed' } : r))
      );
    }

    // 5. Create operational Job in the professional's SaaS workspace
    const newJob: Job = {
      id: `job-${Date.now()}`,
      jobNumber: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
      professionalId: quote.professionalId,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone || '+91 98200 00000',
      serviceCategory,
      description: quote.scopeSummary || `Service for ${quote.customerName}`,
      scheduledDate,
      scheduledTime,
      assignedTo: quote.professionalName,
      estimatedCost: quote.grandTotal,
      status: 'scheduled',
      linkedQuotationId: quote.id,
      createdAt: now,
      updatedAt: now,
      isDemo: true,
    };
    setJobs((prev) => [newJob, ...prev]);

    // 6. Ensure customer record exists in the professional's directory
    setCustomerRecords((prev) => {
      const exists = prev.some(
        (c) => c.professionalId === quote.professionalId && (c.phone === quote.customerPhone || c.name === quote.customerName)
      );
      if (!exists) {
        const newCustRecord: CustomerRecord = {
          id: `cust-${Date.now()}`,
          professionalId: quote.professionalId,
          name: quote.customerName,
          phone: quote.customerPhone || '+91 98200 00000',
          address,
          neighbourhood,
          notes: 'Customer acquired via KaamSetu Marketplace booking.',
          source: 'kaamsetu',
          createdAt: now,
          updatedAt: now,
          isDemo: true,
        };
        return [newCustRecord, ...prev];
      }
      return prev;
    });

    return newBooking;
  };

  const rejectQuotation = (quotationId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'rejected', rejectedAt: new Date().toISOString() } : q))
    );
  };

  // Direct / Offline Customer Management
  const createCustomerRecord = (data: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'isDemo'>): CustomerRecord => {
    const now = new Date().toISOString();
    const newRecord: CustomerRecord = {
      ...data,
      id: `cust-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isDemo: true,
    };
    setCustomerRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateCustomerRecord = (id: string, updates: Partial<CustomerRecord>) => {
    setCustomerRecords((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  // Job Management
  const createJob = (data: Omit<Job, 'id' | 'jobNumber' | 'createdAt' | 'updatedAt' | 'isDemo'>): Job => {
    const now = new Date().toISOString();
    const newJob: Job = {
      ...data,
      id: `job-${Date.now()}`,
      jobNumber: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: now,
      updatedAt: now,
      isDemo: true,
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJobStatus = (jobId: string, status: Job['status'], notes?: string) => {
    const now = new Date().toISOString();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status,
            workNotes: notes ? (j.workNotes ? `${j.workNotes}\n${notes}` : notes) : j.workNotes,
            updatedAt: now,
          };
        }
        return j;
      })
    );

    // If there is a linked booking, sync its status
    setBookings((prev) =>
      prev.map((b) => {
        const j = jobs.find((job) => job.id === jobId);
        if (j && (b.id === j.linkedQuotationId || b.quotationId === j.linkedQuotationId)) {
          if (status === 'completed') return { ...b, status: 'completed', completedAt: now };
          if (status === 'in_progress') return { ...b, status: 'in_progress' };
          if (status === 'cancelled') return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );
  };

  // Invoice Management
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'isDemo' | 'amountPaid' | 'balanceDue'>): Invoice => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      amountPaid: 0,
      balanceDue: data.grandTotal,
      createdAt: now,
      isDemo: true,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Link back to job if present
    if (data.jobId) {
      setJobs((prev) =>
        prev.map((j) => (j.id === data.jobId ? { ...j, linkedInvoiceId: newInvoice.id, updatedAt: now } : j))
      );
    }
    return newInvoice;
  };

  // Record Payment Manually (cash, upi, bank_transfer)
  const recordPaymentManually = (
    invoiceId: string,
    amount: number,
    method: PaymentRecord['paymentMethod'],
    refNumber?: string,
    notes?: string
  ): PaymentRecord | null => {
    const targetInv = invoices.find((inv) => inv.id === invoiceId);
    if (!targetInv) return null;

    const now = new Date().toISOString();
    const safeAmount = Math.max(0, Math.min(amount, targetInv.balanceDue));
    const newPaid = targetInv.amountPaid + safeAmount;
    const newBalance = Math.max(0, targetInv.grandTotal - newPaid);
    const newStatus: Invoice['status'] = newBalance === 0 ? 'paid' : 'partially_paid';

    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceId: targetInv.id,
      invoiceNumber: targetInv.invoiceNumber,
      professionalId: targetInv.professionalId,
      customerName: targetInv.customerName,
      amount: safeAmount,
      paymentMethod: method,
      paymentType: 'manual_record', // Distinct from online gateway verified
      referenceNumber: refNumber,
      notes: notes || `Manually recorded by professional as received via ${method.toUpperCase()}.`,
      recordedAt: now,
      isDemo: true,
    };

    setPayments((prev) => [payment, ...prev]);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              amountPaid: newPaid,
              balanceDue: newBalance,
              status: newStatus,
              paidAt: newBalance === 0 ? now : inv.paidAt,
            }
          : inv
      )
    );

    return payment;
  };

  // Follow-ups & Reminders
  const createReminder = (data: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'isDemo'>): Reminder => {
    const newRem: Reminder = {
      ...data,
      id: `rem-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setReminders((prev) => [newRem, ...prev]);
    return newRem;
  };

  const toggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, completed: !r.completed } : r))
    );
  };

  // Warranties
  const recordWarranty = (data: Omit<WarrantyRecord, 'id' | 'isDemo'>): WarrantyRecord => {
    const newWar: WarrantyRecord = {
      ...data,
      id: `war-${Date.now()}`,
      isDemo: true,
    };
    setWarranties((prev) => [newWar, ...prev]);
    return newWar;
  };

  // Reviews
  const submitReview = (bookingId: string, rating: number, comment: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookingId,
      professionalId: booking.professionalId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate provider profile rating
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.userId === booking.professionalId || p.id === booking.professionalId) {
          const newCount = p.reviewCount + 1;
          const newAvg = Math.round(((p.rating * p.reviewCount + rating) / newCount) * 10) / 10;
          return { ...p, rating: newAvg, reviewCount: newCount };
        }
        return p;
      })
    );
  };

  // Complaints
  const submitComplaint = (
    bookingId: string | undefined,
    respondentId: string,
    respondentName: string,
    subject: string,
    description: string
  ) => {
    const newComp: Complaint = {
      id: `cmp-${Date.now()}`,
      bookingId,
      reporterId: currentUser.id,
      reporterRole: currentUser.role,
      reporterName: currentUser.name,
      respondentId,
      respondentName,
      subject,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setComplaints((prev) => [newComp, ...prev]);
  };

  // Subscription plan change
  const updateSubscriptionPlan = (professionalId: string, planId: 'free' | 'pro') => {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setUserSubscriptions((prev) => ({
      ...prev,
      [professionalId]: {
        professionalId,
        planId,
        status: 'active',
        periodStart: now.toISOString(),
        periodEnd: nextMonth.toISOString(),
        autoRenew: planId === 'pro',
        lastPaymentMethod: planId === 'pro' ? 'UPI AutoPay (Simulated Demo)' : 'None',
        isDemo: true,
      },
    }));
  };

  // Admin: Verification actions
  const verifyProvider = (profileId: string, notes: string) => {
    if (currentUser.role !== 'admin') {
      console.warn('Unauthorized admin operation blocked by client RBAC layer');
      return;
    }
    const now = new Date().toISOString();
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, verificationStatus: 'verified', verificationNotes: notes, verifiedAt: now }
          : p
      )
    );
    logAdminAction('PROVIDER_VERIFIED', 'provider', profileId, notes || 'Verified credentials and granted badge.');
  };

  const rejectProvider = (profileId: string, notes: string) => {
    if (currentUser.role !== 'admin') return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, verificationStatus: 'rejected', verificationNotes: notes }
          : p
      )
    );
    logAdminAction('PROVIDER_REJECTED', 'provider', profileId, notes || 'Application rejected.');
  };

  const suspendProvider = (profileId: string, notes: string) => {
    if (currentUser.role !== 'admin') return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, verificationStatus: 'suspended', verificationNotes: notes }
          : p
      )
    );
    logAdminAction('PROVIDER_SUSPENDED', 'provider', profileId, notes || 'Account suspended.');
  };

  const addCategory = (name: string, description: string, iconName: string) => {
    if (currentUser.role !== 'admin') return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description,
      iconName: iconName || 'Tool',
      active: true,
      order: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCat]);
    logAdminAction('CATEGORY_ADDED', 'category', newCat.id, `Created service category ${name}`);
  };

  const toggleCategory = (categoryId: string) => {
    if (currentUser.role !== 'admin') return;
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    );
    logAdminAction('CATEGORY_TOGGLED', 'category', categoryId, `Toggled active state`);
  };

  // Reset to initial demo data
  const resetToInitialDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setProfiles(DEMO_PROFILES);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setQuotations(INITIAL_QUOTATIONS);
    setBookings(INITIAL_BOOKINGS);
    setCustomerRecords(INITIAL_CUSTOMER_RECORDS);
    setJobs(INITIAL_JOBS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setReminders(INITIAL_REMINDERS);
    setWarranties(INITIAL_WARRANTIES);
    setReviews(INITIAL_REVIEWS);
    setComplaints(INITIAL_COMPLAINTS);
    setSubscriptionPlans(INITIAL_SUBSCRIPTION_PLANS);
    setUserSubscriptions(DEMO_USER_SUBSCRIPTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(DEMO_USERS.professional);
    localStorage.clear();
  };

  const clearAllData = () => {
    setServiceRequests([]);
    setQuotations([]);
    setBookings([]);
    setCustomerRecords([]);
    setJobs([]);
    setInvoices([]);
    setPayments([]);
    setReminders([]);
    setWarranties([]);
    setReviews([]);
    setComplaints([]);
    localStorage.clear();
  };

  const value = useMemo(
    () => ({
      currentUser,
      switchUser,
      setUser: setCurrentUser,
      language,
      setLanguage,
      t,
      selectedNeighbourhood,
      setSelectedNeighbourhood,
      currentView,
      setCurrentView,
      selectedProviderId,
      setSelectedProviderId,
      categories,
      profiles,
      serviceRequests,
      quotations,
      bookings,
      customerRecords,
      jobs,
      invoices,
      payments,
      reminders,
      warranties,
      reviews,
      complaints,
      subscriptionPlans,
      userSubscriptions,
      auditLogs,
      createServiceRequest,
      cancelServiceRequest,
      sendQuotation,
      acceptQuotation,
      rejectQuotation,
      createCustomerRecord,
      updateCustomerRecord,
      createJob,
      updateJobStatus,
      createInvoice,
      recordPaymentManually,
      createReminder,
      toggleReminder,
      recordWarranty,
      submitReview,
      submitComplaint,
      updateSubscriptionPlan,
      verifyProvider,
      rejectProvider,
      suspendProvider,
      addCategory,
      toggleCategory,
      resetToInitialDemoData,
      clearAllData,
    }),
    [
      currentUser,
      language,
      selectedNeighbourhood,
      currentView,
      selectedProviderId,
      categories,
      profiles,
      serviceRequests,
      quotations,
      bookings,
      customerRecords,
      jobs,
      invoices,
      payments,
      reminders,
      warranties,
      reviews,
      complaints,
      subscriptionPlans,
      userSubscriptions,
      auditLogs,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
