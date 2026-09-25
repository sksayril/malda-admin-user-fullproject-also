import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Customer } from '@/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
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
      referralCode,
      type = 'Loan',
      savingsBalance = 5000,
    } = body;

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, Mobile and Password are required.' },
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
      address: address || 'West Bengal, India',
      pincode: pincode || '700001',
      referralCode: referralCode || '',
      accountNumber: uniqueAccNumber,
      debitCardNumber,
      debitCardExpiry: '09/31',
      debitCardCvv: String(Math.floor(100 + Math.random() * 900)),
      savingsBalance: Number(savingsBalance) || 5000,
      type,
      status: 'Active',
      kycStatus: panNumber && adhaarNumber ? 'Verified' : 'Pending',
      accountsCount: 1,
      loansCount: 0,
      depositsCount: 0,
      collectionsCount: 0,
      documentsCount: (panImage ? 1 : 0) + (adhaarImage ? 1 : 0) + 2,
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const created = await Customer.create(newCustomerData);
        return NextResponse.json({
          success: true,
          message: 'Customer signup successful!',
          data: {
            customer: created,
            token: `token_cust_${Date.now()}`,
          },
        });
      }
    } catch (dbErr) {
      console.warn('MongoDB not reachable, using fallback session:', dbErr);
    }

    // Fallback response if DB offline
    return NextResponse.json({
      success: true,
      message: 'Customer signup successful (Mock Mode)',
      data: {
        customer: { id: `c_${Date.now()}`, ...newCustomerData },
        token: `token_cust_${Date.now()}`,
      },
    });
  } catch (err: any) {
    console.error('Customer signup error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Customer registration failed' },
      { status: 500 }
    );
  }
}
