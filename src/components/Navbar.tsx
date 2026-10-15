import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PILOT_LOCATIONS } from '../lib/demoData';
import { LanguageCode, UserRole } from '../types';
import {
  Briefcase,
  ChevronDown,
  Globe,
  HelpCircle,
  Home,
  Layers,
  MapPin,
  Menu,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUser,
    language,
    setLanguage,
    t,
    selectedNeighbourhood,
    setSelectedNeighbourhood,
    currentView,
    setCurrentView,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'customer':
        return t('roleCustomer');
      case 'professional':
        return t('roleProfessional');
      case 'admin':
        return t('roleAdmin');
    }
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Demo & Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              MUMBAI PILOT
            </span>
            <span className="text-slate-300 hidden md:inline">
              KaamSetu Pro — Local Services Marketplace & Business SaaS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition text-[11px] font-medium"
                title="Switch test account role"
              >
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  Role: <strong className="text-white">{getRoleLabel(currentUser.role)}</strong>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-700 text-[11px] text-slate-400">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => switchUser('professional')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 ${
                      currentUser.role === 'professional' ? 'bg-teal-900/40 text-teal-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Rajesh Sharma (Electrician)</div>
                      <div className="text-[10px] text-slate-400">Sharma Electricals • Pro SaaS Suite</div>
                    </div>
                    {currentUser.role === 'professional' && <span className="text-xs text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => switchUser('customer')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 ${
                      currentUser.role === 'customer' ? 'bg-teal-900/40 text-teal-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Priya Sharma (Homeowner)</div>
                      <div className="text-[10px] text-slate-400">Powai • Marketplace Client</div>
                    </div>
                    {currentUser.role === 'customer' && <span className="text-xs text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => switchUser('admin')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 ${
                      currentUser.role === 'admin' ? 'bg-teal-900/40 text-teal-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Omkar (Administrator)</div>
                      <div className="text-[10px] text-slate-400">omgmore2005@gmail.com • Verification & Audit</div>
                    </div>
                    {currentUser.role === 'admin' && <span className="text-xs text-teal-400">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-0.5 border border-slate-700">
              <Globe className="w-3 h-3 text-slate-400" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1 rounded ${language === 'en' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                EN
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1 rounded ${language === 'hi' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                हिन्दी
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-1 rounded ${language === 'mr' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center shadow-sm group-hover:border-teal-500 transition">
                <Wrench className="w-5 h-5 text-teal-400 -rotate-12" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">KaamSetu</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-extrabold bg-teal-600 text-white tracking-wider">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                  Mumbai Local Services & SaaS
                </div>
              </div>
            </button>

            {/* Pilot Location Filter */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <select
                  value={selectedNeighbourhood}
                  onChange={(e) => setSelectedNeighbourhood(e.target.value)}
                  className="bg-transparent border-none text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
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
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'home' ? 'text-slate-900 bg-slate-100 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('appName')}
            </button>

            <button
              onClick={() => navigateTo('discover')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'discover' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navMarketplace')}
            </button>

            <button
              onClick={() => navigateTo('how-it-works')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'how-it-works' ? 'text-slate-900 bg-slate-100 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navHowItWorks')}
            </button>

            <button
              onClick={() => navigateTo('pricing')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'pricing' ? 'text-slate-900 bg-slate-100 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navPricing')}
            </button>
          </nav>

          {/* Action Button depending on current role */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser.role === 'professional' ? (
              <button
                onClick={() => navigateTo('pro-dashboard')}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition border border-slate-700"
              >
                <Briefcase className="w-4 h-4 text-teal-400" />
                <span>{t('navSaaS')}</span>
              </button>
            ) : currentUser.role === 'customer' ? (
              <button
                onClick={() => navigateTo('customer-dashboard')}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('myBookings')} & Requests</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="pt-2 pb-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Select Mumbai Area
            </label>
            <select
              value={selectedNeighbourhood}
              onChange={(e) => setSelectedNeighbourhood(e.target.value)}
              className="w-full text-xs font-medium bg-slate-100 border border-slate-300 rounded-lg p-2 text-slate-800"
            >
              <option value="All Mumbai Neighbourhoods">All Mumbai Neighbourhoods</option>
              {PILOT_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.areaType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => navigateTo('discover')}
              className="p-2.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold text-center border border-teal-200"
            >
              {t('navMarketplace')}
            </button>
            <button
              onClick={() => navigateTo('pro-dashboard')}
              className="p-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold text-center"
            >
              {t('navSaaS')}
            </button>
          </div>

          <div className="space-y-1 text-sm font-medium text-slate-700 pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('customer-dashboard')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
            >
              Customer Requests & Bookings
            </button>
            <button
              onClick={() => navigateTo('how-it-works')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
            >
              How KaamSetu Works
            </button>
            <button
              onClick={() => navigateTo('pricing')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
            >
              SaaS Plans & Pricing
            </button>
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-rose-700"
            >
              Administrator Panel
            </button>
            <button
              onClick={() => navigateTo('terms-privacy')}
              className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-500 text-xs"
            >
              Terms, Privacy & Trust Scope
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
