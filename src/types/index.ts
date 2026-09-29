// MultiCredit 360 Types Definition

export type UserRole =
  | 'Super Admin'
  | 'Society Admin'
  | 'Branch Manager'
  | 'Loan Officer'
  | 'Collection Manager'
  | 'Agent'
  | 'Accountant'
  | 'Viewer';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId: string;
  mobile?: string;
}

export interface SocietyInfo {
  name: string;
  regNumber: string;
  panNumber: string;
  contact: string;
  email: string;
  address: string;
  logo: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  terms: string;
  privacyPolicy: string;
  loanPolicy: string;
  depositConfig: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  manager: string;
  location: string;
  agentsCount: number;
  status: 'Active' | 'Inactive';
  customersCount?: number;
  loanPortfolio?: string;
}

export interface Agent {
  id: string;
  agentId: string;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  branch: string;
  status: 'Active' | 'Inactive';
  referralCode?: string;
  sponsorAgentId?: string;
  sponsorReferralCode?: string;
  upline?: string[];
  level?: number;
  directAgentsCount?: number;
  totalTeamCount?: number;
  mlmCommissionEarned?: number;
  walletBalance?: number;
  totalCommission?: string | number;
  totalDirectCustomers?: number;
  online?: boolean;
  lastActive?: string;
  location?: { lat: number; lng: number; address: string };
  totalCollection?: string;
  transactions?: number;
  target?: string;
  achievementRate?: number;
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  mobile: string;
  email: string;
  password?: string;
  panNumber?: string;
  panImage?: string;
  adhaarNumber?: string;
  adhaarImage?: string;
  address: string;
  pincode?: string;
  referralCode?: string;
  agentId?: string;
  accountNumber?: string;
  debitCardNumber?: string;
  debitCardExpiry?: string;
  debitCardCvv?: string;
  savingsBalance?: number;
  dob?: string;
  type: 'Loan' | 'FD' | 'RD' | 'MIS';
  status: 'Active' | 'Inactive';
  kycStatus: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  photo?: string;
  accountsCount: number;
  loansCount: number;
  depositsCount: number;
  collectionsCount: number;
  documentsCount: number;
}

export type LoanStatus = 'Pending' | 'Approved' | 'Disbursed' | 'Rejected';

export interface LoanApplication {
  id: string;
  loanId: string;
  customerName: string;
  customerId: string;
  loanType: 'Personal Loan' | 'Business Loan' | 'Emergency Loan' | 'Small Loan' | 'Daily Loan';
  amount: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  appliedDate: string;
  status: LoanStatus;
  step: 'Application' | 'Documents' | 'Verification' | 'Approval' | 'Disbursement';
  paidEmis?: number;
  totalEmis?: number;
  lateFee?: number;
  isDailyLoan?: boolean;
  dailyInstallment?: number;
  daysTotal?: number;
  daysPaid?: number;
}

export interface DepositAccount {
  id: string;
  accountId: string;
  customerName: string;
  customerId?: string;
  type: 'FD' | 'RD' | 'MIS';
  amount: number;
  interestRate?: number;
  tenureMonths?: number;
  startDate: string;
  maturityDate: string;
  maturityAmount?: number;
  monthlyPayout?: number;
  status: 'Active' | 'Matured' | 'Pending' | 'Premature Request';
}

export interface CollectionRecord {
  id: string;
  receiptNo: string;
  customerName: string;
  customerId: string;
  agentName: string;
  type: 'EMI' | 'RD' | 'Loan' | 'MIS' | 'FD';
  amount: number;
  mode: 'UPI' | 'Cash' | 'Bank';
  date: string;
}

export interface MlmLevelConfig {
  id?: string;
  _id?: string;
  level: number;
  name: string;
  commissionPercent: number;
  fixedBonus: number;
  minDirectReferrals: number;
  minBusinessVolume: number;
  status: 'Active' | 'Inactive';
  description?: string;
  membersCount?: number;
  totalCommissionPaid?: number;
}

export interface MlmLevelStat {
  level: number;
  name?: string;
  members: number;
  commission: number;
  commissionPercent?: number;
  fixedBonus?: number;
  minDirectReferrals?: number;
  minBusinessVolume?: number;
  status: 'Paid' | 'Pending' | 'Processing';
}

export interface MlmCommissionLog {
  id?: string;
  _id?: string;
  transactionId: string;
  fromAgentId: string;
  fromAgentName: string;
  toAgentId: string;
  toAgentName: string;
  level: number;
  eventType: 'AGENT_JOIN' | 'CUSTOMER_ONBOARD' | 'COLLECTION' | 'DEPOSIT' | 'LOAN_EMI' | 'MANUAL_PAYOUT';
  sourceAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  status: 'Credited' | 'Pending' | 'Rejected';
  notes?: string;
  date: string;
}

export interface WhiteLabelPartner {
  id: string;
  partnerId: string;
  companyName: string;
  domain: string;
  status: 'Active' | 'Inactive';
  plan: 'Basic' | 'Professional' | 'Enterprise';
  branchesCount: number;
}

export interface SystemUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface ProductScheme {
  id: string;
  code: string;
  category: 'LOAN' | 'FD' | 'RD' | 'MIS';
  name: string;
  interestRate: number; // e.g. 8.5%
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
  agentCommissionPercent: number; // e.g. 2.0%
  isDailyLoan?: boolean;
  dailyTenureDays?: number;
  status: 'Active' | 'Inactive';
  description?: string;
  features?: string[];
}

export interface GatewaySettings {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  isLiveMode: boolean;
  gatewayEnabled: boolean;
  currency: string;
  onboardingCommission: number; // ₹250
}

