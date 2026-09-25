import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Customer } from '@/models';
import { INITIAL_CUSTOMERS } from '@/data/mockData';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide Email/Mobile and Password' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim().toLowerCase();

    // Check in MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const found = await Customer.findOne({
          $or: [
            { email: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
            { mobile: cleanInput.replace(/\D/g, '') },
            { customerId: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
            { accountNumber: { $regex: new RegExp(`^${cleanInput}$`, 'i') } },
          ],
        }).lean();

        if (found) {
          if (found.password && found.password !== password) {
            return NextResponse.json(
              { success: false, message: 'Invalid customer password' },
              { status: 401 }
            );
          }
          return NextResponse.json({
            success: true,
            data: {
              customer: found,
              token: `jwt_cust_${found._id || found.customerId}`,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB query fallback to mock data:', dbErr);
    }

    // Check in Mock Data
    const mockFound = INITIAL_CUSTOMERS.find(
      (c) =>
        c.email.toLowerCase() === cleanInput ||
        c.mobile === cleanInput.replace(/\D/g, '') ||
        c.customerId.toLowerCase() === cleanInput ||
        c.accountNumber?.toLowerCase() === cleanInput
    );

    if (mockFound) {
      if (mockFound.password && mockFound.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Invalid customer password' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          customer: mockFound,
          token: `jwt_cust_${mockFound.id}`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Customer account not found' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Login error' },
      { status: 500 }
    );
  }
}
