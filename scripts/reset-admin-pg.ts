// Reset admin user - PostgreSQL/Neon version for production server
import { loadSecrets } from '../server/aws-secrets';
import bcrypt from 'bcryptjs';

async function resetAdminPG() {
  // Load environment variables from AWS Secrets Manager or .env FIRST
  await loadSecrets();
  
  // Dynamically import db after secrets are loaded
  const { db } = await import('../server/db');
  const { users } = await import('../shared/schema');
  const { eq } = await import('drizzle-orm');
  try {
    // New admin credentials
    const newAdminEmail = 'admin@techpartner.sa';
    const newAdminPassword = 'TechPartner2026!';
    const newAdminUsername = 'admin';

    console.log('🔍 Checking for existing admin users in PostgreSQL...');

    // Find existing admin users
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'));

    console.log(`Found ${existingAdmins.length} existing admin(s)`);

    for (const admin of existingAdmins) {
      console.log(`🚫 Disabling admin: ${admin.email} (ID: ${admin.id})`);
      // Deactivate instead of delete to avoid foreign key constraint
      await db
        .update(users)
        .set({ isActive: false, role: 'client', updatedAt: new Date() })
        .where(eq(users.id, admin.id));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newAdminPassword, 10);

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, newAdminEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('ℹ️  User exists, updating to admin...');
      await db
        .update(users)
        .set({
          password: hashedPassword,
          username: newAdminUsername,
          role: 'admin',
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser[0].id));
    } else {
      console.log('✨ Creating new admin user...');
      await db.insert(users).values({
        username: newAdminUsername,
        email: newAdminEmail,
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true,
      });
    }

    console.log('\n✅ Admin user reset complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', newAdminEmail);
    console.log('🔑 Password:', newAdminPassword);
    console.log('👤 Username:', newAdminUsername);
    console.log('🎭 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');

  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  } finally {
    if (db && db.$client) {
      await db.$client.end();
    }
    process.exit(0);
  }
}

resetAdminPG();
