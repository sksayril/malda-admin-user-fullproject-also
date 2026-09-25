import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import {
  Society,
  Branch,
  Agent,
  Customer,
  LoanApplicationModel,
  Deposit,
  Collection,
  Partner,
} from '@/models';
import {
  INITIAL_SOCIETY,
} from '@/data/mockData';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Could not connect to MongoDB', data: null },
        { status: 500 }
      );
    }

    // Ensure Master Society settings exist
    const societyCount = await Society.countDocuments();
    if (societyCount === 0) {
      await Society.create(INITIAL_SOCIETY);
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB initialized ready for real user records',
      data: {
        branches: await Branch.countDocuments(),
        agents: await Agent.countDocuments(),
        customers: await Customer.countDocuments(),
        loans: await LoanApplicationModel.countDocuments(),
        deposits: await Deposit.countDocuments(),
        collections: await Collection.countDocuments(),
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Seeding failed', data: null },
      { status: 500 }
    );
  }
}
