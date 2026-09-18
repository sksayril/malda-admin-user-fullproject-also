import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user exists in MongoDB
    let user = await User.findOne({ email: normalizedEmail });

    // If default Super Admin doesn't exist yet in MongoDB, create it automatically!
    if (!user && (normalizedEmail === 'superadmin@multicredit.com' || normalizedEmail === 'admin@multicredit.com')) {
      user = await User.create({
        name: 'Super Admin',
        email: normalizedEmail,
        password: hashedPassword,
        role: 'Super Admin',
        mobile: '+91 98765 43210',
        status: 'Active',
        tenantId: 'TNT001',
        lastLogin: 'Just now',
      });
    }

    // If branch manager demo doesn't exist
    if (!user && normalizedEmail.includes('branch1@multicredit.com')) {
      user = await User.create({
        name: 'R. Roy (Branch Manager)',
        email: normalizedEmail,
        password: hashedPassword,
        role: 'Branch Manager',
        mobile: '+91 98765 43211',
        status: 'Active',
        tenantId: 'TNT001',
        lastLogin: 'Just now',
      });
    }

    // Verify user & password if user exists
    if (user) {
      // Allow if password matches hash OR if it's demo password 'admin123' OR superadmin demo override
      const isPasswordValid =
        user.password === hashedPassword ||
        user.password === password ||
        password === 'admin123' ||
        normalizedEmail === 'superadmin@multicredit.com' ||
        normalizedEmail === 'admin@multicredit.com';

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid password provided for this account',
            code: 'INVALID_CREDENTIALS',
            data: null,
          },
          { status: 401 }
        );
      }

      // Update last login
      await User.updateOne({ _id: user._id }, { lastLogin: new Date().toLocaleTimeString() });

      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        data: {
          user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
            tenantId: user.tenantId,
          },
          token: `jwt_${user._id}_${Date.now()}`,
        },
      });
    }

    // Fallback if not found in database and not a known demo
    return NextResponse.json(
      {
        success: false,
        message: 'No account found with this email. Please check your credentials or sign up.',
        code: 'USER_NOT_FOUND',
        data: null,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Authentication error',
        code: 'AUTH_FAILED',
        data: null,
      },
      { status: 500 }
    );
  }
}
