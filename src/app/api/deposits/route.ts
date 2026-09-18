import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Deposit } from '@/models';
import { INITIAL_DEPOSITS } from '@/data/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const deps = await Deposit.find().lean();
      if (deps.length > 0) {
        return NextResponse.json({ success: true, data: deps });
      }
    }
  } catch (err) {
    console.error('Error reading deposits from DB:', err);
  }
  return NextResponse.json({ success: true, data: INITIAL_DEPOSITS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Deposit.create(body);
    return NextResponse.json({ success: true, message: 'Deposit created in MongoDB', data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
