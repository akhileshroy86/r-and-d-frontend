import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating staff with data:', body);
    
    // Check if backend is running
    try {
      const healthCheck = await fetch('http://localhost:3002/api/v1/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      console.log('Backend health check:', healthCheck.status);
    } catch (healthError) {
      console.error('Backend not responding:', healthError);
      return NextResponse.json({ 
        error: 'Backend server not running. Please start your backend server on localhost:3002' 
      }, { status: 503 });
    }
    
    // First create user account
    const userResponse = await fetch('http://localhost:3002/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        role: 'STAFF'
      })
    });

    console.log('User creation response status:', userResponse.status);
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('User creation failed:', errorText);
      console.error('User creation request body was:', JSON.stringify({
        email: body.email,
        password: body.password,
        role: 'STAFF'
      }));
      return NextResponse.json({ error: `User creation failed: ${errorText}` }, { status: 400 });
    }

    const userData = await userResponse.json();
    console.log('User created:', userData);

    // Then create staff profile
    const staffResponse = await fetch('http://localhost:3002/api/v1/staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userData.id,
        fullName: `${body.firstName} ${body.lastName}`,
        email: body.email,
        password: body.password,
        phone: body.phone,
        position: body.position
      })
    });

    console.log('Staff creation response status:', staffResponse.status);
    
    if (!staffResponse.ok) {
      const errorText = await staffResponse.text();
      console.error('Staff creation failed:', errorText);
      console.error('Staff creation request body was:', JSON.stringify({
        userId: userData.id,
        fullName: `${body.firstName} ${body.lastName}`,
        email: body.email,
        password: body.password,
        phone: body.phone,
        position: body.position
      }));
      return NextResponse.json({ error: `Staff creation failed: ${errorText}` }, { status: 400 });
    }

    const staffData = await staffResponse.json();
    console.log('Staff created:', staffData);
    
    return NextResponse.json({
      success: true,
      data: {
        ...staffData,
        email: body.email,
        fullName: `${body.firstName} ${body.lastName}`
      }
    });

  } catch (error: any) {
    console.error('Staff creation error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({ 
        error: 'Cannot connect to backend server. Please ensure your backend is running on localhost:3002' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:3002/api/v1/staff');
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Staff fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}