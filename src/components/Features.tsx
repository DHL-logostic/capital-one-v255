import React from 'react';
import { CreditCard, PiggyBank, Car, Key, Smartphone, ArrowRight, ChevronRight, ShoppingBag, Coffee, Plane } from 'lucide-react';
import { motion } from 'motion/react';

export default function Features() {
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
    <section id="features" className="bg-white text-[#001c3d] font-sans">
      
      {/* SECTION 1: CORE OFFERINGS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-widest font-black text-slate-400 block mb-2 uppercase">Core Offerings</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#001c3d]">Built to support your financial journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Offering 1: Credit Cards */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderRadius: '14px' }}
          >
            <div>
              <div className="w-12 h-12 bg-blue-50 text-[#004879] rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-extrabold text-[#001c3d] mb-2 font-sans">Explore card offers</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                See if you&apos;re eligible for credit card offers with our pre-approval tool. Find rewards and premium privileges.
              </p>
            </div>
            <button 
              onClick={triggerSignIn}
              className="text-xs font-bold text-[#004879] hover:text-[#002f52] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Offers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Offering 2: Piggy Bank Checking */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderRadius: '14px' }}
          >
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#001c3d] mb-2 font-sans">Bank with confidence</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Enjoy no fees or minimums for checking and savings accounts. High interest premium yields on performance node safes.
              </p>
            </div>
            <button 
              onClick={triggerSignIn}
              className="text-xs font-bold text-[#004879] hover:text-[#002f52] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Compare savings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Offering 3: Find a car you love */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderRadius: '14px' }}
          >
            <div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <Car className="w-6 h-6 shrink-0" />
                  <Key className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-amber-700 bg-amber-50 rounded" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-[#001c3d] mb-2 font-sans">Find a car you love</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Shop cars and pre-qualify for financing with Auto Navigator. Customized schedules matching credit score thresholds.
              </p>
            </div>
            <button 
              onClick={triggerSignIn}
              className="text-xs font-bold text-[#004879] hover:text-[#002f52] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Auto Navigator</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* SECTION 2: PROMOTIONAL BANNERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Paze Promo Banner */}
          <div 
            className="bg-[#fafafa] border border-gray-100 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            style={{ borderRadius: '16px' }}
          >
            <div className="h-48 sm:h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80')" }}>
              <div className="w-full h-full bg-black/10" />
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest font-extrabold text-[#005a9c] uppercase bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded inline-block">PAZE® SPECIALS</span>
                <h3 className="text-2xl font-extrabold text-[#001c3d]">Save with Paze®</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Now integrated inside Capital One checkout workflows. Shop with participating retailers online to apply seamless promotional codes and secure 30% off offers automatically.
                </p>
              </div>
              <div className="pt-6">
                <button 
                  onClick={triggerSignIn}
                  className="px-6 py-3 bg-[#004879] hover:bg-[#003154] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition shadow cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  Save with Paze
                </button>
              </div>
            </div>
          </div>

          {/* Digital Tools Built For Ease */}
          <div 
            className="bg-[#001c3d] text-white overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative"
            style={{ borderRadius: '16px' }}
          >
            {/* Background smartphone picture */}
            <div className="h-48 sm:h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80')" }}>
              <div className="w-full h-full bg-[#001026]/40 backdrop-brightness-75" />
            </div>

            <div className="p-8 sm:p-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest font-extrabold text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded inline-block">DIGITAL TOOLS BUILT FOR EASE</span>
                <h3 className="text-2xl font-extrabold text-white">Anytime account access</h3>
                <p className="text-xs text-slate-350 leading-relaxed">
                  Monitor locks, private security vectors, and balance assets on the go. High fidelity transactions and push confirmation notifications are synchronized across your smartphone enclaves instantly.
                </p>
              </div>
              <div className="pt-6">
                <button 
                  onClick={triggerSignIn}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-[#001c3d] font-extrabold text-xs uppercase tracking-widest rounded-full transition shadow cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  Download App
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: MORE THAN A BANK ECOSYSTEM CARD GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-widest font-black text-slate-400 block mb-2 uppercase">LIFESTYLE BENEFITS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#001c3d]">More than a bank ecosystem</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">Every account is fully locked for extreme cyber security, yet opens beautiful lifestyle rewards.</p>
        </div>

        {/* 3-Row Beautiful Horizontal-Sized Responsive Card Grid */}
        <div className="space-y-6">
          
          {/* Card 1: Capital One Shopping */}
          <div 
            className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch"
            style={{ borderRadius: '16px' }}
          >
            <div className="w-full sm:w-1/3 min-h-[160px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80')" }} />
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2 text-[#005a9c]">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Capital One Shopping</span>
              </div>
              <h4 className="text-lg font-extrabold text-[#001c3d]">Instant automated checkout savings</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl">
                Automatically apply free coupons and save with price drop notifications inside browser checks. Real-time scanning ensures no discounts are omitted.
              </p>
            </div>
          </div>

          {/* Card 2: Capital One Cafes */}
          <div 
            className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch"
            style={{ borderRadius: '16px' }}
          >
            <div className="w-full sm:w-1/3 min-h-[160px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80')" }} />
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <Coffee className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Capital One Cafes</span>
              </div>
              <h4 className="text-lg font-extrabold text-[#001c3d]">Work, meet up, and collaborate</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl">
                Enjoy free Wi-Fi & cozy spaces. Registered cardholders get a permanent 50% off handcrafted beverages across any cafe workspace nationwide.
              </p>
            </div>
          </div>

          {/* Card 3: Capital One Travel */}
          <div 
            className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch"
            style={{ borderRadius: '16px' }}
          >
            <div className="w-full sm:w-1/3 min-h-[160px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80')" }} />
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2 text-teal-600">
                <Plane className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Capital One Travel</span>
              </div>
              <h4 className="text-lg font-extrabold text-[#001c3d]">Your ticket to premium rewards</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl">
                Earn rewards when you book a flight, hotel or car with an eligible card. Complete high-status loyalty levels with built-in traveler insurances.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
