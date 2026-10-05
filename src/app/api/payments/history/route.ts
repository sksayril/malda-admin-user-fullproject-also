import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { PaymentTransactionModel, Customer, Agent, Collection } from '@/models';

// Sample pre-populated transactions when user or agent history is requested
const SEED_TRANSACTIONS = [
  // Customer Transactions
  {
    transactionId: 'TXN-20260930-8912',
    userId: 'CUST-001',
    agentId: 'KNM00006282',
    userType: 'Both',
    userName: 'Anita Sharma',
    agentName: 'KESHAB CH MAHATO',
    type: 'Monthly Recurring Deposit (RD)',
    category: 'RENEWAL',
    flow: 'CREDIT',
    amount: 2500,
    balanceAfter: 27900,
    paymentMode: 'UPI',
    status: 'Success',
    referenceAccount: 'RD00037560',
    receiptNo: 'RC-9482',
    notes: 'RD Installment for Month of September 2026',
    date: '30 Sep 2026, 04:30 PM',
  },
  {
    transactionId: 'TXN-20260928-7411',
    userId: 'CUST-001',
    agentId: 'KNM00006282',
    userType: 'Both',
    userName: 'Anita Sharma',
    agentName: 'KESHAB CH MAHATO',
    type: 'Personal Loan EMI',
    category: 'LOAN_EMI',
    flow: 'DEBIT',
    amount: 1891,
    balanceAfter: 25400,
    paymentMode: 'Razorpay',
    status: 'Success',
    referenceAccount: 'LN-MALDA-4401',
    receiptNo: 'RC-9304',
    notes: 'EMI #3 of 12 for Personal Loan',
    date: '28 Sep 2026, 11:15 AM',
  },
  {
    transactionId: 'TXN-20260920-6320',
    userId: 'CUST-001',
    agentId: 'KNM00006282',
    userType: 'Both',
    userName: 'Anita Sharma',
    agentName: 'KESHAB CH MAHATO',
    type: 'Savings Account Deposit',
    category: 'DEPOSIT',
    flow: 'CREDIT',
    amount: 5000,
    balanceAfter: 27291,
    paymentMode: 'Bank Transfer',
    status: 'Success',
    referenceAccount: 'SB-MALDA-2026-091',
    receiptNo: 'RC-8912',
    notes: 'Cash deposit at Pakuahat Branch counter',
    date: '20 Sep 2026, 02:45 PM',
  },
  {
    transactionId: 'TXN-20260915-5190',
    userId: 'CUST-001',
    agentId: 'KNM00006282',
    userType: 'Both',
    userName: 'Anita Sharma',
    agentName: 'KESHAB CH MAHATO',
    type: 'Daily Deposit Scheme (DRD)',
    category: 'RENEWAL',
    flow: 'CREDIT',
    amount: 500,
    balanceAfter: 22291,
    paymentMode: 'Cash',
    status: 'Success',
    referenceAccount: 'DD00045883',
    receiptNo: 'RC-8419',
    notes: 'Daily collection verified by field collector',
    date: '15 Sep 2026, 10:20 AM',
  },
  {
    transactionId: 'TXN-20260905-3120',
    userId: 'CUST-001',
    agentId: 'KNM00006282',
    userType: 'Customer',
    userName: 'Anita Sharma',
    agentName: 'Razorpay Online Gateway',
    type: 'Online Wallet Top-up',
    category: 'DEPOSIT',
    flow: 'CREDIT',
    amount: 10000,
    balanceAfter: 21791,
    paymentMode: 'Razorpay',
    status: 'Success',
    referenceAccount: 'PAY-RZP-902183',
    receiptNo: 'RC-7712',
    notes: 'Instant net-banking top-up',
    date: '05 Sep 2026, 07:10 PM',
  },

  // Agent Specific Transactions (Commissions, Collections, Payouts)
  {
    transactionId: 'TXN-20260929-9941',
    userId: '',
    agentId: 'KNM00006282',
    userType: 'Agent',
    userName: 'SWAPAN BALA',
    agentName: 'KESHAB CH MAHATO',
    type: 'Field Collection - RD Renewal',
    category: 'COLLECTION',
    flow: 'CREDIT',
    amount: 90000,
    balanceAfter: 24500,
    paymentMode: 'Cash',
    status: 'Success',
    referenceAccount: 'RD000055331',
    receiptNo: 'RC-9941',
    notes: 'Doorstep collection logged in Malda Zone 2',
    date: '29 Sep 2026, 03:20 PM',
  },
  {
    transactionId: 'TXN-20260928-9821',
    userId: '',
    agentId: 'KNM00006282',
    userType: 'Agent',
    userName: 'KESHAB CH MAHATO',
    agentName: 'KESHAB CH MAHATO',
    type: 'Over-Riding Commission (ORC Level 1)',
    category: 'COMMISSION',
    flow: 'CREDIT',
    amount: 4250.75,
    balanceAfter: 24500,
    paymentMode: 'Wallet',
    status: 'Success',
    referenceAccount: 'ORC-SEPT-2026',
    receiptNo: 'RC-9821',
    notes: 'Unilevel Override from Team Chinmay Roy volume',
    date: '28 Sep 2026, 08:00 PM',
  },
  {
    transactionId: 'TXN-20260925-8812',
    userId: '',
    agentId: 'KNM00006282',
    userType: 'Agent',
    userName: 'KESHAB CH MAHATO',
    agentName: 'KESHAB CH MAHATO',
    type: 'Agent Wallet Payout to Bank',
    category: 'PAYOUT',
    flow: 'DEBIT',
    amount: 15000,
    balanceAfter: 20249.25,
    paymentMode: 'Bank Transfer',
    status: 'Success',
    referenceAccount: 'SBI-09823481239',
    receiptNo: 'RC-8812',
    notes: 'Transferred to State Bank of India Account ending **239',
    date: '25 Sep 2026, 01:10 PM',
  },
  {
    transactionId: 'TXN-20260918-7731',
    userId: '',
    agentId: 'KNM00006282',
    userType: 'Agent',
    userName: 'RINA MANDAL SARKAR',
    agentName: 'KESHAB CH MAHATO',
    type: 'Daily Deposit Scheme (DRD)',
    category: 'COLLECTION',
    flow: 'CREDIT',
    amount: 18900,
    balanceAfter: 35249.25,
    paymentMode: 'UPI',
    status: 'Success',
    referenceAccount: 'DD000060582',
    receiptNo: 'RC-7731',
    notes: 'DRD Month 3 bulk collection',
    date: '18 Sep 2026, 12:40 PM',
  },
  {
    transactionId: 'TXN-20260910-6621',
    userId: '',
    agentId: 'KNM00006282',
    userType: 'Agent',
    userName: 'KESHAB CH MAHATO',
    agentName: 'KESHAB CH MAHATO',
    type: 'Direct Member Onboarding Incentive',
    category: 'COMMISSION',
    flow: 'CREDIT',
    amount: 1250,
    balanceAfter: 16349.25,
    paymentMode: 'Wallet',
    status: 'Success',
    referenceAccount: 'ONB-CUST-8392',
    receiptNo: 'RC-6621',
    notes: 'Direct 5 member onboarding incentive credited',
    date: '10 Sep 2026, 05:15 PM',
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('customerId');
    const agentId = searchParams.get('agentId');
    const userType = searchParams.get('userType'); // 'Customer' | 'Agent' | 'Both'
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed', data: [] },
        { status: 500 }
      );
    }

    // Auto-seed initial transactions if collection is empty
    const totalCount = await PaymentTransactionModel.countDocuments();
    if (totalCount === 0) {
      try {
        await PaymentTransactionModel.insertMany(SEED_TRANSACTIONS);
      } catch (e) {
        console.warn('Seed transactions error:', e);
      }
    }

    // Build filter query
    const filter: any = {};

    if (userId && agentId) {
      filter.$or = [
        { userId },
        { agentId },
        { customerName: { $regex: userId, $options: 'i' } },
        { agentName: { $regex: agentId, $options: 'i' } },
      ];
    } else if (userId) {
      filter.$or = [
        { userId },
        { userName: { $regex: userId, $options: 'i' } },
        { userType: { $in: ['Customer', 'Both'] } },
      ];
    } else if (agentId) {
      filter.$or = [
        { agentId },
        { agentName: { $regex: agentId, $options: 'i' } },
        { userType: { $in: ['Agent', 'Both'] } },
      ];
    }

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (userType && userType !== 'ALL') {
      filter.userType = { $in: [userType, 'Both'] };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { transactionId: searchRegex },
            { receiptNo: searchRegex },
            { referenceAccount: searchRegex },
            { userName: searchRegex },
            { agentName: searchRegex },
            { type: searchRegex },
            { notes: searchRegex },
          ],
        },
      ];
    }

    const transactions = await PaymentTransactionModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Calculate aggregated statistics
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalCollections = 0;
    let totalCommissions = 0;

    transactions.forEach((tx: any) => {
      const amt = Number(tx.amount || 0);
      if (tx.flow === 'CREDIT') totalInflow += amt;
      if (tx.flow === 'DEBIT') totalOutflow += amt;
      if (tx.category === 'COLLECTION') totalCollections += amt;
      if (tx.category === 'COMMISSION') totalCommissions += amt;
    });

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        stats: {
          totalCount: transactions.length,
          totalInflow,
          totalOutflow,
          totalCollections,
          totalCommissions,
        },
      },
    });
  } catch (err: any) {
    console.error('Payment history GET error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching payment history', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      transactionId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      agentId,
      userType = 'Customer',
      userName = '',
      agentName = '',
      type,
      category,
      flow = 'CREDIT',
      amount,
      paymentMode = 'UPI',
      referenceAccount = '',
      receiptNo = `RC-${Math.floor(1000 + Math.random() * 9000)}`,
      notes = '',
      date = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    } = body;

    if (!amount || !type || !category) {
      return NextResponse.json(
        { success: false, message: 'Amount, Type, and Category are required.' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    let balanceAfter = 0;

    await connectToDatabase();

    // 1. If customer, update customer savings balance if appropriate
    if (userId) {
      const customer = await Customer.findOne({
        $or: [{ customerId: userId }, { mobile: userId }],
      });
      if (customer) {
        if (flow === 'CREDIT' && (category === 'DEPOSIT' || category === 'RENEWAL')) {
          customer.savingsBalance = (Number(customer.savingsBalance) || 0) + numAmount;
        } else if (flow === 'DEBIT' && (category === 'WITHDRAWAL' || category === 'LOAN_EMI')) {
          customer.savingsBalance = Math.max(0, (Number(customer.savingsBalance) || 0) - numAmount);
        }
        await customer.save();
        balanceAfter = customer.savingsBalance;
      }
    }

    // 2. If agent, update agent wallet balance if commission or payout
    if (agentId) {
      const agent = await Agent.findOne({
        $or: [{ agentId }, { mobile: agentId }],
      });
      if (agent) {
        if (flow === 'CREDIT' && category === 'COMMISSION') {
          agent.walletBalance = (Number(agent.walletBalance) || 0) + numAmount;
          agent.totalCommission = (Number(agent.totalCommission) || 0) + numAmount;
        } else if (flow === 'DEBIT' && category === 'PAYOUT') {
          agent.walletBalance = Math.max(0, (Number(agent.walletBalance) || 0) - numAmount);
        }
        await agent.save();
        if (!balanceAfter) balanceAfter = agent.walletBalance;
      }
    }

    // 3. Create persistent Payment Transaction in MongoDB
    const createdTransaction = await PaymentTransactionModel.create({
      transactionId,
      userId,
      agentId,
      userType,
      userName,
      agentName,
      type,
      category,
      flow,
      amount: numAmount,
      balanceAfter,
      paymentMode,
      status: 'Success',
      referenceAccount,
      receiptNo,
      notes,
      date,
    });

    // 4. Also mirror into Collection model if it is a field/online collection
    if (category === 'COLLECTION' || category === 'RENEWAL' || category === 'LOAN_EMI') {
      try {
        await Collection.create({
          receiptNo,
          customerName: userName || 'Valued Member',
          customerId: userId || 'CUST-001',
          agentName: agentName || 'Malda HQ Collector',
          type: category === 'LOAN_EMI' ? 'EMI' : category === 'RENEWAL' ? 'RD' : 'FD',
          amount: numAmount,
          mode: paymentMode === 'Razorpay' ? 'UPI' : paymentMode === 'Bank Transfer' ? 'Bank' : paymentMode,
          date,
        });
      } catch (e) {
        console.warn('Collection mirror warning:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction recorded and database synced successfully',
      data: createdTransaction,
    });
  } catch (err: any) {
    console.error('Payment history POST error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error creating transaction' },
      { status: 500 }
    );
  }
}
