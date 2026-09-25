import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Collection } from '@/models';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const collections = await Collection.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: collections });
    }
  } catch (err) {
    console.error('Error reading collections from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const created = await Collection.create(body);
    return NextResponse.json({
      success: true,
      message: 'Collection receipt recorded in MongoDB',
      data: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
