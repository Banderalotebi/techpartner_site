// Create an admin user for testing
import { db } from './server/db.js';
import { users } from './shared/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, 'admin@techpartner.sa')).limit(1);
    
    if (existing) {
      console.log('ℹ️ Admin user already exists:', {
        id: existing.id,
        email: existing.email,
        username: existing.username,
        role: existing.role
      });
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123!', 10);
    
    const [adminUser] = await db.insert(users).values({
      email: 'admin@techpartner.sa',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      role: 'admin',
    }).returning();

    console.log('✅ Admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
      role: adminUser.role
    });
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
