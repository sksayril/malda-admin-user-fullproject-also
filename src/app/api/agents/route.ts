import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';
import { distributeUnilevelCommission, ensureMlmLevelConfigs } from '@/lib/mlmService';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const agents = await Agent.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: agents });
    }
  } catch (err) {
    console.error('Error reading agents from DB:', err);
  }
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    await ensureMlmLevelConfigs();

    let linkedSponsorAgentId = body.sponsorAgentId || '';
    let linkedSponsorReferralCode = body.sponsorReferralCode || '';
    let uplineList: string[] = body.upline || [];

    const searchCode = (body.sponsorReferralCode || body.sponsorAgentId || '').trim();
    if (searchCode && uplineList.length === 0) {
      const sponsor = await Agent.findOne({
        $or: [
          { referralCode: searchCode },
          { agentId: searchCode },
          { mobile: searchCode },
        ],
      });

      if (sponsor) {
        linkedSponsorAgentId = sponsor.agentId;
        linkedSponsorReferralCode = sponsor.referralCode;
        uplineList = [sponsor.agentId, ...(sponsor.upline || [])];

        sponsor.directAgentsCount = (sponsor.directAgentsCount || 0) + 1;
        sponsor.totalTeamCount = (sponsor.totalTeamCount || 0) + 1;
        await sponsor.save();

        if (sponsor.upline && sponsor.upline.length > 0) {
          await Agent.updateMany(
            { agentId: { $in: sponsor.upline } },
            { $inc: { totalTeamCount: 1 } }
          );
        }
      }
    }

    const agentPayload = {
      ...body,
      sponsorAgentId: linkedSponsorAgentId,
      sponsorReferralCode: linkedSponsorReferralCode,
      upline: uplineList,
    };

    const created = await Agent.create(agentPayload);

    if (linkedSponsorAgentId) {
      distributeUnilevelCommission({
        fromAgentId: created.agentId,
        fromAgentName: created.name,
        eventType: 'AGENT_JOIN',
        sourceAmount: 0,
        notes: `Agent ${created.name} (${created.agentId}) added by Admin with sponsor ${linkedSponsorReferralCode}`,
        maxLevels: 14,
      }).catch((e) => console.warn('MLM distribution error:', e));
    }

    return NextResponse.json({ success: true, message: 'Agent created in MongoDB', data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
