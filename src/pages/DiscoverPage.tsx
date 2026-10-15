import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PILOT_LOCATIONS } from '../lib/demoData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Phone,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Wrench,
  X,
  FileText,
} from 'lucide-react';
import { ProfessionalProfile } from '../types';

export const DiscoverPage: React.FC = () => {
  const {
    profiles,
    categories,
    selectedNeighbourhood,
    setSelectedNeighbourhood,
    selectedProviderId,
    setSelectedProviderId,
    setCurrentView,
    createServiceRequest,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Quote Request Modal State
  const [quoteModalPro, setQuoteModalPro] = useState<ProfessionalProfile | null>(null);
  const [quoteProblem, setQuoteProblem] = useState('');
  const [quoteDate, setQuoteDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [quoteTime, setQuoteTime] = useState('Morning (9 AM - 12 PM)');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Active Profile Modal
  const activeProfile = useMemo(() => {
    if (!selectedProviderId) return null;
    return profiles.find((p) => p.id === selectedProviderId) || null;
  }, [selectedProviderId, profiles]);

  // Filtered List
  const filteredPros = useMemo(() => {
    return profiles.filter((pro) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pro.businessName.toLowerCase().includes(q) || pro.ownerName.toLowerCase().includes(q);
        const matchesServices = pro.servicesOffered.some((s) => s.toLowerCase().includes(q));
        const matchesArea = pro.serviceArea.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesServices && !matchesArea) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const hasCat = pro.servicesOffered.some(
          (s) => s.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!hasCat) return false;
      }

      // Neighbourhood filter
      if (selectedNeighbourhood !== 'All Mumbai Neighbourhoods') {
        const servesArea = pro.serviceArea.some(
          (a) => a.toLowerCase() === selectedNeighbourhood.toLowerCase()
        );
        if (!servesArea) return false;
      }

      // Verification status
      if (onlyVerified && pro.verificationStatus !== 'verified') {
        return false;
      }

      return true;
    });
  }, [profiles, searchQuery, selectedCategory, selectedNeighbourhood, onlyVerified]);

  const handleSendDirectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalPro || !quoteProblem.trim()) return;

    createServiceRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      category: quoteModalPro.servicesOffered[0] || 'General Service',
      description: `Direct request to ${quoteModalPro.businessName}: ${quoteProblem}`,
      appointmentDate: quoteDate,
      preferredTime: quoteTime,
      city: 'Mumbai',
      neighbourhood: quoteModalPro.serviceArea[0] || 'Powai',
      urgency: 'standard',
      contactPreference: 'call',
    });

    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setQuoteModalPro(null);
      setQuoteProblem('');
      setCurrentView('customer-dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-teal-700 font-bold uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Mumbai Pilot Service Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Find Verified Local Service Professionals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct contact, transparent quotations, and zero commission markups.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, AC, plumbing, electrical..."
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium text-slate-800"
            >
              <option value="all">All Service Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Neighbourhood Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedNeighbourhood}
              onChange={(e) => setSelectedNeighbourhood(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium text-slate-800"
            >
              <option value="All Mumbai Neighbourhoods">All Mumbai Neighbourhoods</option>
              {PILOT_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.areaType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox: Verified Only */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Show verified providers with approved credentials only</span>
          </label>

          <span className="text-slate-500 text-[11px]">
            Found <strong>{filteredPros.length}</strong> service professional(s)
          </span>
        </div>
      </div>

      {/* Professional Cards Grid */}
      {filteredPros.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Service Providers Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We could not find any active service professionals matching your exact filter criteria in Mumbai.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedNeighbourhood('All Mumbai Neighbourhoods');
              setOnlyVerified(false);
            }}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                      alt={pro.businessName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {pro.businessName}
                      </h3>
                      <p className="text-xs text-slate-500">{pro.ownerName}</p>
                    </div>
                  </div>

                  {pro.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Under Review</span>
                    </span>
                  )}
                </div>

                {/* Services tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pro.servicesOffered.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                    >
                      {srv}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {pro.bio}
                </p>

                {/* Operational Details Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Indicative Pricing:</span>
                    <span className="font-semibold text-slate-800">{pro.indicativePricing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="font-medium text-slate-700">{pro.serviceArea.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-medium text-slate-700">{pro.experienceYears}+ years</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-slate-900">{pro.rating}</span>
                  <span className="text-[11px] text-slate-400">({pro.reviewCount})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProviderId(pro.id)}
                    className="text-xs text-slate-700 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setQuoteModalPro(pro)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Profile View Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={activeProfile.profileImage}
                    alt={activeProfile.businessName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{activeProfile.businessName}</h2>
                      {activeProfile.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Operated by {activeProfile.ownerName} • {activeProfile.experienceYears} years experience
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{activeProfile.rating}</span>
                      <span className="text-slate-400">({activeProfile.reviewCount} customer reviews)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProviderId(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Verified details notice */}
              {activeProfile.verificationStatus === 'verified' && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Administrator Verification Notes:</strong>{' '}
                    {activeProfile.verificationNotes}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  About the Business
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {activeProfile.bio}
                </p>
              </div>

              {/* Services & Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                    Services Offered
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.servicesOffered.map((s, i) => (
                      <span key={i} className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                    Service Areas in Mumbai
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.serviceArea.map((a, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Working Hours & Rates */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Standard Working Hours:</span>
                  <span className="font-semibold text-slate-800">{activeProfile.workingHours}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Indicative Service Pricing:</span>
                  <span className="font-semibold text-slate-800">{activeProfile.indicativePricing}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedProviderId(null)}
                className="text-xs text-slate-600 font-medium px-4 py-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setQuoteModalPro(activeProfile);
                  setSelectedProviderId(null);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition"
              >
                Request Quotation From {activeProfile.ownerName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Quote Request Modal */}
      {quoteModalPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Request Quotation</h3>
                <p className="text-xs text-slate-300">Target Provider: {quoteModalPro.businessName}</p>
              </div>
              <button onClick={() => setQuoteModalPro(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">Request Sent Successfully!</h4>
                <p className="text-xs text-slate-600">
                  {quoteModalPro.businessName} has been notified and will prepare an itemised quotation for you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendDirectRequest} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Describe what you need fixed or installed:
                  </label>
                  <textarea
                    required
                    value={quoteProblem}
                    onChange={(e) => setQuoteProblem(e.target.value)}
                    rows={3}
                    placeholder="e.g. My AC circuit breaker trips after 10 mins; need diagnostic and replacement..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Date:</label>
                    <input
                      type="date"
                      required
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Time:</label>
                    <select
                      value={quoteTime}
                      onChange={(e) => setQuoteTime(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 4 PM)</option>
                      <option>Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                  Your request will be delivered to <strong>{quoteModalPro.businessName}</strong>. You can review their formal itemised quote before confirming any booking.
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setQuoteModalPro(null)}
                    className="text-slate-600 font-medium px-3 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-xl transition"
                  >
                    Send Quotation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
