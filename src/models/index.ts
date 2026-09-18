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
    branch: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    online: { type: Boolean, default: true },
    lastActive: { type: String, default: 'Just now' },
    location: {
      lat: { type: Number, default: 22.5726 },
      lng: { type: Number, default: 88.3639 },
      address: { type: String, default: 'Kolkata, West Bengal' },
    },
    totalCollection: { type: String, default: '₹ 0' },
    transactions: { type: Number, default: 0 },
    target: { type: String, default: '₹ 1,00,000' },
    achievementRate: { type: Number, default: 0 },
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
    address: { type: String },
    dob: { type: String },
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
    documentsCount: { type: Number, default: 0 },
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
      enum: ['Personal Loan', 'Business Loan', 'Emergency Loan', 'Small Loan'],
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
      default: 'Pending',
    },
    step: {
      type: String,
      enum: ['Application', 'Documents', 'Verification', 'Approval', 'Disbursement'],
      default: 'Application',
    },
    tenantId: { type: String, default: 'TNT001', index: true },
  },
  { timestamps: true }
);

// Deposit Account Schema
const DepositSchema = new Schema(
  {
    accountId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    type: { type: String, enum: ['FD', 'RD', 'MIS'], required: true },
    amount: { type: Number, required: true },
    startDate: { type: String, required: true },
    maturityDate: { type: String, required: true },
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

