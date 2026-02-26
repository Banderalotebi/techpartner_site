#!/usr/bin/env node

// Database seeding script for test users using Prisma
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const testUsers = [
  {
    email: 'test@techpartner.sa',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  },
  {
    email: 'admin@techpartner.sa', 
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'demo@techpartner.sa',
    password: 'demo123', 
    firstName: 'Demo',
    lastName: 'Customer'
  },
  {
    email: 'bander@techpartner.sa',
    password: 'bander123',
    firstName: 'Bander',
    lastName: 'Alotebi'
  }
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users into database (Prisma)...');
  
  try {
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      try {
        // Try to create user, or update if exists
        const result = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName
          },
          create: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.email === 'admin@techpartner.sa'
          }
        });
        
        console.log(`✅ Created/Updated user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error);
      }
    }
    
    console.log('\n✨ Test users ready! You can now login with:');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email} / 🔑 ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUsers();
