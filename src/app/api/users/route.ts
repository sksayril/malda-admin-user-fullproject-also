import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import crypto from 'crypto';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const users = await User.find({}, '-password').lean();
      return NextResponse.json({ success: true, data: users });
    }
  } catch (err) {
    console.error('Error reading users from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const hashedPassword = crypto.createHash('sha256').update(body.password || 'admin123').digest('hex');

    const created = await User.create({
      ...body,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: 'Staff user created in MongoDB',
      data: {
        id: String(created._id),
        name: created.name,
        email: created.email,
        role: created.role,
        mobile: created.mobile,
        status: created.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
