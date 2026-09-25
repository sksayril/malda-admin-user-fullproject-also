import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide Email/Mobile/Agent ID and Password' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim().toLowerCase();

    // Check strictly in MongoDB
    const conn = await connectToDatabase();
    if (conn) {
      const found = await Agent.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
          { mobile: cleanInput.replace(/\D/g, '') },
          { agentId: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
          { referralCode: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
        ],
      }).lean();

      if (found) {
        if (found.password && found.password !== password) {
          return NextResponse.json(
            { success: false, message: 'Invalid agent password' },
            { status: 401 }
          );
        }
        return NextResponse.json({
          success: true,
          data: {
            agent: found,
            token: `jwt_agt_${found._id || found.agentId}`,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Agent account not found. Please verify your credentials or register.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Agent login error' },
      { status: 500 }
    );
  }
}
