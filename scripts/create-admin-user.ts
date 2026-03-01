// Load environment variables FIRST before any other imports
import 'dotenv/config';

// Now import other modules that depend on environment variables
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    // Debug: Show DATABASE_URL status (hide actual value for security)
    const dbUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL exists:', !!dbUrl);
    if (dbUrl) {
      console.log('DATABASE_URL starts with:', dbUrl.substring(0, 20) + '...');
    }

    // Check if database is connected
    if (!db) {
      console.error('❌ Database not initialized. Check your DATABASE_URL environment variable.');
      console.error('Make sure you have a .env file with DATABASE_URL set.');
      process.exit(1);
    }

    console.log('✅ Database connection initialized');

    const email = 'bander.alotebi@gmail.com';
    const password = 'Admin@6565';
    
    console.log('Checking if user exists...');
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      console.log('User already exists, updating to admin...');
      await db.update(users)
        .set({ 
          role: 'admin',
          isActive: true 
        })
        .where(eq(users.email, email));
      console.log('✅ User updated to admin successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Role: admin');
      return;
    }

    console.log('Creating new admin user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const [newUser] = await db.insert(users).values({
      email: email,
      username: 'bander_alotebi',
      password: hashedPassword,
      firstName: 'Bander',
      lastName: 'Alotebi',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: admin');
    console.log('You can now log in at: https://techpartner.sa/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
  
  process.exit(0);
}

createAdminUser();
