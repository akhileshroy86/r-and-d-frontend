import { NextRequest, NextResponse } from 'next/server';

// Persistent storage using file system
const fs = require('fs');
const path = require('path');
const dataFile = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.dirname(dataFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load existing users data
function loadUsersData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users data:', error);
  }
  return [];
}

// Save users data
function saveUsersData(users: any[]) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users data:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    if (!userData.email || !userData.password || !userData.fullName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create user object
    const newUser = {
      id: userId,
      fullName: userData.fullName,
      firstName: userData.firstName || userData.fullName.split(' ')[0],
      lastName: userData.lastName || userData.fullName.split(' ').slice(1).join(' '),
      email: userData.email,
      password: userData.password, // In production, hash this!
      phone: userData.phone,
      position: userData.position || 'Staff',
      role: userData.role || 'staff',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Load existing data and add new user
    const users = loadUsersData();
    users.push(newUser);
    
    // Save to persistent storage
    if (!saveUsersData(users)) {
      throw new Error('Failed to save user data');
    }
    
    console.log('✅ User created in database:', newUser);
    console.log('✅ Total users in database:', users.length);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = loadUsersData();
  return NextResponse.json({
    success: true,
    data: users,
    count: users.length
  });
}