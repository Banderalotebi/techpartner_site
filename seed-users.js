#!/usr/bin/env node

// Database seeding script for test users
import { db } from './server/db.ts';
import { users } from './shared/schema.ts';
import bcrypt from 'bcryptjs';

const testUsers = [
  {
    email: 'test@techpartner.sa',
    password: '{process.env.PASSWORD_1}',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User'
  },
  {
    email: 'admin@techpartner.sa', 
    password: '{process.env.PASSWORD_2}',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'demo@techpartner.sa',
    password: '{process.env.PASSWORD_3}', 
    username: 'demo',
    firstName: 'Demo',
    lastName: 'Customer'
  },
  {
    email: 'bander@techpartner.sa',
    password: '{process.env.PASSWORD_4}',
    username: 'bander',
    firstName: 'Bander',
    lastName: 'Alotebi'
  }
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users into database...');
  
  try {
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      try {
        const result = await db.insert(users).values({
          email: user.email,
          password: hashedPassword,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: true
        }).returning();
        
        console.log(`✅ Created user: ${user.email}`);
      } catch (error) {
        if (error.message?.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  User already exists: ${user.email}`);
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      }
    }
    
    console.log('\n✨ Test users ready! You can now login with:');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email} / 🔑 ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

seedTestUsers().catch(console.error);
