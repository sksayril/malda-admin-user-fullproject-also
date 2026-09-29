import { NextResponse } from 'next/server';
import { distributeUnilevelCommission } from '@/lib/mlmService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromAgentId, fromAgentName, eventType, sourceAmount, notes, maxLevels } = body;

    if (!fromAgentId) {
      return NextResponse.json(
        { success: false, message: 'fromAgentId is required' },
        { status: 400 }
      );
    }

    const result = await distributeUnilevelCommission({
      fromAgentId,
      fromAgentName: fromAgentName || 'Agent',
      eventType: eventType || 'AGENT_JOIN',
      sourceAmount: Number(sourceAmount) || 0,
      notes: notes || 'Unilevel Commission Trigger',
      maxLevels: maxLevels || 14,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error distributing MLM commission:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error executing distribution' },
      { status: 500 }
    );
  }
}
