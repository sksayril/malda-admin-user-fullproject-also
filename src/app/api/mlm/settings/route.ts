import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { MlmLevelConfig, Agent, MlmCommissionLog } from '@/models';
import { ensureMlmLevelConfigs } from '@/lib/mlmService';

// GET: Fetch all MLM Level Configurations and live statistics
export async function GET() {
  try {
    await connectToDatabase();
    await ensureMlmLevelConfigs();

    const configs = await MlmLevelConfig.find().sort({ level: 1 }).lean();
    const agents = await Agent.find().lean();
    const logs = await MlmCommissionLog.find().lean();

    // Aggregate members count and commission paid per level
    const levelStats = configs.map((cfg) => {
      // Find how many agents exist at this depth in uplines
      let membersCount = 0;
      agents.forEach((agt) => {
        if (agt.upline && agt.upline.length >= cfg.level) {
          membersCount++;
        }
      });

      // Sum commissions logged for this level
      const totalCommission = logs
        .filter((l) => l.level === cfg.level && l.status === 'Credited')
        .reduce((sum, l) => sum + (Number(l.commissionAmount) || 0), 0);

      const pendingCommission = logs
        .filter((l) => l.level === cfg.level && l.status === 'Pending')
        .reduce((sum, l) => sum + (Number(l.commissionAmount) || 0), 0);

      return {
        ...cfg,
        membersCount,
        totalCommission,
        pendingCommission,
      };
    });

    const totalSystemCommission = logs
      .filter((l) => l.status === 'Credited')
      .reduce((sum, l) => sum + (Number(l.commissionAmount) || 0), 0);

    const totalPendingCommission = logs
      .filter((l) => l.status === 'Pending')
      .reduce((sum, l) => sum + (Number(l.commissionAmount) || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        levels: levelStats,
        summary: {
          totalLevels: configs.length,
          totalSystemCommission,
          totalPendingCommission,
          totalAgents: agents.length,
        },
      },
    });
  } catch (err: any) {
    console.error('Error fetching MLM settings:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching MLM settings' },
      { status: 500 }
    );
  }
}

// POST/PUT: Admin updates Level Configurations (Criteria, Percentages, Bonuses, Status)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { levels } = body;

    if (!Array.isArray(levels)) {
      return NextResponse.json(
        { success: false, message: 'Expected an array of level configs' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatePromises = levels.map(async (lvl) => {
      const {
        level,
        name,
        commissionPercent,
        fixedBonus,
        minDirectReferrals,
        minBusinessVolume,
        status,
        description,
      } = lvl;

      return MlmLevelConfig.findOneAndUpdate(
        { level: Number(level) },
        {
          $set: {
            name,
            commissionPercent: Number(commissionPercent) || 0,
            fixedBonus: Number(fixedBonus) || 0,
            minDirectReferrals: Number(minDirectReferrals) || 0,
            minBusinessVolume: Number(minBusinessVolume) || 0,
            status: status || 'Active',
            description: description || '',
          },
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updatePromises);

    const updatedConfigs = await MlmLevelConfig.find().sort({ level: 1 }).lean();

    return NextResponse.json({
      success: true,
      message: 'MLM Level criteria and commission rates updated successfully!',
      data: updatedConfigs,
    });
  } catch (err: any) {
    console.error('Error saving MLM settings:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error updating MLM settings' },
      { status: 500 }
    );
  }
}
