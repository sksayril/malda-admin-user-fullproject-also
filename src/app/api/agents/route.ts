import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';
import { INITIAL_AGENTS } from '@/data/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const agents = await Agent.find().lean();
      if (agents.length > 0) {
        return NextResponse.json({ success: true, data: agents });
      }
    }
  } catch (err) {
    console.error('Error reading agents from DB:', err);
  }
  return NextResponse.json({ success: true, data: INITIAL_AGENTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Agent.create(body);
    return NextResponse.json({ success: true, message: 'Agent created in MongoDB', data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
