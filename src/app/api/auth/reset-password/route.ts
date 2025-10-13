import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await request.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Password reset attempt for:', email);

    // Find staff by email
    const staff = await prisma.staff.findUnique({
      where: { email: email }
    });

    if (!staff) {
      console.log('❌ Staff not found for email:', email);
      return NextResponse.json(
        { success: false, message: 'Staff not found' },
        { status: 404 }
      );
    }

    // Check if old password matches firstName (case insensitive)
    const expectedOldPassword = staff.firstName.toLowerCase();
    if (oldPassword.toLowerCase() !== expectedOldPassword) {
      console.log('❌ Old password mismatch. Expected:', expectedOldPassword, 'Got:', oldPassword.toLowerCase());
      return NextResponse.json(
        { success: false, message: 'Old password (first name) is incorrect' },
        { status: 401 }
      );
    }

    // Update password in database
    await prisma.staff.update({
      where: { email: email },
      data: { password: newPassword }
    });

    console.log('✅ Password updated successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}