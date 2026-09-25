import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Customer } from '@/models';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const customers = await Customer.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: customers });
    }
  } catch (err) {
    console.error('Error reading customers from MongoDB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Customer.create(body);
    return NextResponse.json({
      success: true,
      message: 'Customer saved in MongoDB',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
