import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  MapPin,
  Receipt,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    t,
    categories,
    profiles,
    selectedNeighbourhood,
    setSelectedNeighbourhood,
    setCurrentView,
    setSelectedProviderId,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter profiles for Mumbai pilot
  const verifiedPros = profiles.filter((p) => p.verificationStatus === 'verified');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('discover');
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentView('discover');
  };

  const viewProProfile = (id: string) => {
    setSelectedProviderId(id);
    setCurrentView('discover');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Pilot Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Pilot Active in Mumbai • Andheri, Powai, Ghatkopar, Thane & Navi Mumbai</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Get more customers. Manage every job.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Grow your local business.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The trusted digital platform uniting India’s independent trade professionals with local homeowners. Built with a dedicated business management suite.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
            >
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 text-slate-800">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Need AC service, Plumber, Electrician, Carpenter...?"
                  className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>{t('searchButton')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mt-3">
              <span className="text-slate-400">Popular:</span>
              {['AC repair', 'Electrical tripping', 'Tap leakage', 'Modular carpentry', 'Deep cleaning'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setCurrentView('discover');
                    }}
                    className="hover:text-teal-300 underline underline-offset-2 transition"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setCurrentView('customer-dashboard')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Post a Service Request</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </button>
            <button
              onClick={() => setCurrentView('pro-dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <span>Explore Pro Business Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Popular Service Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a service to view verified trade specialists across Mumbai
            </p>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition text-left group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-teal-600 mt-3 inline-flex items-center gap-1">
                Explore Pros →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* The Two Interconnected Products (Marketplace + SaaS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              The KaamSetu Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Two Interconnected Products. Zero Commission Traps.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              We never artificially lock phone numbers or penalise direct client relationships. A professional continues getting value from KaamSetu Pro even when a customer saves their number directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product A: Marketplace */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <span>Product A</span>
                  <span className="text-slate-400">•</span>
                  <span>For Customers</span>
                </div>
                <h3 className="text-xl font-bold">KaamSetu Marketplace</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discover verified technicians in Mumbai, compare formal quotations with clear itemised parts & labour, confirm bookings, and track progress without opaque middleman markups.
                </p>
                <ul className="text-xs text-slate-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free service request posting with AI diagnosis assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Compare up to 3 competitive quotations transparently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct phone & WhatsApp contact once quote accepted</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('discover')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 rounded-xl transition text-center"
              >
                Find a Professional Now
              </button>
            </div>

            {/* Product B: Pro SaaS */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <span>Product B (Primary Engine)</span>
                  <span className="text-slate-400">•</span>
                  <span>For Professionals</span>
                </div>
                <h3 className="text-xl font-bold">KaamSetu Pro SaaS</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Operate your entire business. Add offline clients from WhatsApp, friends, and direct society calls. Generate GST invoices, record payments, manage warranties, and track revenue.
                </p>
                <ul className="text-xs text-slate-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Customer CRM for both KaamSetu & direct WhatsApp contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Professional quotations with code-verified mathematical totals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Gemini AI Business Copilot (queries your verified records)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('pro-dashboard')}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs py-2.5 rounded-xl transition text-center"
              >
                Launch Professional Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Professionals in Mumbai Pilot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Verified Pilot Providers</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Trusted Mumbai Technicians
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Government license & ID verification completed by administration
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedPros.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.profileImage}
                      alt={pro.businessName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{pro.businessName}</h4>
                      <p className="text-xs text-slate-500">{pro.ownerName}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {pro.servicesOffered.map((srv, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                    >
                      {srv}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {pro.bio}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Service Area:</span>
                    <span className="font-semibold text-slate-700">{pro.serviceArea.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Experience:</span>
                    <span className="font-semibold text-slate-700">{pro.experienceYears}+ years</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-slate-900">{pro.rating}</span>
                  <span className="text-[11px] text-slate-400">({pro.reviewCount} reviews)</span>
                </div>
                <button
                  onClick={() => viewProProfile(pro.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            How KaamSetu Works for Homeowners & Contractors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A transparent 4-step workflow that respects your time and keeps pricing predictable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-extrabold text-teal-100 absolute top-4 right-4">01</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Post Job with AI Help</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Describe your issue in plain words. Our Gemini assistant structures technical checklists and diagnostic points.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-extrabold text-teal-100 absolute top-4 right-4">02</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Receive Itemised Quotes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Providers submit transparent estimates breaking down genuine replacement parts and technical labour.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-extrabold text-teal-100 absolute top-4 right-4">03</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Accept & Confirm</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Accepting 1 quote locks out conflicting bids and automatically syncs the schedule to the provider's calendar.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-extrabold text-teal-100 absolute top-4 right-4">04</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Warranty & Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provider logs the completed work, issues invoice, and sets up warranty and maintenance reminders in SaaS.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Affordable SaaS Subscription
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Only ₹399/month for Service Professionals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              No commission cuts on customer payments. Keep 100% of your earnings. Free starter plan available with essential profile and booking tools.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('pricing')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition shrink-0"
          >
            Compare Free vs Pro Plans
          </button>
        </div>
      </section>
    </div>
  );
};
