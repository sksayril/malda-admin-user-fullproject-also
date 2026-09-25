import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { GatewaySettingsModel } from '@/models';
import { INITIAL_GATEWAY_SETTINGS } from '@/data/mockData';

export async function GET() {
  try {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const settings = await GatewaySettingsModel.findOne({ configKey: 'GLOBAL_SETTINGS' }).lean();
        if (settings) {
          return NextResponse.json({ success: true, data: settings });
        }
      }
    } catch (err) {
      console.warn('DB gateway settings lookup error, falling back to mock:', err);
    }

    return NextResponse.json({ success: true, data: INITIAL_GATEWAY_SETTINGS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching gateway settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpayKeyId,
      razorpayKeySecret,
      razorpayWebhookSecret,
      isLiveMode = false,
      gatewayEnabled = true,
      currency = 'INR',
      onboardingCommission = 250,
    } = body;

    const payload = {
      configKey: 'GLOBAL_SETTINGS',
      razorpayKeyId: razorpayKeyId || 'rzp_test_1DP5mmOlF5G5ag',
      razorpayKeySecret: razorpayKeySecret || 'sK_test_9019283921831',
      razorpayWebhookSecret: razorpayWebhookSecret || 'whsec_928391823',
      isLiveMode: Boolean(isLiveMode),
      gatewayEnabled: Boolean(gatewayEnabled),
      currency: currency || 'INR',
      onboardingCommission: Number(onboardingCommission) || 250,
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const updated = await GatewaySettingsModel.findOneAndUpdate(
          { configKey: 'GLOBAL_SETTINGS' },
          { $set: payload },
          { upsert: true, new: true }
        );
        return NextResponse.json({
          success: true,
          message: 'Razorpay payment gateway & commission settings saved!',
          data: updated,
        });
      }
    } catch (err) {
      console.warn('DB error saving gateway settings:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Razorpay payment gateway & commission settings saved (Mock Mode)!',
      data: payload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error updating gateway settings' },
      { status: 500 }
    );
  }
}
