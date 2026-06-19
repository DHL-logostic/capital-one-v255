import { Transaction } from './types';

export function generateHistoricalTransactions(balance: number): Transaction[] {
  const transactions: Transaction[] = [];
  const currentDate = new Date();
  
  // To ensure the ledger sums up exactly to the user's initial state balance:
  // - Premium Corporate Treasury Credit: 30% of total balance (Credit)
  // - Institutional Crypto-Asset Liquidation: 50% of total balance (Credit)
  // - Private Account Ledger Initialization: 40% of total balance (Credit)
  // - 58 daily debit entries (totaling exactly -20% of total balance)
  // Sum = 120% of balance (credits) - 20% of balance (debits) = exactly 100% of balance.
  
  const initialCredit = parseFloat((balance * 0.4).toFixed(2));
  const treasuryCredit = parseFloat((balance * 0.3).toFixed(2));
  const cryptoCredit = parseFloat((balance * 0.5).toFixed(2));
  const targetDailySum = parseFloat((-balance * 0.2).toFixed(2));

  const merchants = [
    { desc: 'Starbucks Coffee Cafe', category: 'Food & Dining', min: 4.50, max: 28.00 },
    { desc: 'Amazon Marketplace Online', category: 'Shopping', min: 14.99, max: 245.00 },
    { desc: 'Capital One Cafe Beverage', category: 'Food & Dining', min: 3.25, max: 15.50 },
    { desc: 'ATM Cash Withdrawal Terminal', category: 'Cash & ATM', min: 40.00, max: 200.00 },
    { desc: 'Target Store Checkout', category: 'Shopping', min: 22.50, max: 185.00 },
    { desc: 'Shell Service Station', category: 'Gas & Auto', min: 35.00, max: 75.00 },
    { desc: 'Netflix Subscription Premium', category: 'Entertainment', min: 15.49, max: 22.99 },
    { desc: 'Uber Ride Dispatch', category: 'Travel & Transport', min: 12.50, max: 48.00 },
    { desc: 'Apple Services Cloud', category: 'Infrastructure', min: 0.99, max: 9.99 },
    { desc: 'Whole Foods Market', category: 'Food & Dining', min: 34.00, max: 160.00 }
  ];

  let cumulativeSum = 0;

  // Create 58 daily transactions
  for (let i = 58; i >= 1; i--) {
    const txDate = new Date(currentDate);
    txDate.setDate(currentDate.getDate() - i);
    
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    
    // Generate a random portion
    let amount = parseFloat((Math.random() * (merchant.max - merchant.min) + merchant.min).toFixed(2));
    amount = -Math.abs(amount);

    if (i === 1) {
      amount = parseFloat((targetDailySum - cumulativeSum).toFixed(2));
    }

    cumulativeSum = parseFloat((cumulativeSum + amount).toFixed(2));

    transactions.push({
      id: `NX-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: merchant.desc,
      category: merchant.category,
      amount: amount,
      date: txDate.toISOString().split('T')[0],
      status: 'Settled'
    });
  }

  // Major Entries on Day 60 and 59
  const date60 = new Date(currentDate);
  date60.setDate(currentDate.getDate() - 60);

  const date59 = new Date(currentDate);
  date59.setDate(currentDate.getDate() - 59);

  const initialTx: Transaction = {
    id: `NX-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
    description: 'Private Account Ledger Initialization',
    category: 'Treasury Clearance',
    amount: initialCredit,
    date: date60.toISOString().split('T')[0],
    status: 'Settled'
  };

  const treasuryTx: Transaction = {
    id: `NX-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
    description: 'Premiums Corporate Treasury Credit',
    category: 'Treasury Clearance',
    amount: treasuryCredit,
    date: date60.toISOString().split('T')[0],
    status: 'Settled'
  };

  const cryptoTx: Transaction = {
    id: `NX-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
    description: 'Institutional Crypto-Asset Liquidation',
    category: 'Sovereign Sync Credit',
    amount: cryptoCredit,
    date: date59.toISOString().split('T')[0],
    status: 'Settled'
  };

  return [initialTx, treasuryTx, cryptoTx, ...transactions].reverse();
}

export function generateAccountNumber(): string {
  // matches NX-8842110902 pattern exactly, returning a unique 10-digit Institutional Account Number.
  const randNum = Math.floor(10000000 + Math.random() * 90000000); // 10-digit representation
  const paddedRand = String(randNum).padStart(10, '0');
  // Wait, let's make it exactly 10 digits as requested (e.g. 8842110902 is 10 digits)
  const full10 = (Math.floor(1000000000 + Math.random() * 9000000000)).toString();
  return `NX-${full10}`;
}

export function generateCardNumber(): string {
  const parts = [];
  // Standard card formatting: starts with 4 (Visa-like) or 5 (Mastercard-like)
  parts.push(Math.floor(4000 + Math.random() * 999).toString());
  for (let i = 0; i < 3; i++) {
    parts.push(Math.floor(1000 + Math.random() * 8999).toString());
  }
  return parts.join(' ');
}

export function generateReferenceID(): string {
  const bytes = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let refStr = 'NX-';
  for (let i = 0; i < 12; i++) {
    refStr += bytes[Math.floor(Math.random() * bytes.length)];
  }
  return refStr;
}
