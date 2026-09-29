import { connectToDatabase } from '@/lib/db';
import { Agent, MlmLevelConfig, MlmCommissionLog } from '@/models';
import { DEFAULT_MLM_LEVEL_CONFIGS } from '@/data/mockData';

export interface DistributeCommissionParams {
  fromAgentId: string;
  fromAgentName: string;
  eventType: 'AGENT_JOIN' | 'CUSTOMER_ONBOARD' | 'COLLECTION' | 'DEPOSIT' | 'LOAN_EMI' | 'MANUAL_PAYOUT';
  sourceAmount?: number;
  notes?: string;
  maxLevels?: number;
}

/**
 * Ensures default 14 MLM levels exist in database
 */
export async function ensureMlmLevelConfigs() {
  await connectToDatabase();
  const count = await MlmLevelConfig.countDocuments();
  if (count === 0) {
    await MlmLevelConfig.insertMany(DEFAULT_MLM_LEVEL_CONFIGS);
  }
}

/**
 * Distributes unilevel commission across upline chain based on Admin configured criteria
 */
export async function distributeUnilevelCommission(params: DistributeCommissionParams) {
  try {
    await connectToDatabase();
    await ensureMlmLevelConfigs();

    const {
      fromAgentId,
      fromAgentName,
      eventType,
      sourceAmount = 0,
      notes = '',
      maxLevels = 14,
    } = params;

    const sourceAgent = await Agent.findOne({ agentId: fromAgentId }).lean();
    if (!sourceAgent) {
      console.warn(`[MLM] Source agent ${fromAgentId} not found`);
      return { success: false, message: 'Source agent not found', distributions: [] };
    }

    const uplineList: string[] = sourceAgent.upline || [];
    if (uplineList.length === 0 && sourceAgent.sponsorAgentId) {
      uplineList.push(sourceAgent.sponsorAgentId);
    }

    if (uplineList.length === 0) {
      return { success: true, message: 'No upline sponsors to distribute', distributions: [] };
    }

    // Fetch all active level configs
    const configs = await MlmLevelConfig.find({ status: 'Active' }).sort({ level: 1 }).lean();
    const configMap = new Map<number, any>();
    configs.forEach((c) => configMap.set(c.level, c));

    const distributions: any[] = [];
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const effectiveLevels = Math.min(uplineList.length, maxLevels);

    for (let i = 0; i < effectiveLevels; i++) {
      const levelNumber = i + 1;
      const uplineAgentId = uplineList[i];
      if (!uplineAgentId) continue;

      const levelConfig = configMap.get(levelNumber);
      if (!levelConfig) continue;

      // Find the upline agent
      const uplineAgent = await Agent.findOne({ agentId: uplineAgentId });
      if (!uplineAgent || uplineAgent.status !== 'Active') continue;

      // Check Qualification Criteria set by Admin
      const directCount = uplineAgent.directAgentsCount || 0;
      const minRequiredDirect = levelConfig.minDirectReferrals || 0;

      // Parse business volume if collection string has rupee
      const rawVol = uplineAgent.totalCollection ? String(uplineAgent.totalCollection).replace(/[^\d]/g, '') : '0';
      const agentVolume = Number(rawVol) || 0;
      const minRequiredVolume = levelConfig.minBusinessVolume || 0;

      const isQualified = directCount >= minRequiredDirect && agentVolume >= minRequiredVolume;

      // Calculate commission
      let commission = 0;
      if (sourceAmount > 0 && levelConfig.commissionPercent > 0) {
        commission += Math.round((sourceAmount * levelConfig.commissionPercent) / 100);
      }

      if (eventType === 'AGENT_JOIN' && levelConfig.fixedBonus > 0) {
        commission += Number(levelConfig.fixedBonus);
      }

      if (commission <= 0) continue;

      const status = isQualified ? 'Credited' : 'Pending';
      const logNotes = isQualified
        ? `${notes || 'Unilevel Commission'} (Qualified: ${directCount}/${minRequiredDirect} direct referrals)`
        : `Criteria not met (Requires ${minRequiredDirect} direct referrals, agent has ${directCount})`;

      // Create log
      const txId = `MLM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const logEntry = await MlmCommissionLog.create({
        transactionId: txId,
        fromAgentId,
        fromAgentName,
        toAgentId: uplineAgent.agentId,
        toAgentName: uplineAgent.name,
        level: levelNumber,
        eventType,
        sourceAmount,
        commissionPercent: levelConfig.commissionPercent || 0,
        commissionAmount: commission,
        status,
        notes: logNotes,
        date: dateStr,
      });

      // If qualified, credit to wallet
      if (isQualified) {
        const currentBalance = Number(uplineAgent.walletBalance) || 0;
        const currentTotal = Number(uplineAgent.totalCommission) || 0;
        const currentMlm = Number(uplineAgent.mlmCommissionEarned) || 0;

        uplineAgent.walletBalance = currentBalance + commission;
        uplineAgent.totalCommission = currentTotal + commission;
        uplineAgent.mlmCommissionEarned = currentMlm + commission;
        await uplineAgent.save();
      }

      distributions.push({
        level: levelNumber,
        uplineAgentId: uplineAgent.agentId,
        uplineAgentName: uplineAgent.name,
        commission,
        status,
        isQualified,
      });
    }

    return {
      success: true,
      message: `Distributed unilevel commission to ${distributions.length} upline levels`,
      distributions,
    };
  } catch (error: any) {
    console.error('[MLM Engine] Distribution Error:', error);
    return { success: false, message: error.message, distributions: [] };
  }
}

/**
 * Fetches downline tree up to 14 levels for an agent
 */
export async function getAgentDownlineTree(rootAgentId: string) {
  await connectToDatabase();
  await ensureMlmLevelConfigs();

  const rootAgent = await Agent.findOne({ agentId: rootAgentId }).lean();
  if (!rootAgent) return null;

  const allAgents = await Agent.find().lean();
  const configs = await MlmLevelConfig.find().sort({ level: 1 }).lean();

  const levelMap = new Map<number, any[]>();
  for (let i = 1; i <= 14; i++) {
    levelMap.set(i, []);
  }

  // Helper to find level by checking upline array
  allAgents.forEach((agt) => {
    if (agt.agentId === rootAgentId) return;
    const upline: string[] = agt.upline || [];
    const index = upline.indexOf(rootAgentId);
    if (index !== -1) {
      const level = index + 1;
      if (level <= 14) {
        levelMap.get(level)?.push(agt);
      }
    } else if (agt.sponsorAgentId === rootAgentId) {
      levelMap.get(1)?.push(agt);
    }
  });

  const levelBreakdown = configs.map((cfg) => {
    const members = levelMap.get(cfg.level) || [];
    const minRequiredDirect = cfg.minDirectReferrals || 0;
    const isUnlocked = (rootAgent.directAgentsCount || 0) >= minRequiredDirect;

    return {
      level: cfg.level,
      name: cfg.name,
      commissionPercent: cfg.commissionPercent,
      fixedBonus: cfg.fixedBonus,
      minDirectReferrals: cfg.minDirectReferrals,
      minBusinessVolume: cfg.minBusinessVolume,
      status: cfg.status,
      membersCount: members.length,
      members: members.map((m) => ({
        agentId: m.agentId,
        name: m.name,
        mobile: m.mobile,
        branch: m.branch,
        walletBalance: m.walletBalance,
        totalCollection: m.totalCollection,
        totalDirectCustomers: m.totalDirectCustomers,
        status: m.status,
        createdAt: m.createdAt,
      })),
      isUnlocked,
    };
  });

  const totalDownlineMembers = Array.from(levelMap.values()).reduce((sum, arr) => sum + arr.length, 0);

  return {
    agent: rootAgent,
    totalDownlineMembers,
    levelBreakdown,
  };
}
