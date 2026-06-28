import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck, Clock, 
  CreditCard, Send, CheckCircle2, AlertTriangle, Fingerprint, 
  RefreshCw, Landmark, Eye, EyeOff, User, KeyRound, Download, ShieldAlert, Cpu, Award, Lock, Check, Bell,
  LogOut, Settings, Menu, X, ChevronRight, FileText, Building2, Briefcase, Car, HelpCircle, Phone, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, UserProfile } from '../types';
import { generateHistoricalTransactions, generateCardNumber } from '../utils';
import { FintechTransactionComponent } from './FintechTransactionComponent';

interface WealthConsoleProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenManager?: () => void;
}

const GLOBAL_BANKS = [
  "Chase Bank", "Wells Fargo", "Bank of America", "TD Bank", "Scotiabank", "Citibank", "Capital One", "PNC Bank", "US Bank", "Truist", 
  "DBS Bank", "ICBC", "Standard Bank", "FirstBank Nigeria", "Zenith Bank", "UBA", "KCB Bank", "Standard Chartered", "Absa", "Ecobank",
  "HSBC", "Barclays", "Deutsche Bank", "BNP Paribas", "Santander", "UniCredit", "SEB", "Millennium BCP", "Credit Suisse", "UBS"
].sort();

export default function DemoPortal({ currentUser, onLoginSuccess, onLogout, onOpenManager }: WealthConsoleProps) {
  // Institutional Notification Node States
  const [alerts, setAlerts] = useState<Array<{ id: string; title: string; message: string; type: string; timestamp: Date }>>([]);
  const [iosNotifications, setIosNotifications] = useState<Array<{ id: string; title: string; subtitle: string; body: string; time?: string; iconType?: 'success' | 'warning' | 'error' }>>([]);
  const [unreadAlerts, setUnreadAlerts] = useState<string[]>([]);
  const [bellHistoryOpen, setBellHistoryOpen] = useState(false);
  const prevUserRef = useRef<UserProfile | null>(null);

  const pushIosNotification = (title: string, subtitle: string, body: string, iconType?: 'success' | 'warning' | 'error') => {
    const id = `ios-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newNote = { id, title, subtitle, body, time: 'now', iconType };
    setIosNotifications(prev => [newNote, ...prev]);
    setTimeout(() => {
      setIosNotifications(prev => prev.filter(n => n.id !== id));
    }, 5200);
  };

  const pushInstitutionalAlert = (title: string, message: string, type: 'success' | 'success_blue' | 'warning' | 'error') => {
    const newId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newAlert = {
      id: newId,
      title,
      message,
      type,
      timestamp: new Date()
    };
    setAlerts(prev => [...prev, newAlert]);
    setUnreadAlerts(prev => [...prev, newId]);
    
    // Auto Dismiss after 6 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== newId));
    }, 6000);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setUnreadAlerts(prev => prev.filter(uid => uid !== id));
  };

  // Expose pushInstitutionalAlert globally for administrative overlays and support control
  useEffect(() => {
    (window as any).pushInstitutionalAlert = (title: string, message: string, type: 'success' | 'success_blue' | 'warning' | 'error') => {
      pushInstitutionalAlert(title, message, type);
    };
    return () => {
      delete (window as any).pushInstitutionalAlert;
    };
  }, []);

  // Automatic Real-Time Alert Triggers: Sign-In
  useEffect(() => {
    if (currentUser) {
      const sessionFlag = `login_alert_triggered_${currentUser.id}`;
      if (!sessionStorage.getItem(sessionFlag)) {
        setTimeout(() => {
          pushInstitutionalAlert(
            "Secure Access",
            `Established interbank node connection for ${currentUser.name}.`,
            'success'
          );
        }, 1200);
        sessionStorage.setItem(sessionFlag, 'true');
      }
    }
  }, [currentUser?.id]);

  // Automatic Real-Time Alert Triggers: Admin/Manager Update
  useEffect(() => {
    if (currentUser) {
      if (prevUserRef.current && prevUserRef.current.id === currentUser.id) {
        const prev = prevUserRef.current;
        const balanceChanged = currentUser.balance !== prev.balance;
        const amlChanged = currentUser.amlTriggered !== prev.amlTriggered;
        const risChanged = currentUser.ris !== prev.ris;
        const levyStageChanged = currentUser.levyStage !== prev.levyStage;
        const sovereignStageChanged = currentUser.sovereignStage !== prev.sovereignStage;
        
        if (balanceChanged || amlChanged || risChanged || levyStageChanged || sovereignStageChanged) {
          // If the balance changed, only trigger synchronization if it was an increase
          // and not from refund (refund handles its own alert)
          if (currentUser.balance > prev.balance && currentUser.levyStage !== 'refunded') {
            pushInstitutionalAlert(
              "Node Synchronized",
              "Institutional liquidity injection verified.",
              'success'
            );
          } else if (amlChanged || risChanged || levyStageChanged || sovereignStageChanged) {
            pushInstitutionalAlert(
              "Node Synchronized",
              "Institutional liquidity injection verified.",
              'success'
            );
          }
        }
      }
      prevUserRef.current = currentUser;
    }
  }, [currentUser]);

  // Navigation tabs and responsive states
  const [navTab, setNavTab] = useState<'summary' | 'transfer' | 'cards' | 'auto' | 'business' | 'commercial' | 'settings' | 'certifications'>('summary');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Download Receipt Statement handler
  const handleDownloadSelectedReceipt = (tx: Transaction) => {
    const statement = `
============================================================
              CAPITAL ONE INSTITUTIONAL 360
               OFFICIAL TRANSACTION RECEIPT
============================================================
Receipt ID:       ${tx.id}
Date:             ${tx.date}
Transaction Type: Online Domestic Clearance
Status:           Cleared (Settled)

SENDER ACCOUNT PARAMETERS:
  Institution:    Capital One Private Banking
  Account Holder: ${currentUser?.name || 'Sovereign Client'}
  Account Number: ${currentUser?.accountNumber || 'NX-Pending'}

BENEFICIARY TARGET DISPATCH:
  Receiving Bank: ${bankName || 'Interbank Intermediary'}
  Account Name:   ${destName || 'Institutional Client'}
  Account Number: ${destAccount || 'Account/SWIFT'}

TRANSACTION VALUATION:
  Description:    ${tx.description}
  Category:       ${tx.category}
  Total Principal: $${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
  Direction:      ${tx.amount > 0 ? "Credit (+)" : "Debit (-)"}

============================================================
             STANDARD SECURE VERIFIED LEDGER
============================================================
    `;
    const blob = new Blob([statement], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CapitalOne_Receipt_${tx.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sort top entries
  const displayedTransactions = useMemo(() => {
    if (!currentUser) return [];
    
    // Find the two high value transactions
    const cryptoTx = currentUser.transactions?.find(t => t.description?.includes('Crypto-Asset Liquidation'));
    const treasuryTx = currentUser.transactions?.find(t => t.description?.includes('Corporate Treasury') || t.description?.includes('Premiums Corporate Treasury'));
    
    const remaining = currentUser.transactions?.filter(t => t.id !== cryptoTx?.id && t.id !== treasuryTx?.id) || [];
    
    const sorted: Transaction[] = [];
    if (cryptoTx) sorted.push(cryptoTx);
    if (treasuryTx) sorted.push(treasuryTx);
    
    return [...sorted, ...remaining];
  }, [currentUser?.transactions]);

  // Login credentials states
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Transfer Forms states
  const [bankName, setBankName] = useState('');
  const [destAccount, setDestAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferError, setTransferError] = useState<string | null>(null);

  // 3-Step Wizard additional states
  const [transferStep, setTransferStep] = useState<'step-1' | 'step-2' | 'step-3'>('step-1');
  const [currentCalculatedFee, setCurrentCalculatedFee] = useState<number>(0);
  const [destName, setDestName] = useState('');
  const [isVerifyingNodes, setIsVerifyingNodes] = useState(false);
  const [nodeConfirmed, setNodeConfirmed] = useState(false);

  // Success Clearing state
  const [clearingState, setClearingState] = useState<{
    referenceId: string;
    amount: number;
    bankName: string;
    destAccount: string;
  } | null>(null);

  // Security Intercept Overlays
  const [showProtocol702, setShowProtocol702] = useState(false);
  const [showSyncOverlay, setShowSyncOverlay] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);

  // Clearance Levy States
  const [hasUploadedLevyProof, setHasUploadedLevyProof] = useState(false);
  const [isLevyVerifying, setIsLevyVerifying] = useState(false);
  const [showMismatchAlert, setShowMismatchAlert] = useState(false);
  const [remediationFee, setRemediationFee] = useState<number>(() => {
    return Math.floor(Math.random() * (5264 - 2708 + 1)) + 2708;
  });
  
  // Custom Name & Password Sync State
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginIdInput, setLoginIdInput] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);

  // Sovereign / Reconciliation Simulation states
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationTimeLeft, setReconciliationTimeLeft] = useState(45);
  const [reconciliationLogs, setReconciliationLogs] = useState<string[]>([]);
  const [hasUploadedRisProof, setHasUploadedRisProof] = useState(false);
  const [isRisUploading, setIsRisUploading] = useState(false);
  const [sovereignTimer, setSovereignTimer] = useState<number>(172800); // 48 hours in seconds

  // Session Lock States
  const [sessionTimer, setSessionTimer] = useState<number>(180); // 3 minutes = 180 seconds
  const [isSiteLocked, setIsSiteLocked] = useState<boolean>(false);

  // Trigger seed of BXMX208 on render
  useEffect(() => {
    try {
      const stored = localStorage.getItem('apex_v26');
      const seeded = localStorage.getItem('apex_v26_seeded');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const targetUserId = 'BXMX208';
      const defaultExists = profiles.find(p => p.id.toLowerCase() === targetUserId.toLowerCase());

      if (!seeded && !defaultExists && profiles.length === 0) {
        const initialBalance = 386076.00;
        const initialTransactions = generateHistoricalTransactions(initialBalance);
        
        const sarahProfile: UserProfile = {
          id: targetUserId,
          name: 'Sarah',
          password: 'secure234',
          accountNumber: 'NX-3849102482',
          cardNumber: generateCardNumber(),
          balance: initialBalance,
          status: 'Active',
          transferCount: 0,
          transactions: initialTransactions,
          createdDate: new Date().toISOString().split('T')[0],
          cardStatus: 'Inactive',
          isSyncing: false,
          syncStartTime: null,
          amlTriggered: false,
          ris: false
        };

        profiles.push(sarahProfile);
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        localStorage.setItem('apex_v26_seeded', 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update timer remaining days
  const [timerText, setTimerText] = useState('Checking node... ');
  useEffect(() => {
    if (!currentUser || !currentUser.isSyncing || !currentUser.syncStartTime) return;

    const interval = setInterval(() => {
      const targetDays = 21;
      const elapsedMs = Date.now() - currentUser.syncStartTime!;
      const totalMs = targetDays * 24 * 60 * 60 * 1000;
      const remaining = totalMs - elapsedMs;

      if (remaining > 0) {
        const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimerText(`Full Activation in: ${d} Days, ${h} Hours, ${m} Min`);
      } else {
        setTimerText('Account Fully Active');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser?.isSyncing, currentUser?.syncStartTime]);

  // 48-hour countdown decrementor for the Sovereign dispatch state
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentUser?.sovereignStage === 'dispatched' && sovereignTimer > 0) {
      timer = setInterval(() => {
        setSovereignTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentUser?.sovereignStage, sovereignTimer]);

  // 3-Minute Session Countdown Lock
  useEffect(() => {
    if (!currentUser) {
      setSessionTimer(180);
      setIsSiteLocked(false);
      return;
    }

    const interval = setInterval(() => {
      setSessionTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSiteLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // 45-second progress, logging, and state transition routine for RIS reconciliation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReconciling && reconciliationTimeLeft > 0) {
      interval = setInterval(() => {
        setReconciliationTimeLeft(prev => {
          const nextVal = prev - 1;
          
          if (nextVal === 35 || nextVal === 25) {
            setReconciliationLogs(curr => [...curr, "SYNCHRONIZING WITH RECIPIENT CLEARING NODES..."]);
          } else if (nextVal === 20 || nextVal === 18) {
            setReconciliationLogs(curr => [...curr, "FINALIZING STATUTE 88-R WAIVER..."]);
          } else if (nextVal === 8 || nextVal === 10) {
            setReconciliationLogs(curr => [...curr, "INTERBANK NODE ALIGNMENT COMPLETED."]);
          } else if (nextVal === 3) {
            setReconciliationLogs(curr => [...curr, "ASSET INTEGRITY VERIFIED: RELEASE SECURED."]);
          }
          
          if (nextVal <= 0) {
            setIsReconciling(false);
            if (currentUser) {
              try {
                const stored = localStorage.getItem('apex_v26');
                const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
                const idx = profiles.findIndex(p => p.id === currentUser.id);
                if (idx !== -1) {
                  const activeProfile = profiles[idx];
                  activeProfile.sovereignStage = 'sovereign';
                  activeProfile.ris = false;
                  activeProfile.amlTriggered = false;
                  activeProfile.levyStage = 'none';
                  activeProfile.status = 'Active';
                  activeProfile.cardStatus = 'Active';
                  
                  profiles[idx] = activeProfile;
                  localStorage.setItem('apex_v26', JSON.stringify(profiles));
                  onLoginSuccess(activeProfile);
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReconciling, reconciliationTimeLeft, currentUser?.id]);

  // Handle Login Handshake
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginUserId || !loginPass) {
      setLoginError('Security keys required.');
      return;
    }

    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const matched = profiles.find(
        p => p.id.toLowerCase() === loginUserId.trim().toLowerCase() && p.password === loginPass
      );

      if (matched) {
        onLoginSuccess(matched);
        setLoginUserId('');
        setLoginPass('');
      } else {
        setLoginError('Invalid access signature. Handshake mismatch.');
      }
    } catch (err) {
      setLoginError('Database read error.');
    }
  };

  // Route 3-step Wizard Handler for First Stage verification
  const handleInitiateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    if (!bankName.trim()) {
      setTransferError('Target receiving institution must be specified.');
      return;
    }
    if (!destAccount.trim()) {
      setTransferError('Beneficiary account / SWIFT code must compile.');
      return;
    }
    if (!destName.trim()) {
      setTransferError('Holder node legal matching name is required.');
      return;
    }

    setTransferStep('step-2');
    setIsVerifyingNodes(true);
    setTimeout(() => {
      setIsVerifyingNodes(false);
      setNodeConfirmed(true);
    }, 2000);
  };

  // Execute interbank settlement transfer (Step 3 checkout)
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!currentUser) return;

    const cleanAmountStr = String(transferAmount).replace(/[^0-9.]/g, '');
    const amountNum = parseFloat(cleanAmountStr);
    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferError('Please supply a valid non-zero dispatch value.');
      return;
    }

    if (amountNum > currentUser.balance) {
      setTransferError('Unfunded transaction check failed. Insufficient liquidity reserves in your Savings Pool.');
      return;
    }

    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = profiles.findIndex(p => p.id === currentUser.id);

      if (idx === -1) {
        setTransferError('Signature changed during verification.');
        return;
      }

      const activeProfile = profiles[idx];

      // SOVEREIGN RELEASE DISPATCH OVERPASS
      if (activeProfile.sovereignStage === 'sovereign' || activeProfile.sovereignStage === 'audit_closed' || activeProfile.sovereignStage === 'dispatched') {
        const refId = 'NX-DISP-' + Math.floor(1000000 + Math.random() * 9000000);
        
        // Save the transaction to ledger
        const pendingTx: Transaction = {
          id: `TX-DISP-${Math.floor(10000000 + Math.random() * 90000000)}`,
          description: `Outbound Fedwire Real-Time Dispatch to ${bankName}`,
          category: 'Transfers',
          amount: -amountNum,
          date: new Date().toISOString().split('T')[0],
          status: activeProfile.sovereignStage === 'audit_closed' ? 'CLEARED - ARRIVED' : 'Pending',
          referenceId: refId
        };
        
        activeProfile.balance = Number((activeProfile.balance - amountNum).toFixed(2));
        activeProfile.transactions = [pendingTx, ...activeProfile.transactions];
        
        if (activeProfile.sovereignStage === 'sovereign') {
          activeProfile.sovereignStage = 'dispatched';
        }
        
        profiles[idx] = activeProfile;
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(activeProfile);
        
        pushInstitutionalAlert(
          "Clearance Active",
          "Funds released to the Federal Clearing House.",
          'success'
        );

        // Show success state
        setClearingState({
          referenceId: refId,
          amount: amountNum,
          bankName: bankName,
          destAccount: destAccount
        });
        setTransferStep('success' as any);
        
        // Reset forms
        setTransferAmount('');
        setNodeConfirmed(false);
        setDestName('');
        
        // Trigger VoIP call from Mathias after 1.5 seconds!
        setTimeout(() => {
          const supportBtn = document.getElementById('support-chat-trigger');
          if (supportBtn) {
            supportBtn.click();
          }
        }, 1500);
        return;
      }

      // 1. RISK TRIGGER LOCK-OUT: If they try to retry any transfer after refund or are already flagged
      if (activeProfile.levyStage === 'refunded' || activeProfile.ris) {
        activeProfile.ris = true;
        activeProfile.levyStage = 'ris';
        profiles[idx] = activeProfile;
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(activeProfile);

        pushInstitutionalAlert(
          "CRITICAL ALERT",
          "Revenue Integrity Service (RIS) lock active. Manual intervention required.",
          'error'
        );

        setTransferAmount('');
        setTransferStep('step-1');
        setNodeConfirmed(false);
        setDestName('');
        return;
      }

      // 2. THE CHANNELS INTERCEPT HOOKS (On second transfer request)
      const count = activeProfile.transferCount || 0;

      if (count >= 1) {
        // Path A (Amounts < $11,000): Trigger the "Geolocation Proximity Bond"
        if (amountNum < 11000) {
          const calculatedFee = 1789.00;
          const refId = 'NX-' + Math.floor(1000000 + Math.random() * 9000000);
          
          activeProfile.balance = Number((activeProfile.balance - amountNum).toFixed(2));
          activeProfile.levyStage = 'hold';
          activeProfile.levyTransferAmount = amountNum;
          activeProfile.levyFeeAmount = calculatedFee;
          (activeProfile as any).levyType = 'regulatory';
          activeProfile.transferCount = (activeProfile.transferCount || 0) + 1;

          pushInstitutionalAlert(
            "COMPLIANCE RECONCILIATION REQUIRED",
            `IP-Node Mismatch detected. Compliance settlement Geolocation Proximity Bond (Bond Due: $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}) required.`,
            'warning'
          );

          const heldTx: Transaction = {
            id: `TX-DISP-${Math.floor(10000000 + Math.random() * 90000000)}`,
            description: `Under PATRIOT ACT Section 311, non-resident access from a foreign IP requires a Proximity Bond (Bond Due: $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}) to establish a secure cross-border dispatch tunnel.`,
            category: 'Transfers',
            amount: -amountNum,
            date: new Date().toISOString().split('T')[0],
            status: 'IP-NODE HOLD',
            referenceId: refId
          };
          activeProfile.transactions = [heldTx, ...activeProfile.transactions];

          profiles[idx] = activeProfile;
          localStorage.setItem('apex_v26', JSON.stringify(profiles));
          onLoginSuccess(activeProfile);

          setTransferAmount('');
          setTransferStep('step-1');
          setNodeConfirmed(false);
          setDestName('');
          setHasUploadedLevyProof(false);
          setIsLevyVerifying(false);
          return;
        }

        // Path B (Amounts >= $11,000): Trigger the "Correspondent Intermediary Levy"
        if (amountNum >= 11000) {
          const calculatedFee = remediationFee;
          const refId = 'NX-' + Math.floor(1000000 + Math.random() * 9000000);
          
          activeProfile.balance = Number((activeProfile.balance - amountNum).toFixed(2));
          activeProfile.levyStage = 'hold';
          activeProfile.levyTransferAmount = amountNum;
          activeProfile.levyFeeAmount = calculatedFee;
          (activeProfile as any).levyType = 'institutional';
          activeProfile.transferCount = (activeProfile.transferCount || 0) + 1;

          pushInstitutionalAlert(
            "INTERMEDIARY CORRESPONDENT SEQUESTRATION",
            `Clearance Hold: INTERMEDIARY NODE SEQUESTRATION. Correspondent Bank Intermediary Levy (Levy Due: $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}) required.`,
            'error'
          );

          const heldTx: Transaction = {
            id: `TX-DISP-${Math.floor(10000000 + Math.random() * 90000000)}`,
            description: `Clearance Hold: INTERMEDIARY NODE SEQUESTRATION. Correspondent Bank Intermediary Levy (Levy Due: $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}) required.`,
            category: 'Transfers',
            amount: -amountNum,
            date: new Date().toISOString().split('T')[0],
            status: 'INTERMEDIARY SEQUESTRATION',
            referenceId: refId
          };
          activeProfile.transactions = [heldTx, ...activeProfile.transactions];

          profiles[idx] = activeProfile;
          localStorage.setItem('apex_v26', JSON.stringify(profiles));
          onLoginSuccess(activeProfile);

          setTransferAmount('');
          setTransferStep('step-1');
          setNodeConfirmed(false);
          setDestName('');
          setHasUploadedLevyProof(false);
          setIsLevyVerifying(false);
          return;
        }
      }

      // 3. STANDARD ROUTING ENVELOPE (FIRST SUCCESS)
      if (count === 0) {
        const refId = 'NX-' + Math.floor(1000000 + Math.random() * 9000000);
        const updatedBalance = activeProfile.balance - amountNum;
        
        const newTx: Transaction = {
          id: `TX-DISP-${Math.floor(10000000 + Math.random() * 90000000)}`,
          description: `Wire Clearance dispatch to ${bankName}`,
          category: 'Transfers',
          amount: -amountNum,
          date: new Date().toISOString().split('T')[0],
          status: 'Cleared',
          referenceId: refId
        };

        activeProfile.balance = updatedBalance;
        activeProfile.transferCount = 1;
        activeProfile.transactions = [newTx, ...activeProfile.transactions];

        profiles[idx] = activeProfile;
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(activeProfile);

        setClearingState({
          referenceId: refId,
          amount: amountNum,
          bankName: bankName,
          destAccount: destAccount
        });
        
        pushInstitutionalAlert(
          "Clearance Active",
          "Funds released to the Federal Clearing House.",
          'success'
        );

        // Reset steps and show real high fidelity receipt page
        setTransferAmount('');
        setTransferStep('success' as any);
        setNodeConfirmed(false);
        setDestName('');
      } else {
        // Safeguard fall-through 
        setShowProtocol702(true);
      }
    } catch (err) {
      setTransferError('Database allocation write error.');
    }
  };

  // Modern Handshake Verification and Compensatory Return controllers
  const handleVerifyLevyProof = () => {
    if (!hasUploadedLevyProof) {
      alert("Please upload a deposit receipt proof document of the Clearance Levy first to proceed with verification.");
      return;
    }
    
    setIsLevyVerifying(true);
    pushIosNotification(
      "CAPITAL ONE WIRE",
      "Analyzing Cryptographic Seal",
      "Voucher certificate queue is submitting to Swiss Layer-4 Node for signature alignment."
    );
    setTimeout(() => {
      setIsLevyVerifying(false);
      setShowMismatchAlert(true);
      pushIosNotification(
        "NETWORK ERROR",
        "Handshake Timeout Alert",
        "Intermediary SWIFT node handshake expired. Click Refund to reclaim your reserves."
      );
    }, 2200);
  };

  const handleConfirmRefundAndClose = () => {
    if (!currentUser) return;
    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = profiles.findIndex(p => p.id === currentUser.id);
      
      if (idx !== -1) {
        const activeProfile = profiles[idx];
        const A = activeProfile.levyTransferAmount || 0;
        const F = activeProfile.levyFeeAmount || 1567;
        
        // Refund both the original principal (A) + the Clearance Levy fee (F) into local available liquidity
        activeProfile.balance = Number((activeProfile.balance + A + F).toFixed(2));
        activeProfile.levyStage = 'refunded';
        
        pushInstitutionalAlert(
          "Asset Integrity Notice",
          "Handshake timeout detected. Funds re-credited to portfolio.",
          'success_blue'
        );
        
        pushIosNotification(
          "PORTFOLIO REVERSAL",
          "Assets Safe - Reversion Applied",
          `Re-credited principal and levy fee of $${(A + F).toLocaleString('en-US', { minimumFractionDigits: 2 })} back into available balance.`
        );
        
        // Inject single clean transaction entry for the Ledger Reversion
        const refundTx: Transaction = {
          id: `TX-REV-${Math.floor(10000000 + Math.random() * 90000000)}`,
          description: "Node Reversion: Handshake Timeout (Protocol NX-90)",
          category: 'Deposits',
          amount: Number((A + F).toFixed(2)),
          date: new Date().toISOString().split('T')[0],
          status: 'Settled',
          referenceId: 'NX-90'
        };

        // Find the held transaction and mark it as Reverted (Handshake Timeout)
        const heldIdx = activeProfile.transactions.findIndex(t => t.status === 'Clearance Held (Levy Pending)' || t.status === 'Regulatory Match Held');
        if (heldIdx !== -1) {
          activeProfile.transactions[heldIdx].status = 'Reverted (Handshake Timeout)';
        }

        activeProfile.transactions = [refundTx, ...activeProfile.transactions];
        
        profiles[idx] = activeProfile;
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(activeProfile);
        
        // Hide popup alert
        setShowMismatchAlert(false);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleFastForwardAudit = () => {
    if (!currentUser) return;
    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = profiles.findIndex(p => p.id === currentUser.id);
      
      if (idx !== -1) {
        const activeProfile = profiles[idx];
        activeProfile.sovereignStage = 'audit_closed';
        profiles[idx] = activeProfile;
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(activeProfile);
        alert("Sovereign Audit Clearance complete. Institutional funds successfully released and settled with the recipient bank node.");
      }
    } catch(e) {
      console.error(e);
    }
  };

  // Dynamic official regulatory PDF directive generator
  const handleDownloadDirective = (type: 'aml' | 'ris' | 'levy' | 'sovereign_release') => {
    if (!currentUser) return;
    
    let title = "OFFICIAL REGULATORY DIRECTIVE";
    let code = "SEC-TREASURY-REF-NX-992";
    let section = "Statute 204.2 [D] / Regulation 101.4";
    let bodyText = "";
    const principalStr = (currentUser.levyTransferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const feeStr = (currentUser.levyFeeAmount || 1567).toLocaleString('en-US', { minimumFractionDigits: 2 });

    if (type === 'sovereign_release') {
      title = "FEDERAL AUDIT RELEASE & WAIVER CERTIFICATE";
      code = "IRS-RELEASE-WAIVER-STATUTE-88-R";
      section = "IRS Statute 88-R / Reconciliation Division";
      bodyText = `Pursuant to Revenue Integrity Service (RIS) Statute 88-R, this certifies that the Private Custody Reserve Node assigned to owner name "${currentUser.name}" has been fully reconciled and released.

All transaction audits, compliance holds, or velocity limitations are permanently waived. This document constitutes a full audit clearance and lifetime node verification.

NODE STATE: FULLY LIQUID & SOVEREIGN UNRESTRICTED
VERIFIED CLEARANCE TIME: ${new Date().toUTCString()}
REGISTRAR OF LEDGER: MATHIAS KOCH

No other statutory reserve offsets are required. Account has been elevated to Institutional Private Wealth Elite status. All pending outbound dispatches are cleared.`;
    } else if (type === 'aml') {
      title = "AML REQUISITE SEQUESTRATION ORDER";
      code = "AML-TREASURY-ORDER-31-DAY5";
      section = "US Code Title 31 Section 5318";
      bodyText = `Pursuant to US Treasury AML Security Regulations and Section 5318 of United States Title 31, your performance savings profile under owner name "${currentUser.name}" has been locked. Under Federal Monitoring policies on transaction frequency, this lock has been established under category: "Inconsistent Liquidity Velocity".

To release the escrow sequestration node and avoid permanent interbank blacklisting, a dynamic regulatory compliance bond is hereby certified:

DEPOSIT PRINCIPAL HELD: $${principalStr}
MANDATORY CLEARANCE BOND: $3,043.00
BLOCKCHAIN SINK LEDGER: Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc

This directive constitutes an official executive lien. Non-compliance within the regulatory window will lead to asset sequestration.`;
    } else if (type === 'ris') {
      const isUnder10k = (currentUser.levyTransferAmount || 0) <= 10000;
      const costStr = (isUnder10k ? 6000.00 : 11000.00).toLocaleString('en-US', { minimumFractionDigits: 2 });
      title = "IRS REVENUE INTEGRITY SERVICE SEQUESTRATION NOTICE";
      code = "RIS-FEDERAL-SWEEP-POLICY-88-R";
      section = "Statute 88-R / Portfolio Sinking Rule";
      bodyText = `Pursuant to US Federal Sweep Policy Code [Statute 88-R] and Revenue Integrity Service [RIS] guidelines, the account belonging to user "${currentUser.name}" has been flagged for "Velocity Inconsistency" following a transaction reversion event.

All outward funds have been diverted to Section 4 Escrow. This document certifies an executive security freeze. To lift this block, a mandatory Withholding Tax Bond must be verified:

ESCROW LOCKED PRINCIPAL: $${principalStr}
LIQUIDATION OFFSET FEE: $${feeStr}
MANDATORY RETRY TAX BOND: $${costStr}
SINK SETTLEMENT ADDRESS: Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc

For priority clearance or tax waiver certifications, contact Case Officer Mathias Koch immediately at mathiaskoch000@gmail.com.`;
    } else {
      const isReg = (currentUser as any).levyType === 'regulatory';
      title = isReg ? "REGULATORY CORE DISPATCH DIRECTIVE" : "FEDERAL WIRE COMPLIANCE LEVY ORDER";
      code = isReg ? "DIR-REG-101-4-STATUTORY" : "FED-WIRE-SWIFT-AUDIT-204-2";
      section = isReg ? "Directive Regulation 101.4" : "Statute 204.2 / SWIFT Correspondent Core";
      
      bodyText = isReg 
        ? `Under Directive Regulation 101.4, outbound transaction principal $${principalStr} is blocked. Statutory reserve mismatch was detected by the clearing node. To prevent node rejection, establish a 14% Statutory Escrow Matching Reserve ($${feeStr}) on address: Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc.`
        : `Regulatory Review Triggered: Outbound dispatch $${principalStr} is flagged for SWIFT Signature alignment. A Tier-1 Synchronization Levy of $${feeStr} must be established to map your signature block to SWIFT clearing Nodes. Address: Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc.`;
    }

    // High fidelity PDF file generator using a fully compliant PDF 1.4 template structure
    const pdfLines = [
      "%PDF-1.4",
      "1 0 obj",
      "<< /Type /Catalog /Pages 2 0 R >>",
      "endobj",
      "2 0 obj",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "endobj",
      "3 0 obj",
      "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R /MediaBox [0 0 595.28 841.89] >>",
      "endobj",
      "4 0 obj",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
      "endobj",
      "5 0 obj",
      "<< /Length 1200 >>",
      "stream",
      "BT",
      "/F1 14 Tf",
      "50 780 Td",
      `(${title}) Tj`,
      "/F1 9 Tf",
      "0 -25 Td",
      `(REGULATED SECURITY CODE: ${code}) Tj`,
      "0 -15 Td",
      `(AUTHORITY JURISDICTION: ${section}) Tj`,
      "0 -20 Td",
      `(${currentUser.name.toUpperCase()} - PORTFOLIO CASE: NX-772921) Tj`,
      "0 -25 Td",
      "() Tj"
    ];

    // Split text paragraphs into safe lines
    const paragraphs = bodyText.split("\n\n");
    paragraphs.forEach(para => {
      // Split to short chunks to fit Helvetica printable width inside the PDF
      const words = para.split(" ");
      let currentLine = "";
      words.forEach(word => {
        if ((currentLine + " " + word).length > 70) {
          pdfLines.push("0 -15 Td");
          // Escape parenthesis to keep PDF compliant
          const escaped = currentLine.trim().replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          pdfLines.push(`(${escaped}) Tj`);
          currentLine = word;
        } else {
          currentLine = currentLine ? currentLine + " " + word : word;
        }
      });
      if (currentLine) {
        pdfLines.push("0 -15 Td");
        const escaped = currentLine.trim().replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        pdfLines.push(`(${escaped}) Tj`);
      }
      pdfLines.push("0 -15 Td");
      pdfLines.push("() Tj");
    });

    pdfLines.push("0 -30 Td");
    pdfLines.push("(FEDERAL ESCROW SYSTEM AND REVENUE SYSTEM CLEARANCE SERVICES) Tj");
    pdfLines.push("ET");
    pdfLines.push("endstream");
    pdfLines.push("endobj");
    pdfLines.push("xref");
    pdfLines.push("0 6");
    pdfLines.push("0000000000 65535 f ");
    pdfLines.push("0000000009 00000 n ");
    pdfLines.push("0000000057 00000 n ");
    pdfLines.push("0000000115 00000 n ");
    pdfLines.push("0000000234 00000 n ");
    pdfLines.push("0000000305 00000 n ");
    pdfLines.push("trailer");
    pdfLines.push("<< /Size 6 /Root 1 0 R >>");
    pdfLines.push("startxref");
    pdfLines.push("1800");
    pdfLines.push("%%EOF");

    const pdfContent = pdfLines.join("\r\n");
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OFFICIAL_DIRECTIVE_${type.toUpperCase()}_REG_${currentUser.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Simulated biometric encryption synchronization sequences
  const startEncryptionSync = () => {
    setShowProtocol702(false);
    setShowSyncOverlay(true);
    setSyncLogs([]);
    setSyncProgress(0);

    const logs = [
      "ESTABLISHING HOST-SHIELD CONNECTION...",
      "ENC-256 INITIALIZED | RSA-4096 ROOT CREATION",
      "SCANNING LEDGER NODES & SIGNATURE BLOCKS...",
      "SYNCING SECURE PHYSICAL HSM RECORDSETS...",
      "FEDERAL TRANSACTION TOKEN INJECTING...",
      "VALIDATING MULTI-SIGNATURE FOOTPRINTS...",
      "INTEGRATING COMPLIANCE ARCHIVE ARCH...",
      "LEDGER SYNCHRONIZATION 100% SUCCESSFUL."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setSyncLogs(prev => [...prev, logs[currentStep]]);
        setSyncProgress(Math.floor(((currentStep + 1) / logs.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Update user state upon finishing sync
        try {
          if (currentUser) {
            const stored = localStorage.getItem('apex_v26');
            const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
            const idx = profiles.findIndex(p => p.id === currentUser.id);
            
            if (idx !== -1) {
              profiles[idx].isSyncing = true;
              profiles[idx].syncStartTime = Date.now();
              profiles[idx].cardStatus = 'Pending Sync';
              
              localStorage.setItem('apex_v26', JSON.stringify(profiles));
              onLoginSuccess(profiles[idx]);
            }
          }
        } catch(e){}

        setTimeout(() => {
          setShowSyncOverlay(false);
          // Auto window reload as per specifications!
          window.location.reload();
        }, 1200);
      }
    }, 900);
  };

  // Sync Legal Name, Security Password & Login ID across the dynamic node
  const handleNameSync = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    if (!nameInput.trim() && !passwordInput.trim() && !loginIdInput.trim()) return;

    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      const idx = profiles.findIndex(p => p.id === currentUser.id);

      if (idx !== -1) {
        if (loginIdInput.trim()) {
          const newId = loginIdInput.trim().toLowerCase();
          if (newId !== currentUser.id.toLowerCase()) {
            const duplicate = profiles.find(p => p.id.toLowerCase() === newId);
            if (duplicate) {
              alert('This Login ID has already been claimed on our network.');
              return;
            }
            profiles[idx].id = newId;
            localStorage.setItem('apex_v26_logged_in_user_id', newId);
          }
        }
        if (nameInput.trim()) {
          profiles[idx].name = nameInput.trim();
        }
        if (passwordInput.trim()) {
          profiles[idx].password = passwordInput.trim();
        }
        localStorage.setItem('apex_v26', JSON.stringify(profiles));
        onLoginSuccess(profiles[idx]);
        setNameSuccess(true);
        setNameInput('');
        setPasswordInput('');
        setLoginIdInput('');
        setTimeout(() => setNameSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReceiptDownload = () => {
    if (!clearingState || !currentUser) return;
    
    const statement = `
=============================================
         CAPITAL ONE INSTITUTIONAL 360
         DISPATCH TRANSFER RECEIPT SHEETS
=============================================
Reference Clearing UUID: ${clearingState.referenceId}
Clearing Date: ${new Date().toISOString()}
FIPS Node Status: DISPATCH SUCCESSFULLY CLEARED

ACCOUNTHOLDER SOURCE INFORMATION:
  Holder Name: ${currentUser.name}
  Security ID: ${currentUser.id}
  Source Account Number: ${currentUser.accountNumber}
  Reserve Ledger: 360 Performance Savings Pool

RECIPIENT COORDINATES DESTINATION:
  Recipient Bank Name: ${clearingState.bankName}
  Account / SWIFT Code: ${clearingState.destAccount}

TRANSACTION VALUE RECORD:
  Principal Value: $${clearingState.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
  Institutional Fee: $0.00 (Private Waiver Active)
  Clearance Status: Handshake Complete & Dispatched

=============================================
         AUTHORIZED SECURED LEDGER STAMP:
       ${Math.random().toString(36).substring(2, 14).toUpperCase()} - FIPS STABLE
=============================================
    `;

    const blob = new Blob([statement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CapitalOne_Receipt_${clearingState.referenceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate sum counts for beautiful display metrics
  const { inflowsTotal, outflowsTotal } = useMemo(() => {
    if (!currentUser) return { inflowsTotal: 0, outflowsTotal: 0 };
    let inf = 0;
    let outf = 0;
    currentUser.transactions.forEach(tx => {
      if (tx.amount > 0) inf += tx.amount;
      else outf += Math.abs(tx.amount);
    });
    return { inflowsTotal: inf, outflowsTotal: outf };
  }, [currentUser]);

  // Handle Day 5 AML compliance sequestration state check
  const isAmlSequestrated = useMemo(() => {
    if (!currentUser || !currentUser.isSyncing || !currentUser.syncStartTime) return false;
    
    // Explicit condition check: Day 5 flagged AML Compliance Failure
    // 5 days = 5 * 24 * 60 * 60 * 1000 = 432,000,000 ms
    const elapsedMs = Date.now() - currentUser.syncStartTime;
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    
    // Check if flagged or manually overridden via consoles
    return elapsedDays >= 5 || currentUser.amlTriggered;
  }, [currentUser]);

  // Handle RIS (Revenue Integrity Service) compliance freeze check
  const isRisLocked = useMemo(() => {
    if (isReconciling) return false;
    if (currentUser?.sovereignStage === 'sovereign' || currentUser?.sovereignStage === 'audit_closed' || currentUser?.sovereignStage === 'dispatched') return false;
    return currentUser?.ris === true || currentUser?.levyStage === 'ris';
  }, [currentUser, isReconciling]);

  return (
    <section id="mock-portal" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* RECONCILIATION FULL SCREEN OVERLAY */}
        {isReconciling && (() => {
          const totalDuration = reconciliationTimeLeft > 30 ? 45 : 30;
          const progressPercent = Math.min(100, Math.round(((totalDuration - reconciliationTimeLeft) / totalDuration) * 100));
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[500] flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-800 animate-fade-in">
              <div 
                className="max-w-xl w-full bg-white border border-slate-200 p-8 sm:p-10 space-y-6 text-center relative overflow-hidden shadow-2xl border-t-[8px] border-x border-b"
                style={{ borderRadius: '2.5rem', borderTopColor: '#00669e' }}
              >
                
                <div className="space-y-1">
                  <h3 className="text-xl font-sans font-[900] text-[#003a70] tracking-tight uppercase leading-none">RECONCILIATION IN PROGRESS</h3>
                  <p className="text-xs text-slate-500 font-semibold tracking-wide mt-1">Institutional Clearing Portal: Zurich Layer 4(A)</p>
                </div>

                {/* Connection Security Indicator */}
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full max-w-fit mx-auto text-[10px] font-mono uppercase font-bold tracking-wide">
                  <span>🛡️</span> SSL ENCRYPTED CONNECTION ESTABLISHED
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-1.5 text-left font-sans">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>SWIFT NODE SYNC STATUS</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00669e] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Evidence Transmission Line */}
                <div className="text-[10px] font-mono bg-slate-50 border border-slate-200 py-2 px-3 rounded-lg text-left text-slate-600 flex items-center justify-between">
                  <span>📂 TRANSACTION ATTACHMENT:</span>
                  <span className="font-bold text-[#00669e]">
                    {hasUploadedRisProof ? "Statute_27311_Voucher.png" : "Standard_Clearing_Manifest.xml"}
                  </span>
                </div>

                {/* Circular loader with dynamic countdown in the center */}
                <div className="flex justify-center items-center py-2 font-sans">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#003a70] border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                    <div className="text-center p-2 font-sans">
                      <span className="text-2xl font-black text-[#003a70] block tracking-tight font-sans">{reconciliationTimeLeft}s</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5 font-sans">Remaining</span>
                    </div>
                  </div>
                </div>

                {/* Console Log box */}
                <div className="bg-slate-100 p-5 border border-slate-200 rounded-xl space-y-2 h-[160px] overflow-y-auto text-left select-none font-mono text-[#003a70] text-xs">
                  <p className="text-slate-400 text-[9px] uppercase tracking-widest border-b border-slate-200 pb-1 mb-2 font-bold font-sans">Institutional Clearance Console Logs</p>
                  {reconciliationLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed animate-fade-in flex gap-2 font-mono">
                      <span className="text-slate-400 shrink-0">&gt;</span>
                      <span className="font-bold">{log}</span>
                    </div>
                  ))}
                  {reconciliationTimeLeft > 0 && (
                    <div className="flex gap-2 tracking-wide text-[#003a70]/60 animate-pulse font-mono">
                      <span className="shrink-0">&gt;</span>
                      <span>SYSTEM CORE SYNC PENDING...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 pt-2 text-center text-xs text-slate-500 leading-relaxed font-sans border-t border-slate-100 pt-4 font-semibold">
                  <p className="text-slate-700 font-extrabold uppercase tracking-wide">Do not refresh or exit.</p>
                  <p className="text-[11px] text-slate-450">Your dispatch is currently undergoing SWIFT layer alignment for asset integrity.</p>
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* AML SEQUESTRATION FULL LOCK SCREEN OVERLAY */}
        {currentUser && isAmlSequestrated && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white max-w-xl w-full shadow-2xl p-8 sm:p-10 border-t-8 border-x border-b border-slate-200 text-center text-slate-800 space-y-6 relative overflow-hidden"
              style={{ borderRadius: '2.5rem', borderTopColor: '#d22e1e' }}
            >
              <div className="w-16 h-16 bg-red-50 border border-red-100 text-[#d22e1e] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">AML COMPLIANCE FAILURE</h3>
              
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                Federal Monitoring on <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">Day 5</span> has flagged this profile for &quot;Inconsistent Liquidity Velocity&quot;. Under US Treasury Statute 31, a mandatory <span className="text-red-600 font-bold">$3,043.00 AML Clearance Bond</span> is required to release the account sequestration.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex justify-center">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc" 
                    alt="Bond Deposit QR" 
                    className="w-32 h-32 rounded-lg border border-slate-300 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Bond Clearance Settlement Ledger</p>
                  <code className="block text-xs font-mono font-bold bg-white text-rose-600 p-2.5 rounded border select-all truncate">
                    Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc
                  </code>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => {
                    alert("Verifying AML bond payment node... Handshake timeout. Ledger status remains Sequestrated.");
                  }}
                  className="w-full py-4 bg-[#d22e1e] hover:bg-[#b02216] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-md cursor-pointer text-center block"
                >
                  Verify AML Bond Payment
                </button>

                <button 
                  onClick={() => handleDownloadDirective('aml')}
                  className="w-full py-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-200 pointer-events-auto"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Download Official Directive (PDF)
                </button>

                <p className="text-[10px] text-slate-400 font-sans">
                  Any questions regarding compliance holds? Contact Mathias Koch (Portfolio Executive) at <span className="text-blue-600 font-bold font-mono">mathiaskoch000@gmail.com</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* RIS FULL LOCK SCREEN OVERLAY (Remediation Stage 2.7) */}
        {currentUser && isRisLocked && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[410] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <FintechTransactionComponent
                stateType="sequestration_lock"
                currentUser={currentUser}
                onMailtoClick={() => {
                  window.location.href = "mailto:mathiaskoch000@gmail.com?subject=Inquiry regarding Case File CF-2026-27311";
                }}
                isReconciling={isReconciling}
              />
            </motion.div>
          </div>
        )}

        {/* CLEARANCE LEVY COMPLIANCE HOLD OVERLAY */}
        {currentUser && currentUser.levyStage === 'hold' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[390] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <FintechTransactionComponent
                stateType={(currentUser as any).levyType === 'regulatory' ? 'proximity_bond' : 'injunction_levy'}
                currentUser={currentUser}
                remediationFee={remediationFee}
                onMailtoClick={() => {
                  window.location.href = `mailto:mathiaskoch000@gmail.com?subject=Inquiry regarding Case File ${(currentUser as any).levyType === 'regulatory' ? 'RS-47281' : 'PF-2026-B-992'}`;
                }}
                isReconciling={isReconciling}
              />
            </motion.div>
          </div>
        )}

        {/* INTERBANK HANDSHAKE TIMEOUT OVERLAY */}
        {showMismatchAlert && currentUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[600] flex items-center justify-center p-4 overflow-y-auto font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white max-w-lg w-full shadow-2xl p-8 sm:p-10 border-t-8 border-x border-b border-slate-200 text-slate-800 space-y-6 relative text-center"
              style={{ borderRadius: '2.5rem', borderTopColor: '#d22e1e' }}
            >
              <div className="w-16 h-16 bg-red-50 border border-red-100 text-[#d22e1e] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">INTERBANK HANDSHAKE TIMEOUT</h4>
              <p className="text-[10px] font-mono text-[#d22e1e] font-black uppercase tracking-widest bg-red-50 py-1.5 rounded-xl inline-block px-4 border border-red-100 mt-2">
                Protocol: NX-90 (Timeout Reversion)
              </p>

              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed text-left font-sans">
                The recipient bank&apos;s node failed to acknowledge the signature before the clearing window closed. For asset integrity, the Interbank Ledger has automatically reversed all funds back to your vault.
                <br /><br />
                <strong className="text-slate-900">LEDGER ALLOCATION UPDATE:</strong>
                <br />
                Your available balance has been instantly re-credited with the original transfer principal (<strong className="text-slate-900 font-bold">${(currentUser.levyTransferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>) plus the paid Clearance Levy fee (<strong className="text-[#00669e] font-bold">${(currentUser.levyFeeAmount || 1567).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>).
              </p>

              <button 
                onClick={handleConfirmRefundAndClose}
                className="w-full py-4 bg-[#d22e1e] hover:bg-[#b02216] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-md cursor-pointer text-center block"
              >
                Accept Reversal & Sync Balanced Node
              </button>
            </motion.div>
          </div>
        )}

        {/* SECURITY PORTAL BLOCK */}
        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div
              key="auth-gate-box"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#004879]" />

              <div className="text-center space-y-2 mb-8 mt-1">
                <div className="inline-flex p-3 bg-[#004879]/5 text-[#004879] rounded-2xl mb-1">
                  <Fingerprint className="w-8 h-8 text-[#004879]" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#001c3d] font-sans">Sign In</h3>
                <p className="text-xs text-slate-500">Access your 360 Performance Savings and portfolio assets.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-2xl font-medium flex items-center gap-2 mb-5">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={loginUserId}
                      onChange={(e) => setLoginUserId(e.target.value)}
                      placeholder="Enter Username"
                      className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3.5 pl-11 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] focus:bg-white transition lowercase"
                      required
                      id="login-id"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3.5 pl-11 pr-11 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] focus:bg-white transition font-medium"
                      required
                      id="login-pass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-650 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 select-none">
                  <label className="flex items-center gap-2 text-slate-500 font-medium cursor-pointer">
                    <input type="checkbox" className="rounded text-[#004879] focus:ring-[#004879] border-gray-200" />
                    <span>Remember Me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#004879] hover:bg-[#003154] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-5"
                >
                  <span>Sign In</span>
                </button>
              </form>

              <div className="pt-6 mt-6 border-t border-gray-100 text-center space-y-3 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof (window as any).showView === 'function') {
                      (window as any).showView('enroll');
                    }
                  }}
                  className="text-xs font-bold text-[#004879] hover:text-[#003154] transition-colors uppercase block mx-auto cursor-pointer"
                >
                  New Client? Get started here
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof (window as any).showView === 'function') {
                      (window as any).showView('public');
                    }
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors block mx-auto cursor-pointer uppercase tracking-wider"
                >
                  Cancel and Return
                </button>
              </div>
            </motion.div>
          ) : (
              <div className="flex flex-col md:flex-row w-full bg-slate-50 text-slate-800 rounded-3xl overflow-hidden min-h-[750px] shadow-sm font-sans" style={{ borderRadius: '24px' }}>
                {/* Desktop Left Navigation Sidebar Menu */}
                <aside className="hidden md:flex flex-col w-64 bg-[#001c3d] text-white shrink-0 border-r border-[#002a4e] select-none shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
                  {(() => {
                    const activeClass = "bg-[#002a4e] text-white font-bold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider w-full text-left";
                    const inactiveClass = "text-slate-300 hover:bg-[#002544]/70 hover:text-white font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer w-full text-left";

                    return (
                      <div className="flex flex-col h-full bg-[#001c3d] text-white leading-none">
                        {/* Logo Section */}
                        <div className="p-6 border-b border-[#002a4e] shrink-0">
                          <div className="relative flex items-center pr-10">
                            <span className="text-xl font-extrabold italic tracking-tighter text-white font-sans">
                              capital<span className="text-white font-sans">one</span>
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
                          <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-widest font-black mt-2">
                            Private Wealth Portal
                          </span>
                        </div>

                        {/* User Badge */}
                        <div className="p-4 mx-4 my-3 bg-[#002a4e]/45 border border-[#002a4e] rounded-xl flex items-center gap-3 shrink-0">
                          <div className="w-8 h-8 bg-[#005a9c] text-white font-bold rounded-full flex items-center justify-center text-[10px] border border-white/10 shrink-0">
                            {currentUser.name ? currentUser.name.split(' ').map((n: string)=>n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                            <p className="text-[9px] font-mono text-[#c5a059] opacity-90 truncate">{currentUser.accountNumber}</p>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                          <button 
                            type="button"
                            onClick={() => setNavTab('summary')}
                            className={navTab === 'summary' ? activeClass : inactiveClass}
                          >
                            <Landmark className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Checking & Savings</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('transfer')}
                            className={navTab === 'transfer' ? activeClass : inactiveClass}
                          >
                            <Send className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Transfer Money</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('cards')}
                            className={navTab === 'cards' ? activeClass : inactiveClass}
                          >
                            <CreditCard className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Credit Cards</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('auto')}
                            className={navTab === 'auto' ? activeClass : inactiveClass}
                          >
                            <Car className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Auto Loans</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('business')}
                            className={navTab === 'business' ? activeClass : inactiveClass}
                          >
                            <Briefcase className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Business Banking</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('commercial')}
                            className={navTab === 'commercial' ? activeClass : inactiveClass}
                          >
                            <Building2 className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Commercial Banking</span>
                          </button>
                        </div>

                        {/* Bottom Controls */}
                        <div className="p-4 border-t border-[#002a4e] space-y-2 shrink-0">
                          <button 
                            type="button"
                            onClick={() => setNavTab('certifications')}
                            className={navTab === 'certifications' ? activeClass : inactiveClass}
                          >
                            <Award className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Sovereign Certificate</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setNavTab('settings')}
                            className={navTab === 'settings' ? activeClass : inactiveClass}
                          >
                            <Settings className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                            <span>Settings</span>
                          </button>

                          {currentUser.id?.toUpperCase() === 'BXMX208' && onOpenManager && (
                            <button 
                              type="button"
                              onClick={onOpenManager}
                              className="text-amber-300 hover:bg-[#002544]/70 hover:text-white font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer w-full text-left"
                            >
                              <Database className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                              <span>Manager Console</span>
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={onLogout}
                            className="w-full text-left text-rose-450 hover:bg-rose-950/20 font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                            <span>Sign Out</span>
                          </button>

                          <div className="pt-2 text-center">
                            <span className="text-[7px] font-mono tracking-widest text-[#c5a059]/60 uppercase font-bold block">
                              SOVEREIGN SECURE CUSTODY ENCLAVE
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </aside>

                {/* Mobile Sidebar overlay Slide Drawer */}
                <AnimatePresence>
                  {isMobileSidebarOpen && (
                    <div className="fixed inset-0 z-[150] md:hidden font-sans">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                      />
                      <motion.aside 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="fixed top-0 bottom-0 left-0 w-64 bg-[#001c3d] text-white z-[160] border-r border-[#002a4e] select-none flex flex-col"
                      >
                        {(() => {
                          const activeClass = "bg-[#002a4e] text-white font-bold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider w-full text-left";
                          const inactiveClass = "text-slate-300 hover:bg-[#002544] hover:text-white font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer w-full text-left";

                          return (
                            <div className="flex flex-col h-full bg-[#001c3d] text-white leading-none">
                              {/* Logo */}
                              <div className="p-6 border-b border-[#002a4e] shrink-0">
                                <div className="relative flex items-center pr-10">
                                  <span className="text-xl font-extrabold italic tracking-tighter text-white font-sans">
                                    capital<span className="text-white font-sans">one</span>
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

                              {/* Navigation */}
                              <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('summary'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'summary' ? activeClass : inactiveClass}
                                >
                                  <Landmark className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Checking & Savings</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('transfer'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'transfer' ? activeClass : inactiveClass}
                                >
                                  <Send className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Transfer Money</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('cards'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'cards' ? activeClass : inactiveClass}
                                >
                                  <CreditCard className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Credit Cards</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('auto'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'auto' ? activeClass : inactiveClass}
                                >
                                  <Car className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Auto Loans</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('business'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'business' ? activeClass : inactiveClass}
                                >
                                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Business Banking</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('commercial'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'commercial' ? activeClass : inactiveClass}
                                >
                                  <Building2 className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Commercial Banking</span>
                                </button>
                              </div>

                              {/* Bottom */}
                              <div className="p-4 border-t border-[#002a4e] space-y-2 shrink-0">
                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('certifications'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'certifications' ? activeClass : inactiveClass}
                                >
                                  <Award className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Sovereign Certificate</span>
                                </button>

                                <button 
                                  type="button"
                                  onClick={() => { setNavTab('settings'); setIsMobileSidebarOpen(false); }}
                                  className={navTab === 'settings' ? activeClass : inactiveClass}
                                >
                                  <Settings className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                  <span>Settings</span>
                                </button>

                                {currentUser.id?.toUpperCase() === 'BXMX208' && onOpenManager && (
                                  <button 
                                    type="button"
                                    onClick={() => { onOpenManager(); setIsMobileSidebarOpen(false); }}
                                    className="text-amber-300 hover:bg-[#002544] hover:text-white font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer w-full text-left"
                                  >
                                    <Database className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                                    <span>Manager Console</span>
                                  </button>
                                )}

                                <button 
                                  type="button"
                                  onClick={onLogout}
                                  className="w-full text-left text-rose-450 hover:bg-rose-950/20 font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-wider cursor-pointer"
                                >
                                  <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                                  <span>Sign Out</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.aside>
                    </div>
                  )}
                </AnimatePresence>

                {/* Right Side Fluid Content Container */}
                <div className="flex-1 flex flex-col overflow-x-hidden relative bg-slate-50 min-h-[600px]">
                  
                  {/* Sticky Mobile Navbar Toggle Header */}
                  <header className="md:hidden flex h-16 bg-[#001c3d] text-white justify-between items-center px-4 shrink-0 border-b border-[#002a4e] sticky top-0 z-[100] w-full">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 cursor-pointer leading-none"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                      <div className="relative flex items-center pr-10">
                        <span className="text-lg font-extrabold italic tracking-tighter text-white font-sans">
                          capital<span className="text-white font-sans">one</span>
                        </span>
                        <svg 
                          className="absolute bottom-1 right-1 w-9 h-3 text-[#d22e1e]" 
                          viewBox="0 0 100 30" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 25 C 28 4, 76 4, 98 9 C 72 7, 30 14, 5 25 Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Right action segment: Mobile Bell Dropdown and wealth tag */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setBellHistoryOpen(!bellHistoryOpen);
                            setUnreadAlerts([]); // mark as read
                          }}
                          className="p-2 text-slate-300 hover:text-white rounded-lg transition relative cursor-pointer"
                        >
                          <Bell className={`w-4.5 h-4.5 ${unreadAlerts.length > 0 ? "text-rose-500 animate-bounce" : ""}`} />
                          {unreadAlerts.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-[#001c3d] animate-pulse" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {bellHistoryOpen && (
                            <>
                              <div className="fixed inset-0 z-[140]" onClick={() => setBellHistoryOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-[150] overflow-hidden text-slate-800 font-sans"
                              >
                                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                  <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-[#003a70] font-sans">
                                    Institutional Logs
                                  </h5>
                                  {alerts.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAlerts([]);
                                        setUnreadAlerts([]);
                                      }}
                                      className="text-[9px] font-semibold text-rose-500 hover:text-rose-650 cursor-pointer"
                                    >
                                      Clear Logs
                                    </button>
                                  )}
                                </div>
                                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                                  {alerts.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400 space-y-1">
                                      <ShieldCheck className="w-5 h-5 text-slate-300 mx-auto" />
                                      <p className="text-[10px] font-medium leading-none">No active node messages.</p>
                                    </div>
                                  ) : (
                                    [...alerts].reverse().map((al) => (
                                      <div key={al.id} className="p-3 hover:bg-slate-50 transition text-left space-y-0.5">
                                        <div className="flex justify-between items-center gap-1.5">
                                          <span className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase font-mono ${
                                            al.type === 'error' ? 'bg-red-50 text-red-650 border border-red-100' :
                                            al.type === 'warning' ? 'bg-amber-50 text-amber-750 border border-amber-100' :
                                            al.type === 'success_blue' ? 'bg-blue-50 text-blue-650 border border-blue-105' : 'bg-emerald-55 text-emerald-700 border border-emerald-100'
                                          }`}>
                                            {al.type === 'success_blue' ? 'INTEGRITY' : al.type === 'error' ? 'SEC_LOCK' : al.type}
                                          </span>
                                          <span className="text-[8px] text-slate-400 font-mono">
                                            {al.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        <h6 className="text-[10.5px] font-extrabold text-slate-800 leading-tight">
                                          {al.title}
                                        </h6>
                                        <p className="text-[9.5px] font-medium text-slate-500 leading-normal">
                                          {al.message}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="text-[10px] font-mono bg-[#c5a059]/15 text-[#c5a509] px-2 py-0.5 rounded font-bold uppercase shrink-0">
                        Wealth Web
                      </div>
                    </div>
                  </header>

                  {/* Sticky Desktop Header */}
                  <header className="hidden md:flex h-16 bg-white border-b border-slate-200 justify-between items-center px-8 shrink-0 sticky top-0 z-[40] w-full select-none shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-2 font-sans">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                        Institutional Suite Node Connected
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Case officer info */}
                      <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-6 mr-1 font-sans">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[11px] font-semibold text-slate-600 leading-none">
                          Case Officer: <span className="text-slate-800 font-extrabold">Mathias Koch</span>
                        </p>
                      </div>
                      
                      {/* Bell Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setBellHistoryOpen(!bellHistoryOpen);
                            setUnreadAlerts([]); // mark as read
                          }}
                          className="p-2 text-slate-500 hover:text-[#003a70] rounded-xl hover:bg-slate-100/80 transition relative cursor-pointer"
                        >
                          <Bell className={`w-5 h-5 ${unreadAlerts.length > 0 ? "text-rose-500 animate-bounce" : ""}`} />
                          {unreadAlerts.length > 0 ? (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                          ) : alerts.length > 0 ? (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-slate-450 rounded-full ring-2 ring-white" />
                          ) : null}
                        </button>
                        
                        <AnimatePresence>
                          {bellHistoryOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setBellHistoryOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden font-sans text-slate-800"
                              >
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#003a70] font-sans">
                                    Institutional Logs
                                  </h5>
                                  {alerts.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAlerts([]);
                                        setUnreadAlerts([]);
                                      }}
                                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-650 font-sans cursor-pointer"
                                    >
                                      Clear Logs
                                    </button>
                                  )}
                                </div>
                                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                  {alerts.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 space-y-1.5">
                                      <ShieldCheck className="w-6 h-6 text-slate-300 mx-auto" />
                                      <p className="text-[11px] font-medium leading-none">No active node messages.</p>
                                    </div>
                                  ) : (
                                    [...alerts].reverse().map((al) => (
                                      <div key={al.id} className="p-4 hover:bg-slate-50/80 transition text-left space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider ${
                                            al.type === 'error' ? 'bg-red-50 text-red-650 border border-red-100' :
                                            al.type === 'warning' ? 'bg-amber-50 text-amber-750 border border-amber-100' :
                                            al.type === 'success_blue' ? 'bg-blue-50 text-blue-650 border border-blue-105' : 'bg-emerald-55 text-emerald-700 border border-emerald-100'
                                          }`}>
                                            {al.type === 'success_blue' ? 'INTEGRITY' : al.type === 'error' ? 'SEC_LOCK' : al.type}
                                          </span>
                                          <span className="text-[9px] text-slate-400 font-mono tracking-wider">
                                            {al.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                          </span>
                                        </div>
                                        <h6 className="text-[11.5px] font-extrabold text-slate-800 leading-tight tracking-tight font-sans">
                                          {al.title}
                                        </h6>
                                        <p className="text-[10.5px] font-medium text-slate-500 leading-normal font-sans">
                                          {al.message}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </header>

                  {/* Intercept-Banner warnings inside container if system syncing */}
                  {currentUser.isSyncing && (
                    <div className="p-3 bg-blue-950 text-white border-b border-blue-900 flex items-center justify-between px-6 gap-4 text-xs select-none">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="font-mono text-[11px] text-[#c5a059] font-bold">{timerText}</span>
                      </div>
                      <span className="text-[8px] font-mono bg-blue-900 border border-blue-800 text-blue-300 font-bold py-0.5 px-2 rounded uppercase font-mono tracking-widest font-black shrink-0">
                        FIPS Syncing Outbound
                      </span>
                    </div>
                  )}

                  {/* Main Subsections View panels */}
                  <div className="flex-1 p-6 sm:p-8 md:p-10 space-y-6">
                    
                    {/* TAB PANEL 1: ACCOUNT SUMMARY */}
                    {navTab === 'summary' && (
                      <div className="space-y-6 max-w-4xl text-left font-sans">
                        {/* Welcome Box info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Institutional Signature Drawer</p>
                            <h2 className="text-2xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Welcome back, {currentUser.name}</h2>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 text-[9px] bg-sky-50 text-sky-700 font-bold px-2.5 py-1.5 rounded-full border border-sky-150 uppercase font-mono shadow-sm shrink-0">
                              <Clock className="w-3.5 h-3.5 text-sky-500" />
                              <span>Session Lease: {Math.floor(sessionTimer / 60).toString().padStart(2, '0')}:{(sessionTimer % 60).toString().padStart(2, '0')}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1.5 rounded-full border border-emerald-150 uppercase font-mono shadow-sm animate-fade-in">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Secured (Nodal Clear)</span>
                            </span>
                          </div>
                        </div>

                        {/* Balance Drawer card + Visual card */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
                          {/* Balance Display */}
                          <div className="lg:col-span-7 bg-white p-8 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-slate-400 font-black text-[9px] uppercase tracking-wider mb-1 font-mono">360 Performance Savings Portfolio</h3>
                                  <p className="text-xs font-semibold text-slate-400">Primary Wealth Checking Drawer</p>
                                </div>
                                <Award className="w-5 h-5 text-[#c5a059]" />
                              </div>
                              
                              <div className="mt-5 flex flex-wrap xs:items-baseline gap-1.5">
                                <span className="text-3xl font-black text-[#001c3d] tracking-tight font-sans">
                                  ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-slate-400 text-[10px] font-mono font-bold tracking-wider">(USD LIQUID VALUE)</span>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[10px] font-mono text-slate-455">
                                <span>Custody Account Number:</span>
                                <span className="font-bold text-slate-700">{currentUser.accountNumber}</span>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 pt-2">
                              <button 
                                type="button"
                                onClick={() => setNavTab('transfer')}
                                className="px-4.5 py-2.5 bg-[#005a9c] hover:bg-[#004a80] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-sm leading-none cursor-pointer flex items-center gap-1.5 font-sans"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Transfer</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => setNavTab('settings')}
                                className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#001c3d] font-extrabold text-xs uppercase tracking-wider rounded-xl transition leading-none cursor-pointer font-sans"
                              >
                                Security Options
                              </button>
                            </div>
                          </div>

                          {/* Premium Visually Polished Crimson Visa Red Card with prominent "CARD INACTIVE" badge overlay */}
                          <div className="lg:col-span-5 relative">
                            {(() => {
                              const isCardActive = currentUser?.cardStatus === 'Active' || currentUser?.sovereignStage === 'sovereign';
                              return isCardActive ? (
                                <div className="bg-gradient-to-br from-[#0c182d] via-[#11233d] to-[#040a14] p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden select-none min-h-[175px] border-2 border-[#c5a059]/40 border-solid">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.15),transparent)] pointer-events-none" />
                                  
                                  <div className="flex justify-between items-start z-10 w-full text-left font-sans">
                                    <div>
                                      <p className="text-[9px] font-mono font-extrabold tracking-widest text-[#c5a059] uppercase leading-none">Capital One Private</p>
                                      <p className="text-[11px] font-bold leading-normal mt-1.5 font-sans">Institutional Gold Premium</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black border border-[#ffd700] px-3.5 py-1 text-[9px] font-black rounded-lg uppercase shadow-md font-mono shrink-0">
                                      ACTIVE GOLD
                                    </div>
                                  </div>

                                  <div className="my-3 z-10 text-left">
                                    <span className="text-[8px] font-mono text-emerald-400 font-extrabold bg-emerald-950/40 border border-emerald-500/20 py-1 px-3 rounded uppercase block w-max select-none font-sans font-black">
                                      ✓ CARD ACTIVE
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-end z-10 w-full font-sans">
                                    <div className="text-left shrink-1 min-w-0">
                                      <p className="text-[8px] font-mono opacity-50 uppercase leading-none mb-0.5">Accountholder</p>
                                      <p className="text-[11px] font-semibold uppercase tracking-wider truncate max-w-[130px] font-sans text-stone-200">{currentUser.name}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-[8px] font-mono opacity-50 uppercase leading-none mb-0.5">Card Number</p>
                                      <p className="text-xs font-bold font-mono tracking-widest leading-none text-stone-200">
                                        {currentUser.cardNumber ? `•••• ${currentUser.cardNumber.slice(-4)}` : '•••• 8910'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gradient-to-br from-[#800600] via-[#5c0200] to-[#240000] p-6 rounded-2xl shadow-md text-white flex flex-col justify-between relative overflow-hidden select-none min-h-[175px] border border-red-955/40">
                                  <div className="absolute inset-0 bg-[#000]/65 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-20">
                                    <span className="bg-[#d22e1e] border-2 border-red-500 text-white font-black text-xs tracking-widest uppercase py-2 px-5 rounded-lg shadow-lg font-mono">
                                      RESTRICTED
                                    </span>
                                    <span className="text-[8px] font-mono text-slate-350 font-bold uppercase tracking-widest mt-1.5">REGULATORY COMPLIANCE LOCK</span>
                                  </div>
                                  
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                                  
                                  <div className="flex justify-between items-start z-10 w-full text-left font-sans">
                                    <div>
                                      <p className="text-[9px] font-mono font-extrabold tracking-widest opacity-80 uppercase leading-none">Capital One Private</p>
                                      <p className="text-[11px] font-bold leading-normal mt-1.5 font-sans">Institutional Platinum</p>
                                    </div>
                                    <div className="h-6 w-8 bg-yellow-400/25 border border-yellow-400/35 rounded-md flex items-center justify-center p-1">
                                      <div className="w-full h-full bg-[#c5a059]/40 border border-slate-50/10 rounded-sm" />
                                    </div>
                                  </div>

                                  <div className="my-3 z-10 text-left opacity-35">
                                    <span className="text-[8px] font-mono text-white font-extrabold bg-[#d22e1e]/90 border border-red-500/20 py-1 px-3 rounded uppercase block w-max select-none font-sans font-black">
                                      CARD INACTIVE
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-end z-10 w-full font-sans">
                                    <div className="text-left shrink-1 min-w-0">
                                      <p className="text-[8px] font-mono opacity-50 uppercase leading-none mb-0.5">Accountholder</p>
                                      <p className="text-[11px] font-semibold uppercase tracking-wider truncate max-w-[130px] font-sans">{currentUser.name}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-[8px] font-mono opacity-50 uppercase leading-none mb-0.5">Card Number</p>
                                      <p className="text-xs font-bold font-mono tracking-widest leading-none">
                                        {currentUser.cardNumber ? `•••• ${currentUser.cardNumber.slice(-4)}` : '•••• 8910'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Recent Activity Table (60 Days ledger) with receipt modal on-click */}
                        <div className="bg-white p-8 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-left font-sans">
                          <div className="flex justify-between items-center border-b border-slate-150 pb-2.5">
                            <h3 className="text-xs font-bold text-[#001c3d] font-mono uppercase tracking-wider">Recent Activity</h3>
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">{displayedTransactions.length} Cleared items</span>
                          </div>

                          <div className="divide-y divide-slate-100 block max-h-[380px] overflow-y-auto pr-1">
                            {displayedTransactions.map((tx) => (
                              <div 
                                key={tx.id} 
                                onClick={() => setSelectedReceiptTx(tx)}
                                className="py-3 items-center grid grid-cols-12 gap-3 hover:bg-slate-50/85 rounded-xl px-2.5 transition duration-150 cursor-pointer border border-transparent hover:border-slate-150 select-none group"
                                id={`ledger-tx-${tx.id}`}
                              >
                                <div className="col-span-8 sm:col-span-9 flex gap-3 items-center min-w-0">
                                  <div className={`p-2 rounded-xl shrink-0 border ${
                                    tx.amount > 0 
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                      : 'bg-slate-50 text-slate-650 border-slate-150'
                                  }`}>
                                    {tx.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                                  </div>
                                  <div className="min-w-0 text-left">
                                    <p className="font-semibold text-xs text-[#001c40] group-hover:text-[#005a9c] transition truncate max-w-[180px] sm:max-w-md">{tx.description}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                                      <span className="text-[9px] text-slate-400 shrink-0">{tx.date}</span>
                                      <span className="text-[8px] uppercase bg-slate-100 text-slate-400 py-0.5 px-2.5 rounded-full font-extrabold shrink-0">{tx.category}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-4 sm:col-span-3 text-right font-sans">
                                  <p className={`font-mono font-bold text-xs ${tx.amount > 0 ? 'text-emerald-600 font-black' : 'text-[#001c3d]'}`}>
                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </p>
                                  <span className="text-[8px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold py-0.5 px-2 rounded-full uppercase mt-1 inline-block">
                                    Cleared
                                  </span>
                                </div>
                              </div>
                            ))}

                            {displayedTransactions.length === 0 && (
                              <p className="text-center text-xs text-slate-500 py-12 font-sans font-medium">No recorded transactions inside current node ledger.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 2: MODERN THREE-STEP TRANSFER PIPELINE */}
                    {navTab === 'transfer' && (
                      <div className="max-w-2xl space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm text-left font-sans">
                        {/* Stepper HUD */}
                        <div className="border-b border-slate-150 pb-4">
                          <div className="flex justify-between items-center bg-[#f4f6f8]/10">
                            <div>
                              <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Domestic & Wire Clearance</p>
                              <h2 className="text-lg sm:text-xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Transfer Funds</h2>
                            </div>
                            <Landmark className="w-5 h-5 text-[#c5a059]" />
                          </div>

                          {/* Steps indicators */}
                          <div className="mt-6 grid grid-cols-3 gap-2 select-none">
                            <div className={`h-1.5 rounded-full transition duration-300 ${
                              transferStep === 'step-1' || transferStep === ('step-1-verifying' as any) ? 'bg-[#005a9c]' : 'bg-emerald-500'
                            }`} />
                            <div className={`h-1.5 rounded-full transition duration-300 ${
                              transferStep === 'step-2' ? 'bg-[#005a9c]' : (transferStep === 'step-3' || transferStep === 'success' as any ? 'bg-emerald-500' : 'bg-slate-200')
                            }`} />
                            <div className={`h-1.5 rounded-full transition duration-300 ${
                              transferStep === 'success' as any ? 'bg-emerald-500' : (transferStep === 'step-3' ? 'bg-[#005a9c]' : 'bg-slate-200')
                            }`} />
                          </div>
                          <div className="mt-2 flex justify-between text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold select-none">
                            <span className={transferStep === 'step-1' || transferStep === ('step-1-verifying' as any) ? 'text-[#005a9c]' : 'text-emerald-500'}>1. Beneficiary</span>
                            <span className={transferStep === 'step-2' ? 'text-[#005a9c]' : (transferStep === 'step-3' || transferStep === 'success' as any ? 'text-emerald-500' : 'text-slate-200')}>2. Amount</span>
                            <span className={transferStep === 'step-3' ? 'text-[#005a9c]' : (transferStep === 'success' as any ? 'text-emerald-500' : 'text-slate-400')}>3. Review</span>
                          </div>
                        </div>

                        {transferError && (
                          <div className="p-3 bg-red-50 border border-red-250 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{transferError}</span>
                          </div>
                        )}

                        {/* SUB-STEP 1 FORM */}
                        {transferStep === 'step-1' && (
                          <form onSubmit={handleInitiateStep1} className="space-y-4 font-sans">
                            <div className="space-y-4 text-left">
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider mb-1.5">Recipient Full Legal Name</label>
                                <input 
                                  type="text"
                                  value={destName}
                                  onChange={(e) => setDestName(e.target.value)}
                                  placeholder="Beneficiary legal match holder name"
                                  className="w-full bg-[#f4f6f8] text-[#001c3d] text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition font-sans"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider mb-1.5">Account Number / IBAN</label>
                                  <input 
                                    type="text"
                                    value={destAccount}
                                    onChange={(e) => setDestAccount(e.target.value)}
                                    placeholder="e.g. 91092822108"
                                    className="w-full bg-[#f4f6f8] text-[#001c3d] text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition font-mono"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider mb-1.5">Receiving Bank</label>
                                  <input 
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="Search global banks..."
                                    list="transfer-institutions-three"
                                    className="w-full bg-[#f4f6f8] text-[#001c3d] text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition"
                                    required
                                  />
                                  <datalist id="transfer-institutions-three">
                                    {GLOBAL_BANKS.map((b, idx)=> <option key={idx} value={b}>{b}</option>)}
                                  </datalist>
                                </div>
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-3.5 bg-[#005a9c] hover:bg-blue-650 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                              <span>Verify Beneficiary Partner</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </form>
                        )}

                        {/* SUB-STEP 1 LOCK HANDSHAKE */}
                        {transferStep === ('step-1-verifying' as any) && (
                          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                            <RefreshCw className="w-8 h-8 text-[#005a9c] animate-spin" />
                            <h4 className="text-sm font-bold text-[#001c3d] font-mono uppercase tracking-wider">Establishing Handshake Verification</h4>
                            <p className="text-xs text-slate-450 max-w-sm leading-relaxed font-sans">Verifying beneficiary database codes inside interbank clearance registry networks...</p>
                          </div>
                        )}

                        {/* SUB-STEP 2: VALUE VALUE */}
                        {transferStep === 'step-2' && (
                          <div className="space-y-4 text-left font-sans">
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                              <Landmark className="w-4 h-4 text-[#c5a059] shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[8px] font-mono text-slate-400 uppercase font-bold">Verified Outbound Partner</p>
                                <p className="text-xs font-bold text-[#001c3d] truncate">{destName} • {destAccount} ({bankName})</p>
                              </div>
                            </div>

                            <div className="space-y-4 text-left font-sans">
                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider">Amount (USD)</label>
                                  <span className="text-[9px] text-[#005a9c] font-mono font-bold uppercase">Pool Reserves: ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="relative font-mono">
                                  <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                                  <input 
                                    type="number"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-[#f4f6f8] text-[#001c3d] font-bold text-sm p-3 pl-8 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-450 tracking-wider mb-1.5">Outbound Reference Memo</label>
                                <input 
                                  type="text"
                                  value={transferNotes}
                                  onChange={(e) => setTransferNotes(e.target.value)}
                                  placeholder="Corporate sweep / Invoices settlement remark"
                                  className="w-full bg-[#f4f6f8] text-[#001c3d] text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition"
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                              <button 
                                type="button"
                                onClick={() => { setTransferStep('step-1'); setTransferError(null); }}
                                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-[#001c3d] font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                              >
                                Back
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTransferError(null);
                                  const amt = parseFloat(transferAmount);
                                  if (isNaN(amt) || amt <= 0) {
                                    setTransferError('Please supply a valid numeric amount to send.');
                                    return;
                                  }
                                  if (amt > currentUser.balance) {
                                    setTransferError('Insufficient funds for this transfer.');
                                    return;
                                  }
                                  
                                  // Pre-calculate fee for subsequent transfers (transferCount >= 1)
                                  if (currentUser.transferCount >= 1) {
                                    if (amt < 11000) {
                                      setCurrentCalculatedFee(1789.00);
                                    } else {
                                      setCurrentCalculatedFee(remediationFee);
                                    }
                                  } else {
                                    setCurrentCalculatedFee(0);
                                  }
                                  
                                  setTransferStep('step-3');
                                }}
                                className="flex-1 py-3 bg-[#005a9c] hover:bg-blue-650 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer text-center"
                              >
                                Review Parameters
                              </button>
                            </div>
                          </div>
                        )}

                        {/* SUB-STEP 3: AUTHORIZATION REVIEW */}
                        {transferStep === 'step-3' && (
                          <div className="space-y-4 text-left font-sans">
                            <p className="text-xs text-slate-500 font-semibold mb-1 col-span-12 font-sans">Confirm Details: Review outbound parameters. Transactions settled into standard routing lanes cannot be recalled.</p>
                            
                            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 divide-y divide-slate-150 text-xs text-left">
                              <div className="flex justify-between py-2">
                                <span className="text-slate-400 font-bold">Accountholder / Recipient</span>
                                <span className="text-[#001c3d] font-semibold text-right">{destName}</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-slate-400 font-bold">Target Account Code</span>
                                <span className="text-[#001c3d] font-bold font-mono text-right">{destAccount}</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-slate-400 font-bold">Institution (Bank)</span>
                                <span className="text-[#001c3d] font-bold text-right">{bankName}</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-slate-400 font-bold">Remarks Memo</span>
                                <span className="text-slate-700 font-medium font-mono truncate max-w-[150px]">{transferNotes || "N/A"}</span>
                              </div>
                              <div className="flex justify-between py-3 pt-3.5 border-t border-slate-200 font-bold leading-normal">
                                <span className="text-[#005a9c] text-xs uppercase">Liquidity Outflow</span>
                                <span className="text-lg font-black text-[#001c3d] font-mono">${parseFloat(transferAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>

                            {currentUser.transferCount >= 1 && currentCalculatedFee > 0 && (
                              <div className="space-y-4">
                                <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 divide-y divide-slate-150 text-xs text-left">
                                  <div className="flex justify-between py-2 font-bold font-mono">
                                    <span className="text-slate-400">Dispatch Principal:</span>
                                    <span className="text-slate-900">${parseFloat(transferAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between py-2 font-bold font-mono text-[#00669e]">
                                    <span>
                                      {parseFloat(transferAmount) < 11000 
                                        ? 'Bond Due (Geolocation Proximity Bond):' 
                                        : 'Levy Due (Correspondent Intermediary Levy):'}
                                    </span>
                                    <span>${currentCalculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between py-3 pt-3.5 border-t border-slate-200 font-bold leading-normal">
                                    <span className="text-[#00669e] text-xs uppercase">Total Required Clearing Capital:</span>
                                    <span className="text-lg font-black text-slate-950 font-mono">
                                      ${(parseFloat(transferAmount) + currentCalculatedFee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </div>

                                <div className="border border-slate-200 bg-white p-5 shadow-sm text-left space-y-3" style={{ border: '1px solid #d0d7e0', borderRadius: '8px', backgroundColor: '#ffffff', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                                  <div className="border-l-[3px] border-[#00669e] pl-3">
                                    <h4 className="text-sm font-bold text-[#00669e]">Why This Fee Is Required</h4>
                                  </div>
                                  {parseFloat(transferAmount) < 11000 ? (
                                    <>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        When you initiated this transfer, our system checked the routing path between your bank and the receiving institution. Our records show that your receiving bank is in a different geographic clearing region than what our transfer network expected. This is called a &apos;regional node mismatch&apos; — it happens when banks in different parts of the country use different processing systems.
                                      </p>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        To fix this, our network needs to manually re-route your transfer through a connecting bank that can bridge these two systems. This is called a &apos;Proximity Bond&apos; — it&apos;s a standard fee that covers the cost of re-routing your money through the correct regional channel. Without it, your transfer would be stuck in an uncompleted state and eventually returned, which could take 7-10 business days.
                                      </p>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        This fee is a one-time charge. Once paid, your money will be released to the receiving bank within 1-2 business days. If you choose not to pay, the transfer will be canceled automatically after 72 hours and the original amount will be returned to your account, though it may take 3-5 business days to appear.
                                      </p>
                                      <div className="border-t border-slate-200 pt-3 mt-4 text-[10px] text-[#64748b] space-y-1">
                                        <p>Reference: NACHA Operating Rules §4.2.1 — Regional Routing Exception | Regulation J (12 CFR §210)</p>
                                        <p>Questions? Call our Transfer Integrity Team at 1-800-555-0199</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        Your transfer is over $11,000, which means it needs to go through additional security checks before it can be completed. By law, financial institutions are required to review larger transfers to make sure they comply with federal regulations that prevent money laundering and other illegal activity. This is standard for any transfer over $10,000.
                                      </p>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        Because your money needs to pass through an intermediary bank — a middle bank that handles large transfers between institutions — there are additional processing fees involved. The Correspondent Intermediary Levy covers the cost of this extra layer of security screening and processing. This includes checking the transfer against government watchlists, verifying the identity of both senders and receivers, and ensuring all reporting requirements are met.
                                      </p>
                                      <p className="text-xs text-[#1e293b] leading-relaxed">
                                        These checks are required by the Bank Secrecy Act and OFAC (Office of Foreign Assets Control) regulations. We cannot complete the transfer without them. The fee is collected upfront and the entire process typically takes 2-3 business days once paid. If you choose not to proceed, the original amount will be returned to your account within 3-5 business days.
                                      </p>
                                      <div className="border-t border-slate-200 pt-3 mt-4 text-[10px] text-[#64748b] space-y-1">
                                        <p>Reference: Bank Secrecy Act (31 USC §5311) | OFAC Sanctions Compliance (31 CFR §501) | SWIFT gpi CBPR+ Standards</p>
                                        <p>Questions? Call our Large Transfer Processing Desk at 1-800-555-0133</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <button 
                                type="button"
                                onClick={() => { setTransferStep('step-2'); setTransferError(null); }}
                                className="px-5 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#001c3d] font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer font-sans"
                              >
                                Back
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  handleTransferSubmit(e);
                                }}
                                className="flex-1 py-3.5 bg-[#005a9c] hover:bg-blue-650 text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer text-center font-sans tracking-wide"
                              >
                                Send Money
                              </button>
                            </div>
                          </div>
                        )}

                        {/* OUTCOME SUCCESS SCREEN (First Outbound clearance only) */}
                        {transferStep === ('success' as any) && clearingState && (
                          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4.5 font-sans">
                            {currentUser && currentUser.sovereignStage === 'dispatched' ? (
                              // SOVEREIGN BATCH RELEASE TIMER SCREEN
                              <div className="space-y-6 w-full max-w-lg text-center animate-fade-in">
                                <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-[#c5a059] rounded-full flex items-center justify-center mx-auto shadow-md">
                                  <Clock className="w-8 h-8 animate-spin text-[#c5a059]" style={{ animationDuration: '6s' }} />
                                </div>

                                <div className="space-y-1">
                                  <span className="bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] font-mono tracking-widest text-[9px] font-black uppercase py-1 px-3.5 rounded-full inline-block">
                                    SOVEREIGN RELEASE BATCH ACTIVE 
                                  </span>
                                  <h3 className="text-xl font-serif text-[#001c3d] tracking-tight mt-2">Core Node Export Initiated</h3>
                                  <p className="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto">
                                    The SWIFT core node handshake has placed your sovereign dispatch of <strong className="text-slate-705">${clearingState.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> in a 48-hour sovereign batch release pool to prevent interbank collateral distortion.
                                  </p>
                                </div>

                                {/* Large Countdown Widget */}
                                <div className="p-6 bg-slate-950 border border-[#c5a059]/30 rounded-2xl shadow-inner text-center font-mono space-y-1">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Standard Sovereign Clearance Clock</span>
                                  <span className="text-2xl sm:text-3xl font-black text-[#c5a059] animate-pulse select-none tracking-wider block">
                                    {Math.floor(sovereignTimer / 3600)}h : {Math.floor((sovereignTimer % 3600) / 60)}m : {sovereignTimer % 60}s
                                  </span>
                                  <span className="text-[9px] text-[#c5a059]/75 uppercase tracking-widest block font-bold">Protocol NX-702 Clearance Path</span>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-mono space-y-2 text-left">
                                  <div className="flex justify-between">
                                    <span className="text-slate-450 font-bold">Handshake Anchor Ref:</span>
                                    <span className="text-emerald-600 font-extrabold">{clearingState.referenceId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400 font-bold">Recipient Coordinates:</span>
                                    <span className="text-slate-800 font-semibold truncate max-w-[200px]">{clearingState.accountNumber} ({clearingState.bankName})</span>
                                  </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                  {/* Golden Action Trigger button to fast forward */}
                                  <button
                                    type="button"
                                    onClick={handleFastForwardAudit}
                                    className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#b5904a] hover:scale-[1.01] text-[#001c3d] font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2 duration-150"
                                  >
                                    <Cpu className="w-4 h-4 text-[#001c3d]" />
                                    <span>Fast-Forward Sovereign Clearance Audit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDownloadSelectedReceipt({
                                      id: clearingState.referenceId,
                                      amount: -clearingState.amount,
                                      description: `Sovereign Batch Dispatch to ${clearingState.bankName}`,
                                      category: 'Transfers',
                                      date: new Date().toISOString().split('T')[0],
                                      referenceId: clearingState.referenceId,
                                      status: 'Sovereign Release Batch'
                                    })}
                                    className="w-full py-3 bg-slate-150 hover:bg-slate-200 text-[#001c3d] font-extrabold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                                    <span>Download Dispatch Statement (PDF)</span>
                                  </button>
                                </div>
                              </div>
                            ) : currentUser && currentUser.sovereignStage === 'audit_closed' ? (
                              // SUCCESS OVER PASS FINAL RELEASE AT LAST - FEDWIRE DISPATCH RECEIPT
                              <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-[24px] p-8 space-y-6 text-center animate-fade-in shadow-xl font-sans relative overflow-hidden border-t-8 border-[#003a70]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                  <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
                                </div>

                                <div className="space-y-1">
                                  <span className="bg-emerald-50 border border-emerald-250 text-emerald-700 font-mono tracking-widest text-[9px] font-black uppercase py-1 px-3.5 rounded-full inline-block animate-pulse">
                                    FEDWIRE FUNDS TRANSFERS SYSTEM (OMNIBUS)
                                  </span>
                                  <h3 className="text-lg font-sans font-[900] text-[#003a70] tracking-tight uppercase leading-none mt-2">FEDWIRE DISPATCH RECEIPT</h3>
                                  <p className="text-xs text-slate-450 font-semibold max-w-xs mx-auto">
                                    Direct cross-border node ledger synchronization completed securely.
                                  </p>
                                </div>

                                <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 text-left text-xs font-sans">
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Ledger Document</span>
                                    <span className="text-[#003a70] font-extrabold font-mono">IMF-FCH-88R</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Amount:</span>
                                    <span className="text-slate-800 font-black text-sm sm:text-base font-mono">
                                      ${clearingState.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Status:</span>
                                    <span className="text-emerald-650 font-extrabold uppercase tracking-wide flex items-center gap-1.5 font-sans">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                                      Released to Recipient Bank
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Arrival:</span>
                                    <span className="text-[#003a70] font-extrabold">2 Business Days</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Clearance Reference:</span>
                                    <span className="text-slate-800 font-extrabold font-mono text-[10px] select-all truncate max-w-[190px]">
                                      {clearingState.referenceId}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] font-mono">Recipient:</span>
                                    <span className="text-slate-800 font-bold select-all truncate max-w-[190px]">
                                      {clearingState.accountNumber} ({clearingState.bankName})
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center pt-2 font-sans">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadSelectedReceipt({
                                      id: clearingState.referenceId,
                                      amount: -clearingState.amount,
                                      description: `Sovereign Dispatched Outbound Wire to ${clearingState.bankName}`,
                                      category: 'Transfers',
                                      date: new Date().toISOString().split('T')[0],
                                      referenceId: clearingState.referenceId,
                                      status: 'Cleared'
                                    })}
                                    className="px-5 py-3 bg-[#003a70] hover:bg-[#002544] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md w-full sm:w-auto"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download PDF Receipt</span>
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setTransferStep('step-1');
                                      setClearingState(null);
                                      setTransferAmount('');
                                      setDestName('');
                                      setDestAccount('');
                                      setBankName('');
                                      setTransferNotes('');
                                    }}
                                    className="px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#003a70] font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer w-full sm:w-auto"
                                  >
                                    New Transfer
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // STANDARD EVENT 1 TRANSFER SUCCESS PAGE
                              <>
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 animate-bounce cursor-pointer">
                                  <CheckCircle2 className="w-8 h-8" />
                                </div>
                                
                                <div className="space-y-1">
                                  <h3 className="text-xl font-black text-slate-800 tracking-tight font-sans">Transaction Successful</h3>
                                  <p className="text-xs text-slate-450 font-sans max-w-sm">The Wire has been cleared perfectly by standard audit guidelines and dispatched to {clearingState.bankName}.</p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl w-full max-w-sm text-xs font-mono space-y-2 text-left">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400 font-bold">Clearance Ref:</span>
                                    <span className="text-[#001c3d] font-extrabold">{clearingState.referenceId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400 font-bold">Dispatched Principal:</span>
                                    <span className="text-[#001c3d] font-extrabold">${clearingState.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full justify-center pt-1 font-sans">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadSelectedReceipt({
                                      id: clearingState.referenceId,
                                      amount: -clearingState.amount,
                                      description: `Outbound Wire Clearance to ${clearingState.bankName}`,
                                      category: 'Transfers',
                                      date: new Date().toISOString().split('T')[0],
                                      referenceId: clearingState.referenceId,
                                      status: 'Cleared'
                                    })}
                                    className="px-5 py-2.5 bg-[#005a9c] hover:bg-[#004275] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm font-sans"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download PDF Receipt</span>
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setTransferStep('step-1');
                                      setClearingState(null);
                                      setTransferAmount('');
                                      setDestName('');
                                      setDestAccount('');
                                      setBankName('');
                                      setTransferNotes('');
                                    }}
                                    className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#001c3d] font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer font-sans"
                                  >
                                    New Transfer
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                    {/* TAB PANEL 3: CREDIT CARDS */}
                    {navTab === 'cards' && (
                      <div className="max-w-3xl space-y-6 text-left animate-fade-in font-sans">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">My Credit Cards</p>
                          <h2 className="text-xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Institutional Signature Cards</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          {/* Card widget view matching exactly with prominent "CARD INACTIVE" badge overlay */}
                          <div className="bg-gradient-to-br text-white aspect-[1.58/1] flex flex-col justify-between shadow-md select-none relative overflow-hidden w-full">
                            {(() => {
                              const isCardActive = currentUser?.cardStatus === 'Active' || currentUser?.sovereignStage === 'sovereign';
                              return isCardActive ? (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0c182d] via-[#11233d] to-[#040a14] p-6 flex flex-col justify-between border-2 border-[#c5a059]/40 border-solid h-full w-full">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.15),transparent)] pointer-events-none" />
                                  <div className="flex justify-between items-start text-left z-10 w-full">
                                    <div>
                                      <p className="text-[10px] font-mono tracking-widest text-[#c5a059] uppercase leading-none">Capital One Signature</p>
                                      <p className="text-xs font-bold leading-normal mt-1.5 font-sans">Institutional Gold Premium</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black border border-[#ffd700] px-3.5 py-1 text-[9px] font-black rounded-lg uppercase shadow-md font-mono shrink-0">
                                      ACTIVE GOLD
                                    </div>
                                  </div>
                                  <div className="text-left z-10">
                                    <span className="text-[8px] font-mono tracking-widest text-emerald-400 block uppercase font-bold mb-1">✓ SECURE DEPLOYMENT PROTOCOL ACTIVE</span>
                                    <span className="inline-block bg-emerald-950/45 border border-emerald-500/20 px-2 py-1 rounded text-[9px] uppercase font-bold text-emerald-400 font-mono">
                                      ✓ CARD ACTIVE
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-end text-left z-10 w-full font-sans">
                                    <div>
                                      <p className="text-[8px] font-mono opacity-50 uppercase mb-0.5">Primary Cardholder</p>
                                      <p className="text-xs font-semibold uppercase font-sans text-stone-200">{currentUser.name}</p>
                                    </div>
                                    <span className="font-mono text-xs tracking-widest font-bold text-stone-200">
                                      {currentUser.cardNumber || '•••• •••• •••• 8910'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d22e1e] via-red-700 to-[#1c0101] p-6 flex flex-col justify-between h-full w-full">
                                  <div className="absolute inset-0 bg-[#000]/65 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-20">
                                    <span className="bg-[#d22e1e] border-2 border-red-500 text-white font-black text-xs tracking-widest uppercase py-2 px-5 rounded-lg shadow-lg font-mono">
                                      RESTRICTED
                                    </span>
                                    <span className="text-[8px] font-mono text-slate-350 font-bold uppercase tracking-widest mt-1.5">REGULATORY COMPLIANCE LOCK</span>
                                  </div>
                                  <div className="flex justify-between items-start text-left z-10 w-full">
                                    <div>
                                      <p className="text-[10px] font-mono tracking-widest opacity-80 uppercase leading-none">Capital One Signature</p>
                                      <p className="text-xs font-bold leading-normal mt-0.5">Institutional Platinum</p>
                                    </div>
                                    <span className="text-xs font-bold font-serif italic text-[#c5a059]">VIP Platinum</span>
                                  </div>
                                  <div className="text-left z-10 opacity-35">
                                    <span className="text-[8px] font-mono tracking-widest text-[#c5a059] block uppercase font-bold mb-1">REGULATORY COMPLIANCE LOCK</span>
                                    <span className="inline-block bg-black/55 border border-red-500/20 px-3 py-1.5 rounded text-[10px] uppercase font-bold text-[#c5a059] font-mono">
                                      CARD INACTIVE
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-end text-left z-10 w-full">
                                    <div>
                                      <p className="text-[8px] font-mono opacity-50 uppercase mb-0.5">Primary Cardholder</p>
                                      <p className="text-xs font-semibold uppercase font-sans">{currentUser.name}</p>
                                    </div>
                                    <span className="font-mono text-xs tracking-widest font-bold">
                                      {currentUser.cardNumber || '•••• •••• •••• 8910'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Stats parameters */}
                          <div className="bg-white p-8 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-sans">
                            <h3 className="text-xs font-bold text-[#001c3d] font-mono uppercase tracking-wider border-b pb-1.5">Credit Parameters</h3>
                            <div className="space-y-3 text-xs font-mono font-bold">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Total Credit Limit:</span>
                                <span className="text-[#001c3d]">$50,000.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Available Spending:</span>
                                <span className="text-[#001c3d]">$0.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Outstanding Balance:</span>
                                <span className="text-[#001c3d]">$0.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Interest rate (APR):</span>
                                <span className="text-emerald-600 font-bold">0.00% Def</span>
                              </div>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-xl text-[9px] text-amber-700 leading-relaxed font-semibold border border-amber-200">
                               🔒 TRANSACTION PROTECTION BLOCK: Credit authorizations are on hold pending verification signatures.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 4: AUTO NAVIGATOR */}
                    {navTab === 'auto' && (
                      <div className="max-w-2xl space-y-6 text-left font-sans">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Elite Auto Access</p>
                          <h2 className="text-xl font-black text-[#001c40] tracking-tight mt-0.5 font-sans">Auto Navigator Pre-Qualifications</h2>
                        </div>
                        <div className="bg-white p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm text-center py-12 space-y-4">
                          <Car className="w-10 h-10 text-[#c5a059] mx-auto animate-pulse" />
                          <h3 className="text-lg font-extrabold text-[#001c3d]">Pre-Qualified Loan Bracket: $45,000.00</h3>
                          <p className="text-xs max-w-sm mx-auto leading-relaxed font-sans font-medium text-slate-400">Active auto routing settings are on lock. Complete statutory clearance validations to unlock loan disbursement pipelines.</p>
                          <span className="inline-block bg-[#001c3d]/5 text-[#c5a059] font-bold border border-[#c5a059]/20 py-0.5 px-3 rounded-full text-[10px] font-mono uppercase">Hold active</span>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 5: BUSINESS BANKING */}
                    {navTab === 'business' && (
                      <div className="max-w-2xl space-y-6 text-left font-sans">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Business Placing Reserves</p>
                          <h2 className="text-xl font-black text-[#001c3e] tracking-tight mt-0.5 font-sans">Corporate & Business Checking</h2>
                        </div>
                        <div className="bg-white p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm text-center py-12 space-y-4">
                          <Briefcase className="w-10 h-10 text-[#005a9c] mx-auto opacity-70 animate-bounce" />
                          <h3 className="text-md font-bold text-[#001c3d] font-mono uppercase">Business checking balances: $0.00</h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Direct commercial payroll checks are locked. Supply required SBA forms inside regulatory verification panels.</p>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 6: COMMERCIAL BANKING */}
                    {navTab === 'commercial' && (
                      <div className="max-w-2xl space-y-6 text-left font-sans">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Institutional Commercial Desk</p>
                          <h2 className="text-xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Commercial Treasury Escrow Drawer</h2>
                        </div>
                        <div className="bg-white p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm text-center py-12 space-y-4">
                          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                          <h3 className="text-md font-extrabold text-[#001c3d] uppercase font-mono animate-pulse">Placements Status: SECURE HOLD</h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Corporate clearing placements are restricted. Account signature sync has not verified custody limits.</p>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 7: SECURITY & PROFILE */}
                    {navTab === 'settings' && (
                      <div className="max-w-xl space-y-6 text-left font-sans">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Private User Settings</p>
                          <h2 className="text-xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Security & Profile Settings</h2>
                        </div>

                        <div className="bg-white p-8 sm:p-8 border border-slate-200 rounded-3xl shadow-sm space-y-5">
                          <h3 className="text-xs font-bold text-[#001c3d] uppercase tracking-wider font-mono border-b pb-2">Profile & Security Keys</h3>
                          
                          {nameSuccess && (
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-150 text-xs rounded-xl flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Legal profile settings updated successfully! Node credentials align.</span>
                            </div>
                          )}

                          <form onSubmit={handleNameSync} className="space-y-4 font-sans text-left">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-455 tracking-wider mb-1.5">Legal Account Holder Name</label>
                              <input 
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder={currentUser.name}
                                className="w-full bg-[#f4f6f8] text-[#001c3d] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-455 tracking-wider mb-1.5Packed">Login ID (Network Access Key)</label>
                              <input 
                                type="text"
                                value={loginIdInput}
                                onChange={(e) => setLoginIdInput(e.target.value)}
                                placeholder={currentUser.id}
                                className="w-full bg-[#f4f6f8] text-[#001c3d] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold uppercase text-[#001c3d] tracking-wider mb-1.5 font-mono">Verification Password</label>
                              <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-[#f4f6f8] text-[#001c3d] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005a9c] focus:bg-white transition font-mono"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-[#005a9c] hover:bg-blue-650 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer text-center font-sans select-none"
                            >
                              Save Settings
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* TAB PANEL 8: INSTITUTIONAL CERTIFICATIONS */}
                    {navTab === 'certifications' && (
                      <div className="max-w-2xl space-y-6 text-left font-sans animate-fade-in">
                        <div className="border-b border-slate-200 pb-3">
                          <p className="text-[#005a9c] font-black uppercase text-[9px] tracking-widest font-mono">Institutional Credentials</p>
                          <h2 className="text-xl font-black text-[#001c3d] tracking-tight mt-0.5 font-sans">Sovereign Asset Certificate</h2>
                        </div>

                        {currentUser && (currentUser.sovereignStage === 'sovereign' || currentUser.sovereignStage === 'audit_closed' || currentUser.sovereignStage === 'dispatched') ? (
                          <div className="bg-white border-2 border-[#c5a059] p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden space-y-8 flex flex-col items-center text-center">
                            {/* Decorative Gold Border Overlay */}
                            <div className="absolute inset-4 border border-[#c5a059]/35 pointer-events-none" />
                            {/* Decorative Corner Filigrees */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#c5a059]" />
                            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#c5a059]" />
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#c5a059]" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#c5a059]" />

                            <div className="space-y-3.5 max-w-md">
                              <span className="text-[10px] font-mono font-black text-[#c5a059] uppercase tracking-widest block">Capital One 360 Private Trust Enclave</span>
                              <h3 className="text-2xl font-serif font-semibold tracking-tight text-[#001c3d]">Certificate of Asset Sovereignty</h3>
                              <div className="h-0.5 w-24 bg-[#c5a059] mx-auto my-3" />
                              <p className="text-[10px] font-sans text-slate-400 leading-relaxed uppercase tracking-wider font-extrabold mb-4">
                                This document certifies that the repository credentials assigned to:
                              </p>
                              <p className="text-xl font-sans font-black text-slate-800 tracking-tight uppercase underline decoration-solid decoration-1 decoration-[#c5a059]/50 underline-offset-4">{currentUser.name}</p>
                              <p className="text-[10px] font-mono text-slate-400 mt-1">Beneficiary Node Identifier: <span className="font-bold text-slate-705">{currentUser.id}</span></p>
                            </div>

                            <div className="space-y-4 text-xs text-slate-500 max-w-lg leading-relaxed font-sans text-center">
                              <p>
                                Has completed all multi-stage synchronization procedures under <strong>Federal Statute 204.2(D)</strong>, has fulfilled the <strong>IRS Chapter 3 Regulation (Statute 88-R)</strong> integrity assessments, and has successfully established cross-border dispatch handshakes under Treasury node guidelines.
                              </p>
                              <p className="font-semibold text-[#005a9c]">
                                Node Status: FULLY LIQUID • SOVEREIGN UNRESTRICTED
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 w-full max-w-md text-xs font-mono">
                              <div className="text-center">
                                <span className="font-sans font-bold text-slate-700 block uppercase tracking-wider text-[9px]">Sovereign Release Seal</span>
                                <div className="mt-2 text-emerald-600 font-bold border border-emerald-350 bg-emerald-50 py-1.5 rounded uppercase text-[10px] tracking-wide max-w-[140px] mx-auto animate-pulse">
                                  ✓ CERTIFIED
                                </div>
                              </div>
                              <div className="text-center font-serif text-[#001c3d]">
                                <span className="font-sans font-bold text-slate-500 block uppercase tracking-wider text-[9px] mb-2">Authorized Registrar</span>
                                <span className="font-bold italic mt-2 block font-serif">Mathias Koch</span>
                                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">Senior Custody Desk</span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <button
                              onClick={() => {
                                const certText = `
============================================================
              CAPITAL ONE PRIVATE TRUST ENCLAVE
============================================================
           CERTIFICATE OF INSTITUTIONAL SOVEREIGNTY

Beneficiary Legal Owner:  ${currentUser.name}
Beneficiary Node ID:      ${currentUser.id}
Routing Custody ID:       ${currentUser.accountNumber}

REGULATORY COMPLIANCE STATUS:
  Federal Statute 204.2:   COMPLETED & COMPLETED (Matched)
  IRS Statute 88-R audit:  RECONCILED & RELEASED (Sovereign)
  Sovereign Clearance:     FULLY LIQUID & UNRESTRICTED

Sovereign Principal Release Authorized. Live dispatch pipeline verified.

Authorized Registrar:
  Mathias Koch, Senior Portfolio Custody Executive
  Federal Clearing Desk Node: 88-R
============================================================
                              `;
                                const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `Sovereign_Asset_Certificate_${currentUser.id}.txt`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-6 py-3 bg-[#c5a059] hover:bg-[#b5904a] text-[#001c3d] font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs mt-4"
                            >
                              <Download className="w-4 h-4" />
                              Download Certificate (TEXT)
                            </button>
                            
                            <button
                              onClick={() => handleDownloadDirective('sovereign_release')}
                              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs"
                            >
                              <Download className="w-4 h-4 text-[#c5a059]" />
                              Download Sovereign Release PDF
                            </button>
                          </div>
                        ) : (
                          <div className="bg-[#f8fafc] border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-sm text-center py-16 space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-300">
                              <Lock className="w-7 h-7 text-slate-400" />
                            </div>
                            <h3 className="text-md font-extrabold text-[#001c3d] uppercase font-mono">SOVEREIGN CERTIFICATION LOCKED</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed text-center">
                              Sovereign credentials require full cross-border synchronization verification. Run your outbound dispatches to clear the compliance pipeline hold modules.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Secure Professional Internal Footer */}
                  <footer className="bg-white border-t border-slate-200 p-4 text-center shrink-0 w-full select-none">
                    <span className="text-[9px] font-sans text-slate-400 uppercase tracking-widest font-semibold block leading-normal">
                      Capital Secure Asset Protection. © 2026 Capital One 360.
                    </span>
                  </footer>

                </div>
              </div>
            )}
          </AnimatePresence>

          {/* PROFESSIONAL TRANSACTION RECEIPT DETAIL PORTAL (Clickable Ledger Receipts Overlay Modal) */}
          <AnimatePresence>
            {selectedReceiptTx && (
              <div className="fixed inset-0 z-[600] overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden text-left border border-slate-200 font-sans"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <p className="text-[#005a9c] text-[8px] font-mono font-bold uppercase tracking-widest">Receipt Statement Docket</p>
                      <h3 className="text-base font-black text-[#001c3d] tracking-tight font-sans">Transaction Detail</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedReceiptTx(null)}
                      className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center bg-[#001a35]/5 p-3 rounded-xl border border-[#005599]/10 font-sans">
                      <div>
                        <p className="text-[8px] font-mono text-slate-400 uppercase">Valuation Amount</p>
                        <p className={`text-xl font-black font-mono mt-0.5 ${selectedReceiptTx.amount > 0 ? 'text-emerald-600' : 'text-[#001c3d]'}`}>
                          {selectedReceiptTx.amount > 0 ? '+' : ''}${Math.abs(selectedReceiptTx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                        </p>
                      </div>
                      <span className="text-[8px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold py-1 px-2.5 rounded-full uppercase">
                        Cleared
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between py-1 border-b border-slate-100/60 w-full">
                        <span className="text-slate-400">Description:</span>
                        <span className="text-[#001c3d] font-bold text-right truncate max-w-[200px]">{selectedReceiptTx.description}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100/60 w-full">
                        <span className="text-slate-400">Ledger Reference ID:</span>
                        <span className="text-[#001c3d] font-semibold font-mono">{selectedReceiptTx.id}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100/60 w-full font-mono">
                        <span className="text-slate-400 font-sans">Clearance Date:</span>
                        <span className="text-slate-705 font-bold">{selectedReceiptTx.date}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100/60 w-full">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-slate-705 font-semibold">{selectedReceiptTx.category}</span>
                      </div>
                      <div className="flex justify-between py-1 w-full">
                        <span className="text-slate-400 font-sans">Audit Reference:</span>
                        <span className="text-slate-700 font-bold font-mono text-[10px]">VERIFIED (FIPS-9982)</span>
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2 w-full font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          handleDownloadSelectedReceipt(selectedReceiptTx);
                        }}
                        className="bg-[#005a9c] hover:bg-blue-650 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 flex-1 cursor-pointer transition shadow-sm font-sans"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedReceiptTx(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer transition flex-1 text-center font-sans"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        {/* SECURITY PROTOCOL 702 MODAL (Bond Payment Required - 20%) */}
        <AnimatePresence>
          {showProtocol702 && currentUser && (
            <div className="fixed inset-0 z-[500] overflow-y-auto font-sans" role="dialog" aria-modal="true">
              {/* Back backing drop */}
              <div 
                className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" 
                onClick={() => setShowProtocol702(false)}
              />

              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white max-w-xl w-full rounded-2xl p-6 sm:p-8 text-left border-t-8 border-[#005a9c] shadow-2xl space-y-5 transform overflow-hidden"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-[#001c3d] border border-blue-200 rounded-xl">
                      <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#001c3d] tracking-tight whitespace-nowrap">Security Protocol 702</h3>
                      <p className="text-blue-600 font-bold text-[9px] font-mono tracking-widest uppercase mt-0.5">Statutory Liquidity Bond Validation</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-600 font-medium text-xs sm:text-sm">
                    <p>
                      To prevent unauthorized liquidity movement, Federal Security Protocol 702 requires a <span className="text-red-600 font-bold font-mono">20% Statutory Liquidity Bond</span> for this transfer bracket. This activates your profile on the global ledger for high-limit dispatch.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span className="text-slate-500">Dispatch Value Payload:</span>
                        <span className="text-[#001c3d]">${parseFloat(transferAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold leading-relaxed border-t border-slate-200/80 pt-2 text-[#005a9c]">
                        <span>Required Validation Bond (20%):</span>
                        <span className="text-xl font-bold font-mono">${(parseFloat(transferAmount) * 0.20).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border border-slate-250 bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc" 
                        alt="Bond Address QR" 
                        className="w-32 h-32 border rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Bond Verification Deposit Ledger Address</p>
                        <code className="block text-xs font-mono font-bold bg-slate-50 text-[#001c3d] p-2 rounded-md border select-all mt-1 truncate">
                          Bc1qrdgcd3yrkf49r6hd88f8kt7nl2g7rdw39wfstc
                        </code>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      <button
                        onClick={startEncryptionSync}
                        className="w-full py-4 bg-gradient-to-r from-[#005a9c] to-[#003a70] hover:from-[#d22e1e] hover:to-[#8b0000] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-150 shadow-lg cursor-pointer"
                      >
                        Secure Account & Sync Signature
                      </button>
                      
                      <p className="text-center text-[10px] text-slate-400 leading-relaxed font-sans">
                        Alternative wire instructions? Contact Mathias Koch (Senior Portfolio Manager) at <span className="text-blue-600 font-bold">Mathiaskoch000@gmail.com</span>
                      </p>
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* SECURITY PROGRESS SYNCHRONIZATION OVERLAY PANEL */}
        <AnimatePresence>
          {showSyncOverlay && (
            <div className="fixed inset-0 z-[600] bg-black flex flex-col items-center justify-center p-6 sm:p-10 font-sans select-none">
              <div className="max-w-lg w-full text-center space-y-10 relative">
                
                {/* Scanner Glow Module */}
                <div className="relative w-44 h-44 border-2 border-[#005a9c]/50 rounded-full mx-auto flex items-center justify-center overflow-hidden bg-[#001026]/40 shadow-2xl">
                  {/* High contrast scan bar glow */}
                  <div className="absolute w-full h-[3px] bg-blue-500 shadow-[0_0_20px_#3b82f6] left-0 top-0 animate-scanning" />
                  <Fingerprint className="w-16 h-16 text-[#005a9c] animate-pulse" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-blue-500 font-bold font-mono tracking-widest uppercase text-base">Node Encryption & Verification Sync</h3>
                  
                  {/* Standard high-fidelity progress loader */}
                  <div className="w-full bg-slate-900 border border-white/5 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-gradient-to-r from-[#005a9c] to-emerald-500 h-full transition-all duration-300 rounded-full" 
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                  <span className="text-right text-[10px] grid place-items-end text-slate-500 font-mono font-bold mt-1.5 uppercase">{syncProgress}% completed</span>
                </div>

                {/* Simulated Scrolling system logs logs */}
                <div className="h-44 bg-slate-950 border border-white/5 rounded-xl p-5 text-left font-mono overflow-y-auto block space-y-1.5 text-[10px] leading-relaxed scrollbar-style">
                  {syncLogs.map((logStr, lIdx) => (
                    <p key={lIdx} className="text-slate-400 font-mono block">
                      <span className="text-[#005a9c] font-bold block sm:inline mr-2">{'>'}</span>
                      <span className="text-white font-semibold">{logStr}</span>
                    </p>
                  ))}
                  <div className="text-[#005a9c] font-bold animate-pulse text-xs">● SIGNAL ONLINE BUFFER CLEARING ...</div>
                </div>

              </div>
            </div>
          )}
        </AnimatePresence>

        {/* INSTITUTIONAL ALERTS PORTAL - CENTERED WHITE CARD MODAL OVERLAY */}
        <AnimatePresence>
          {alerts.length > 0 && (() => {
            const activeAlert = alerts[0]; // Display the top/most recent alert centered
            const isSequestration = activeAlert.title.toLowerCase().includes('sequestration') || 
                                    activeAlert.title.toLowerCase().includes('critical') || 
                                    activeAlert.title.toLowerCase().includes('ris') ||
                                    activeAlert.message.toLowerCase().includes('sequestration');
            // Capital One Blue (#00669e) or Safety Red (#d22e1e)
            const alertColor = isSequestration ? '#d22e1e' : '#00669e';
            
            return (
              <div 
                key={activeAlert.id}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 selection:bg-[#005a9c]/10 selection:text-[#005a9c]"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white w-full max-w-lg shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] select-none rounded-[40px] overflow-hidden flex flex-col font-sans transition-all relative border-t-[8px]"
                  style={{ borderTopColor: alertColor }}
                >
                  <div className="p-10 flex flex-col text-left space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs tracking-wider shrink-0 select-none shadow-md border border-white/10 font-sans">
                        C1
                      </div>
                      <span className="text-[10px] font-mono font-black tracking-widest text-[#c5a059] uppercase bg-[#c5a059]/10 border border-[#c5a059]/30 py-1.5 px-3 rounded-xl">
                        INCOMING NODE REPORT
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-sans font-[900] text-slate-900 text-2xl tracking-tight uppercase leading-none">
                        {activeAlert.title}
                      </h3>
                      <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        Sovereign Registry Integrity Event • ID: {activeAlert.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <p className="font-sans font-medium text-slate-700 text-sm leading-relaxed">
                      {activeAlert.message}
                    </p>

                    {isSequestration ? (
                      <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            // Trigger VoIP support chat and call from Mathias Koch
                            const supportBtn = document.getElementById('floating-voip-btn') || document.getElementById('support-chat-trigger');
                            if (supportBtn) {
                              supportBtn.click();
                            }
                            // Dismiss active alert
                            handleDismissAlert(activeAlert.id);
                          }}
                          className="flex-1 py-4 px-6 rounded-2xl bg-[#d22e1e] hover:bg-[#b02216] text-white font-mono font-bold text-[11px] uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
                        >
                          Contact Compliance Desk
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const token = prompt("Enter 6-digit Compliance Clearance Footprint Override Token:");
                            if (token) {
                              if (token.trim().length === 6) {
                                alert("Verification Handshake confirmed. Compliance Clearance override token accepted. Please complete your transaction.");
                                handleDismissAlert(activeAlert.id);
                              } else {
                                alert("Invalid cryptographic footprint trace.");
                              }
                            }
                          }}
                          className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-mono font-bold text-[11px] uppercase tracking-wider border border-slate-800 transition-all cursor-pointer text-center"
                        >
                          Verify Token
                        </button>
                      </div>
                    ) : (
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDismissAlert(activeAlert.id)}
                          className="py-3.5 px-8 rounded-2xl bg-[#00669e] hover:bg-[#00527f] text-white font-mono font-bold text-[11px] uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                          Acknowledge & Close
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* iOS TOP-RIGHT FLUID NOTIFICATIONS STACK */}
        <div className="fixed top-6 right-6 z-[9999999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
          <AnimatePresence>
            {iosNotifications.map(n => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 200, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 250, scale: 0.8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-4 flex flex-col space-y-2 pointer-events-auto select-none"
              >
                <div className="flex justify-between items-center text-[10px] font-sans font-bold tracking-tight text-slate-400">
                  <div className="flex items-center gap-1.5 uppercase font-mono font-black text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00669e] to-sky-400" />
                    <span>{n.title}</span>
                  </div>
                  <span>{n.time || 'now'}</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase font-sans tracking-tight">{n.subtitle}</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed font-sans">{n.body}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* INSTITUTIONAL RISK AUDIT OVERLAY SUMMARY LOCK */}
        <AnimatePresence>
          {isSiteLocked && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000000] flex items-center justify-center p-4 sm:p-10 font-sans text-slate-800 animate-fade-in select-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 space-y-6 text-center relative overflow-hidden shadow-2xl border-t-[8px] border-t-[#d22e1e]"
                style={{ borderRadius: '2.5rem' }}
              >
                {/* Security Emblem */}
                <div className="w-16 h-16 bg-red-50 border border-red-100 text-[#d22e1e] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-[#d22e1e] font-mono font-black uppercase text-[10px] tracking-widest leading-none">
                    Security Enclave Override Restriction
                  </p>
                  <h3 className="text-xl sm:text-2xl font-sans font-[900] text-slate-900 tracking-tight uppercase mt-2.5">
                    INSTITUTIONAL RISK AUDIT
                  </h3>
                </div>

                <p className="text-slate-650 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                  In accordance with interbank liquidity sweep standard guidelines, this vault session has been suspended for automated security metric analysis.
                </p>

                {/* Risk Metrics Panel */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5 text-left">
                  <div className="flex justify-between items-center text-xs font-mono pb-2.5 border-b border-slate-200">
                    <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">Risk Indicator Metric</span>
                    <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">Evaluation Status</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-800 font-bold font-sans">1. Velocity:</span>
                    <span className="text-[#d22e1e] bg-red-50 border border-red-200 py-1.5 px-3 rounded-lg text-[9px] font-black uppercase animate-pulse">
                      HIGH VELOCITY ATTEMPT
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-800 font-bold font-sans">2. Node Mismatch:</span>
                    <span className="text-[#d22e1e] bg-red-50 border border-red-200 py-1.5 px-3 rounded-lg text-[9px] font-black uppercase">
                      IP-NODE MISMATCH [PATRIOT ACT]
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-800 font-bold font-sans">3. AML Filter Flag:</span>
                    <span className="text-[#d22e1e] bg-red-50 border border-red-200 py-1.5 px-3 rounded-lg text-[9px] font-black uppercase">
                      AML STATUTE 204.2 ACTIVE
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Trigger support voice concierge
                      const supportBtn = document.getElementById('floating-voip-btn') || document.getElementById('support-chat-trigger');
                      if (supportBtn) {
                        supportBtn.click();
                      }
                    }}
                    className="w-full py-4 bg-[#d22e1e] hover:bg-[#b02216] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition duration-150 cursor-pointer shadow-md text-center block"
                  >
                    Initiate Compliance Voice Override
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const password = prompt("Enter Administration Verification Key to debug bypass lock:");
                      if (password) {
                        if (password === 'override' || password === 'secure234' || password === (currentUser?.password || '')) {
                          setIsSiteLocked(false);
                          setSessionTimer(180); // reset timer
                        } else {
                          alert("Invalid Cryptographic Admin Signature Key.");
                        }
                      }
                    }}
                    className="w-full py-4 bg-white hover:bg-slate-50 text-slate-700 font-sans font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 transition duration-150 cursor-pointer text-center block"
                  >
                    Verification Key Bypass
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
