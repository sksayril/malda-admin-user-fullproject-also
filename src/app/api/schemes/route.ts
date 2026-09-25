import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ProductSchemeModel } from '@/models';
import { INITIAL_SCHEMES } from '@/data/mockData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // 'LOAN', 'FD', 'RD', 'MIS'
    const onlyActive = searchParams.get('active') === 'true';

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const query: any = {};
        if (category) query.category = category.toUpperCase();
        if (onlyActive) query.status = 'Active';

        const dbSchemes = await ProductSchemeModel.find(query).lean();
        if (dbSchemes.length > 0) {
          return NextResponse.json({ success: true, data: dbSchemes });
        }
      }
    } catch (err) {
      console.warn('DB error fetching schemes, falling back to mock:', err);
    }

    let result = INITIAL_SCHEMES;
    if (category) {
      result = result.filter((s) => s.category.toUpperCase() === category.toUpperCase());
    }
    if (onlyActive) {
      result = result.filter((s) => s.status === 'Active');
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error loading schemes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      code,
      category,
      name,
      interestRate,
      minAmount,
      maxAmount,
      tenureMonths,
      agentCommissionPercent = 2.0,
      isDailyLoan = false,
      dailyTenureDays = 100,
      status = 'Active',
      description,
      features = [],
    } = body;

    if (!code || !category || !name || interestRate === undefined) {
      return NextResponse.json(
        { success: false, message: 'Scheme code, category, name, and interest rate are required.' },
        { status: 400 }
      );
    }

    const schemeData = {
      code,
      category: category.toUpperCase(),
      name,
      interestRate: Number(interestRate),
      minAmount: Number(minAmount) || 1000,
      maxAmount: Number(maxAmount) || 1000000,
      tenureMonths: Number(tenureMonths) || 12,
      agentCommissionPercent: Number(agentCommissionPercent) || 2.0,
      isDailyLoan: Boolean(isDailyLoan),
      dailyTenureDays: Number(dailyTenureDays) || 100,
      status,
      description: description || '',
      features: Array.isArray(features) ? features : [],
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const saved = await ProductSchemeModel.findOneAndUpdate(
          { code },
          { $set: schemeData },
          { upsert: true, new: true }
        );
        return NextResponse.json({
          success: true,
          message: 'Scheme saved successfully!',
          data: saved,
        });
      }
    } catch (err) {
      console.warn('DB scheme update error:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Scheme saved successfully (Mock Mode)',
      data: { id: `sch_${Date.now()}`, ...schemeData },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error saving scheme' },
      { status: 500 }
    );
  }
}
