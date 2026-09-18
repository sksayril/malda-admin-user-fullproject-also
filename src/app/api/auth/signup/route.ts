import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, mobile, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, email and password are required',
          code: 'VALIDATION_ERROR',
          data: null,
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An administrator account with this email already exists',
          code: 'USER_EXISTS',
          data: null,
        },
        { status: 400 }
      );
    }

    // Hash password using SHA-256 with salt
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'Super Admin',
      mobile: mobile || '+91 98765 43210',
      status: 'Active',
      tenantId: 'TNT001',
      lastLogin: 'Just now',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Administrator account registered successfully',
        data: {
          user: {
            id: String(newUser._id),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            mobile: newUser.mobile,
            tenantId: newUser.tenantId,
          },
          token: `jwt_${newUser._id}_${Date.now()}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create user account',
        code: 'INTERNAL_ERROR',
        data: null,
      },
      { status: 500 }
    );
  }
}
