#!/usr/bin/env node

// Test user creation script
import bcrypt from 'bcryptjs';

const testUsers = [
  {
    email: 'test@techpartner.sa',
    password: 'password123',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User'
  },
  {
    email: 'admin@techpartner.sa', 
    password: 'admin123',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'demo@techpartner.sa',
    password: 'demo123', 
    username: 'demo',
    firstName: 'Demo',
    lastName: 'Customer'
  }
];

async function createTestUsers() {
  console.log('🧪 Test User Credentials for TechPartner Authentication System');
  console.log('='.repeat(60));
  
  for (const user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    console.log(`\n👤 ${user.firstName} ${user.lastName}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Password: ${user.password}`);
    console.log(`🆔 Username: ${user.username}`);
    console.log(`🔒 Hash: ${hashedPassword}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 Instructions:');
  console.log('1. Go to http://localhost:3000');
  console.log('2. Try to access any service (Logo Design, Web Design, etc.)');
  console.log('3. You will be prompted to login');
  console.log('4. Use any of the credentials above');
  console.log('5. Or register a new account with any email/password');
  console.log('\n🚀 Testing Authentication Flow:');
  console.log('• Click on any service → Auth modal should appear');
  console.log('• Login with test credentials → Should continue to service');
  console.log('• Complete order flow → User info should be recorded');
  console.log('• Check dashboard → Order history should be available');
}

createTestUsers().catch(console.error);
