// Reset admin user - removes old admin and creates new one (SQLite version)
import Database from "better-sqlite3";
import path from "path";
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), "data", "techpartner.db");

const db = new Database(dbPath);

async function resetAdmin() {
  try {
    // New admin credentials
    const newAdminEmail = 'admin@techpartner.sa';
    const newAdminPassword = 'TechPartner2026!';
    const newAdminUsername = 'admin';

    console.log('🔍 Checking for existing admin users...');

    // Find existing admin users
    const existingAdmins = db.prepare("SELECT * FROM users WHERE role = 'admin'").all() as any[];
    
    console.log(`Found ${existingAdmins.length} existing admin(s)`);

    for (const admin of existingAdmins) {
      console.log(`🗑️  Removing admin: ${admin.email} (ID: ${admin.id})`);
      
      // Delete the user
      db.prepare("DELETE FROM users WHERE id = ?").run(admin.id);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newAdminPassword, 10);

    // Check if user with this email already exists (non-admin)
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(newAdminEmail) as any;
    
    if (existingUser) {
      console.log('ℹ️  User with this email exists, updating to admin...');
      db.prepare(`
        UPDATE users 
        SET password = ?, username = ?, role = 'admin', isActive = 1, updatedAt = CURRENT_TIMESTAMP 
        WHERE email = ?
      `).run(hashedPassword, newAdminUsername, newAdminEmail);
    } else {
      console.log('✨ Creating new admin user...');
      db.prepare(`
        INSERT INTO users (username, email, password, firstName, lastName, role, isEmailVerified, isActive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newAdminUsername,
        newAdminEmail,
        hashedPassword,
        'System',
        'Administrator',
        'admin',
        1,
        1
      );
    }

    console.log('\n✅ Admin user reset complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', newAdminEmail);
    console.log('🔑 Password:', newAdminPassword);
    console.log('👤 Username:', newAdminUsername);
    console.log('🎭 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   You can now login at: /login');

  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  } finally {
    db.close();
    process.exit(0);
  }
}

resetAdmin();
