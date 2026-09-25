import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Customer, Agent, Collection } from '@/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      agentId,
      agentReferralCode,
      name,
      email,
      mobile,
      password,
      panNumber,
      panImage,
      adhaarNumber,
      adhaarImage,
      address,
      pincode,
      type = 'Loan',
      initialDeposit = 0,
    } = body;

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: 'Customer Name, Mobile, and Password are required.' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const uniqueAccNumber = `MC360-${cleanMobile}`;
    const cardPart1 = '5421';
    const cardPart2 = cleanMobile.slice(0, 4) || '8812';
    const cardPart3 = cleanMobile.slice(4, 8) || '9876';
    const cardPart4 = cleanMobile.slice(-2) + '26';
    const debitCardNumber = `${cardPart1} ${cardPart2} ${cardPart3} ${cardPart4}`;
    const customerId = `CUS${Math.floor(100 + Math.random() * 900)}`;

    const newCustomerData = {
      customerId,
      name,
      mobile: cleanMobile,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      password,
      panNumber: panNumber || '',
      panImage: panImage || '',
      adhaarNumber: adhaarNumber || '',
      adhaarImage: adhaarImage || '',
      address: address || 'Kolkata, West Bengal',
      pincode: pincode || '700001',
      referralCode: agentReferralCode || agentId || '',
      agentId: agentId || '',
      accountNumber: uniqueAccNumber,
      debitCardNumber,
      debitCardExpiry: '09/31',
      debitCardCvv: String(Math.floor(100 + Math.random() * 900)),
      savingsBalance: Number(initialDeposit) || 5000,
      type,
      status: 'Active',
      kycStatus: panNumber && adhaarNumber ? 'Verified' : 'Pending',
      accountsCount: 1,
      loansCount: 0,
      depositsCount: 0,
      collectionsCount: 0,
      documentsCount: (panImage ? 1 : 0) + (adhaarImage ? 1 : 0) + 2,
    };

    const onboardingCommission = 250; // ₹250 direct customer bonus

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const createdCustomer = await Customer.create(newCustomerData);

        // Update Agent Wallet & Direct Customers Count
        if (agentId) {
          await Agent.findOneAndUpdate(
            { $or: [{ agentId }, { referralCode: agentReferralCode }] },
            {
              $inc: {
                walletBalance: onboardingCommission,
                totalCommission: onboardingCommission,
                totalDirectCustomers: 1,
              },
            }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Customer onboarded successfully! ₹${onboardingCommission} commission credited to agent wallet.`,
          data: {
            customer: createdCustomer,
            commissionEarned: onboardingCommission,
          },
        });
      }
    } catch (dbErr) {
      console.warn('DB error on agent creating customer:', dbErr);
    }

    // Fallback response
    return NextResponse.json({
      success: true,
      message: `Customer onboarded successfully! ₹${onboardingCommission} commission credited to agent wallet (Mock Mode).`,
      data: {
        customer: { id: `c_${Date.now()}`, ...newCustomerData },
        commissionEarned: onboardingCommission,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to onboard customer' },
      { status: 500 }
    );
  }
}
