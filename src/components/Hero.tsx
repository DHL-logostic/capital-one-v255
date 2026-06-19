import React from 'react';
import { Sparkles, Heart, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  const triggerSignIn = () => {
    if (typeof (window as any).showView === 'function') {
      (window as any).showView('login');
    } else {
      const element = document.getElementById('mock-portal');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 border-b border-gray-100 font-sans">
      
      {/* Hero Banner Grid Background */}
      <div className="relative h-[480px] lg:h-[620px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-95" />
        
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          
          {/* Main Floating Content Card Overlay (placed relative for mobile & desktop layouts) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white text-[#001c3d] rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md border border-slate-100 relative z-20"
            style={{ borderRadius: '16px' }}
          >
            <span className="text-[10px] font-mono tracking-[0.2em] font-black text-slate-400 block mb-2 uppercase">
              SEE IF YOU&apos;RE PRE-APPROVED
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#001c3d] leading-none mb-3 font-sans">
              Take charge of your credit
            </h1>
            
            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
              Find the right card for you, anytime. See if you&apos;re pre-approved in seconds. No impact on your credit score.
            </p>
            
            <button
              onClick={triggerSignIn}
              className="w-full py-3.5 bg-[#004879] hover:bg-[#003154] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
            >
              Get started
            </button>
          </motion.div>

        </div>
      </div>

      {/* Massive White Space to separate Sections exactly as requested */}
      <div className="py-20 lg:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        
        {/* Topic Selector Block */}
        <div className="text-center space-y-8">
          
          <div className="space-y-1">
            <h3 className="text-[11px] font-mono font-black text-[#c5a059] tracking-[0.25em] uppercase">
              EXPLORE OPPORTUNITIES
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001c3d] tracking-tight">
              CHOOSE A TOPIC
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 pt-2">
            
            {/* Massive blue pill-button matching Capital One 360 visual standards */}
            <button
              onClick={triggerSignIn}
              className="px-10 py-5 bg-[#004879] hover:bg-[#003154] text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-full transition shadow-xl transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Meet Capital One 360</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Sub-options with icons to complete requirements */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
              
              <button 
                onClick={triggerSignIn}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 rounded-full transition text-slate-600 hover:text-[#004879] cursor-pointer"
              >
                <div className="p-1.5 bg-red-50 text-[#d22e1e] rounded-full">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Financial wellness</span>
              </button>

              <div className="hidden sm:block h-4 w-px bg-slate-200" />

              <button 
                onClick={triggerSignIn}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 rounded-full transition text-slate-600 hover:text-[#004879] cursor-pointer"
              >
                <div className="p-1.5 bg-blue-50 text-[#005a9c] rounded-full">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Built-in benefits</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
