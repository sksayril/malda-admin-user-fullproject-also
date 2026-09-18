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
  branch: string;
  status: 'Active' | 'Inactive';
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
  address: string;
  dob: string;
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
  loanType: 'Personal Loan' | 'Business Loan' | 'Emergency Loan' | 'Small Loan';
  amount: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  appliedDate: string;
  status: LoanStatus;
  step: 'Application' | 'Documents' | 'Verification' | 'Approval' | 'Disbursement';
}

export interface DepositAccount {
  id: string;
  accountId: string;
  customerName: string;
  type: 'FD' | 'RD' | 'MIS';
  amount: number;
  interestRate?: number;
  startDate: string;
  maturityDate: string;
  maturityAmount?: number;
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

export interface MlmLevelStat {
  level: number;
  members: number;
  commission: number;
  status: 'Paid' | 'Pending' | 'Processing';
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
