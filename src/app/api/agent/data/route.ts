import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent, Customer, Collection } from '@/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId') || searchParams.get('mobile') || searchParams.get('email');

    if (!agentId) {
      return NextResponse.json(
        { success: false, message: 'Agent ID, mobile, or email is required' },
        { status: 400 }
      );
    }

    let agent: any = null;
    let customers: any[] = [];
    let collections: any[] = [];

    const conn = await connectToDatabase();
    if (conn) {
      agent = await Agent.findOne({
        $or: [
          { agentId },
          { mobile: agentId },
          { email: agentId },
          { referralCode: agentId },
        ],
      }).lean();

      if (agent) {
        customers = await Customer.find({
          $or: [{ agentId: agent.agentId }, { referralCode: agent.referralCode }],
        }).sort({ createdAt: -1 }).lean();

        collections = await Collection.find({
          $or: [
            { agentName: agent.name },
            { agentId: agent.agentId },
          ],
        }).sort({ createdAt: -1 }).lean();
      }
    }

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent account not found in database', data: null },
        { status: 404 }
      );
    }

    const currentBalance = Number(agent.walletBalance || 0);

    // Commission statistics breakdown calculated from actual wallet balance
    const commissionBreakdown = {
      directOnboarding: currentBalance * 0.35,
      loanDisbursementShare: currentBalance * 0.4,
      recurringDepositCommission: currentBalance * 0.15,
      mlmNetworkOverride: currentBalance * 0.1,
    };

    return NextResponse.json({
      success: true,
      data: {
        agent,
        customers,
        collections,
        commissionBreakdown,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching agent data' },
      { status: 500 }
    );
  }
}
