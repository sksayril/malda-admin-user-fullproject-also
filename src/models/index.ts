import mongoose, { Schema, model, models } from 'mongoose';

// Society Schema
const SocietySchema = new Schema(
  {
    name: { type: String, required: true },
    regNumber: { type: String, required: true },
    panNumber: { type: String },
    contact: { type: String },
    email: { type: String },
    address: { type: String },
    logo: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    terms: { type: String },
    privacyPolicy: { type: String },
    loanPolicy: { type: String },
    depositConfig: { type: String },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Branch Schema
const BranchSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manager: { type: String, required: true },
    location: { type: String, required: true },
    agentsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Agent Schema
const AgentSchema = new Schema(
  {
    agentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, default: '' },
    password: { type: String, default: 'agent123' },
    branch: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    referralCode: { type: String, default: 'AGT-3601' },
    walletBalance: { type: Number, default: 18450 },
    totalCommission: { type: Number, default: 42500 },
    totalDirectCustomers: { type: Number, default: 24 },
    online: { type: Boolean, default: true },
    lastActive: { type: String, default: 'Just now' },
    location: {
      lat: { type: Number, default: 22.5726 },
      lng: { type: Number, default: 88.3639 },
      address: { type: String, default: 'Kolkata, West Bengal' },
    },
    totalCollection: { type: String, default: '₹ 2,50,000' },
    transactions: { type: Number, default: 120 },
    target: { type: String, default: '₹ 3,00,000' },
    achievementRate: { type: Number, default: 83 },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Customer Schema
const CustomerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    password: { type: String, default: 'cust123' },
    panNumber: { type: String, default: '' },
    panImage: { type: String, default: '' },
    adhaarNumber: { type: String, default: '' },
    adhaarImage: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    referralCode: { type: String, default: '' },
    agentId: { type: String, default: '' },
    accountNumber: { type: String },
    debitCardNumber: { type: String },
    debitCardExpiry: { type: String, default: '09/31' },
    debitCardCvv: { type: String, default: '834' },
    savingsBalance: { type: Number, default: 25400 },
    dob: { type: String, default: '' },
    type: { type: String, enum: ['Loan', 'FD', 'RD', 'MIS'], default: 'Loan' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    kycStatus: {
      type: String,
      enum: ['Verified', 'Pending', 'Rejected', 'Under Review'],
      default: 'Verified',
    },
    photo: { type: String },
    accountsCount: { type: Number, default: 1 },
    loansCount: { type: Number, default: 0 },
    depositsCount: { type: Number, default: 0 },
    collectionsCount: { type: Number, default: 0 },
    documentsCount: { type: Number, default: 4 },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Loan Application Schema
const LoanApplicationSchema = new Schema(
  {
    loanId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerId: { type: String, required: true, index: true },
    loanType: {
      type: String,
      enum: ['Personal Loan', 'Business Loan', 'Emergency Loan', 'Small Loan', 'Daily Loan'],
      default: 'Personal Loan',
    },
    amount: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
    appliedDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Disbursed', 'Rejected'],
      default: 'Approved',
    },
    step: {
      type: String,
      enum: ['Application', 'Documents', 'Verification', 'Approval', 'Disbursement'],
      default: 'Disbursement',
    },
    paidEmis: { type: Number, default: 3 },
    totalEmis: { type: Number, default: 12 },
    lateFee: { type: Number, default: 0 },
    isDailyLoan: { type: Boolean, default: false },
    dailyInstallment: { type: Number, default: 0 },
    daysTotal: { type: Number, default: 100 },
    daysPaid: { type: Number, default: 28 },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Deposit Account Schema
const DepositSchema = new Schema(
  {
    accountId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerId: { type: String },
    type: { type: String, enum: ['FD', 'RD', 'MIS'], required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, default: 8.5 },
    tenureMonths: { type: Number, default: 12 },
    startDate: { type: String, required: true },
    maturityDate: { type: String, required: true },
    maturityAmount: { type: Number, default: 0 },
    monthlyPayout: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Matured', 'Pending', 'Premature Request'],
      default: 'Active',
    },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Collection Schema
const CollectionSchema = new Schema(
  {
    receiptNo: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerId: { type: String, required: true, index: true },
    agentName: { type: String, required: true },
    type: { type: String, enum: ['EMI', 'RD', 'Loan', 'MIS', 'FD'], default: 'EMI' },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ['UPI', 'Cash', 'Bank'], default: 'UPI' },
    date: { type: String, required: true },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// White Label Partner Schema
const PartnerSchema = new Schema(
  {
    partnerId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    domain: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    plan: { type: String, enum: ['Basic', 'Professional', 'Enterprise'], default: 'Professional' },
    branchesCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// S3 Document Metadata Schema
const DocumentMetadataSchema = new Schema(
  {
    fileKey: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number },
    s3Url: { type: String, required: true },
    tenantId: { type: String, default: 'TNT001' },
    entityType: { type: String }, // 'customer', 'loan', 'society_logo', 'receipt'
    entityId: { type: String },
  },
  { timestamps: true }
);

// User / Staff Schema
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'Super Admin',
        'Society Admin',
        'Branch Manager',
        'Loan Officer',
        'Collection Manager',
        'Agent',
        'Accountant',
        'Viewer',
      ],
      default: 'Super Admin',
    },
    mobile: { type: String, default: '+91 98765 43210' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    tenantId: { type: String, default: 'TNT001', index: true },
    lastLogin: { type: String, default: 'Just now' },
  },
  { timestamps: true }
);

// Product Scheme Schema (Loan, FD, RD, MIS Offers created by Admin)
const ProductSchemeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    category: { type: String, enum: ['LOAN', 'FD', 'RD', 'MIS'], required: true },
    name: { type: String, required: true },
    interestRate: { type: Number, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    agentCommissionPercent: { type: Number, default: 2.0 },
    isDailyLoan: { type: Boolean, default: false },
    dailyTenureDays: { type: Number, default: 100 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    description: { type: String },
    features: [{ type: String }],
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Gateway Settings Schema (Razorpay Config & Global Commission)
const GatewaySettingsSchema = new Schema(
  {
    configKey: { type: String, default: 'GLOBAL_SETTINGS', unique: true },
    razorpayKeyId: { type: String, default: 'rzp_test_1DP5mmOlF5G5ag' },
    razorpayKeySecret: { type: String, default: 'sK_test_9019283921831' },
    razorpayWebhookSecret: { type: String, default: 'whsec_928391823' },
    isLiveMode: { type: Boolean, default: false },
    gatewayEnabled: { type: Boolean, default: true },
    currency: { type: String, default: 'INR' },
    onboardingCommission: { type: Number, default: 250 },
  },
  { timestamps: true }
);

// Export Mongoose Models (re-use if already compiled in Next.js hot reload)
export const User = models.User || model('User', UserSchema);
export const Society = models.Society || model('Society', SocietySchema);
export const Branch = models.Branch || model('Branch', BranchSchema);
export const Agent = models.Agent || model('Agent', AgentSchema);
export const Customer = models.Customer || model('Customer', CustomerSchema);
export const LoanApplicationModel = models.LoanApplication || model('LoanApplication', LoanApplicationSchema);
export const Deposit = models.Deposit || model('Deposit', DepositSchema);
export const Collection = models.Collection || model('Collection', CollectionSchema);
export const Partner = models.Partner || model('Partner', PartnerSchema);
export const DocumentMetadata = models.DocumentMetadata || model('DocumentMetadata', DocumentMetadataSchema);
export const ProductSchemeModel = models.ProductScheme || model('ProductScheme', ProductSchemeSchema);
export const GatewaySettingsModel = models.GatewaySettings || model('GatewaySettings', GatewaySettingsSchema);


