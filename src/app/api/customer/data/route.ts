import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Customer, LoanApplicationModel, Deposit, Collection } from '@/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId') || searchParams.get('mobile') || searchParams.get('email');

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'CustomerId/Mobile/Email is required' },
        { status: 400 }
      );
    }

    let customer: any = null;
    let loans: any[] = [];
    let deposits: any[] = [];
    let collections: any[] = [];

    const conn = await connectToDatabase();
    if (conn) {
      customer = await Customer.findOne({
        $or: [
          { customerId },
          { mobile: customerId },
          { email: customerId },
          { accountNumber: customerId },
        ],
      }).lean();

      if (customer) {
        loans = await LoanApplicationModel.find({
          $or: [{ customerId: customer.customerId }, { customerName: customer.name }],
        }).sort({ createdAt: -1 }).lean();

        deposits = await Deposit.find({
          $or: [{ customerId: customer.customerId }, { customerName: customer.name }],
        }).sort({ createdAt: -1 }).lean();

        collections = await Collection.find({
          $or: [{ customerId: customer.customerId }, { customerName: customer.name }],
        }).sort({ createdAt: -1 }).lean();
      }
    }

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer record not found in database', data: null },
        { status: 404 }
      );
    }

    // Standard Late Payment Fee Structure Matrix
    const latePaymentChart = [
      {
        slab: '1 - 3 Days',
        title: 'Grace Period',
        fee: '₹0 (Free)',
        interest: '0.0%',
        impact: 'No Penalty, Credit Score Unaffected',
        status: 'Safe',
      },
      {
        slab: '4 - 10 Days',
        title: 'Minor Overdue',
        fee: '₹150 Flat',
        interest: '1.5% p.m.',
        impact: 'SMS Reminder & Grace Window Closes',
        status: 'Warning',
      },
      {
        slab: '11 - 30 Days',
        title: 'Moderate Default',
        fee: '₹350 + 2.0%',
        interest: '2.0% p.m.',
        impact: 'Credit Score Alert (-20 Pts), Agent Call',
        status: 'Critical',
      },
      {
        slab: '31+ Days',
        title: 'Severe Default / NPA',
        fee: '₹750 + 5.0%',
        interest: '3.5% p.m.',
        impact: 'Legal Notice, Score Impact (-65 Pts)',
        status: 'Severe',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        customer,
        loans,
        deposits,
        collections,
        latePaymentChart,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching customer data' },
      { status: 500 }
    );
  }
}
