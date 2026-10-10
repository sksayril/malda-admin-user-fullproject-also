import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Collection, LoanApplicationModel, Agent, PaymentTransactionModel } from '@/models';
import { distributeUnilevelCommission } from '@/lib/mlmService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const customerId = searchParams.get('customerId');
    const loanId = searchParams.get('loanId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const conn = await connectToDatabase();
    if (conn) {
      const query: any = {};
      if (agentId) {
        query.$or = [{ agentId }, { agentName: { $regex: agentId, $options: 'i' } }];
      }
      if (customerId) {
        query.customerId = customerId;
      }
      if (loanId) {
        query.loanId = loanId;
      }
      if (type && type !== 'All') {
        query.type = type;
      }

      const collections = await Collection.find(query).sort({ createdAt: -1 }).limit(limit).lean();
      return NextResponse.json({ success: true, data: collections });
    }
  } catch (err: any) {
    console.error('Error reading collections from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerId,
      agentName,
      agentId,
      loanId,
      type = 'DAILY_LOAN',
      amount,
      mode = 'Cash',
      receiptNo = `RC${Math.floor(10000 + Math.random() * 90000)}`,
      date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    } = body;

    if (!amount || !customerId) {
      return NextResponse.json(
        { success: false, message: 'Amount and Customer ID are required' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    await connectToDatabase();

    const isDaily = type === 'DAILY_LOAN' || type === 'DRD' || Boolean(loanId);
    let daysPaidCount = 1;
    let carryForwardSettled = 0;
    let linkedLoan: any = null;

    // 1. If loanId or daily loan, find LoanApplication and update repayment progress
    if (loanId || isDaily) {
      const loanQuery: any = loanId ? { loanId } : { customerId, isDailyLoan: true, status: { $ne: 'Closed' } };
      linkedLoan = await LoanApplicationModel.findOne(loanQuery);

      if (linkedLoan) {
        const dailyInst = linkedLoan.dailyInstallment || Math.round(linkedLoan.totalPayable / (linkedLoan.daysTotal || 100)) || 100;
        daysPaidCount = Math.max(1, Math.floor(numAmount / dailyInst));

        const updatedDaysPaid = (linkedLoan.daysPaid || 0) + daysPaidCount;
        const totalCollected = (linkedLoan.totalCollected || 0) + numAmount;
        const isCompleted = updatedDaysPaid >= (linkedLoan.daysTotal || 100);

        // Calculate carry forward settled
        if (linkedLoan.carryForwardDue && linkedLoan.carryForwardDue > 0) {
          carryForwardSettled = Math.min(linkedLoan.carryForwardDue, numAmount - dailyInst);
          if (carryForwardSettled < 0) carryForwardSettled = 0;
        }

        linkedLoan.daysPaid = updatedDaysPaid;
        linkedLoan.totalCollected = totalCollected;
        linkedLoan.lastPaymentDate = date;
        if (isCompleted) {
          linkedLoan.status = 'Closed';
        }
        await linkedLoan.save();
      }
    }

    // 2. Create Collection Record
    const collectionData = {
      receiptNo,
      customerName: customerName || linkedLoan?.customerName || 'Valued Member',
      customerId: customerId || linkedLoan?.customerId || 'CUS-001',
      agentName: agentName || linkedLoan?.agentName || 'Assigned Collector',
      agentId: agentId || linkedLoan?.agentId || '',
      loanId: loanId || linkedLoan?.loanId || '',
      type: isDaily ? 'DAILY_LOAN' : type,
      amount: numAmount,
      mode,
      daysPaidCount,
      carryForwardSettled,
      date,
    };

    const created = await Collection.create(collectionData);

    // 3. Calculate and Credit Agent Commission (3.0% for Daily Loans, 2.5% for general field collections)
    const commissionPercent = isDaily ? 0.03 : 0.025;
    const directCommission = Math.round(numAmount * commissionPercent);

    const targetAgentId = agentId || linkedLoan?.agentId;
    const targetAgentName = agentName || linkedLoan?.agentName;

    if (targetAgentId || targetAgentName) {
      const collectingAgent = await Agent.findOne({
        $or: [
          ...(targetAgentId ? [{ agentId: targetAgentId }] : []),
          ...(targetAgentName ? [{ name: targetAgentName }] : []),
        ],
      });

      if (collectingAgent) {
        collectingAgent.walletBalance = (Number(collectingAgent.walletBalance) || 0) + directCommission;
        collectingAgent.totalCommission = (Number(collectingAgent.totalCommission) || 0) + directCommission;
        collectingAgent.transactions = (collectingAgent.transactions || 0) + 1;
        await collectingAgent.save();

        // 4. Distribute Unilevel Overrides across upline (14 levels)
        distributeUnilevelCommission({
          fromAgentId: collectingAgent.agentId,
          fromAgentName: collectingAgent.name,
          eventType: 'COLLECTION',
          sourceAmount: numAmount,
          notes: `${isDaily ? 'Daily Loan Collection' : type} of ₹${numAmount} collected by ${collectingAgent.name}`,
          maxLevels: 14,
        }).catch((e) => console.warn('Collection MLM distribution warning:', e));
      }
    }

    // 5. Record Unified Payment Transaction
    try {
      await PaymentTransactionModel.create({
        transactionId: `TXN-COL-${Date.now()}`,
        userId: customerId,
        agentId: targetAgentId || '',
        userType: 'Both',
        userName: customerName || 'Valued Member',
        agentName: targetAgentName || 'Malda HQ Collector',
        type: isDaily ? 'Daily Loan Installment Collection' : `${type} Collection`,
        category: 'COLLECTION',
        flow: 'CREDIT',
        amount: numAmount,
        paymentMode: mode,
        status: 'Success',
        referenceAccount: loanId || linkedLoan?.loanId || receiptNo,
        receiptNo,
        notes: `Collected ${daysPaidCount} day(s) daily EMI installment${carryForwardSettled > 0 ? ` (Settled ₹${carryForwardSettled} carry-forward)` : ''}`,
        date,
      });
    } catch (txErr) {
      console.warn('PaymentTransaction log warning:', txErr);
    }

    return NextResponse.json({
      success: true,
      message: `Collection receipt recorded! ₹${directCommission} commission credited to agent wallet.`,
      data: {
        ...created.toObject(),
        daysPaidCount,
        commissionEarned: directCommission,
        loan: linkedLoan
          ? {
              loanId: linkedLoan.loanId,
              daysPaid: linkedLoan.daysPaid,
              daysTotal: linkedLoan.daysTotal,
              status: linkedLoan.status,
            }
          : null,
      },
    });
  } catch (err: any) {
    console.error('Collection POST error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
