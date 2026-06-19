import React from 'react';
import { Star, MessageSquareCode, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'Managing Director, Sovereign Capital Ltd',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'MV',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      rating: 5,
      comment: "Capital One's 360 Performance Savings has revolutionized our liquidity dispatch. The ledger transparency is unparalleled, making sovereign transfers instant and audited in perfect real-time.",
      date: 'Verified Client Since 2021'
    },
    {
      name: 'Dr. Elara Sterling',
      role: 'Head of Treasury, Aetheris BioHoldings',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'ES',
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      rating: 5,
      comment: "With Capital One, our reserve funds are protected by physical HSM Ledger shielding and statutory compliant nodes. It's the institutional digital ledger solution our enterprise demands.",
      date: 'Verified Client Since 2023'
    },
    {
      name: 'Kenji Takahashi',
      role: 'Chief Technology Officer, Nexus Global Tranz',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'KT',
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      rating: 5,
      comment: "Our global operations require flawless asset orchestration. The pre-approval workflows and lifestyle benefits of our Venture X accounts are outstanding. This is institutional finance engineered correctly.",
      date: 'Verified Client Since 2022'
    }
  ];

  return (
    <section id="testimonials" className="bg-[#f8fafc] text-[#001c3d] font-sans py-24 border-t border-gray-100 relative overflow-hidden">
      
      {/* Background Subtle Accent Grids */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-50" />
      <div className="absolute inset-y-0 right-0 w-96 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-[0.25em] font-black text-[#004879] block mb-3 uppercase bg-[#004879]/5 border border-[#004879]/10 rounded-full px-3 py-1 w-max mx-auto">
            Client Perspectives
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#001c3d] mb-4">
            Trusted by Leaders of Enterprises
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            How institutions, treasury heads, and premium clients leverage our elite performance yields and digital ledger protection.
          </p>
        </div>

        {/* Testimonials Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(0,28,61,0.08)' }}
              className="bg-white border border-slate-150-alt border-slate-100 p-8 flex flex-col justify-between relative transition-all duration-300 shadow-sm"
              style={{ borderRadius: '16px' }}
              id={`testimonial-${idx + 1}`}
            >
              {/* Card Quote Decorator */}
              <div className="absolute top-6 right-8 text-slate-100 pointer-events-none">
                <Quote className="w-10 h-10 transform rotate-180" strokeWidth={1.5} />
              </div>

              <div>
                {/* Star Ratings */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-[#c5a059] text-[#c5a059]" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-8 font-medium font-sans">
                  "{t.comment}"
                </p>
              </div>

              {/* User Bio Footer */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="relative shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if unsplash changes or goes down
                      e.currentTarget.style.display = 'none';
                      const fallback = document.getElementById(`fallback-avatar-${idx}`);
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div
                    id={`fallback-avatar-${idx}`}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold font-mono tracking-tight uppercase bg-slate-100 text-slate-700 border border-slate-200 hidden"
                  >
                    {t.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-white border border-slate-150 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-[#004879] rounded-full" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold text-[#001c3d] tracking-tight truncate">
                    {t.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 font-semibold truncate leading-tight mt-0.5 uppercase">
                    {t.role}
                  </p>
                  <p className="text-[9px] font-extrabold text-[#005a9c] hover:text-[#004879] italic tracking-tight font-sans mt-1">
                    {t.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Concept Notice Disclaimer Flag */}
        <div 
          className="mx-auto max-w-2xl bg-slate-50 border border-slate-200/60 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-center sm:text-left flex-col sm:flex-row"
          style={{ borderRadius: '12px' }}
          id="testimonial-concept-flag"
        >
          <div className="p-2 bg-slate-200/50 rounded-lg text-slate-500 shrink-0 mx-auto">
            <MessageSquareCode className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[9px] font-mono tracking-widest font-black text-slate-400 uppercase bg-slate-200/70 border border-slate-300/40 px-2 py-0.5 rounded">
                Concept Design
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:inline" />
              <span className="text-[10px] font-extrabold text-[#004879] uppercase tracking-wide">
                ApexBank Visual Demonstration
              </span>
            </div>
            <p className="text-slate-500 text-[10.5px] leading-relaxed font-sans font-medium mt-1.5 matches-slate-light">
              This testimonials panel is a high-fidelity mock-up showcasing the interface design and responsive layout layout. All client biographies, identities, quotation records, and visual feedback instances are fictional creations representing future state designs.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
