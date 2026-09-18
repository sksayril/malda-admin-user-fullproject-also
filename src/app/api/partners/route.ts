import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Partner } from '@/models';
import { INITIAL_PARTNERS } from '@/data/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const partners = await Partner.find().lean();
      if (partners.length > 0) {
        return NextResponse.json({ success: true, data: partners });
      }
    }
  } catch (err) {
    console.error('Error reading partners from DB:', err);
  }
  return NextResponse.json({ success: true, data: INITIAL_PARTNERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Partner.create(body);
    return NextResponse.json({
      success: true,
      message: 'Partner registered in MongoDB',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
