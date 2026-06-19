import React, { useState, useEffect } from 'react';
import { X, Database, Check, Cpu, Trash2, ShieldAlert, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface ManagerConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChange: () => void; // callback to force refresh of authenticated state in parent
}

export default function ManagerConsoleModal({ isOpen, onClose, onStateChange }: ManagerConsoleModalProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'roster' | 'newsletter'>('roster');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState<any | null>(null);
  
  // Balance modification states
  const [customBalance, setCustomBalance] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Ledger Injector State
  const [injectDesc, setInjectDesc] = useState<string>('Direct Deposit - Institutional Payroll');
  const [injectCategory, setInjectCategory] = useState<string>('Payroll / ACH Credit');
  const [injectAmount, setInjectAmount] = useState<string>('150000.00');
  const [injectType, setInjectType] = useState<'credit' | 'debit'>('credit');

  // Compliance Override States
  const [customSettlementAmount, setCustomSettlementAmount] = useState<string>('');
  const [customRegulatoryReason, setCustomRegulatoryReason] = useState<string>('');

  // Load registered users directly from browser storage
  const loadProfiles = () => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      setProfiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubscribers = () => {
    try {
      const stored = localStorage.getItem('capital_newsletter_subscriptions');
      const data = stored ? JSON.parse(stored) : [];
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = (emailToDelete: string) => {
    try {
      const stored = localStorage.getItem('capital_newsletter_subscriptions');
      const data = stored ? JSON.parse(stored) : [];
      const updated = data.filter((item: any) => item.email.toLowerCase() !== emailToDelete.toLowerCase());
      localStorage.setItem('capital_newsletter_subscriptions', JSON.stringify(updated));
      setSubscribers(updated);
      if (selectedSubscriber && selectedSubscriber.email.toLowerCase() === emailToDelete.toLowerCase()) {
        setSelectedSubscriber(null);
      }
      setActionSuccess(`Subscriber ${emailToDelete} successfully removed from dispatch server.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
      loadSubscribers();
      setSelectedUser(null);
      setSelectedSubscriber(null);
      setActiveTab('roster');
      setCustomBalance('');
      setActionSuccess(null);
    }
  }, [isOpen]);

  const handleInjectLedger = (userId: string) => {
    const amt = parseFloat(injectAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive numeric amount.');
      return;
    }
    if (!injectDesc.trim()) {
      alert('Please enter a description/label for the custom ledger entry.');
      return;
    }

    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        const profile = data[idx];
        const finalAmt = injectType === 'credit' ? amt : -amt;
        const newBal = profile.balance + finalAmt;
        
        const newTx = {
          id: `TX-INJ-${Math.floor(10000000 + Math.random() * 90000000)}`,
          description: injectDesc.trim(),
          category: injectCategory.trim() || (injectType === 'credit' ? 'ACH Deposit' : 'Wire Sweeps'),
          amount: finalAmt,
          date: new Date().toISOString().split('T')[0],
          status: 'Settled',
          referenceId: 'NX-' + Math.floor(1000000 + Math.random() * 9000000)
        };

        profile.balance = newBal;
        profile.transactions = [newTx, ...profile.transactions];

        data[idx] = profile;
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(profile);
          setCustomBalance(newBal.toString());
        }

        setActionSuccess(`Injected custom transaction "${injectDesc}" of $${amt.toLocaleString()} successfully!`);
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBalance = (userId: string) => {
    const val = parseFloat(customBalance);
    if (isNaN(val) || val < 0) {
      alert('Please enter a valid balance amount.');
      return;
    }

    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].balance = val;
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        // update chosen local option
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, balance: val });
        }

        setActionSuccess(`Liquidity adjusted in database to $${val.toLocaleString()}`);
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoState = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].transferCount = 0;
        data[idx].isSyncing = false;
        data[idx].syncStartTime = null;
        data[idx].cardStatus = 'Inactive';
        data[idx].amlTriggered = false;
        data[idx].ris = false;
        data[idx].levyStage = 'none';
        delete data[idx].levyTransferAmount;
        delete data[idx].levyFeeAmount;
        delete data[idx].sovereignStage;
        delete data[idx].dispatchTime;
        data[idx].balance = 386076.00; // Reset to default Starting Balance
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(data[idx]);
          setCustomBalance(data[idx].balance.toString());
        }
        
        setActionSuccess("Cleared transfer limit counters & reset database to default values!");
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAmlFailure = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].isSyncing = true;
        // set start time to 5.1 days ago to trigger Day 5 limits instantly
        data[idx].syncStartTime = Date.now() - (5.1 * 24 * 60 * 60 * 1000);
        data[idx].cardStatus = 'Pending Sync';
        data[idx].amlTriggered = true;
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(data[idx]);
        }
        
        setActionSuccess("Triggered Day 5 AML Hold: Security check failed!");
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerClearanceLevy = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].levyStage = 'hold';
        data[idx].levyTransferAmount = 45000;
        data[idx].levyFeeAmount = 1845;
        data[idx].transferCount = (data[idx].transferCount || 0) + 1;
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(data[idx]);
        }
        
        setActionSuccess("Triggered Clearance Levy Hold on $45,000 transfer!");
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerRisLock = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].ris = true;
        data[idx].levyStage = 'ris';
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(data[idx]);
        }
        
        setActionSuccess("Triggered RIS Security Lockout (Revenue Integrity Service)!");
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgradeToSovereign = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].sovereignStage = 'sovereign';
        data[idx].ris = false;
        data[idx].amlTriggered = false;
        data[idx].levyStage = 'none';
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(data[idx]);
        }
        
        setActionSuccess("Bypassed holds and Fast-Tracked account to Sovereign Elite!");
        onStateChange();
        
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserStatus = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        const current = data[idx].status;
        const nextStatus = current === 'Active' ? 'Verification Pending' : 'Active';
        data[idx].status = nextStatus;
        
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, status: nextStatus });
        }
        
        onStateChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveComplianceOverride = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].complianceSettlementAmount = customSettlementAmount ? parseFloat(customSettlementAmount) : undefined;
        data[idx].complianceRegulatoryReason = customRegulatoryReason.trim() || undefined;
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({
            ...selectedUser,
            complianceSettlementAmount: data[idx].complianceSettlementAmount,
            complianceRegulatoryReason: data[idx].complianceRegulatoryReason
          });
        }
        setActionSuccess("Compliance Overrides saved to beneficiary database successfully.");
        onStateChange();
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveNode = (userId: string) => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const data: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = data.findIndex(p => p.id === userId);

      if (idx !== -1) {
        data[idx].cardStatus = 'Active';
        localStorage.setItem('apex_v26', JSON.stringify(data));
        setProfiles(data);
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({
            ...selectedUser,
            cardStatus: 'Active'
          });
        }
        setActionSuccess("Node approved! Virtual card status set to Active Gold.");
        onStateChange();
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Dark backing backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative transform overflow-hidden rounded-2xl bg-[#001c3d] border border-white/10 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl animate-fade-in"
          style={{ borderRadius: '12px' }}
        >
          {/* Top Gold border highlight */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#005a9c] via-[#c5a059] to-[#d22e1e]" />

          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-black/30 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#005a9c]/20 text-[#c5a059] rounded-lg border border-[#005a9c]/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block font-mono uppercase text-white">Capital One 360 Sovereign Console</span>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-semibold">Ledger Override & Port Controls</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Exit Console"
              id="admin-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x md:divide-slate-800 gap-0 min-h-[480px]">
            
            {/* Sidebar list (5 columns) with Tab toggle */}
            <div className="md:col-span-5 p-6 space-y-4 max-h-[520px] overflow-y-auto bg-black/20">
              
              {/* Premium Tab Switcher */}
              <div className="flex p-1 bg-black/45 rounded-xl border border-slate-805">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('roster');
                    setActionSuccess(null);
                  }}
                  className={`flex-1 py-1.5 px-3 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeTab === 'roster' 
                      ? 'bg-[#005a9c] text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Asset Nodes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('newsletter');
                    setActionSuccess(null);
                  }}
                  className={`flex-1 py-1.5 px-3 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeTab === 'newsletter' 
                      ? 'bg-[#005a9c] text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Newsletter ({subscribers.length})
                </button>
              </div>

              {activeTab === 'roster' ? (
                <>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Registered Asset Nodes</h3>
                  <div className="space-y-2.5">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(profile);
                          setCustomBalance(profile.balance.toString());
                          setActionSuccess(null);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left block transition-all cursor-pointer ${
                          selectedUser?.id === profile.id
                            ? 'bg-[#001026] border-[#005a9c] shadow-md text-white'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs uppercase text-slate-200 block truncate max-w-[150px]">
                            {profile.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#c5a059]">
                            {profile.id}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                          <span>Ref Account ID:</span>
                          <span className="font-semibold text-slate-350">{profile.accountNumber}</span>
                        </div>

                        <div className="flex justify-between items-center mt-1 text-[10px] font-mono">
                          <span>Reserve balance:</span>
                          <span className="font-semibold text-emerald-400 font-mono">${profile.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        </div>

                        {profile.isSyncing && (
                          <div className="text-[8px] font-mono font-bold bg-blue-950/50 text-blue-400 border border-blue-900/30 py-0.5 px-2 rounded-sm text-center mt-2.5 uppercase">
                            Sync Active {profile.amlTriggered && "• Day 5 AML Failure"}
                          </div>
                        )}
                      </button>
                    ))}

                    {profiles.length === 0 && (
                       <p className="text-center text-xs text-slate-500 py-12 font-sans">No registered database nodes present.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Subscribed Coordinates</h3>
                  <div className="space-y-2.5">
                    {subscribers.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setSelectedSubscriber(sub);
                          setActionSuccess(null);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left block transition-all cursor-pointer ${
                          selectedSubscriber?.id === sub.id
                            ? 'bg-[#001026] border-[#005a9c] shadow-md text-white'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-slate-200 block truncate max-w-[170px] font-sans">
                            {sub.email}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-[#c5a059] shrink-0">
                            {sub.id}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                          <span>Channels:</span>
                          <span className="font-medium text-slate-300 font-sans truncate max-w-[120px]">{sub.interests.join(', ')}</span>
                        </div>

                        <div className="flex justify-between items-center mt-1 text-[10px] font-mono text-slate-500">
                          <span>Subscribed:</span>
                          <span className="font-semibold text-slate-400">{sub.date}</span>
                        </div>
                      </button>
                    ))}

                    {subscribers.length === 0 && (
                       <p className="text-center text-xs text-slate-500 py-12 font-sans">No dispatch subscribers registered.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Editing actions panel (7 columns) */}
            <div className="md:col-span-7 p-6 text-slate-200 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'roster' ? (
                  selectedUser ? (
                  <motion.div
                    key="action-editor"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[#c5a059] text-[9px] font-mono tracking-widest uppercase block mb-1">SELECTED BENEFICIARY NODE</span>
                      <h4 className="text-lg font-bold text-white tracking-tight">{selectedUser.name}</h4>
                      <p className="text-xs text-slate-400 font-mono uppercase mt-0.5 font-semibold">Account Number: {selectedUser.accountNumber} | User ID: {selectedUser.id}</p>
                    </div>

                    {actionSuccess && (
                      <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>{actionSuccess}</span>
                      </div>
                    )}                    {/* Liquidity Injection block */}
                    <div className="bg-[#001026] p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        <span>Nominee Override: Liquidity Injection</span>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Reserve Balance size ($USD)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="1"
                            value={customBalance}
                            onChange={(e) => {
                              setCustomBalance(e.target.value);
                            }}
                            className="flex-1 bg-black/40 border border-slate-800 p-2.5 text-xs text-white font-mono rounded-lg focus:outline-none focus:border-[#005a9c]"
                          />
                          <button
                            onClick={() => handleUpdateBalance(selectedUser.id)}
                            className="px-4 py-2.5 bg-[#005a9c] hover:bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                          >
                            Update
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCustomBalance('386076.00')}
                            className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-850 px-2 py-1 rounded cursor-pointer"
                          >
                            Preset $386,076.00
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomBalance('50000.00')}
                            className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-850 px-2 py-1 rounded cursor-pointer"
                          >
                            Preset $50,000.00
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Source Injector block */}
                    <div className="bg-[#001026] p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        <span>Nominee Override: Source Injector</span>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <p className="text-[10px] text-slate-400 font-medium">
                          Define and inject a secure "Source of Funds" credit entry directly into the customer's active ledger.
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Source of Funds Description / Name</label>
                            <input
                              type="text"
                              value={injectDesc}
                              onChange={(e) => setInjectDesc(e.target.value)}
                              placeholder="e.g., Direct Deposit - Institutional Payroll"
                              className="w-full bg-black/40 border border-slate-800 p-2.5 text-xs text-white rounded-lg focus:outline-none focus:border-[#005a9c]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Amount ($USD)</label>
                              <input
                                type="number"
                                value={injectAmount}
                                onChange={(e) => setInjectAmount(e.target.value)}
                                className="w-full bg-black/40 border border-slate-800 p-2.5 text-xs text-white font-mono rounded-lg focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Entry Type</label>
                              <select
                                value={injectType}
                                onChange={(e) => setInjectType(e.target.value as 'credit' | 'debit')}
                                className="w-full bg-black/40 border border-slate-800 p-2 text-xs text-white rounded-lg font-semibold focus:outline-none"
                              >
                                <option value="credit">Credit (+)</option>
                                <option value="debit">Debit (-)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleInjectLedger(selectedUser.id)}
                          className="w-full py-2.5 bg-[#005a9c] hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                        >
                          Inject Source of Funds Entry
                        </button>
                      </div>
                    </div>

                    {/* Compliance Override block */}
                    <div className="bg-[#001026] p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        <span>Nominee Override: Compliance Override</span>
                      </div>

                      <div className="space-y-3 text-xs text-slate-300">
                        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                          Manually customize the hold characteristics. The user will see these specific parameters displayed inside their active compliance alerts.
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Custom Settlement Amount ($USD)</label>
                            <input
                              type="number"
                              value={customSettlementAmount}
                              onChange={(e) => setCustomSettlementAmount(e.target.value)}
                              placeholder="e.g., 1789.00"
                              className="w-full bg-black/40 border border-slate-800 p-2.5 text-xs text-white font-mono rounded-lg focus:outline-none"
                            />
                            <p className="text-[8px] text-slate-500 mt-0.5">Leave blank to use default calculated thresholds.</p>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Custom Regulatory Reason / Header</label>
                            <textarea
                              rows={2}
                              value={customRegulatoryReason}
                              onChange={(e) => setCustomRegulatoryReason(e.target.value)}
                              placeholder="e.g., Geolocation Proximity Bond required due to routing node warning."
                              className="w-full bg-black/40 border border-slate-800 p-2.5 text-xs text-white rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleSaveComplianceOverride(selectedUser.id)}
                          className="w-full py-2.5 bg-[#005a9c] hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                        >
                          Save Compliance Override Parameters
                        </button>
                      </div>
                    </div>

                    {/* Activation Toggle & Clearance Override Controls */}
                    <div className="p-5 bg-[#001026] border border-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest font-black">Core Node Activation Toggle</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${selectedUser.cardStatus === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-black">
                            {selectedUser.cardStatus === 'Active' ? 'Active Gold' : 'Restricted Red'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        Execute node approval. Transitions this beneficiary's virtual card from Restricted (Red) to Active (Gold) immediately.
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveNode(selectedUser.id)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Node</span>
                        </button>
                      </div>
                    </div>

                    {/* Authorized Administrative Action Overrides */}
                    <div className="p-5 bg-black/40 border border-slate-800 rounded-xl space-y-4">
                      <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest font-black">Direct Stage Injection Overrides</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Day 5 Direct Trigger */}
                        <button
                          onClick={() => handleTriggerAmlFailure(selectedUser.id)}
                          className="p-3 bg-red-950/20 text-red-400 hover:text-white border border-red-900/30 hover:bg-red-900/50 rounded-xl text-left transition text-xs flex flex-col justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold uppercase font-mono text-[10px]">Trigger Day 5 AML Hold</span>
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-normal leading-tight">Force the client sync pipeline into AML Hold, locking the card instantly.</span>
                        </button>

                        {/* Clearance Levy Hold Trigger */}
                        <button
                          onClick={() => handleTriggerClearanceLevy(selectedUser.id)}
                          className="p-3 bg-blue-950/20 text-blue-400 hover:text-white border border-blue-900/30 hover:bg-blue-900/50 rounded-xl text-left transition text-xs flex flex-col justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold uppercase font-mono text-[10px]">Trigger Clearance Hold</span>
                            <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0 animate-pulse" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-normal leading-tight font-sans">Simulate direct hold on a pending $45,000 transaction.</span>
                        </button>

                        {/* RIS Lockout Trigger */}
                        <button
                          onClick={() => handleTriggerRisLock(selectedUser.id)}
                          className="p-3 bg-amber-950/20 text-amber-400 hover:text-white border border-amber-900/30 hover:bg-amber-900/50 rounded-xl text-left transition text-xs flex flex-col justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold uppercase font-mono text-[10px]">Trigger RIS lockout</span>
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-normal leading-tight font-sans">Directly place client node under RIS control, blocking outbound wire channels.</span>
                        </button>

                        {/* Sovereign Upgrade Fast-Track */}
                        <button
                          onClick={() => handleUpgradeToSovereign(selectedUser.id)}
                          className="p-3 bg-emerald-950/20 text-emerald-400 hover:text-white border border-emerald-900/30 hover:bg-emerald-900/50 rounded-xl text-left transition text-xs flex flex-col justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold uppercase font-mono text-[10px]">Sovereign Upgrade</span>
                            <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0 close" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-normal leading-tight font-sans">Elevate client node status to Sovereign Elite, unblocking locks immediately.</span>
                        </button>

                        {/* Reset state */}
                        <button
                          onClick={() => handleResetDemoState(selectedUser.id)}
                          className="p-3 bg-[#0d1527] text-slate-350 hover:text-white border border-slate-800 hover:bg-slate-800 rounded-xl text-left transition text-xs flex flex-col justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold uppercase font-mono text-[10px]">Clear System Sync</span>
                            <Trash2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-normal leading-tight font-sans">Reset transfer counters, revert card status, and restore available vault currency.</span>
                        </button>
                      </div>
                    </div>

                    {/* Administrative Toggle state overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-black/35 p-4 rounded-xl border border-slate-800 space-y-2">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Patriot Act Override</p>
                        <div className="flex justify-between items-center bg-black/20 p-2.5 rounded border border-slate-900">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{selectedUser.status}</span>
                          <button
                            onClick={() => toggleUserStatus(selectedUser.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
                          >
                            Toggle Hold
                          </button>
                        </div>
                      </div>

                      <div className="bg-black/35 p-4 rounded-xl border border-slate-800 space-y-2">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Administrative Source Pipeline</p>
                        <div className="flex justify-between items-center bg-black/20 p-2.5 rounded border border-slate-900">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">SECURE CHANNEL</span>
                          <span className="text-[9px] text-[#c5a059] font-mono font-black py-0.5 px-2 bg-[#c5a059]/10 rounded border border-[#c5a059]/10 uppercase">NOMINEE SYNC</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-950/20 border border-blue-900/20 text-blue-400 text-[10px] rounded-lg font-mono leading-relaxed font-bold">
                      💡 EXECUTIVE OVERRIDE PORTAL: Nominee Overrides propagate to the live environment in real-time. Target browsers running authenticated sessions will sync changes credit lines and thresholds instantaneously.
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
                    <Database className="w-12 h-12 text-slate-700 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-400">No Asset Node Selected</p>
                    <p className="text-xs max-w-xs leading-relaxed font-sans font-medium">Choose an active registered client from the sidebar roster to modify liquidity balances or edit compliance clearance status overrides.</p>
                  </div>
                ) ) : (
                  // Subscriber Management Panel
                  selectedSubscriber ? (
                    <motion.div
                      key="selected-editor-subscriber"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6 text-left"
                    >
                      <div>
                        <span className="text-[#c5a059] text-[9px] font-mono tracking-widest uppercase block mb-1 font-bold">REGISTERED DISPATCH ADAPTER</span>
                        <h4 className="text-xl font-bold text-white tracking-tight break-all font-sans">{selectedSubscriber.email}</h4>
                        <p className="text-xs text-slate-400 font-mono uppercase mt-1 font-semibold">Subscriber Reference ID: {selectedSubscriber.id} | Status: {selectedSubscriber.status}</p>
                      </div>

                      {actionSuccess && (
                        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{actionSuccess}</span>
                        </div>
                      )}

                      {/* Active channels summary */}
                      <div className="bg-black/35 p-5 rounded-xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                          <span>Configured Transmission Streams</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedSubscriber.interests.map((topic: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-lg text-[10.5px] text-[#c5a059] font-mono uppercase font-black">
                              {topic}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono text-slate-450">
                          <span>Integration Date:</span>
                          <span className="text-slate-300 font-bold">{selectedSubscriber.date}</span>
                        </div>
                      </div>

                      {/* Deletion control */}
                      <div className="bg-black/35 p-5 rounded-xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-455 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>Administrative Purging Controller</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          Revoking subscription access instantly terminates any scheduled automated market updates, yield optimization forecasts and compliance alerts being transmitted to this client&apos;s terminal node.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            handleDeleteSubscriber(selectedSubscriber.email);
                          }}
                          className="w-full py-3 bg-rose-955/20 hover:bg-rose-900 border border-rose-900/30 hover:border-rose-500 text-rose-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl transition cursor-pointer font-extrabold"
                        >
                          Revoke and Purge Subscriber Address
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
                      <Mail className="w-12 h-12 text-slate-700 animate-pulse" />
                      <p className="text-sm font-semibold text-slate-400 font-sans">No Dispatch Subscriber Selected</p>
                      <p className="text-xs max-w-xs leading-relaxed font-sans font-medium">Select a registered secure corporate newsletter coordinate from the left panel roster to audit active transmission preferences or execute system purge protocols.</p>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
