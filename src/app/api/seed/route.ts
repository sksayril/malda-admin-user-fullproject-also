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
  INITIAL_BRANCHES,
  INITIAL_AGENTS,
  INITIAL_CUSTOMERS,
  INITIAL_LOANS,
  INITIAL_DEPOSITS,
  INITIAL_COLLECTIONS,
  INITIAL_PARTNERS,
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

    // Seed Society
    const societyCount = await Society.countDocuments();
    if (societyCount === 0) {
      await Society.create(INITIAL_SOCIETY);
    }

    // Seed Branches
    const branchCount = await Branch.countDocuments();
    if (branchCount === 0) {
      await Branch.insertMany(INITIAL_BRANCHES);
    }

    // Seed Agents
    const agentCount = await Agent.countDocuments();
    if (agentCount === 0) {
      await Agent.insertMany(INITIAL_AGENTS);
    }

    // Seed Customers
    const custCount = await Customer.countDocuments();
    if (custCount === 0) {
      await Customer.insertMany(INITIAL_CUSTOMERS);
    }

    // Seed Loans
    const loanCount = await LoanApplicationModel.countDocuments();
    if (loanCount === 0) {
      await LoanApplicationModel.insertMany(INITIAL_LOANS);
    }

    // Seed Deposits
    const depCount = await Deposit.countDocuments();
    if (depCount === 0) {
      await Deposit.insertMany(INITIAL_DEPOSITS);
    }

    // Seed Collections
    const colCount = await Collection.countDocuments();
    if (colCount === 0) {
      await Collection.insertMany(INITIAL_COLLECTIONS);
    }

    // Seed Partners
    const partnerCount = await Partner.countDocuments();
    if (partnerCount === 0) {
      await Partner.insertMany(INITIAL_PARTNERS);
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB collections successfully initialized with MultiCredit 360 seed data',
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
