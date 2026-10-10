import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { LoanApplicationModel, Customer, Agent } from '@/models';
import { calculateEmi } from '@/lib/financials';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const customerId = searchParams.get('customerId');
    const isDailyLoan = searchParams.get('isDaily') || searchParams.get('isDailyLoan');
    const status = searchParams.get('status');

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, data: [] });
    }

    const filter: any = {};

    if (customerId) {
      filter.customerId = customerId;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (isDailyLoan === 'true') {
      filter.$or = [{ isDailyLoan: true }, { loanType: 'Daily Loan' }];
    } else if (isDailyLoan === 'false') {
      filter.isDailyLoan = { $ne: true };
      filter.loanType = { $ne: 'Daily Loan' };
    }

    // Agent specific filtering: matches loan's agentId OR customers registered under this agent's referralCode / agentId
    if (agentId) {
      const agentCusts = await Customer.find({
        $or: [{ agentId }, { referralCode: agentId }],
      })
        .select('customerId')
        .lean();

      const customerIds = agentCusts.map((c) => c.customerId);

      filter.$or = [
        { agentId },
        { agentReferralCode: agentId },
        { customerId: { $in: customerIds } },
      ];
    }

    const rawLoans = await LoanApplicationModel.find(filter).sort({ createdAt: -1 }).lean();

    const todayDate = new Date();

    // Enrich loans with carry-forward overdue and daily installment calculations
    const enrichedLoans = rawLoans.map((loan: any) => {
      const isDaily = loan.isDailyLoan === true || loan.loanType === 'Daily Loan';
      const principal = Number(loan.amount) || 0;
      const rate = Number(loan.interestRate) || 10;
      const totalPayable = loan.totalPayable || principal + Math.round((principal * rate) / 100);
      const daysTotal = Number(loan.daysTotal || loan.dailyTenureDays || 100);
      const dailyInstallment = loan.dailyInstallment || Math.round(totalPayable / daysTotal);
      const daysPaid = Number(loan.daysPaid) || 0;

      let missedDays = 0;
      let carryForwardDue = 0;
      let todayDue = dailyInstallment;
      let balanceRemaining = Math.max(0, totalPayable - daysPaid * dailyInstallment);

      if (isDaily) {
        // Calculate days elapsed since loan disbursement / creation
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

        // How many days should have been paid by today
        const expectedDays = Math.min(daysTotal, daysElapsed);

        // Missed days that are overdue
        missedDays = Math.max(0, expectedDays - daysPaid);

        // Cumulative Carry-Forward overdue amount
        carryForwardDue = missedDays * dailyInstallment;

        // Total Due Today = Carry Forward Due + Today's installment
        todayDue = daysPaid >= daysTotal ? 0 : carryForwardDue + dailyInstallment;
      }

      return {
        ...loan,
        id: loan._id?.toString() || loan.id,
        isDailyLoan: isDaily,
        dailyInstallment,
        daysTotal,
        daysPaid,
        missedDays,
        carryForwardDue,
        todayDue,
        totalPayable,
        totalCollected: loan.totalCollected || daysPaid * dailyInstallment,
        balanceRemaining,
      };
    });

    return NextResponse.json({ success: true, data: enrichedLoans });
  } catch (err: any) {
    console.error('Error reading loans from DB:', err);
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount = 50000,
      interestRate = 10,
      tenureMonths = 3,
      isDailyLoan = false,
      dailyTenureDays = 100,
      daysTotal = 100,
      customerId,
      customerName,
      agentId,
      agentName,
      agentReferralCode,
      loanType,
      status = 'Approved',
      step = 'Disbursement',
    } = body;

    await connectToDatabase();

    const isDaily = isDailyLoan || loanType === 'Daily Loan';
    const numAmount = Number(amount);
    const numRate = Number(interestRate);

    // Calculate Financials
    let monthlyEmi = 0;
    let dailyInstallment = 0;
    let totalPayable = 0;
    const effectiveDaysTotal = Number(daysTotal || dailyTenureDays || 100);

    if (isDaily) {
      totalPayable = numAmount + Math.round((numAmount * numRate) / 100);
      dailyInstallment = Math.round(totalPayable / effectiveDaysTotal);
      monthlyEmi = dailyInstallment * 30;
    } else {
      const calc = calculateEmi(numAmount, numRate, Number(tenureMonths) || 12);
      monthlyEmi = calc.monthlyEmi;
      totalPayable = monthlyEmi * (Number(tenureMonths) || 12);
    }

    // Auto-resolve Agent information from Customer if not explicitly provided
    let resolvedAgentId = agentId || '';
    let resolvedAgentName = agentName || '';
    let resolvedReferralCode = agentReferralCode || '';

    if (!resolvedAgentId && customerId) {
      const linkedCustomer = await Customer.findOne({
        $or: [{ customerId }, { accountNumber: customerId }],
      }).lean();

      if (linkedCustomer) {
        resolvedAgentId = linkedCustomer.agentId || '';
        resolvedReferralCode = linkedCustomer.referralCode || '';

        if (resolvedAgentId) {
          const linkedAgent = await Agent.findOne({
            $or: [{ agentId: resolvedAgentId }, { referralCode: resolvedReferralCode }],
          }).lean();
          if (linkedAgent) {
            resolvedAgentName = linkedAgent.name;
          }
        }
      }
    }

    const loanId = body.loanId || `LN${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newLoanData = {
      ...body,
      loanId,
      customerName: customerName || 'Valued Member',
      customerId: customerId || `CUS${Math.floor(100 + Math.random() * 900)}`,
      agentId: resolvedAgentId,
      agentName: resolvedAgentName,
      agentReferralCode: resolvedReferralCode,
      loanType: isDaily ? 'Daily Loan' : loanType || 'Personal Loan',
      amount: numAmount,
      interestRate: numRate,
      tenureMonths: isDaily ? Math.ceil(effectiveDaysTotal / 30) : Number(tenureMonths) || 12,
      monthlyEmi,
      appliedDate: body.appliedDate || todayStr,
      disbursedDate: todayStr,
      status,
      step,
      paidEmis: 0,
      totalEmis: isDaily ? 0 : Number(tenureMonths) || 12,
      isDailyLoan: isDaily,
      dailyInstallment,
      daysTotal: effectiveDaysTotal,
      dailyTenureDays: effectiveDaysTotal,
      daysPaid: 0,
      carryForwardDue: 0,
      missedDays: 0,
      totalPayable,
      totalCollected: 0,
    };

    const created = await LoanApplicationModel.create(newLoanData);

    return NextResponse.json({
      success: true,
      message: isDaily
        ? `Daily Loan of ₹${numAmount} successfully issued! Daily installment set to ₹${dailyInstallment}/day.`
        : 'Loan application created successfully!',
      data: created,
    });
  } catch (err: any) {
    console.error('Error creating loan:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
