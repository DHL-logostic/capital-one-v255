import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SecuritySection() {
  const specs = [
    {
      title: 'Physical HSM Ledger Shielding',
      desc: 'All private-key materials and routing coordinates reside within state-isolated Hardware Security Modules (HSM) that zero-out under physical penetration events.'
    },
    {
      title: 'Section 204.2 Statutory Alignment',
      desc: 'Our Interbank Settlement infrastructure operates in flawless synchronization with Statutory Liquidity protocols, ensuring instantaneous clearing validity.'
    },
    {
      title: 'Continuous Cleared Auditing Logs',
      desc: 'On-chain signature verification protocols validate the source and destination nodes of every dispatch command, generating immutable cryptographic audit trails.'
    }
  ];

  return (
    <section id="security" className="py-24 bg-[#001026] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Visual Accent Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Security Panel */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[#001c3d]/60 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-sm relative" style={{ borderRadius: '12px' }}>
              
              {/* Header inside Security Card */}
              <div className="flex items-center gap-3.5 mb-2">
                <div className="p-2.5 bg-[#005a9c]/10 text-[#005a9c] border border-[#005a9c]/20 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-[#005a9c] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
                    CAPITAL ONE STANDARD
                  </h3>
                  <p className="text-[9px] text-[#c5a059] font-mono tracking-widest uppercase font-semibold">CRYPTOGRAPHIC VAULT SECURITY</p>
                </div>
              </div>

              {/* Secure connection logs mimicking extreme safety */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">Node Alignment</span>
                  <span className="text-[#c5a059] font-mono uppercase bg-[#c5a059]/10 py-0.5 px-2 rounded font-semibold text-[10px] border border-[#c5a059]/20">SYNCHRONIZED</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">Key Enclave</span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/20 py-0.5 px-2 rounded font-semibold border border-emerald-900/30">FIPS 140-3 LEVEL 4</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">Verification Index</span>
                  <span className="text-white font-mono text-[10px]">99.999% CLR-VAL</span>
                </div>
              </div>

              {/* Dynamic visual graph displaying simulated security index - highly polished and real */}
              <div className="bg-black/35 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>SSL TRANSACTION HANDSHAKES</span>
                  <span className="text-emerald-400 font-bold">100% SUCCESS RATE</span>
                </div>
                
                {/* Simulated activity bar */}
                <div className="h-6 flex items-end gap-1 px-1 pt-1.5">
                  {[20, 35, 25, 40, 50, 45, 60, 75, 55, 65, 80, 70, 85, 90, 95, 100].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-[#005a9c]/40 to-[#005a9c] rounded-sm transition-all duration-300" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-sans leading-relaxed text-center">
                Automated continuous auditing systems monitor transfer nodes globally to execute Federal Liquidity mandates without performance compromises.
              </p>
            </div>
          </div>

          {/* Core Copy */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            <div className="inline-flex gap-2 bg-[#005a9c]/25 border border-[#005a9c]/40 px-3.5 py-1 rounded-full text-[#c5a059] text-xs font-mono uppercase tracking-wider font-semibold">
              <span>Sovereign Security Protocols</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Ironclad Capital Protection for Sovereign and Private Treasury
            </h2>

            <div className="space-y-6 pt-2">
              {specs.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-[#c5a059] font-mono text-xs font-bold pt-1">
                    0{idx + 1}.
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
