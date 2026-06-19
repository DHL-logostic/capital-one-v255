import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>(['Yield & APY Alerts', 'Market Analysis']);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableTopics = [
    { id: 'yield', label: 'Yield & APY Alerts' },
    { id: 'market', label: 'Market Analysis' },
    { id: 'fiduciary', label: 'Fiduciary Audits' },
    { id: 'regulatory', label: 'Regulation 88-R' }
  ];

  const toggleInterest = (label: string) => {
    if (interests.includes(label)) {
      setInterests(interests.filter(i => i !== label));
    } else {
      setInterests([...interests, label]);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Electronic address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid electronic mail coordinates.');
      return;
    }

    if (interests.length === 0) {
      setError('Please select at least one intelligence stream preference.');
      return;
    }

    setLoading(true);

    // Simulate luxury blockchain ledger register speed
    setTimeout(() => {
      try {
        const existingRaw = localStorage.getItem('capital_newsletter_subscriptions');
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        
        // Prevent duplicate subscriptions
        const exists = list.some((item: any) => item.email.toLowerCase() === email.toLowerCase());
        
        if (!exists) {
          const newSubscription = {
            id: `SUB-${Math.floor(100000 + Math.random() * 900000)}`,
            email: email.trim(),
            interests: [...interests],
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            status: 'Verified'
          };
          list.unshift(newSubscription);
          localStorage.setItem('capital_newsletter_subscriptions', JSON.stringify(list));
        }

        setSuccess(true);
        setEmail('');
      } catch (err) {
        console.error(err);
        setError('Encryption protocol failure. Please retry.');
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div 
      id="newsletter-subscription-container"
      className="bg-gradient-to-br from-[#001c3d] via-[#002e62] to-[#010c1c] text-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-[#c5a059]/30 mb-12"
    >
      {/* Visual background details - safe brand alignments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(0,90,156,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-16">
        
        {/* Pitch & Branding */}
        <div className="flex-1 flex flex-col justify-between text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-full text-[#c5a059] text-[10px] font-mono tracking-widest uppercase mb-5 font-bold">
              <Sparkles className="w-3 h-3 text-[#c5a059]" />
              <span>Sovereign Intel Dispatch</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4 leading-tight font-sans">
              Stay Ahead of Capital Markets
            </h3>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-sans font-medium">
              Subscribe to the secure Capital One 360 newsletter to secure premium yield adjustments forecasts, fiduciaries audit findings, and central bank compliance announcements. 
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60 hidden lg:block">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-2.5">INTEGRATED PIPELINE CHANNELS:</span>
            <div className="flex flex-wrap gap-4 text-[10.5px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Secure Transport</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Promotion Spam</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Standard cryptographic integrity</span>
            </div>
          </div>
        </div>

        {/* Subscription Interactive Terminal */}
        <div className="w-full lg:w-[460px] flex flex-col justify-center bg-black/30 border border-slate-800/40 p-5 md:p-7 rounded-2xl relative">
          
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="subscription-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe} 
                className="space-y-5 text-left"
              >
                {/* Interest checkboxes */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide font-extrabold block">Select Stream Subscriptions:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTopics.map((topic) => {
                      const isActive = interests.includes(topic.label);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleInterest(topic.label)}
                          className={`py-2 px-3 border rounded-xl text-[11px] font-sans font-semibold text-left transition-all ${
                            isActive
                              ? 'bg-[#c5a059]/10 border-[#c5a059] text-white shadow-sm'
                              : 'bg-black/25 border-slate-800/80 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{topic.label}</span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-1.5 ${
                              isActive ? 'border-[#c5a059] bg-[#c5a059]' : 'border-slate-700 bg-transparent'
                            }`}>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#001c3d]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="space-y-1.5">
                  <label htmlFor="newsletter-email" className="text-[10px] font-mono text-slate-400 uppercase tracking-wide font-extrabold block">
                    Secure Electronic Mail Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="e.g. client@fiduciary-firm.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl py-3 pl-10 pr-12 text-sm text-white font-sans placeholder-slate-500 focus:outline-none focus:border-[#c5a059]/80 focus:ring-1 focus:ring-[#c5a059]/40 transition"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#c5a059] hover:bg-[#b08e4b] active:scale-95 text-[#001c3d] font-bold px-3.5 rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-50"
                      aria-label="Submit subscription"
                    >
                      {loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#001c3d] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-950/40 border border-red-900/30 text-rose-400 text-[11px] rounded-xl flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </motion.form>
            ) : (
              <motion.div 
                key="subscription-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 flex flex-col items-center justify-center space-y-4"
              >
                {/* Gold Success Stamp System */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#c5a059]/20 blur-xl rounded-full scale-125 animate-pulse" />
                  <div className="w-16 h-16 rounded-full border-2 border-[#c5a059] bg-[#001c3d] flex items-center justify-center relative z-10 text-[#c5a059] shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1.5 select-none text-center">
                  <h4 className="text-base font-extrabold text-[#c5a059] uppercase tracking-wider font-mono">
                    ✓ SECURED DISPATCH CONFIRMED
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-[320px] mx-auto">
                    Your institutional electronic mail account has been verified and registered on our dispatch server ledger.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 w-full flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-450 uppercase font-extrabold block">ACTIVE STREAMS:</span>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                    {interests.map((it, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-black/50 border border-slate-800 rounded font-mono text-[9px] text-[#c5a059] uppercase font-bold">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-[10px] font-bold font-mono text-slate-400 hover:text-white uppercase tracking-widest underline transition decoration-slate-600 hover:decoration-white focus:outline-none cursor-pointer"
                >
                  Register Another Email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
