export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  referenceId?: string;
}

export interface UserProfile {
  id: string; // User ID
  name: string; // Legal Name
  password: string;
  accountNumber: string; // Account ID representation
  balance: number;
  status: 'Active' | 'Verification Pending' | 'Sequestrated';
  transferCount: number;
  transactions: Transaction[];
  createdDate: string;
  cardNumber: string;
  cardStatus: 'Active' | 'Verification Pending' | 'Inactive' | 'Pending Sync';
  
  // Capital One 365 / 360 compliance state additions
  isSyncing: boolean;
  syncStartTime: number | null; 
  amlTriggered: boolean;
  ris: boolean; // Revenue Integrity status
  levyStage?: 'none' | 'hold' | 'refunded' | 'ris';
  levyTransferAmount?: number;
  levyFeeAmount?: number;
  sovereignStage?: 'none' | 'reconciling' | 'sovereign' | 'dispatched' | 'audit_closed';
  dispatchTime?: number;
  complianceSettlementAmount?: number;
  complianceRegulatoryReason?: string;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

