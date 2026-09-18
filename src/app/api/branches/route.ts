import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Branch } from '@/models';
import { INITIAL_BRANCHES } from '@/data/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const branches = await Branch.find().lean();
      if (branches.length > 0) {
        return NextResponse.json({ success: true, data: branches });
      }
    }
  } catch (err) {
    console.error('Error reading branches from DB:', err);
  }
  return NextResponse.json({ success: true, data: INITIAL_BRANCHES });
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
