import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';
import { INITIAL_AGENTS } from '@/data/mockData';

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

    // Check in MongoDB
    try {
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
    } catch (dbErr) {
      console.warn('MongoDB query fallback for agent:', dbErr);
    }

    // Check Mock Data
    const mockFound = INITIAL_AGENTS.find(
      (a) =>
        a.email?.toLowerCase() === cleanInput ||
        a.mobile === cleanInput.replace(/\D/g, '') ||
        a.agentId.toLowerCase() === cleanInput ||
        a.referralCode?.toLowerCase() === cleanInput
    );

    if (mockFound) {
      if (mockFound.password && mockFound.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Invalid agent password' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          agent: mockFound,
          token: `jwt_agt_${mockFound.id}`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Agent account not found' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Agent login error' },
      { status: 500 }
    );
  }
}
