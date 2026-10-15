import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TermsPrivacyPages } from './pages/TermsPrivacyPages';
import { UserCheck, Briefcase, Shield, RefreshCw } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, currentUser, switchUser, resetToInitialDemoData } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'discover':
        return <DiscoverPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'pro-dashboard':
        return <ProfessionalDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'pricing':
        return <PricingPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'terms-privacy':
        return <TermsPrivacyPages />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />

      {/* Floating Demo Role Switcher Toolbar for fast evaluator walkthrough */}
      <aside aria-label="Demo Role Switcher" className="fixed bottom-4 right-4 z-40 bg-slate-900/95 text-white p-2 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md hidden sm:flex items-center gap-1.5 text-xs animate-in fade-in slide-in-from-bottom-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 pl-2 pr-1">
          Demo Persona:
        </span>
        <button
          onClick={() => switchUser('professional')}
          className={`px-2.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
            currentUser.role === 'professional'
              ? 'bg-teal-600 text-white font-bold'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Rajesh Sharma (Professional SaaS workspace)"
        >
          <Briefcase className="w-3.5 h-3.5 text-teal-300" />
          <span>Pro (Rajesh)</span>
        </button>

        <button
          onClick={() => switchUser('customer')}
          className={`px-2.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
            currentUser.role === 'customer'
              ? 'bg-teal-600 text-white font-bold'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Priya Sharma (Customer marketplace requests)"
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-300" />
          <span>Customer (Priya)</span>
        </button>

        <button
          onClick={() => switchUser('admin')}
          className={`px-2.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
            currentUser.role === 'admin'
              ? 'bg-rose-700 text-white font-bold'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Admin (omgmore2005@gmail.com)"
        >
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span>Admin</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <button
          onClick={resetToInitialDemoData}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Reset demo data to initial state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </aside>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
