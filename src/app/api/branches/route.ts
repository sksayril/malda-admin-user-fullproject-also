import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Branch } from '@/models';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const branches = await Branch.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: branches });
    }
  } catch (err) {
    console.error('Error reading branches from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Branch.create(body);
    return NextResponse.json({ success: true, message: 'Branch created in MongoDB', data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
