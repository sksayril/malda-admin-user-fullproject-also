# MultiCredit 360 - Complete Agent API Specification (A to Z)
**File:** `agentapi.md`  
**Version:** 3.0.0 Enterprise  
**Base URL:** `http://localhost:3000` (Local Development) / `https://your-domain.com` (Production)  
**Content-Type:** `application/json` (or `multipart/form-data` for file uploads)  
**Backend Framework:** Next.js 15 (App Router) + TypeScript + MongoDB (Mongoose)

---

## 📑 Table of Contents

1. [Architectural Overview & Authentication Flow](#1-architectural-overview--authentication-flow)
2. [Data Models & Schema Reference](#2-data-models--schema-reference)
3. [Agent Dedicated Authentication APIs](#3-agent-dedicated-authentication-apis)
   - [3.1 Agent Self-Registration (`POST /api/agent/auth/signup`)](#31-agent-self-registration)
   - [3.2 Agent Login (`POST /api/agent/auth/login`)](#32-agent-login)
4. [Agent Profile, Dashboard & Master APIs](#4-agent-profile-dashboard--master-apis)
   - [4.1 Unified Agent Profile & Overview (`GET /api/agent/data`)](#41-unified-agent-profile--overview)
   - [4.2 List All Agents (`GET /api/agents`)](#42-list-all-agents)
   - [4.3 Create Agent via Admin Panel (`POST /api/agents`)](#43-create-agent-via-admin-panel)
5. [Customer Onboarding & Field KYC APIs](#5-customer-onboarding--field-kyc-apis)
   - [5.1 Onboard Customer with Instant Commission (`POST /api/agent/create-customer`)](#51-onboard-customer-with-instant-commission)
   - [5.2 Cloud S3 Document Upload (`POST /api/s3/upload`)](#52-cloud-s3-document-upload)
   - [5.3 Fetch Agent Linked Customers (`GET /api/customers`)](#53-fetch-agent-linked-customers)
6. [Doorstep Field Collection & Renewal APIs](#6-doorstep-field-collection--renewal-apis)
   - [6.1 Record Field Collection (`POST /api/collections`)](#61-record-field-collection)
   - [6.2 Fetch All Collections (`GET /api/collections`)](#62-fetch-all-collections)
7. [Unified Payment Ledger, Wallet & Bank Payout APIs](#7-unified-payment-ledger-wallet--bank-payout-apis)
   - [7.1 Agent Payment & Commission Ledger (`GET /api/payments/history`)](#71-agent-payment--commission-ledger)
   - [7.2 Agent Bank Payout & Manual Ledger Entry (`POST /api/payments/history`)](#72-agent-bank-payout--manual-ledger-entry)
   - [7.3 Razorpay Online Commission Credit Hook (`POST /api/payments/razorpay/verify`)](#73-razorpay-online-commission-credit-hook)
8. [MLM 14-Level Unilevel Compensation Engine](#8-mlm-14-level-unilevel-compensation-engine)
   - [8.1 Downline Network Tree (`GET /api/mlm/tree`)](#81-downline-network-tree)
   - [8.2 Commission Distribution Audit Logs (`GET /api/mlm/commissions`)](#82-commission-distribution-audit-logs)
   - [8.3 Trigger Commission Distribution (`POST /api/mlm/distribute`)](#83-trigger-commission-distribution)
   - [8.4 Fetch MLM Configurations & Statistics (`GET /api/mlm/settings`)](#84-fetch-mlm-configurations--statistics)
   - [8.5 Update MLM Level Criteria & Rules (`POST /api/mlm/settings`)](#85-update-mlm-level-criteria--rules)
9. [Product Schemes & Commission Rates](#9-product-schemes--commission-rates)
   - [9.1 Fetch Schemes with Agent Rates (`GET /api/schemes`)](#91-fetch-schemes-with-agent-rates)
   - [9.2 Create / Update Scheme Commission (`POST /api/schemes`)](#92-create--update-scheme-commission)
10. [Lending & Deposit Management for Agents](#10-lending--deposit-management-for-agents)
    - [10.1 View Loan Applications (`GET /api/loans`)](#101-view-loan-applications)
    - [10.2 Submit Loan Application (`POST /api/loans`)](#102-submit-loan-application)
    - [10.3 View Deposits (`GET /api/deposits`)](#103-view-deposits)
    - [10.4 Create Deposit Account (`POST /api/deposits`)](#104-create-deposit-account)
11. [Frontend Views to API Mapping](#11-frontend-views-to-api-mapping)
12. [HTTP Status Codes & Response Envelope Standard](#12-http-status-codes--response-envelope-standard)

---

## 1. Architectural Overview & Authentication Flow

All agent features in MultiCredit 360 are built with a **Micro-Service Architecture style inside Next.js App Router API endpoints**.

### Key Highlights:
1. **Multi-Identifier Login**: Agents can log in using:
   - `Agent ID` (e.g. `AGT001`, `KNM00006282`)
   - `Mobile Number` (e.g. `9876543210`)
   - `Email Address` (e.g. `agent@multicredit.com`)
   - `Referral Code` (e.g. `AGT-3601`)
2. **Automated Commission Engine**:
   - **Customer Onboarding Bonus**: Instant ₹250 wallet credit upon creating a customer.
   - **Field Collection Commission**: 2.5% direct cut on cash/UPI field collections (RD, EMI, Loan, FD).
   - **Gateway Attribution**: When a member pays online via Razorpay, the assigned agent earns scheme commission (e.g. 2.0% - 3.0%) automatically.
   - **14-Level Unilevel MLM Over-Riding Commission (ORC)**: Whenever an agent joins, collects, or enrolls a customer, commission distributes up to 14 levels up the upline tree based on unlocked criteria.
3. **Double Ledger Recording**: Every collection records both a physical `Collection` receipt and a financial transaction in `PaymentTransactionModel`.

---

## 2. Data Models & Schema Reference

### 2.1 Agent Schema (`Agent`)
```typescript
interface IAgent {
  agentId: string;              // Unique e.g. "AGT301" or "KNM00006282"
  name: string;                 // Agent Full Name
  mobile: string;               // 10-digit mobile
  email: string;                // Agent email
  password: string;             // Password
  branch: string;               // e.g. "Kolkata HQ" or "Malda Main"
  status: 'Active' | 'Inactive';
  referralCode: string;         // Unique e.g. "AGT-3210"
  sponsorAgentId: string;       // Direct parent agent ID
  sponsorReferralCode: string;   // Direct parent referral code
  upline: string[];             // [Level 1 sponsor, Level 2, ..., Level 14]
  level: number;                // Rank / Tier (1 to 14)
  directAgentsCount: number;    // Directly sponsored agents
  totalTeamCount: number;       // Downline agents across all 14 levels
  mlmCommissionEarned: number;  // Total unilevel commissions earned (₹)
  walletBalance: number;        // Available balance for withdrawal (₹)
  totalCommission: number;      // Lifetime gross commission (₹)
  totalDirectCustomers: number; // Directly onboarded customers count
  online: boolean;              // Online status flag
  lastActive: string;           // Timestamp e.g. "Just now"
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  totalCollection: string;      // Formatted total collections e.g. "₹ 2,50,000"
  transactions: number;         // Total transactions count
  target: string;               // Monthly target e.g. "₹ 3,00,000"
  achievementRate: number;      // Target completion % (e.g. 83)
  tenantId: string;             // "TNT001"
}
```

### 2.2 Payment Transaction Schema (`PaymentTransactionModel`)
```typescript
interface IPaymentTransaction {
  transactionId: string;        // "TXN-20260930-8912"
  userId: string;               // customerId (if customer involved)
  agentId: string;              // agentId (if agent involved)
  userType: 'Customer' | 'Agent' | 'Both';
  userName: string;
  agentName: string;
  type: string;                 // 'Daily Deposit Scheme', 'ORC Level 1', 'Agent Wallet Payout to Bank'
  category: 'DEPOSIT' | 'WITHDRAWAL' | 'LOAN_EMI' | 'RENEWAL' | 'COMMISSION' | 'PAYOUT' | 'COLLECTION';
  flow: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  paymentMode: 'UPI' | 'Cash' | 'Bank Transfer' | 'Razorpay' | 'Wallet';
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  referenceAccount: string;     // Account / Loan / Bank number
  receiptNo: string;            // Receipt number
  notes: string;
  date: string;
}
```

---

## 3. Agent Dedicated Authentication APIs

### 3.1 Agent Self-Registration
- **Route:** `POST /api/agent/auth/signup`
- **Description:** Registers a new field advisor, establishes upline genealogy tree via `sponsorReferralCode`, credits welcome joining bonus (₹2,500), and triggers unilevel MLM distribution.

#### Request Headers:
```http
Content-Type: application/json
```

#### Request Body:
```json
{
  "name": "Subham Banerjee",
  "mobile": "9830123456",
  "email": "subham.agent@multicredit.com",
  "password": "secureAgentPass123",
  "branch": "Malda Main Branch",
  "address": "English Bazar, Malda, West Bengal - 732101",
  "sponsorReferralCode": "AGT-3601"
}
```
*Note: `sponsorReferralCode` can also be supplied as `sponsorAgentId`.*

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Agent registered successfully with referral network linking!",
  "data": {
    "agent": {
      "agentId": "AGT842",
      "name": "Subham Banerjee",
      "mobile": "9830123456",
      "email": "subham.agent@multicredit.com",
      "branch": "Malda Main Branch",
      "status": "Active",
      "referralCode": "AGT-3456",
      "sponsorAgentId": "AGT001",
      "sponsorReferralCode": "AGT-3601",
      "upline": ["AGT001"],
      "level": 1,
      "directAgentsCount": 0,
      "totalTeamCount": 0,
      "mlmCommissionEarned": 0,
      "walletBalance": 2500,
      "totalCommission": 2500,
      "totalDirectCustomers": 0,
      "online": true,
      "lastActive": "Just now",
      "location": {
        "lat": 22.5726,
        "lng": 88.3639,
        "address": "English Bazar, Malda, West Bengal - 732101"
      },
      "totalCollection": "₹ 0",
      "transactions": 0,
      "target": "₹ 2,00,000",
      "achievementRate": 0
    },
    "sponsorLinked": true,
    "sponsorId": "AGT001",
    "token": "token_agt_1760113800000"
  }
}
```

#### Error Responses:
- `400 Bad Request`: `{"success": false, "message": "Name, Mobile and Password are required."}`
- `500 Server Error`: `{"success": false, "message": "Agent registration failed"}`

---

### 3.2 Agent Login
- **Route:** `POST /api/agent/auth/login`
- **Description:** Authenticates an agent using any of their identifiers: Email, Mobile, Agent ID, or Referral Code.

#### Request Body:
```json
{
  "identifier": "AGT001",
  "password": "agent123"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "agent": {
      "_id": "67087612f129a0b12c890123",
      "agentId": "AGT001",
      "name": "Keshab Ch Mahato",
      "mobile": "9876543210",
      "email": "keshab.agent@multicredit.com",
      "branch": "Malda Main Branch",
      "referralCode": "AGT-3601",
      "walletBalance": 24500,
      "totalCommission": 48900,
      "totalDirectCustomers": 32,
      "status": "Active"
    },
    "token": "jwt_agt_AGT001"
  }
}
```

#### Error Responses:
- `400 Bad Request`: `{"success": false, "message": "Please provide Email/Mobile/Agent ID and Password"}`
- `401 Unauthorized`: `{"success": false, "message": "Invalid agent password"}`
- `404 Not Found`: `{"success": false, "message": "Agent account not found. Please verify your credentials or register."}`

---

## 4. Agent Profile, Dashboard & Master APIs

### 4.1 Unified Agent Profile & Overview
- **Route:** `GET /api/agent/data`
- **Description:** Single high-speed aggregator endpoint that powers the entire Agent App: fetches agent profile, assigned customers, collections, 14-level downline tree, MLM commission logs, transaction ledger, and commission breakdown.

#### Query Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `agentId` | string | Optional* | Agent ID (e.g. `AGT001` or `KNM00006282`) |
| `mobile` | string | Optional* | Agent Mobile number |
| `email` | string | Optional* | Agent Email address |
*(At least one query parameter is required).*

#### Sample Request:
```http
GET /api/agent/data?agentId=KNM00006282
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "agent": {
      "agentId": "KNM00006282",
      "name": "KESHAB CH MAHATO",
      "mobile": "9876543210",
      "email": "keshab.agent@multicredit.com",
      "branch": "Malda Main",
      "status": "Active",
      "referralCode": "AGT-3601",
      "walletBalance": 24500,
      "totalCommission": 52000,
      "totalDirectCustomers": 28,
      "totalCollection": "₹ 3,45,000",
      "transactions": 142,
      "target": "₹ 4,00,000",
      "achievementRate": 86
    },
    "customers": [
      {
        "customerId": "CUS001",
        "name": "Anita Sharma",
        "mobile": "9876543210",
        "accountNumber": "MC360-9876543210",
        "savingsBalance": 27900,
        "kycStatus": "Verified",
        "status": "Active"
      }
    ],
    "collections": [
      {
        "receiptNo": "RC-9941",
        "customerName": "Swapan Bala",
        "customerId": "CUS089",
        "agentName": "KESHAB CH MAHATO",
        "type": "RD",
        "amount": 90000,
        "mode": "Cash",
        "date": "29 Sep 2026"
      }
    ],
    "downlineTree": {
      "totalDownlineMembers": 28,
      "levelBreakdown": [...]
    },
    "mlmCommissionLogs": [
      {
        "transactionId": "MLM-1727240100000-842",
        "fromAgentName": "Anil Das",
        "toAgentId": "KNM00006282",
        "level": 1,
        "eventType": "COLLECTION",
        "commissionAmount": 125,
        "status": "Credited",
        "date": "28 Sep 2026"
      }
    ],
    "transactions": [
      {
        "transactionId": "TXN-20260929-9941",
        "type": "Field Collection - RD Renewal",
        "category": "COLLECTION",
        "flow": "CREDIT",
        "amount": 90000,
        "paymentMode": "Cash",
        "date": "29 Sep 2026, 03:20 PM"
      }
    ],
    "commissionBreakdown": {
      "directOnboarding": 8575,
      "loanDisbursementShare": 7350,
      "recurringDepositCommission": 3675,
      "mlmNetworkOverride": 4900
    }
  }
}
```

---

### 4.2 List All Agents
- **Route:** `GET /api/agents`
- **Description:** Returns all registered agents sorted by creation date. Used by Admin dashboards, branch managers, and referral lookup.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "agentId": "AGT001",
      "name": "Keshab Ch Mahato",
      "mobile": "9876543210",
      "branch": "Malda Main",
      "referralCode": "AGT-3601",
      "walletBalance": 24500,
      "totalCollection": "₹ 2,50,000",
      "directAgentsCount": 5,
      "totalTeamCount": 28,
      "status": "Active"
    }
  ]
}
```

---

### 4.3 Create Agent via Admin Panel
- **Route:** `POST /api/agents`
- **Description:** Creates an agent with administrative overrides, links upline sponsor, and triggers the MLM unilevel engine.

#### Request Body:
```json
{
  "agentId": "AGT902",
  "name": "Priyanka Roy",
  "mobile": "9812345678",
  "email": "priyanka.agent@multicredit.com",
  "password": "agentTempPass123",
  "branch": "Malda HQ",
  "sponsorReferralCode": "AGT-3601",
  "target": "₹ 3,50,000"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Agent created in MongoDB",
  "data": {
    "agentId": "AGT902",
    "name": "Priyanka Roy",
    "sponsorAgentId": "AGT001",
    "sponsorReferralCode": "AGT-3601",
    "upline": ["AGT001"],
    "walletBalance": 18450,
    "status": "Active"
  }
}
```

---

## 5. Customer Onboarding & Field KYC APIs

### 5.1 Onboard Customer with Instant Commission
- **Route:** `POST /api/agent/create-customer`
- **Description:** Field Agent registers a new customer. Automatically creates:
  1. Customer Account & Unique Account Number (`MC360-{mobile}`).
  2. Virtual Debit Card (Number, Expiry, CVV).
  3. Sets Savings Balance.
  4. Automatically credits **₹250 Onboarding Bonus** to Agent Wallet.
  5. Triggers unilevel MLM distribution to the agent's upline network!

#### Request Body:
```json
{
  "agentId": "KNM00006282",
  "agentReferralCode": "AGT-3601",
  "name": "Kamal Hassan",
  "mobile": "9876543299",
  "email": "kamal@example.com",
  "password": "custpassword123",
  "panNumber": "ABCDE9999K",
  "panImage": "https://s3.ap-south-1.amazonaws.com/multicredit-docs/tenant/TNT001/customer/pan.jpg",
  "adhaarNumber": "5678 1234 9999",
  "adhaarImage": "https://s3.ap-south-1.amazonaws.com/multicredit-docs/tenant/TNT001/customer/aadhaar.jpg",
  "address": "77 MG Road, English Bazar, Malda",
  "pincode": "732101",
  "type": "Loan",
  "initialDeposit": 2000
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Customer onboarded successfully! ₹250 commission credited to agent wallet.",
  "data": {
    "customer": {
      "customerId": "CUS812",
      "name": "Kamal Hassan",
      "mobile": "9876543299",
      "accountNumber": "MC360-9876543299",
      "debitCardNumber": "5421 9876 5432 9926",
      "debitCardExpiry": "09/31",
      "debitCardCvv": "492",
      "savingsBalance": 5000,
      "referralCode": "AGT-3601",
      "agentId": "KNM00006282",
      "kycStatus": "Verified",
      "status": "Active"
    },
    "commissionEarned": 250
  }
}
```

---

### 5.2 Cloud S3 Document Upload
- **Route:** `POST /api/s3/upload`
- **Description:** Uploads Aadhaar Card, PAN Card, Photo, Signature, or Cheque leaf directly to Amazon S3 and logs file metadata into MongoDB.
- **Request Format:** `multipart/form-data`

#### Form Data Fields:
| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | Binary File | The image or PDF file (e.g. `aadhaar_front.jpg`) |
| `entityType` | string | `customer`, `loan`, `agent_kyc`, or `receipt` |
| `entityId` | string | Target ID e.g. `CUS812` or `AGT001` |

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "File successfully stored in Amazon S3",
  "data": {
    "fileKey": "tenant/TNT001/customer/CUS812/1760113800000_aadhaar_front.jpg",
    "url": "https://multicredit-docs.s3.ap-south-1.amazonaws.com/tenant/TNT001/customer/CUS812/1760113800000_aadhaar_front.jpg",
    "fileName": "aadhaar_front.jpg",
    "fileSize": 245102
  }
}
```

---

### 5.3 Fetch Agent Linked Customers
- **Route:** `GET /api/customers`
- **Description:** Returns all customers registered in the society with their savings balance, loan accounts, and assigned agent.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "customerId": "CUS001",
      "name": "Anita Sharma",
      "mobile": "9876543210",
      "accountNumber": "MC360-9876543210",
      "agentId": "KNM00006282",
      "referralCode": "AGT-3601",
      "savingsBalance": 27900,
      "kycStatus": "Verified",
      "status": "Active"
    }
  ]
}
```

---

## 6. Doorstep Field Collection, Daily Loans & Carry-Forward APIs

### 6.1 Record Field Collection (Daily Loan EMI & General Collections)
- **Route:** `POST /api/collections`
- **Description:** Field Agent collects Cash, UPI, or Wallet payment from a customer. When collecting for a **Daily Loan** (`type: "DAILY_LOAN"` or providing `loanId`):
  1. Locates `LoanApplication` and increments `daysPaid` by the number of installments covered (`Math.floor(amount / dailyInstallment)`).
  2. Settles any **Carry-Forward Overdue** (`carryForwardSettled = Math.min(carryForwardDue, amount - dailyInstallment)`).
  3. Increments `totalCollected` on the loan and updates `lastPaymentDate`.
  4. Automatically closes loan if `daysPaid >= daysTotal`.
  5. Calculates and credits **3.0% Direct Commission** for Daily Loans (2.5% for RD/EMI) instantly to Agent's `walletBalance` and `totalCommission`.
  6. Triggers 14-level unilevel override commission distribution to upline sponsors.
  7. Records an immutable credit entry in `PaymentTransactionModel` unified ledger.

#### Request Body (Daily Loan Collection with Carry-Forward Settlement):
```json
{
  "receiptNo": "RC-9982",
  "loanId": "LN-MALDA-4401",
  "customerId": "CUS001",
  "customerName": "Anita Sharma",
  "agentId": "KNM00006282",
  "agentName": "KESHAB CH MAHATO",
  "type": "DAILY_LOAN",
  "amount": 330,
  "mode": "Cash",
  "date": "11 Oct 2026"
}
```
*Note: In the above example, customer pays ₹330 covering 2 missed days (₹220 carry-forward) plus today's ₹110 installment.*

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Collection receipt recorded! ₹10 commission credited to agent wallet.",
  "data": {
    "_id": "67087612f129a0b12c890999",
    "receiptNo": "RC-9982",
    "loanId": "LN-MALDA-4401",
    "customerName": "Anita Sharma",
    "customerId": "CUS001",
    "agentName": "KESHAB CH MAHATO",
    "agentId": "KNM00006282",
    "type": "DAILY_LOAN",
    "amount": 330,
    "mode": "Cash",
    "daysPaidCount": 3,
    "carryForwardSettled": 220,
    "commissionEarned": 10,
    "date": "11 Oct 2026",
    "loan": {
      "loanId": "LN-MALDA-4401",
      "daysPaid": 11,
      "daysTotal": 100,
      "status": "Approved"
    }
  }
}
```

---

### 6.2 Fetch Collections Filtered by Agent or Loan
- **Route:** `GET /api/collections`
- **Description:** Returns chronological list of all collection receipts. Supports filtering by agent, customer, loan ID, or collection type.

#### Query Parameters:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `agentId` | string | Filters collections by Agent ID or Agent Name |
| `customerId` | string | Filters by Customer ID |
| `loanId` | string | Filters collections specifically for a Daily Loan |
| `type` | string | `DAILY_LOAN`, `EMI`, `RD`, `DRD`, `MIS`, `FD` |
| `limit` | number | Max results (default `100`) |

#### Sample Request:
```http
GET /api/collections?agentId=KNM00006282&type=DAILY_LOAN
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "receiptNo": "RC-9982",
      "loanId": "LN-MALDA-4401",
      "customerName": "Anita Sharma",
      "customerId": "CUS001",
      "agentName": "KESHAB CH MAHATO",
      "agentId": "KNM00006282",
      "type": "DAILY_LOAN",
      "amount": 330,
      "mode": "Cash",
      "daysPaidCount": 3,
      "carryForwardSettled": 220,
      "date": "11 Oct 2026"
    }
  ]
}
```

---

## 7. Unified Payment Ledger, Wallet & Bank Payout APIs

### 7.1 Agent Payment & Commission Ledger
- **Route:** `GET /api/payments/history`
- **Description:** Unified financial ledger returning granular transactions filtered for the agent. Returns commissions, collections, bank payouts, and aggregated inflows/outflows.

#### Query Parameters:
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `agentId` | string | None | Filters transactions by Agent ID or Agent Name |
| `userType` | string | `ALL` | `Agent`, `Customer`, `Both`, or `ALL` |
| `category` | string | `ALL` | `COMMISSION`, `COLLECTION`, `PAYOUT`, `RENEWAL`, `LOAN_EMI`, `DEPOSIT` |
| `search` | string | None | Free text search in Transaction ID, Receipt, Notes, Customer Name |
| `limit` | number | `50` | Maximum records to return |

#### Sample Request:
```http
GET /api/payments/history?agentId=KNM00006282&userType=Agent
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transactionId": "TXN-20260928-9821",
        "agentId": "KNM00006282",
        "userType": "Agent",
        "userName": "KESHAB CH MAHATO",
        "agentName": "KESHAB CH MAHATO",
        "type": "Over-Riding Commission (ORC Level 1)",
        "category": "COMMISSION",
        "flow": "CREDIT",
        "amount": 4250.75,
        "balanceAfter": 24500,
        "paymentMode": "Wallet",
        "status": "Success",
        "referenceAccount": "ORC-SEPT-2026",
        "receiptNo": "RC-9821",
        "notes": "Unilevel Override from Team Chinmay Roy volume",
        "date": "28 Sep 2026, 08:00 PM"
      },
      {
        "transactionId": "TXN-20260925-8812",
        "agentId": "KNM00006282",
        "userType": "Agent",
        "userName": "KESHAB CH MAHATO",
        "agentName": "KESHAB CH MAHATO",
        "type": "Agent Wallet Payout to Bank",
        "category": "PAYOUT",
        "flow": "DEBIT",
        "amount": 15000,
        "balanceAfter": 20249.25,
        "paymentMode": "Bank Transfer",
        "status": "Success",
        "referenceAccount": "SBI-09823481239",
        "receiptNo": "RC-8812",
        "notes": "Transferred to State Bank of India Account ending **239",
        "date": "25 Sep 2026, 01:10 PM"
      }
    ],
    "stats": {
      "totalCount": 2,
      "totalInflow": 4250.75,
      "totalOutflow": 15000,
      "totalCollections": 0,
      "totalCommissions": 4250.75
    }
  }
}
```

---

### 7.2 Agent Bank Payout & Manual Ledger Entry
- **Route:** `POST /api/payments/history`
- **Description:** Allows Agent to withdraw wallet balance to bank account (`PAYOUT`), or Admin to credit manual performance incentives (`COMMISSION`). Automatically updates Agent `walletBalance` in MongoDB.

#### Request Body (Agent Payout Example):
```json
{
  "agentId": "KNM00006282",
  "userType": "Agent",
  "userName": "KESHAB CH MAHATO",
  "agentName": "KESHAB CH MAHATO",
  "type": "Agent Wallet Payout to Bank",
  "category": "PAYOUT",
  "flow": "DEBIT",
  "amount": 5000,
  "paymentMode": "Bank Transfer",
  "referenceAccount": "SBI-98765432101",
  "notes": "Withdrawal request processed to SBI Savings Account"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Transaction recorded and database synced successfully",
  "data": {
    "transactionId": "TXN-20261010-4821",
    "agentId": "KNM00006282",
    "userType": "Agent",
    "amount": 5000,
    "flow": "DEBIT",
    "balanceAfter": 19500,
    "status": "Success",
    "receiptNo": "RC-3982",
    "date": "10 Oct 2026, 10:45 PM"
  }
}
```

---

### 7.3 Razorpay Online Commission Credit Hook
- **Route:** `POST /api/payments/razorpay/verify`
- **Description:** Verifies payment made by a customer via Razorpay. It detects if the paying customer has an associated `referralCode` or `agentId`, looks up the scheme's `agentCommissionPercent`, and **automatically credits commission to the agent's wallet**.

#### Request Body:
```json
{
  "paymentId": "pay_P892jklsd9023",
  "orderId": "order_9832049283",
  "customerId": "CUS001",
  "customerName": "Anita Sharma",
  "amount": 10000,
  "type": "RD",
  "schemeCode": "SCH-RD-01",
  "accountId": "RD00037560"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Razorpay payment verified & automatically collected!",
  "data": {
    "receiptNo": "RC849",
    "paymentId": "pay_P892jklsd9023",
    "amount": 10000,
    "collection": {
      "receiptNo": "RC849",
      "customerName": "Anita Sharma",
      "agentName": "KESHAB CH MAHATO",
      "amount": 10000,
      "mode": "UPI"
    },
    "agentCommissionCredited": 200,
    "agentName": "KESHAB CH MAHATO"
  }
}
```

---

## 8. MLM 14-Level Unilevel Compensation Engine

MultiCredit 360 features an enterprise-grade 14-Level Unilevel Compensation Engine for Agents and Field Advisors.

### 8.1 Downline Network Tree
- **Route:** `GET /api/mlm/tree`
- **Description:** Fetches an agent's complete 14-level downline hierarchy tree, showing members, unlocked qualification status, and total downline count.

#### Query Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `agentId` | string | Optional | Root Agent ID. If omitted, returns all agents with upline information. |

#### Sample Request:
```http
GET /api/mlm/tree?agentId=AGT001
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "agent": {
      "agentId": "AGT001",
      "name": "Keshab Ch Mahato",
      "directAgentsCount": 5,
      "totalTeamCount": 28,
      "walletBalance": 24500
    },
    "totalDownlineMembers": 28,
    "levelBreakdown": [
      {
        "level": 1,
        "name": "Level 1 - Direct Advisor",
        "commissionPercent": 10.0,
        "fixedBonus": 200,
        "minDirectReferrals": 0,
        "minBusinessVolume": 0,
        "status": "Active",
        "membersCount": 5,
        "members": [
          {
            "agentId": "AGT102",
            "name": "Anil Das",
            "mobile": "9876543212",
            "branch": "Malda Main",
            "walletBalance": 12500,
            "totalCollection": "₹ 80,000",
            "totalDirectCustomers": 12,
            "status": "Active"
          }
        ],
        "isUnlocked": true
      },
      {
        "level": 2,
        "name": "Level 2 - Executive Partner",
        "commissionPercent": 5.0,
        "fixedBonus": 100,
        "minDirectReferrals": 2,
        "minBusinessVolume": 10000,
        "status": "Active",
        "membersCount": 12,
        "isUnlocked": true
      }
    ]
  }
}
```

---

### 8.2 Commission Distribution Audit Logs
- **Route:** `GET /api/mlm/commissions`
- **Description:** Fetches unilevel commission audit history. Shows from which agent the event originated, who received the override, level depth, and qualification note.

#### Query Parameters:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `agentId` | string | Filters by recipient (`toAgentId`) or source (`fromAgentId`) |
| `level` | number | Filters by depth level (1 to 14) |
| `eventType` | string | `AGENT_JOIN`, `CUSTOMER_ONBOARD`, `COLLECTION`, `DEPOSIT`, `LOAN_EMI` |

#### Sample Request:
```http
GET /api/mlm/commissions?agentId=AGT001&eventType=COLLECTION
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "MLM-1760113800000-421",
      "fromAgentId": "AGT102",
      "fromAgentName": "Anil Das",
      "toAgentId": "AGT001",
      "toAgentName": "Keshab Ch Mahato",
      "level": 1,
      "eventType": "COLLECTION",
      "sourceAmount": 5000,
      "commissionPercent": 5.0,
      "commissionAmount": 250,
      "status": "Credited",
      "notes": "Collection of ₹5000 (Qualified: 5/0 direct referrals)",
      "date": "10 Oct 2026"
    }
  ]
}
```

---

### 8.3 Trigger Commission Distribution
- **Route:** `POST /api/mlm/distribute`
- **Description:** Programmatically triggers the 14-level unilevel compensation calculation.

#### Request Body:
```json
{
  "fromAgentId": "AGT102",
  "fromAgentName": "Anil Das",
  "eventType": "COLLECTION",
  "sourceAmount": 10000,
  "notes": "RD collection installment of ₹10,000",
  "maxLevels": 14
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Distributed unilevel commission to 3 upline levels",
  "distributions": [
    {
      "level": 1,
      "uplineAgentId": "AGT001",
      "uplineAgentName": "Keshab Ch Mahato",
      "commission": 500,
      "status": "Credited",
      "isQualified": true
    }
  ]
}
```

---

### 8.4 Fetch MLM Configurations & Statistics
- **Route:** `GET /api/mlm/settings`
- **Description:** Retrieves all 14 level rules (names, commission %, joining bonus, direct referral criteria, team volume) plus total network commission paid.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "levels": [
      {
        "level": 1,
        "name": "Level 1 - Direct Advisor",
        "commissionPercent": 10.0,
        "fixedBonus": 200,
        "minDirectReferrals": 0,
        "minBusinessVolume": 0,
        "status": "Active",
        "membersCount": 14,
        "totalCommission": 145000,
        "pendingCommission": 0
      }
    ],
    "summary": {
      "totalLevels": 14,
      "totalSystemCommission": 580000,
      "totalPendingCommission": 12000,
      "totalAgents": 48
    }
  }
}
```

---

### 8.5 Update MLM Level Criteria & Rules
- **Route:** `POST /api/mlm/settings`
- **Description:** Admin configures commission percentages, fixed bonuses, or minimum direct referrals for each tier.

#### Request Body:
```json
{
  "levels": [
    {
      "level": 1,
      "name": "Level 1 - Direct Advisor",
      "commissionPercent": 10.0,
      "fixedBonus": 250,
      "minDirectReferrals": 0,
      "minBusinessVolume": 0,
      "status": "Active"
    },
    {
      "level": 2,
      "name": "Level 2 - Executive Partner",
      "commissionPercent": 6.0,
      "fixedBonus": 150,
      "minDirectReferrals": 2,
      "minBusinessVolume": 25000,
      "status": "Active"
    }
  ]
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "MLM Level criteria and commission rates updated successfully!",
  "data": [...]
}
```

---

## 9. Product Schemes & Commission Rates

### 9.1 Fetch Schemes with Agent Rates
- **Route:** `GET /api/schemes`
- **Description:** Retrieves financial products (Loans, Daily Loans, FDs, RDs, MIS) and the specific `agentCommissionPercent` that the agent earns on each.

#### Query Parameters:
- `category` (optional): `LOAN`, `FD`, `RD`, `MIS`
- `active` (optional): `true`

#### Sample Request:
```http
GET /api/schemes?active=true
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "code": "SCH-LN-01",
      "category": "LOAN",
      "name": "Personal Instant Loan",
      "interestRate": 12.0,
      "minAmount": 10000,
      "maxAmount": 500000,
      "tenureMonths": 24,
      "agentCommissionPercent": 2.0,
      "status": "Active"
    },
    {
      "code": "SCH-LN-DAILY",
      "category": "LOAN",
      "name": "Daily Market Vendor Loan (দৈনিক ঋণ)",
      "interestRate": 10.0,
      "agentCommissionPercent": 3.0,
      "isDailyLoan": true,
      "dailyTenureDays": 100,
      "status": "Active"
    },
    {
      "code": "SCH-RD-01",
      "category": "RD",
      "name": "Monthly Dhanlaxmi Recurring Deposit",
      "interestRate": 7.5,
      "agentCommissionPercent": 1.5,
      "status": "Active"
    }
  ]
}
```

---

### 9.2 Create / Update Scheme Commission
- **Route:** `POST /api/schemes`
- **Description:** Admin sets product specifications and agent commission incentives.

#### Request Body:
```json
{
  "code": "SCH-LN-MICRO",
  "category": "LOAN",
  "name": "Micro Enterprise Loan",
  "interestRate": 14.0,
  "minAmount": 5000,
  "maxAmount": 50000,
  "tenureMonths": 12,
  "agentCommissionPercent": 3.5,
  "status": "Active"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Scheme saved successfully!",
  "data": { ... }
}
```

---

## 10. Lending & Deposit Management for Agents (Daily Loans & Carry-Forward Engine)

### 10.1 Issue Daily Loan to Customer (Agent or Admin)
- **Route:** `POST /api/loans`
- **Description:** Allows an Agent to issue a Doorstep Daily Loan (দৈনিক ঋণ) to any registered customer under their code.
- **Mathematical Formula for Financials:**
  $$\text{Total Payable} = \text{Amount} + \text{Math.round}\left(\frac{\text{Amount} \times \text{InterestRate}}{100}\right)$$
  $$\text{Daily Installment} = \text{Math.round}\left(\frac{\text{Total Payable}}{\text{DailyTenureDays}}\right)$$
  *Example:* On a ₹20,000 loan with 10% interest over 100 days:
  Total Payable = ₹22,000 | Daily Installment = ₹220/day for 100 days.
  Agent Commission = ₹600 (3.0% of principal).

#### Request Body (Issue Daily Loan):
```json
{
  "customerId": "CUS812",
  "customerName": "Kamal Hassan",
  "amount": 20000,
  "interestRate": 10.0,
  "isDailyLoan": true,
  "dailyTenureDays": 100,
  "agentId": "KNM00006282",
  "agentName": "KESHAB CH MAHATO",
  "agentReferralCode": "AGT-3601",
  "loanType": "Daily Loan",
  "status": "Approved"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Daily Loan of ₹20000 successfully issued! Daily installment set to ₹220/day.",
  "data": {
    "loanId": "LN8419",
    "customerName": "Kamal Hassan",
    "customerId": "CUS812",
    "agentId": "KNM00006282",
    "agentName": "KESHAB CH MAHATO",
    "loanType": "Daily Loan",
    "amount": 20000,
    "interestRate": 10,
    "dailyInstallment": 220,
    "daysTotal": 100,
    "daysPaid": 0,
    "carryForwardDue": 0,
    "missedDays": 0,
    "totalPayable": 22000,
    "totalCollected": 0,
    "appliedDate": "11 Oct 2026",
    "disbursedDate": "11 Oct 2026",
    "status": "Approved"
  }
}
```

---

### 10.2 Fetch Agent's Daily Collection Sheet & Carry-Forward Metrics
- **Route:** `GET /api/loans`
- **Description:** Returns all Daily Loans linked to the agent's code or referred customers with dynamic **Carry-Forward Calculation** evaluated on the fly.
- **Carry-Forward Engine Formula:**
  - $\text{Days Elapsed} = \max(1, \text{Today} - \text{DisbursedDate})$
  - $\text{Expected Days Paid} = \min(\text{DaysTotal}, \text{DaysElapsed})$
  - $\text{Missed Days} = \max(0, \text{ExpectedDays} - \text{DaysPaid})$
  - $\mathbf{Carry\ Forward\ Overdue} = \text{Missed Days} \times \text{DailyInstallment}$
  - $\mathbf{Total\ Due\ Today} = \text{Carry Forward Overdue} + \text{DailyInstallment}$
  - $\text{Balance Remaining} = \max(0, \text{Total Payable} - (\text{DaysPaid} \times \text{DailyInstallment}))$

#### Query Parameters:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `agentId` | string | Filters loans where `agentId` matches or borrower was referred by this agent |
| `customerId` | string | Filters loans for a specific customer |
| `isDaily` | string | `true` (only daily loans) or `false` (standard term loans) |
| `status` | string | `All`, `Approved`, `Disbursed`, `Closed`, `Pending` |

#### Sample Request:
```http
GET /api/loans?agentId=KNM00006282&isDaily=true
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "67087612f129a0b12c890123",
      "loanId": "LN-MALDA-4401",
      "customerName": "Anita Sharma",
      "customerId": "CUS001",
      "agentId": "KNM00006282",
      "agentName": "KESHAB CH MAHATO",
      "loanType": "Daily Loan",
      "amount": 10000,
      "interestRate": 10,
      "dailyInstallment": 110,
      "daysTotal": 100,
      "daysPaid": 8,
      "missedDays": 2,
      "carryForwardDue": 220,
      "todayDue": 330,
      "totalPayable": 11000,
      "totalCollected": 880,
      "balanceRemaining": 10120,
      "status": "Approved",
      "disbursedDate": "01 Oct 2026"
    }
  ]
}
```

---

### 10.3 Submit Standard Term Loan Application
- **Route:** `POST /api/loans`
- **Description:** Submit regular monthly Personal Loan, Business Loan, or Emergency Loan.

#### Request Body:
```json
{
  "loanId": "LN-MALDA-9021",
  "customerId": "CUS812",
  "customerName": "Kamal Hassan",
  "loanType": "Personal Loan",
  "amount": 50000,
  "tenureMonths": 24,
  "interestRate": 12.0,
  "appliedDate": "11 Oct 2026",
  "status": "Pending"
}
```

---

### 10.3 View Deposits
- **Route:** `GET /api/deposits`
- **Description:** Lists customer Fixed Deposits, Recurring Deposits, and Monthly Income Schemes.

---

### 10.4 Create Deposit Account
- **Route:** `POST /api/deposits`
- **Description:** Creates a deposit investment account under an agent's referral.

#### Request Body:
```json
{
  "accountId": "RD-2026-0912",
  "customerId": "CUS001",
  "customerName": "Anita Sharma",
  "type": "RD",
  "amount": 2500,
  "interestRate": 7.5,
  "tenureMonths": 12,
  "startDate": "10 Oct 2026",
  "maturityDate": "10 Oct 2027",
  "status": "Active"
}
```

---

## 11. Frontend Views to API Mapping

This table connects the agent React components in `src/components/agent` to their exact API endpoints:

| Frontend Component | UI Feature | API Endpoint(s) Used |
| :--- | :--- | :--- |
| `AgentAuthPage.tsx` | Agent Login Tab | `POST /api/agent/auth/login` |
| `AgentAuthPage.tsx` | Agent Signup / Join Tab | `POST /api/agent/auth/signup` |
| `AgentSavingsView.tsx` | Member Onboarding & KYC | `POST /api/agent/create-customer`, `POST /api/s3/upload` |
| `AgentSavingsView.tsx` | Schemes & Offers | `GET /api/schemes?active=true` |
| `AgentRenewalView.tsx` | Doorstep Collections (Cash/UPI) | `POST /api/collections` |
| `AgentPaymentHistoryView.tsx` | Ledger & Commission History | `GET /api/payments/history?agentId={id}` |
| `AgentPaymentHistoryView.tsx` | Wallet Payout to Bank | `POST /api/payments/history` |
| `AgentProfileChainView.tsx` | 14-Level Network Tree & Upline Chain | `GET /api/mlm/tree?agentId={id}`, `GET /api/agent/data?agentId={id}` |
| `AgentOrcView.tsx` | Over-Riding Commission (ORC) Logs | `GET /api/mlm/commissions?agentId={id}` |
| `AgentQueryReportsView.tsx` | Financial & Collection Analytics | `GET /api/agent/data?agentId={id}` |

---

## 12. HTTP Status Codes & Response Envelope Standard

### Unified JSON Envelope Format:
```json
{
  "success": true,
  "message": "Human-readable description of what succeeded",
  "data": { ... }
}
```

### HTTP Status Code Reference:
- `200 OK`: Request succeeded. Returned data is inside `data`.
- `400 Bad Request`: Validation failure (missing required parameters, invalid amounts).
- `401 Unauthorized`: Bad password or unauthenticated session.
- `404 Not Found`: Agent, customer, or resource not found in database.
- `500 Internal Server Error`: Uncaught database exception or S3 failure.

---

*MultiCredit 360 - Enterprise Micro-Finance & Agent Portal Documentation. Maintained by Core Engineering.*
