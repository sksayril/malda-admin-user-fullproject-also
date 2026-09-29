import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { MlmCommissionLog } from '@/models';

// GET: Fetch commission transaction logs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const level = searchParams.get('level');
    const eventType = searchParams.get('eventType');

    await connectToDatabase();

    const query: any = {};
    if (agentId) {
      query.$or = [{ toAgentId: agentId }, { fromAgentId: agentId }];
    }
    if (level) {
      query.level = Number(level);
    }
    if (eventType) {
      query.eventType = eventType;
    }

    const logs = await MlmCommissionLog.find(query).sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (err: any) {
    console.error('Error fetching commission logs:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching commission logs' },
      { status: 500 }
    );
  }
}
