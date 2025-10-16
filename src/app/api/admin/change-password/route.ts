import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/database';

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    // Get token from authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Decode token to get user info (in production, use proper JWT verification)
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = decoded.split(':')[0];

    // Get user from database
    const user = await DatabaseService.findUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await DatabaseService.verifyPassword(user.password, currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password in database
    const success = await DatabaseService.updateUserPassword(userId, newPassword);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}