import { db } from '../server/db';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const email = 'bander.alotebi@gmail.com';
    const password = 'Admin@6565';
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(users.email === email).limit(1);
    
    if (existingUser.length > 0) {
      console.log('User already exists, updating to admin...');
      await db.update(users)
        .set({ 
          role: 'admin',
          isActive: true 
        })
        .where(users.email === email);
      console.log('✅ User updated to admin successfully!');
      return;
    }

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
    console.log('Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

createAdminUser();
