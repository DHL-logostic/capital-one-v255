import React, { useState, useEffect } from 'react';
import { 
  Landmark, ArrowUp, Mail, MapPin, Phone,
  Twitter, Instagram, Facebook, Youtube, ChevronDown, ChevronUp, ShieldCheck
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import SecuritySection from './components/SecuritySection';
import DemoPortal from './components/DemoPortal';
import OpenAccountModal from './components/OpenAccountModal';
import ManagerConsoleModal from './components/ManagerConsoleModal';
import FloatingChatSupport from './components/FloatingChatSupport';
import Testimonials from './components/Testimonials';
import NewsletterSubscription from './components/NewsletterSubscription';
import { UserProfile } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'enroll' | 'dashboard'>('public');
  const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [openFooterCol, setOpenFooterCol] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.pageYOffset / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial check
    handleScroll();
    
    // Add window resize observer/listener to recalculate if the dimension changes
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentView]);

  const toggleFooterCol = (colId: string) => {
    setOpenFooterCol(openFooterCol === colId ? null : colId);
  };

  const showView = (view: string) => {
    if (view === 'login') {
      setCurrentView('login');
      window.scrollTo(0, 0);
    } else if (view === 'enroll') {
      setCurrentView('enroll');
      window.scrollTo(0, 0);
    } else if (view === 'public') {
      setCurrentView('public');
      window.scrollTo(0, 0);
    } else if (view === 'dashboard') {
      setCurrentView('dashboard');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    (window as any).showView = showView;
  }, []);

  // Sync / load currently active authenticated user session from database
  const syncSession = () => {
    try {
      const activeId = localStorage.getItem('apex_v26_logged_in_user_id');
      if (activeId) {
        const stored = localStorage.getItem('apex_v26');
        const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
        const matched = profiles.find(p => p.id === activeId);
        if (matched) {
          setCurrentUser(matched);
          setCurrentView('dashboard');
          return;
        }
      }
      setCurrentUser(null);
      setCurrentView(prev => (prev === 'dashboard' ? 'public' : prev));
    } catch (err) {
      console.error('Session sync error:', err);
    }
  };

  useEffect(() => {
    syncSession();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    localStorage.setItem('apex_v26_logged_in_user_id', user.id);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_v26_logged_in_user_id');
    setCurrentUser(null);
    setCurrentView('public');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Login View Card on Clean Light Gray Background
  if (currentView === 'login' && !currentUser) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between selection:bg-[#005a9c]/10 selection:text-[#005a9c] relative overflow-x-hidden font-sans">
        {/* Scroll Progress Indicator Bar */}
        <div id="scroll-progress-container-login" className="fixed top-0 left-0 right-0 h-[3px] bg-slate-200/45 z-[10000] pointer-events-none">
          <div 
            id="scroll-progress-bar-login" 
            className="h-full bg-gradient-to-r from-[#004879] via-[#005a9c] to-[#d22e1e] transition-all duration-75 ease-out shadow-[0_1px_5px_rgba(0,120,255,0.25)]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <header className="py-5 px-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer select-none group/logo relative"
              onClick={() => showView('public')}
            >
              <div className="relative flex items-center pr-10">
                <span className="text-xl font-extrabold italic tracking-tighter text-[#001c3d] font-sans">
                  capital<span className="text-[#004879] font-sans">one</span>
                </span>
                <svg 
                  className="absolute bottom-1 right-1 w-10 h-3.5 text-[#d22e1e]" 
                  viewBox="0 0 100 30" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 25 C 28 4, 76 4, 98 9 C 72 7, 30 14, 5 25 Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            <button 
              onClick={() => showView('public')}
              className="text-xs font-extrabold tracking-wide uppercase text-[#004879] hover:text-[#002844] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <DemoPortal 
              currentUser={null}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
            />
          </div>
        </main>

        <footer className="py-6 bg-white border-t border-gray-100 text-center text-[10px] text-slate-400 shrink-0">
          <p>© 2026 Capital One 360 Sovereign Corporative. All rights reserved. Member FDIC. Equal Housing Lender.</p>
        </footer>
        <FloatingChatSupport currentUser={null} />
      </div>
    );
  }

  // Enrollment Flow: Multi-step personal information collector
  if (currentView === 'enroll' && !currentUser) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between selection:bg-[#005a9c]/10 selection:text-[#005a9c] relative overflow-x-hidden font-sans">
        {/* Scroll Progress Indicator Bar */}
        <div id="scroll-progress-container-enroll" className="fixed top-0 left-0 right-0 h-[3px] bg-slate-200/45 z-[10000] pointer-events-none">
          <div 
            id="scroll-progress-bar-enroll" 
            className="h-full bg-gradient-to-r from-[#004879] via-[#005a9c] to-[#d22e1e] transition-all duration-75 ease-out shadow-[0_1px_5px_rgba(0,120,255,0.25)]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <header className="py-5 px-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer select-none group/logo relative"
              onClick={() => showView('public')}
            >
              <div className="relative flex items-center pr-10">
                <span className="text-xl font-extrabold italic tracking-tighter text-[#001c3d] font-sans">
                  capital<span className="text-[#004879] font-sans">one</span>
                </span>
                <svg 
                  className="absolute bottom-1 right-1 w-10 h-3.5 text-[#d22e1e]" 
                  viewBox="0 0 100 30" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 25 C 28 4, 76 4, 98 9 C 72 7, 30 14, 5 25 Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            <button 
              onClick={() => showView('public')}
              className="text-xs font-extrabold tracking-wide uppercase text-[#004879] hover:text-[#002844] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-lg my-8">
            <OpenAccountModal 
              isOpen={true} 
              onClose={() => showView('public')} 
              onRegistrationSuccess={handleLoginSuccess}
            />
          </div>
        </main>

        <footer className="py-6 bg-white border-t border-gray-100 text-center text-[10px] text-slate-400 shrink-0">
          <p>© 2026 Capital One 360 Sovereign Corporative. All rights reserved. Member FDIC. Equal Housing Lender.</p>
        </footer>
        <FloatingChatSupport currentUser={null} />
      </div>
    );
  }

  // Private Dashboard View
  if (currentView === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#005a9c]/10 selection:text-[#005a9c] relative overflow-x-hidden font-sans">
        {/* Scroll Progress Indicator Bar */}
        <div id="scroll-progress-container-dash" className="fixed top-0 left-0 right-0 h-[3px] bg-slate-100/50 z-[10000] pointer-events-none">
          <div 
            id="scroll-progress-bar-dash" 
            className="h-full bg-gradient-to-r from-[#004879] via-[#005a9c] to-[#d22e1e] transition-all duration-75 ease-out shadow-[0_1px_5px_rgba(0,120,255,0.25)]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <ManagerConsoleModal
          isOpen={adminConsoleOpen}
          onClose={() => setAdminConsoleOpen(false)}
          onStateChange={syncSession}
        />

        <main className="flex-grow flex">
          <DemoPortal 
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onOpenManager={() => setAdminConsoleOpen(true)}
          />
        </main>

        <FloatingChatSupport currentUser={currentUser} />
      </div>
    );
  }

  // DEFAULT (currentView === 'public'): Render Complete Public Shell
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#005a9c]/10 selection:text-[#005a9c] relative overflow-x-hidden font-sans">
      {/* Scroll Progress Indicator Bar */}
      <div id="scroll-progress-container-public" className="fixed top-0 left-0 right-0 h-[3px] bg-slate-100/50 z-[10000] pointer-events-none">
        <div 
          id="scroll-progress-bar-public" 
          className="h-full bg-gradient-to-r from-[#004879] via-[#005a9c] to-[#d22e1e] transition-all duration-75 ease-out shadow-[0_1px_5px_rgba(0,120,255,0.25)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Sticky Navigation and State Synchronizers */}
      <Navbar 
        onOpenAccountClick={() => showView('enroll')} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onManagerClick={() => setAdminConsoleOpen(true)}
        currentView={currentView}
      />

      {/* Administrative Manager Console Panel overlay */}
      <ManagerConsoleModal
        isOpen={adminConsoleOpen}
        onClose={() => setAdminConsoleOpen(false)}
        onStateChange={syncSession}
      />

      {/* Main Sections flow */}
      <main className="flex-grow">
        
        {/* Hero Banner with APY Estimator Widget */}
        <Hero />

        {/* Features Grids - Global Dispatch and Asset Custody */}
        <Features />

        {/* Customer Testimonials and Client Perspectives */}
        <Testimonials />

        {/* Security configuration credentials logs */}
        <SecuritySection />

      </main>

      {/* Floating security chat assistant */}
      <FloatingChatSupport currentUser={currentUser} />

      {/* Footer Segment Layout */}
      <footer className="bg-white border-t border-gray-150 text-[#001c3d] py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Newsletter Subscription Component */}
          <NewsletterSubscription />
          
          {/* Section 1: Responsive Multi-column Accordion Menu */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-100 pb-12">
            
            {/* Column 1: Products */}
            <div className="border-b border-gray-100 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterCol('products')}
                className="w-full md:w-auto flex justify-between items-center text-left py-2 md:py-0 cursor-pointer focus:outline-none"
              >
                <h4 className="text-[#001c3d] font-extrabold uppercase tracking-widest text-[11px] font-sans">Products</h4>
                <div className="md:hidden text-slate-450">
                  {openFooterCol === 'products' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              <div className={`mt-3 md:block space-y-2.5 text-xs ${openFooterCol === 'products' ? 'block' : 'hidden md:block'}`}>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Credit Cards</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Checking & Savings</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Auto Loans</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Business</a>
              </div>
            </div>

            {/* Column 2: Get to Know Us */}
            <div className="border-b border-gray-100 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterCol('get-to-know')}
                className="w-full md:w-auto flex justify-between items-center text-left py-2 md:py-0 cursor-pointer focus:outline-none"
              >
                <h4 className="text-[#001c3d] font-extrabold uppercase tracking-widest text-[11px] font-sans">Get to Know Us</h4>
                <div className="md:hidden text-slate-450">
                  {openFooterCol === 'get-to-know' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              <div className={`mt-3 md:block space-y-2.5 text-xs ${openFooterCol === 'get-to-know' ? 'block' : 'hidden md:block'}`}>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">About</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Careers</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Newsroom</a>
              </div>
            </div>

            {/* Column 3: Legal */}
            <div className="border-b border-gray-100 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterCol('legal')}
                className="w-full md:w-auto flex justify-between items-center text-left py-2 md:py-0 cursor-pointer focus:outline-none"
              >
                <h4 className="text-[#001c3d] font-extrabold uppercase tracking-widest text-[11px] font-sans">Legal</h4>
                <div className="md:hidden text-slate-455">
                  {openFooterCol === 'legal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              <div className={`mt-3 md:block space-y-2.5 text-xs ${openFooterCol === 'legal' ? 'block' : 'hidden md:block'}`}>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Privacy</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Terms</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Patriot Act</a>
              </div>
            </div>

            {/* Column 4: Support & Hidden Manager Portal link */}
            <div className="pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterCol('support')}
                className="w-full md:w-auto flex justify-between items-center text-left py-2 md:py-0 cursor-pointer focus:outline-none"
              >
                <h4 className="text-[#001c3d] font-extrabold uppercase tracking-widest text-[11px] font-sans">Support</h4>
                <div className="md:hidden text-slate-455">
                  {openFooterCol === 'support' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              <div className={`mt-3 md:block space-y-2.5 text-xs ${openFooterCol === 'support' ? 'block' : 'hidden md:block'}`}>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Contact Us</a>
                <a href="#features" className="block text-slate-500 hover:text-[#004879] transition font-medium">Help Center</a>
                <button
                  onClick={() => setAdminConsoleOpen(true)}
                  className="block text-left text-slate-400 hover:text-[#004879] transition cursor-pointer"
                  id="footer-manager-portal-trigger"
                >
                  Fiduciary Disclosures
                </button>
              </div>
            </div>

          </div>

          {/* Section 2: Social Media Row */}
          <div className="flex items-center justify-between py-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold italic text-[#001c3d] tracking-tighter">capital<span className="text-[#004879]">one</span></span>
            </div>
            
            <div className="flex items-center gap-5 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#004879] transition duration-150" aria-label="Capital One 360 on Twitter">
                <Twitter className="w-4 h-4 shrink-0" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#004879] transition duration-150" aria-label="Capital One 360 on Instagram">
                <Instagram className="w-4 h-4 shrink-0" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#004879] transition duration-150" aria-label="Capital One 360 on Facebook">
                <Facebook className="w-4 h-4 shrink-0" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#004879] transition duration-150" aria-label="Capital One 360 on YouTube">
                <Youtube className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Section 3: Professional Footnotes & Compliance Block */}
          <div className="pt-8 space-y-6">
            
            <div className="text-[10px] text-slate-400 leading-relaxed space-y-3 font-sans">
              <p>
                1. Credit scoring and pre-approval offers are calculated using proprietary liquidity indicators and index parameters. No impact to credit score during pre-qualification. Continuous sync requires a valid Private ID ledger status.
              </p>
              <p>
                2. Capital One 360 Performance Savings accounts and sovereign private investment safe reserves are held under extreme cybersecurity protocols. Deposits are federally insured up to standard allowable limits under the Federal Deposit Insurance Corporation (FDIC) charter.
              </p>
              <p>
                3. Auto Navigator pre-qualification models represent indicative monthly statements subject to individual credit verification and dealer underwriting approval.
              </p>
              <p>
                © 2026 Capital One 360 Sovereign Corporative. All rights reserved. Capital One 360, Paze, Auto Navigator, Venture X, and associated logo systems are registered service marks under international protection treaties.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-[10px] font-mono text-slate-400 border-t border-gray-100">
              <div className="flex items-center gap-6">
                
                <span className="border border-slate-300 px-2.5 py-1 rounded font-bold text-[9px] tracking-widest text-[#001c3d] select-none bg-slate-50 uppercase font-sans">
                  Member FDIC
                </span>

                <div className="flex items-center gap-1.5 select-none font-sans">
                  <div className="w-5 h-5 border border-slate-300 bg-slate-50 flex items-center justify-center rounded relative">
                    <span className="text-[10px] font-black text-[#001c3d] leading-none">=</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-[#001c3d] uppercase tracking-wider">
                    Equal Housing Lender
                  </span>
                </div>

                {/* Hidden Boss/Manager Console Gear Button */}
                <button
                  onClick={() => setAdminConsoleOpen(true)}
                  className="text-slate-300 hover:text-slate-500 font-bold transition select-none text-[11px] h-5 w-5 flex items-center justify-center rounded cursor-pointer focus:outline-none"
                  title="System Calibration"
                >
                  ⚙️
                </button>

              </div>

              <button
                onClick={handleScrollToTop}
                className="p-2.5 bg-slate-50 hover:bg-[#005a9c] text-slate-500 hover:text-white border border-gray-200 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer group shrink-0"
                aria-label="Scroll back to top"
                id="scroll-to-top"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
