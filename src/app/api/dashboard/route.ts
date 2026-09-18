import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Dashboard metrics retrieved successfully',
    data: {
      metrics: {
        totalCustomers: 12458,
        activeCustomers: 8970,
        totalAgents: 1250,
        branches: 26,
        loanApplications: 1245,
        approvedLoans: 990,
        disbursedLoans: 950,
        totalCollection: '₹ 12.5 Cr',
        outstanding: '₹ 5.8 Cr',
        fdTotal: '₹ 3.2 Cr',
        rdTotal: '₹ 1.8 Cr',
      },
      collectionChart: [
        { month: 'Jan', amount: 80 },
        { month: 'Feb', amount: 95 },
        { month: 'Mar', amount: 110 },
        { month: 'Apr', amount: 105 },
        { month: 'May', amount: 130 },
        { month: 'Jun', amount: 145 },
        { month: 'Jul', amount: 160 },
        { month: 'Aug', amount: 150 },
        { month: 'Sep', amount: 175 },
        { month: 'Oct', amount: 190 },
        { month: 'Nov', amount: 210 },
        { month: 'Dec', amount: 240 },
      ],
      customerDistribution: {
        loan: 45,
        fd: 25,
        rd: 20,
        mis: 10,
        activePercent: 70,
      },
    },
  });
}
