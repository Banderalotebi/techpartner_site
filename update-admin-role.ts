// Update admin user role
import dotenv from 'dotenv';
dotenv.config();

import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

async function updateAdminRole() {
  try {
    const [updated] = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, 'admin@techpartner.sa'))
      .returning();

    console.log('✅ Admin role updated:', {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role
    });
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminRole();
