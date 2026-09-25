import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { LoanApplicationModel } from '@/models';
import { calculateEmi } from '@/lib/financials';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const loans = await LoanApplicationModel.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: loans });
    }
  } catch (err) {
    console.error('Error reading loans from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, interestRate, tenureMonths } = body;
    const { monthlyEmi } = calculateEmi(amount || 50000, interestRate || 12, tenureMonths || 24);

    await connectToDatabase();
    const created = await LoanApplicationModel.create({
      ...body,
      monthlyEmi,
      status: body.status || 'Pending',
      step: body.step || 'Application',
    });

    return NextResponse.json({
      success: true,
      message: 'Loan application stored in MongoDB',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
