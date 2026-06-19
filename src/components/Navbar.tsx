import React, { useState } from 'react';
import { Menu, X, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  onOpenAccountClick: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onManagerClick: () => void;
  currentView?: string;
}

export default function Navbar({ onOpenAccountClick, currentUser, onLogout, onManagerClick, currentView = 'public' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignInClick = () => {
    if (typeof (window as any).showView === 'function') {
      (window as any).showView('login');
    } else {
      const element = document.getElementById('mock-portal');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCloseMenuAndEnroll = () => {
    setIsOpen(false);
    onOpenAccountClick();
  };

  const handleCloseMenuAndScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 text-[#001c3d] shadow-sm font-sans transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Hamburger menu icon */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 -ml-2 text-[#001c3d] hover:bg-gray-50 rounded-full focus:outline-none transition-colors cursor-pointer"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-6 h-6 animate-fade-in" />
            </button>
          </div>

          {/* Center Side: Stylized "Capital One" logo with the red swoosh */}
          <div 
            className="flex items-center justify-center cursor-pointer select-none py-1 group/logo relative"
            onClick={() => {
              if (typeof (window as any).showView === 'function') {
                (window as any).showView('public');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="relative flex items-center pr-10">
              <span className="text-xl font-extrabold italic tracking-tighter text-[#001c3d] font-sans">
                capital<span className="text-[#004879] font-sans">one</span>
              </span>
              
              {/* Precision Curved red swoosh overlay */}
              <svg 
                className="absolute bottom-1 right-1 w-10 h-3.5 text-[#d22e1e] transform group-hover/logo:scale-105 transition-transform" 
                viewBox="0 0 100 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 25 C 28 4, 76 4, 98 9 C 72 7, 30 14, 5 25 Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Right Side: "Sign In" text with a small profile person icon */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-600">
                  Hi, {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-[#001c3d] hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-full transition text-xs font-bold leading-none cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignInClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-gray-50 text-[#004879] hover:text-[#003154] font-bold text-xs uppercase tracking-wider rounded-full border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-[#004879]" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Full-Screen Drawer overlay replicating Image 1 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex overflow-hidden">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#000a14]/60 backdrop-blur-sm transition-opacity"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#001c3d] text-white flex flex-col justify-between shadow-2xl h-full p-6 sm:p-8 overflow-y-auto"
            >
              {/* Header inside drawer */}
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-white/10">
                  <div className="relative flex items-center pr-10">
                    <span className="text-xl font-extrabold italic tracking-tighter text-white font-sans">
                      capital<span className="text-[#a5cbf0] font-sans">one</span>
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

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation content links */}
                <div className="py-8 space-y-6 font-sans">
                  <button
                    onClick={() => handleCloseMenuAndScroll('features')}
                    className="w-full text-left font-bold text-lg hover:text-[#a5cbf0] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Credit Cards</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => handleCloseMenuAndScroll('features')}
                    className="w-full text-left font-bold text-lg hover:text-[#a5cbf0] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Checking & Savings</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => handleCloseMenuAndScroll('features')}
                    className="w-full text-left font-bold text-lg hover:text-[#a5cbf0] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Auto</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => handleCloseMenuAndScroll('features')}
                    className="w-full text-left font-bold text-lg hover:text-[#a5cbf0] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Business</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => handleCloseMenuAndScroll('features')}
                    className="w-full text-left font-bold text-lg hover:text-[#a5cbf0] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Commercial</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  
                  {!currentUser && (
                    <button
                      onClick={handleCloseMenuAndEnroll}
                      className="w-full mt-6 py-3 px-5 text-center bg-transparent border border-white/30 hover:border-white text-sm font-bold rounded-full transition-all cursor-pointer"
                    >
                      Onboard Account Node
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom footer section inside Drawer showing HIDDEN Manager Portal ONLY on Public View without active logins */}
              <div className="pt-8 border-t border-white/10 font-sans">
                {currentView === 'public' && !currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onManagerClick();
                    }}
                    className="w-full text-left text-xs font-semibold text-[#c5a059] hover:text-[#dfcba5] transition uppercase tracking-widest flex items-center gap-2 cursor-pointer py-2 hover:bg-white/5 px-2 rounded-lg"
                    title="Access Ledger Administrative System"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Manager Portal</span>
                  </button>
                ) : (
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest text-left">
                    Sovereign Secure Custody Enclave
                  </p>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
