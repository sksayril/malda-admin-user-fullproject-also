import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';
import { getAgentDownlineTree } from '@/lib/mlmService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    await connectToDatabase();

    if (agentId) {
      const tree = await getAgentDownlineTree(agentId);
      if (!tree) {
        return NextResponse.json(
          { success: false, message: 'Agent not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: tree });
    }

    // If no agentId is specified, return all agents with their direct team counts and sponsor tree
    const allAgents = await Agent.find().lean();
    return NextResponse.json({ success: true, data: allAgents });
  } catch (err: any) {
    console.error('Error fetching MLM tree:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching MLM tree' },
      { status: 500 }
    );
  }
}
