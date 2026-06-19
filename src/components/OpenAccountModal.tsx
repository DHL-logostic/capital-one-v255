import React, { useState } from 'react';
import { X, Landmark, Check, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { generateAccountNumber, generateHistoricalTransactions, generateCardNumber } from '../utils';

interface OpenAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: (profile: UserProfile) => void;
}

export default function OpenAccountModal({ isOpen, onClose, onRegistrationSuccess }: OpenAccountModalProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
    dob: '',
    userId: '',
    password: '',
    agreeLicense: true,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [generatedAccount, setGeneratedAccount] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorText(null);
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanVal = e.target.value.replace(/\D/g, '').substring(0, 9);
    let formatted = cleanVal;
    if (cleanVal.length > 5) {
      formatted = `${cleanVal.substring(0, 3)}-${cleanVal.substring(3, 5)}-${cleanVal.substring(5)}`;
    } else if (cleanVal.length > 3) {
      formatted = `${cleanVal.substring(0, 3)}-${cleanVal.substring(3)}`;
    }
    setFormData(prev => ({ ...prev, ssn: formatted }));
    setErrorText(null);
  };

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanVal = e.target.value.replace(/\D/g, '').substring(0, 8);
    let formatted = cleanVal;
    if (cleanVal.length > 4) {
      formatted = `${cleanVal.substring(0, 2)}/${cleanVal.substring(2, 4)}/${cleanVal.substring(4)}`;
    } else if (cleanVal.length > 2) {
      formatted = `${cleanVal.substring(0, 2)}/${cleanVal.substring(2)}`;
    }
    setFormData(prev => ({ ...prev, dob: formatted }));
    setErrorText(null);
  };

  const handleContinue = () => {
    if (!formData.firstName || !formData.lastName || !formData.ssn || !formData.dob) {
      setErrorText('Please enter your First Name, Last Name, SSN, and Date of Birth to verify identity.');
      return;
    }
    
    // Simple validation of SSN and DOB format
    if (formData.ssn.length < 11) {
      setErrorText('Please enter a valid 9-digit Social Security Number.');
      return;
    }
    if (formData.dob.length < 10) {
      setErrorText('Please enter a valid Date of Birth (MM/DD/YYYY).');
      return;
    }
    
    setStep(2);
  };

  const executeRegistration = () => {
    if (!formData.userId || !formData.password) {
      setErrorText('Please specify a secure User ID and Password.');
      return;
    }

    try {
      const stored = localStorage.getItem('apex_v26');
      const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      
      const duplicate = profiles.find(p => p.id.toLowerCase() === formData.userId.toLowerCase());
      if (duplicate) {
        setErrorText('This User ID has already been claimed on our network.');
        return;
      }

      const accNum = generateAccountNumber();
      setGeneratedAccount(accNum);
      const generatedCard = generateCardNumber();

      const initialBalance = 450670.00;
      const initialTransactions = generateHistoricalTransactions(initialBalance);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const newProfile: UserProfile = {
        id: formData.userId.toLowerCase(),
        name: fullName,
        password: formData.password,
        accountNumber: accNum,
        balance: initialBalance,
        status: 'Active',
        transferCount: 0,
        transactions: initialTransactions,
        createdDate: new Date().toISOString().split('T')[0],
        cardNumber: generatedCard,
        cardStatus: 'Inactive', // Inactive card as specified ("deep red virtual card - 'Inactive' status")
        isSyncing: false,
        syncStartTime: null,
        amlTriggered: false,
        ris: false
      };

      profiles.push(newProfile);
      localStorage.setItem('apex_v26', JSON.stringify(profiles));

      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorText('A storage error prevented node record creation.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      ssn: '',
      dob: '',
      userId: '',
      password: '',
      agreeLicense: true,
    });
    setErrorText(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm transition-opacity" 
        onClick={handleReset}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          className="relative transform overflow-hidden rounded-3xl bg-white text-[#001c3d] shadow-2xl transition-all sm:my-8 w-full sm:max-w-lg border border-slate-100 text-left"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="p-1 px-2.5 bg-[#004879] text-white rounded-lg font-extrabold italic text-xs">
                c1
              </div>
              <div>
                <span className="font-extrabold text-[#001c3d] tracking-tight text-sm block">Capital One 360 Node</span>
                <span className="text-[9px] text-[#004879] font-bold tracking-wider uppercase">Onboarding Gateway</span>
              </div>
            </div>
            
            <button
              onClick={handleReset}
              className="p-1.5 rounded-full text-slate-455 hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              aria-label="Close gateway"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper indicator line */}
          <div className="w-full h-1 bg-slate-100 relative">
            <div 
              className="absolute left-0 top-0 h-full bg-[#004879] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Tell us about you */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#001c3d] tracking-tight">
                      Get started by telling us about you
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      We need a few details to confirm your signature coordinates and verify your ledger footprints.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Sarah"
                          className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-medium focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Jenkins"
                          className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-medium focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Social Security Number</label>
                      <input
                        type="text"
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleSSNChange}
                        placeholder="***-**-****"
                        className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-medium focus:bg-white tracking-widest"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Date of Birth</label>
                      <input
                        type="text"
                        name="dob"
                        value={formData.dob}
                        onChange={handleDOBChange}
                        placeholder="MM/DD/YYYY"
                        className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-medium focus:bg-white tracking-wider"
                        required
                      />
                    </div>
                  </div>

                  {errorText && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl font-medium leading-relaxed">
                      {errorText}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleContinue}
                      className="px-8 py-3.5 bg-[#004879] hover:bg-[#003154] text-xs font-bold uppercase tracking-widest text-white rounded-full transition cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Configure Credentials */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#001c3d] tracking-tight">
                      Configure your ledger credentials
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      These will represent your administrative credentials used to mount secure settlement nodes.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Desired User ID / Username</label>
                      <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        placeholder="sarah_c1"
                        className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-bold focus:bg-white lowercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Secure Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••••••"
                          className="w-full bg-[#f4f6f8] text-[#001c3d] placeholder-slate-400 text-sm p-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:border-[#004879] transition font-medium focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Agree box */}
                    <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-gray-100 rounded-2xl">
                      <input 
                        type="checkbox"
                        checked={formData.agreeLicense}
                        onChange={(e) => setFormData(p => ({ ...p, agreeLicense: e.target.checked }))}
                        className="mt-0.5 rounded cursor-pointer text-[#004879] focus:ring-[#004879]"
                        id="agree-box"
                      />
                      <label htmlFor="agree-box" className="text-[10px] leading-relaxed text-slate-500 font-medium select-none cursor-pointer">
                        I hereby authorize Capital One 360 to synchronize my identity node credentials under compliance footprints of Section 204.2-A.
                      </label>
                    </div>
                  </div>

                  {errorText && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl font-medium leading-relaxed">
                      {errorText}
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center bg-transparent">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 text-xs font-bold text-[#004879] hover:text-[#003154] flex items-center gap-1 cursor-pointer transition border border-[#004879]/20 hover:border-[#004879] rounded-full"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={executeRegistration}
                      disabled={!formData.userId || !formData.password || !formData.agreeLicense}
                      className="px-8 py-3.5 bg-[#004879] hover:bg-[#003154] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest text-white rounded-full transition cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <span>Complete Registration</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success Onboarding */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-5 text-center"
                >
                  <div className="flex justify-center p-3.5 bg-[#004879]/10 text-[#004879] w-14 h-14 rounded-2xl mx-auto">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-[#001c3d] tracking-tight">Onboarding Complete</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your identity credentials has been established successfully. Your vault status is initialized with a default balance.
                    </p>
                  </div>

                  {/* Summary Card Layout */}
                  <div className="bg-slate-50 p-5 border border-gray-100 rounded-2xl text-left text-xs space-y-3 font-medium text-[#001c3d]">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wider">Account holder:</span>
                      <span className="font-bold">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wider">Account Number:</span>
                      <span className="font-mono font-bold tracking-wider">{generatedAccount}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wider">Default Username:</span>
                      <span className="font-mono text-[#004879] lowercase font-bold font-mono">{formData.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wider">Current Balance:</span>
                      <span className="text-emerald-600 font-extrabold font-sans">$450,670.00</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        // Load fresh profiles to sign user in immediately
                        try {
                          const stored = localStorage.getItem('apex_v26');
                          const profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
                          const freshUser = profiles.find(p => p.id === formData.userId.toLowerCase());
                          if (freshUser) {
                            onRegistrationSuccess(freshUser);
                          }
                        } catch (err) {
                          console.error(err);
                        }
                        handleReset();
                      }}
                      className="w-full py-4 bg-[#004879] hover:bg-[#003154] text-xs font-bold uppercase tracking-widest text-white rounded-full transition shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Launch Private Terminal
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
