import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Decode token to get user info
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = decoded.split(':')[0];

    // Mock staff profile data
    const staffProfile = {
      id: userId,
      name: userId === 'demo1' ? 'John Smith' : 'Sarah Johnson',
      email: userId === 'demo1' ? 'john.smith@gmail.com' : 'sarah.johnson@gmail.com',
      phone: userId === 'demo1' ? '+91 9876543210' : '+91 9876543211',
      role: 'staff'
    };

    return NextResponse.json({
      success: true,
      data: staffProfile
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}