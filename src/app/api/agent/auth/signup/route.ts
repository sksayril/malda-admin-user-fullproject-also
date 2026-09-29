import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Agent } from '@/models';
import { distributeUnilevelCommission, ensureMlmLevelConfigs } from '@/lib/mlmService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      mobile,
      email,
      password,
      branch = 'Kolkata HQ',
      address,
      sponsorReferralCode,
      sponsorAgentId,
    } = body;

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

    let linkedSponsorAgentId = '';
    let linkedSponsorReferralCode = '';
    let uplineList: string[] = [];

    await connectToDatabase();
    await ensureMlmLevelConfigs();

    // Check if sponsor referral code was provided
    const searchCode = (sponsorReferralCode || sponsorAgentId || '').trim();
    if (searchCode) {
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
        // Upline chain: [Level 1 sponsor, Level 2 sponsor's sponsor, ...]
        uplineList = [sponsor.agentId, ...(sponsor.upline || [])];

        // Increment direct agents count of sponsor
        sponsor.directAgentsCount = (sponsor.directAgentsCount || 0) + 1;
        sponsor.totalTeamCount = (sponsor.totalTeamCount || 0) + 1;
        await sponsor.save();

        // Increment totalTeamCount of all other uplines
        if (sponsor.upline && sponsor.upline.length > 0) {
          await Agent.updateMany(
            { agentId: { $in: sponsor.upline } },
            { $inc: { totalTeamCount: 1 } }
          );
        }
      }
    }

    const newAgentData = {
      agentId,
      name,
      mobile: cleanMobile,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}.agent@multicredit.com`,
      password,
      branch,
      status: 'Active',
      referralCode,
      sponsorAgentId: linkedSponsorAgentId,
      sponsorReferralCode: linkedSponsorReferralCode,
      upline: uplineList,
      level: 1,
      directAgentsCount: 0,
      totalTeamCount: 0,
      mlmCommissionEarned: 0,
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

    const created = await Agent.create(newAgentData);

    // Trigger MLM Unilevel Commission Distribution for new Agent Joining!
    if (linkedSponsorAgentId) {
      try {
        await distributeUnilevelCommission({
          fromAgentId: agentId,
          fromAgentName: name,
          eventType: 'AGENT_JOIN',
          sourceAmount: 0,
          notes: `Agent ${name} (${agentId}) joined via referral ${linkedSponsorReferralCode}`,
          maxLevels: 14,
        });
      } catch (distErr) {
        console.warn('MLM distribution warning on signup:', distErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Agent registered successfully with referral network linking!',
      data: {
        agent: created,
        sponsorLinked: !!linkedSponsorAgentId,
        sponsorId: linkedSponsorAgentId,
        token: `token_agt_${Date.now()}`,
      },
    });
  } catch (err: any) {
    console.error('Agent signup error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Agent registration failed' },
      { status: 500 }
    );
  }
}
