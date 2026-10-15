import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PILOT_LOCATIONS } from '../../lib/demoData';
import { JobDescriptionAssistant } from '../../components/ai/JobDescriptionAssistant';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FilePlus,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Booking, Quotation, ServiceRequest } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    categories,
    serviceRequests,
    quotations,
    bookings,
    invoices,
    createServiceRequest,
    cancelServiceRequest,
    acceptQuotation,
    rejectQuotation,
    submitReview,
    submitComplaint,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'quotations' | 'bookings' | 'new-request'>('requests');

  // New Request Form State
  const [category, setCategory] = useState(categories[0]?.name || 'Electrical repairs');
  const [description, setDescription] = useState('');
  const [enhancedDescription, setEnhancedDescription] = useState('');
  const [diagnosticChecklist, setDiagnosticChecklist] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [neighbourhood, setNeighbourhood] = useState('Powai');
  const [address, setAddress] = useState('Tower 3, Apt 1102, Lake Homes, Powai');
  const [budgetRange, setBudgetRange] = useState('₹1,000 - ₹2,500');
  const [urgency, setUrgency] = useState<'low' | 'standard' | 'urgent'>('standard');
  const [contactPreference, setContactPreference] = useState<'call' | 'whatsapp' | 'in_app'>('call');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Review & Complaint modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Quotation comparison details modal
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);

  // My requests & quotations
  const myRequests = serviceRequests.filter((r) => r.customerId === currentUser.id);
  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);
  const myQuotations = quotations.filter((q) => q.customerId === currentUser.id || myRequests.some((r) => r.id === q.requestId));

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createServiceRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      category,
      description,
      enhancedDescription: enhancedDescription || undefined,
      diagnosticChecklist: diagnosticChecklist.length > 0 ? diagnosticChecklist : undefined,
      appointmentDate,
      preferredTime,
      city: 'Mumbai',
      neighbourhood,
      address,
      budgetRange,
      urgency,
      contactPreference,
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setDescription('');
      setEnhancedDescription('');
      setDiagnosticChecklist([]);
      setActiveTab('requests');
    }, 1200);
  };

  const handleAcceptQuote = (quoteId: string) => {
    const booking = acceptQuotation(quoteId);
    if (booking) {
      setViewQuotation(null);
      setActiveTab('bookings');
    }
  };

  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !reviewComment.trim()) return;
    submitReview(reviewBooking.id, reviewRating, reviewComment);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewBooking(null);
      setReviewComment('');
    }, 1200);
  };

  const handleSendComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintBooking || !complaintSubject.trim()) return;
    submitComplaint(
      complaintBooking.id,
      complaintBooking.professionalId,
      complaintBooking.professionalName,
      complaintSubject,
      complaintDesc
    );
    setComplaintSuccess(true);
    setTimeout(() => {
      setComplaintSuccess(false);
      setComplaintBooking(null);
      setComplaintSubject('');
      setComplaintDesc('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Customer Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Customer Account
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.email} • {currentUser.phone} • {currentUser.neighbourhood}, Mumbai
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new-request')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
        >
          <FilePlus className="w-4 h-4" />
          <span>Post New Service Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
            activeTab === 'requests' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Requests ({myRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
            activeTab === 'quotations' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Compare Quotations ({myQuotations.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
            activeTab === 'bookings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Confirmed Bookings ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('new-request')}
          className={`px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
            activeTab === 'new-request' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Create Request
        </button>
      </div>

      {/* TAB 1: SERVICE REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active service requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need an electrician, plumber, AC specialist or carpenter? Post your request and get competitive quotations.
              </p>
              <button
                onClick={() => setActiveTab('new-request')}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Create Request Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => {
                const reqQuotes = quotations.filter((q) => q.requestId === req.id);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{req.requestNumber}</span>
                        <h3 className="font-bold text-sm text-slate-900">{req.category}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.neighbourhood}, Mumbai</span>
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.status === 'booking_confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'quotations_received'
                            ? 'bg-blue-100 text-blue-800'
                            : req.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {req.description}
                    </p>

                    {req.diagnosticChecklist && req.diagnosticChecklist.length > 0 && (
                      <div className="text-[11px] bg-teal-50/60 p-2.5 rounded-lg border border-teal-100 text-teal-900">
                        <strong className="block font-semibold mb-1">AI Diagnostic Checklist:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {req.diagnosticChecklist.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Appointment:</span>
                        <span className="font-semibold text-slate-800">{req.appointmentDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Time Window:</span>
                        <span className="font-semibold text-slate-800">{req.preferredTime}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Quotes received: <strong>{reqQuotes.length}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {req.status !== 'cancelled' && req.status !== 'completed' && (
                          <button
                            onClick={() => cancelServiceRequest(req.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1"
                          >
                            Cancel Request
                          </button>
                        )}
                        {reqQuotes.length > 0 && (
                          <button
                            onClick={() => setActiveTab('quotations')}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Review Quotes ({reqQuotes.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPARE QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong>Single-Provider Lock Protection:</strong> Accepting one quotation immediately confirms your booking, adds the appointment to the provider's official schedule, and automatically declines conflicting bids for this job.
            </div>
          </div>

          {myQuotations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No quotations received yet</h3>
              <p className="text-xs text-slate-500">
                When Mumbai professionals respond to your request, their itemised estimates will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myQuotations.map((qt) => (
                <div
                  key={qt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{qt.quotationNumber}</span>
                        <h4 className="font-bold text-sm text-slate-900">{qt.professionalName}</h4>
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

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {qt.scopeSummary}
                    </p>

                    {/* Itemised Breakdown Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 flex justify-between text-[11px]">
                        <span>Item & Scope</span>
                        <span>Amount</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {qt.items.map((item, idx) => (
                          <div key={idx} className="px-3 py-2 flex justify-between items-center text-slate-700">
                            <div>
                              <div className="font-medium">{item.description}</div>
                              <div className="text-[10px] text-slate-400">
                                {item.quantity} x ₹{item.unitPrice} ({item.type})
                              </div>
                            </div>
                            <span className="font-semibold text-slate-900">₹{item.total}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 space-y-1 text-slate-700 font-medium">
                        <div className="flex justify-between text-[11px]">
                          <span>Subtotal:</span>
                          <span>₹{qt.subtotal}</span>
                        </div>
                        {qt.discount > 0 && (
                          <div className="flex justify-between text-[11px] text-emerald-600">
                            <span>Discount:</span>
                            <span>-₹{qt.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[11px]">
                          <span>GST ({qt.taxRate}%):</span>
                          <span>₹{qt.taxAmount}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 text-xs pt-1 border-t border-slate-200">
                          <span>Total Estimated Cost:</span>
                          <span className="text-teal-700">₹{qt.grandTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Valid until: {qt.expiryDate}
                    </span>

                    {qt.status === 'sent' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => rejectQuotation(qt.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1.5"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptQuote(qt.id)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
                        >
                          Accept & Book
                        </button>
                      </div>
                    )}

                    {qt.status === 'accepted' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Accepted & Booking Confirmed</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIRMED BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No confirmed appointments yet</h3>
              <p className="text-xs text-slate-500">
                When you accept a quotation, your booking confirmation and direct contact details appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{bk.bookingNumber}</span>
                        <h4 className="font-bold text-base text-slate-900">{bk.serviceCategory}</h4>
                        <p className="text-xs font-medium text-teal-700">{bk.professionalName}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          bk.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bk.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {bk.status}
                      </span>
                    </div>

                    {/* Unlocked Contact Details for Confirmed Booking */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>Direct Contact: {bk.professionalPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {bk.scheduledDate} • {bk.scheduledTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bk.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">Agreed Amount:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{bk.totalAmount}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setComplaintBooking(bk)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Report Issue / Dispute
                    </button>

                    <button
                      onClick={() => setReviewBooking(bk)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NEW SERVICE REQUEST FORM */}
      {activeTab === 'new-request' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create a New Service Request</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Post your requirement to verified professionals in your Mumbai neighbourhood.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAiAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs hover:opacity-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Diagnosis Assistant</span>
            </button>
          </div>

          {formSuccess ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-slate-900">Service Request Published!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Eligible professionals in Mumbai will review your problem and submit itemised quotations shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mumbai Neighbourhood:</label>
                  <select
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {PILOT_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Describe the Issue or Job:
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. My AC circuit breaker trips after running for 10 minutes. Water also leaks from the bottom corner..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {enhancedDescription && (
                <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                  <span className="font-bold block text-[11px] uppercase tracking-wider">
                    AI Enhanced Technical Scope:
                  </span>
                  <p className="text-xs leading-relaxed">{enhancedDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Appointment Date:</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Time Window:</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none font-medium"
                  >
                    <option>Morning (9 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Service Address:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/Wing number, Society name, Landmark"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="low">Flexible (Within a week)</option>
                    <option value="standard">Standard (Next 1-2 days)</option>
                    <option value="urgent">Urgent (Today / Emergency)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget Expectation:</label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="e.g. ₹500 - ₹1,500"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Mode:</label>
                  <select
                    value={contactPreference}
                    onChange={(e) => setContactPreference(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="in_app">In-App Notification</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('requests')}
                  className="text-slate-600 hover:text-slate-800 font-medium px-3 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
                >
                  Submit Service Request
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Review {reviewBooking.professionalName}</h3>
            {reviewSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">Review submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSendReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Feedback:</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe promptness, quality of parts, and cleanliness..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBooking(null)}
                    className="text-slate-600 font-medium px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Complaint / Dispute Modal */}
      {complaintBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Report an Issue or Dispute</h3>
            <p className="text-xs text-slate-500">
              Booking: {complaintBooking.bookingNumber} with {complaintBooking.professionalName}
            </p>

            {complaintSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">
                  Complaint ticket logged for administrator investigation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendComplaint} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Reason:</label>
                  <input
                    type="text"
                    required
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="e.g. Technician delayed by 3 hours, unapproved part price..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Details:</label>
                  <textarea
                    required
                    rows={3}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Provide exact details so our admin team can investigate..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setComplaintBooking(null)}
                    className="text-slate-600 font-medium px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Submit Dispute Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Modal Integration */}
      {aiAssistantOpen && (
        <JobDescriptionAssistant
          initialPrompt={description}
          categoryHint={category}
          onApply={(data) => {
            setDescription(data.enhancedDescription);
            setEnhancedDescription(data.enhancedDescription);
            setCategory(data.suggestedCategory);
            setDiagnosticChecklist(data.checklist);
          }}
          onClose={() => setAiAssistantOpen(false)}
        />
      )}
    </div>
  );
};
