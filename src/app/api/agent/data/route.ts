import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent, Customer, Collection, MlmCommissionLog, PaymentTransactionModel, LoanApplicationModel } from '@/models';
import { getAgentDownlineTree } from '@/lib/mlmService';

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
    let downlineTree: any = null;
    let mlmCommissionLogs: any[] = [];
    let transactions: any[] = [];
    let dailyLoans: any[] = [];
    let dailySummary = {
      totalActiveDailyLoans: 0,
      todayExpectedCollection: 0,
      totalCarryForwardDue: 0,
      collectedToday: 0,
    };

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

        // Fetch downline tree
        downlineTree = await getAgentDownlineTree(agent.agentId);

        // Fetch MLM commission transactions
        mlmCommissionLogs = await MlmCommissionLog.find({
          toAgentId: agent.agentId,
        }).sort({ createdAt: -1 }).limit(20).lean();

        // Fetch Payment and Collections Transactions Ledger
        transactions = await PaymentTransactionModel.find({
          $or: [
            { agentId: agent.agentId },
            { agentName: { $regex: agent.name, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).limit(50).lean();

        // Fetch active daily loans for this agent and their registered customers
        const customerIds = customers.map((c) => c.customerId);
        const rawDailyLoans = await LoanApplicationModel.find({
          $or: [
            { agentId: agent.agentId },
            { agentReferralCode: agent.referralCode },
            { customerId: { $in: customerIds } },
          ],
          $and: [
            { $or: [{ isDailyLoan: true }, { loanType: 'Daily Loan' }] },
            { status: { $ne: 'Closed' } },
          ],
        }).sort({ createdAt: -1 }).lean();

        const todayDate = new Date();
        const todayStr = todayDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        dailyLoans = rawDailyLoans.map((loan: any) => {
          const principal = Number(loan.amount) || 0;
          const rate = Number(loan.interestRate) || 10;
          const totalPayable = loan.totalPayable || principal + Math.round((principal * rate) / 100);
          const daysTotal = Number(loan.daysTotal || loan.dailyTenureDays || 100);
          const dailyInstallment = loan.dailyInstallment || Math.round(totalPayable / daysTotal);
          const daysPaid = Number(loan.daysPaid) || 0;

          let startDate = todayDate;
          if (loan.disbursedDate) {
            const parsed = new Date(loan.disbursedDate);
            if (!isNaN(parsed.getTime())) startDate = parsed;
          } else if (loan.appliedDate) {
            const parsed = new Date(loan.appliedDate);
            if (!isNaN(parsed.getTime())) startDate = parsed;
          } else if (loan.createdAt) {
            startDate = new Date(loan.createdAt);
          }

          const diffTime = Math.abs(todayDate.getTime() - startDate.getTime());
          const daysElapsed = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
          const expectedDays = Math.min(daysTotal, daysElapsed);
          const missedDays = Math.max(0, expectedDays - daysPaid);
          const carryForwardDue = missedDays * dailyInstallment;
          const todayDue = daysPaid >= daysTotal ? 0 : carryForwardDue + dailyInstallment;

          return {
            ...loan,
            id: loan._id?.toString() || loan.id,
            dailyInstallment,
            daysTotal,
            daysPaid,
            missedDays,
            carryForwardDue,
            todayDue,
            totalPayable,
            totalCollected: loan.totalCollected || daysPaid * dailyInstallment,
            balanceRemaining: Math.max(0, totalPayable - daysPaid * dailyInstallment),
          };
        });

        // Calculate Daily Summary Metrics
        let expectedTotal = 0;
        let carryTotal = 0;
        dailyLoans.forEach((dl) => {
          expectedTotal += dl.dailyInstallment || 0;
          carryTotal += dl.carryForwardDue || 0;
        });

        const todayCollections = collections.filter(
          (c) => (c.date === todayStr || c.date?.includes('Today')) && (c.type === 'DAILY_LOAN' || c.type === 'DRD')
        );
        const collectedToday = todayCollections.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

        dailySummary = {
          totalActiveDailyLoans: dailyLoans.length,
          todayExpectedCollection: expectedTotal,
          totalCarryForwardDue: carryTotal,
          collectedToday,
        };
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
      loanDisbursementShare: currentBalance * 0.3,
      recurringDepositCommission: currentBalance * 0.15,
      mlmNetworkOverride: agent.mlmCommissionEarned || currentBalance * 0.2,
    };

    return NextResponse.json({
      success: true,
      data: {
        agent,
        customers,
        collections,
        downlineTree,
        mlmCommissionLogs,
        transactions,
        dailyLoans,
        dailySummary,
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
