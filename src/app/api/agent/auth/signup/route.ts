import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, email, password, branch = 'Kolkata HQ', address } = body;

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, Mobile and Password are required.' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const agentNum = Math.floor(100 + Math.random() * 900);
    const agentId = `AGT${agentNum}`;
    const referralCode = `AGT-${cleanMobile.slice(-4) || '3600'}`;

    const newAgentData = {
      agentId,
      name,
      mobile: cleanMobile,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}.agent@multicredit.com`,
      password,
      branch,
      status: 'Active',
      referralCode,
      walletBalance: 2500, // Welcome signup bonus
      totalCommission: 2500,
      totalDirectCustomers: 0,
      online: true,
      lastActive: 'Just now',
      location: {
        lat: 22.5726,
        lng: 88.3639,
        address: address || 'Kolkata, West Bengal',
      },
      totalCollection: '₹ 0',
      transactions: 0,
      target: '₹ 2,00,000',
      achievementRate: 0,
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const created = await Agent.create(newAgentData);
        return NextResponse.json({
          success: true,
          message: 'Agent registered successfully!',
          data: {
            agent: created,
            token: `token_agt_${Date.now()}`,
          },
        });
      }
    } catch (dbErr) {
      console.warn('DB error on agent signup:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Agent registered successfully (Mock Mode)',
      data: {
        agent: { id: `agt_${Date.now()}`, ...newAgentData },
        token: `token_agt_${Date.now()}`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Agent registration failed' },
      { status: 500 }
    );
  }
}
