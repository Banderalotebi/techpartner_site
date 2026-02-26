#!/usr/bin/env node

// Test the authentication system by creating users via API
console.log('🧪 Testing authentication system...\n');

async function testAuth() {
  const BASE_URL = 'http://localhost:3000';
  
  // Test users to register
  const testUsers = [
    {
      username: 'testuser',
      email: 'test@techpartner.sa',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    },
    {
      username: 'admin',
      email: 'admin@techpartner.sa', 
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User'
    },
    {
      username: 'demo',
      email: 'demo@techpartner.sa',
      password: 'demo1234', 
      firstName: 'Demo',
      lastName: 'User'
    }
  ];

  console.log('📝 Attempting to register test users...\n');

  for (const user of testUsers) {
    try {
      console.log(`🔄 Registering ${user.email}...`);
      
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Registered ${user.email} successfully`);
      } else {
        const error = await response.text();
        if (error.includes('already exists') || error.includes('duplicate')) {
          console.log(`⚠️  User ${user.email} already exists`);
        } else {
          console.log(`❌ Failed to register ${user.email}: ${error}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error registering ${user.email}: ${error.message}`);
    }
  }

  console.log('\n🔑 Testing login with test credentials...\n');

  // Test login with first user
  const loginUser = testUsers[0];
  try {
    console.log(`🔄 Logging in with ${loginUser.email}...`);
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginUser.email,
        password: loginUser.password
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log(`👤 User: ${data.user.firstName} ${data.user.lastName}`);
      console.log(`🎟️  Token received: ${data.token.substring(0, 20)}...`);
    } else {
      const error = await response.text();
      console.log(`❌ Login failed: ${error}`);
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}`);
  }

  console.log('\n📋 Available test credentials:');
  console.log('• test@techpartner.sa / password123');
  console.log('• admin@techpartner.sa / admin123'); 
  console.log('• demo@techpartner.sa / demo1234');
  console.log('\n🎯 Now try logging in through the web interface!');
}

// Check if server is running first
async function checkServerHealth() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start it with: npm run dev\n');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServerHealth();
  if (serverRunning) {
    await testAuth();
  }
}

main().catch(console.error);
