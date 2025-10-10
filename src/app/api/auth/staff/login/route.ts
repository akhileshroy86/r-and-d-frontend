import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials from localStorage (simulating database)
    // In production, replace with actual database query
    let staffCredentials = [];
    try {
      // Try to get from request headers (for server-side simulation)
      const credentialsHeader = request.headers.get('x-staff-credentials');
      if (credentialsHeader) {
        staffCredentials = JSON.parse(credentialsHeader);
      }
    } catch (error) {
      // Fallback to default demo data
      staffCredentials = [
        { id: 'demo1', email: 'john.smith@gmail.com', password: 'john', name: 'John Smith' },
        { id: 'demo2', email: 'sarah.johnson@gmail.com', password: 'sarah', name: 'Sarah Johnson' }
      ];
    }

    const staff = staffCredentials.find((s: any) => s.email === email && s.password === password);

    if (!staff) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate simple token (use JWT in production)
    const token = Buffer.from(`${staff.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: 'staff'
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}