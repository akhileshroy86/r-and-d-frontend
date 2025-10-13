import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking credentials for:', email);

    // Check credentials directly from Prisma database
    const staff = await prisma.staff.findUnique({
      where: {
        email: email
      }
    });

    console.log('📊 Database query result:', staff ? 'Found staff' : 'No staff found');
    if (staff) {
      console.log('👤 Staff details:', {
        id: staff.id,
        email: staff.email,
        fullName: staff.fullName,
        isActive: staff.isActive,
        storedPassword: staff.password
      });
    }

    if (!staff) {
      console.log('❌ Staff not found in database for email:', email);
      
      // Let's also check what's actually in the database
      const allStaff = await prisma.staff.findMany();
      console.log('📋 All staff in database:', allStaff.map(s => ({ email: s.email, password: s.password })));
      
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if staff is active
    if (!staff.isActive) {
      console.log('❌ Staff account is inactive for:', email);
      return NextResponse.json(
        { success: false, message: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password (in production, use bcrypt for hashed passwords)
    console.log('🔐 Password comparison:', {
      provided: password,
      stored: staff.password,
      match: staff.password === password
    });
    
    if (staff.password !== password) {
      console.log('❌ Invalid password for:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ Login successful for:', email, '| Staff ID:', staff.id);
    
    // Generate simple token (use JWT in production)
    const token = Buffer.from(`${staff.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: staff.id,
          name: staff.fullName,
          email: staff.email,
          role: staff.role,
          position: staff.position
        }
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}