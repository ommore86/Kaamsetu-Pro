export type UserRole = 'customer' | 'professional' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'mr';

export type VerificationStatus = 'not_submitted' | 'pending_review' | 'verified' | 'rejected' | 'suspended';

export type JobStatus = 'new' | 'scheduled' | 'in_progress' | 'waiting_for_parts' | 'completed' | 'cancelled';

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'finding_professionals'
  | 'quotations_received'
  | 'booking_confirmed'
  | 'work_in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card';

export type PaymentType = 'manual_record' | 'gateway_verified';

export type CustomerSource = 'kaamsetu' | 'referral' | 'whatsapp' | 'personal_contact' | 'other';

export type ReminderType = 'follow_up' | 'quotation' | 'unpaid_invoice' | 'appointment' | 'warranty' | 'maintenance';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  city: string;
  neighbourhood: string;
  preferredLanguage: LanguageCode;
  createdAt: string;
  isDemo?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  active: boolean;
  order: number;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  servicesOffered: string[];
  serviceArea: string[];
  experienceYears: number;
  hourlyRate?: number;
  indicativePricing: string;
  bio: string;
  workingHours: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  profileImage?: string;
  portfolioImages?: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  isDemo?: boolean;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  description: string;
  enhancedDescription?: string;
  diagnosticChecklist?: string[];
  photos?: string[];
  appointmentDate: string;
  preferredTime: string;
  city: string;
  neighbourhood: string;
  address?: string;
  budgetRange?: string;
  urgency: 'low' | 'standard' | 'urgent';
  contactPreference: 'call' | 'whatsapp' | 'in_app';
  status: RequestStatus;
  createdAt: string;
  isDemo?: boolean;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'labour' | 'material';
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  requestId?: string;
  jobId?: string;
  professionalId: string;
  professionalName: string;
  professionalPhone?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  scopeSummary: string;
  termsAndConditions: string[];
  expiryDate: string;
  status: QuotationStatus;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  requestId: string;
  quotationId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  professionalId: string;
  professionalName: string;
  professionalPhone: string;
  serviceCategory: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  neighbourhood: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  isDemo?: boolean;
}

export interface CustomerRecord {
  id: string;
  professionalId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighbourhood: string;
  notes?: string;
  source: CustomerSource;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Job {
  id: string;
  jobNumber: string;
  professionalId: string;
  customerRecordId?: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedTo?: string;
  estimatedCost: number;
  actualCost?: number;
  partsUsed?: string[];
  workNotes?: string;
  photosBefore?: string[];
  photosAfter?: string[];
  status: JobStatus;
  linkedQuotationId?: string;
  linkedInvoiceId?: string;
  warrantyPeriodMonths?: number;
  warrantyExpiryDate?: string;
  nextServiceDate?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  professionalId: string;
  professionalBusinessName?: string;
  professionalGstin?: string;
  customerRecordId?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  jobId?: string;
  quotationId?: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  paidAt?: string;
  isDemo?: boolean;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  professionalId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  referenceNumber?: string;
  notes?: string;
  recordedAt: string;
  verifiedAt?: string;
  isDemo?: boolean;
}

export interface Reminder {
  id: string;
  professionalId: string;
  title: string;
  type: ReminderType;
  dueDate: string;
  relatedName?: string;
  relatedId?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  isDemo?: boolean;
}

export interface WarrantyRecord {
  id: string;
  professionalId: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: string;
  workPerformed: string;
  partsReplaced: string;
  serviceDate: string;
  warrantyEnd: string;
  nextServiceDue?: string;
  notes?: string;
  isDemo?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  professionalId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Complaint {
  id: string;
  bookingId?: string;
  reporterId: string;
  reporterRole: UserRole;
  reporterName: string;
  respondentId: string;
  respondentName: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  maxActiveJobs: number | 'unlimited';
  aiDraftingQuota: number | 'unlimited';
  features: string[];
  active: boolean;
}

export interface UserSubscription {
  professionalId: string;
  planId: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  periodStart: string;
  periodEnd: string;
  autoRenew: boolean;
  lastPaymentMethod?: string;
  isDemo?: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'provider' | 'category' | 'complaint' | 'plan' | 'user';
  targetId: string;
  details: string;
  timestamp: string;
}
