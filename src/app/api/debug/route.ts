import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const usersResponse = await fetch(`${request.nextUrl.origin}/api/users`);
    const usersData = await usersResponse.json();
    
    // Get all staff
    const staffResponse = await fetch(`${request.nextUrl.origin}/api/staff`);
    const staffData = await staffResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Database debug info',
      data: {
        users: {
          count: usersData.count || 0,
          data: usersData.data || []
        },
        staff: {
          count: staffData.count || 0,
          data: staffData.data || []
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { success: false, message: 'Debug API error', error: error.message },
      { status: 500 }
    );
  }
}