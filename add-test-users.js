import bcrypt from 'bcryptjs';
import { SQLiteStorage } from './server/storage-sqlite.ts';

// Simple script to add test users directly to the running storage
console.log('🚀 Adding test users to storage...');

async function addTestUsers() {
  try {
    console.log('📦 Initializing storage...');
    
    // Create storage instance
    const db = new SQLiteStorage();
    await db.initialize();
    
    console.log('✅ Storage initialized');
    
    // Hash passwords
    const testPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const demoPassword = await bcrypt.hash('demo123', 10);
    
    // Test users to create
    const testUsers = [
      {
        username: 'testuser',
        email: 'test@techpartner.sa',
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        isAdmin: false
      },
      {
        username: 'admin',
        email: 'admin@techpartner.sa',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
      },
      {
        username: 'demo',
        email: 'demo@techpartner.sa', 
        password: demoPassword,
        firstName: 'Demo',
        lastName: 'User',
        isAdmin: false
      }
    ];
    
    // Add each test user
    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existing = await db.getUserByEmail(userData.email);
        if (existing) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Create the user
        const user = await db.createUser(userData);
        console.log(`✅ Created user: ${user.email} (ID: ${user.id})`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Test users setup complete!');
    console.log('\n📋 Available test credentials:');
    console.log('• test@techpartner.sa / password123');
    console.log('• admin@techpartner.sa / admin123'); 
    console.log('• demo@techpartner.sa / demo123');
    console.log('\n✨ You can now test authentication!');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error('Full error:', error);
  }
}

addTestUsers();
