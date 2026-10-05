import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Collection } from '@/models';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const collections = await Collection.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: collections });
    }
  } catch (err) {
    console.error('Error reading collections from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Collection.create(body);

    // If collected by an agent, credit agent commission and distribute MLM override
    if (body.agentName || body.agentId) {
      const { Agent } = await import('@/models');
      const { distributeUnilevelCommission } = await import('@/lib/mlmService');

      const collectingAgent = await Agent.findOne({
        $or: [{ name: body.agentName }, { agentId: body.agentId }],
      });

      if (collectingAgent) {
        const directCut = Math.round(Number(body.amount || 0) * 0.025); // 2.5% direct commission
        collectingAgent.walletBalance = (Number(collectingAgent.walletBalance) || 0) + directCut;
        collectingAgent.totalCommission = (Number(collectingAgent.totalCommission) || 0) + directCut;
        collectingAgent.transactions = (collectingAgent.transactions || 0) + 1;
        await collectingAgent.save();

        // Distribute Unilevel Overrides to upline
        distributeUnilevelCommission({
          fromAgentId: collectingAgent.agentId,
          fromAgentName: collectingAgent.name,
          eventType: 'COLLECTION',
          sourceAmount: Number(body.amount) || 0,
          notes: `${body.type || 'Collection'} of ₹${body.amount} collected by ${collectingAgent.name}`,
          maxLevels: 14,
        }).catch((e) => console.warn('Collection MLM distribution error:', e));
      }
    }

    // Also record unified PaymentTransaction in database
    try {
      const { PaymentTransactionModel } = await import('@/models');
      await PaymentTransactionModel.create({
        transactionId: `TXN-COL-${Date.now()}`,
        userId: body.customerId || '',
        agentId: body.agentId || '',
        userType: 'Both',
        userName: body.customerName || 'Valued Member',
        agentName: body.agentName || 'Malda HQ Collector',
        type: `${body.type || 'Field'} Collection`,
        category: body.type === 'EMI' || body.type === 'Loan' ? 'LOAN_EMI' : 'COLLECTION',
        flow: 'CREDIT',
        amount: Number(body.amount) || 0,
        paymentMode: body.mode || 'Cash',
        status: 'Success',
        receiptNo: body.receiptNo || `RC${Math.floor(100 + Math.random() * 900)}`,
        notes: `Collected by ${body.agentName || 'Agent'}`,
        date: body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    } catch (txErr) {
      console.warn('Collection to PaymentTransaction warning:', txErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Collection receipt recorded and commissions distributed',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
