import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent, Customer, Collection } from '@/models';
import { INITIAL_AGENTS, INITIAL_CUSTOMERS, INITIAL_COLLECTIONS } from '@/data/mockData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId') || searchParams.get('mobile') || 'AGT001';

    let agent: any = null;
    let customers: any[] = [];
    let collections: any[] = [];

    try {
      const conn = await connectToDatabase();
      if (conn) {
        agent = await Agent.findOne({
          $or: [{ agentId }, { mobile: agentId }, { referralCode: agentId }],
        }).lean();

        if (agent) {
          customers = await Customer.find({
            $or: [{ agentId: agent.agentId }, { referralCode: agent.referralCode }],
          }).lean();

          collections = await Collection.find({
            $or: [{ agentName: agent.name }, { agentId: agent.agentId }],
          }).lean();
        }
      }
    } catch (err) {
      console.warn('DB agent lookup error, using mock:', err);
    }

    if (!agent) {
      agent =
        INITIAL_AGENTS.find(
          (a) => a.agentId === agentId || a.mobile === agentId || a.referralCode === agentId
        ) || INITIAL_AGENTS[0];

      customers = INITIAL_CUSTOMERS.filter(
        (c) => c.agentId === agent.agentId || c.referralCode === agent.referralCode
      );
      collections = INITIAL_COLLECTIONS.filter((col) => col.agentName === agent.name);
    }

    // Commission statistics breakdown
    const commissionBreakdown = {
      directOnboarding: Number(agent.walletBalance || 18450) * 0.35,
      loanDisbursementShare: Number(agent.walletBalance || 18450) * 0.4,
      recurringDepositCommission: Number(agent.walletBalance || 18450) * 0.15,
      mlmNetworkOverride: Number(agent.walletBalance || 18450) * 0.1,
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
