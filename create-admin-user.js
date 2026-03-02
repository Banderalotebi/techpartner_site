// Create an admin user for testing using SQLite
import Database from "better-sqlite3";
import path from "path";
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), "data", "techpartner.db");

const db = new Database(dbPath);

async function createAdminUser() {
  try {
    // Admin credentials
    const adminEmail = 'info@techpartner.sa';
    const adminPassword = 'Admin@123';
    const adminUsername = 'admin';

    // Check if admin user already exists
    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    if (existing) {
      console.log('ℹ️ Admin user already exists, updating password...');
      
      db.prepare(`
        UPDATE users 
        SET password = ?, username = ?, role = 'admin', updatedAt = CURRENT_TIMESTAMP 
        WHERE email = ?
      `).run(hashedPassword, adminUsername, adminEmail);
      
      console.log('✅ Admin password updated:', {
        email: adminEmail,
        username: adminUsername,
        role: 'admin'
      });
    } else {
      console.log('ℹ️ Creating new admin user...');
      
      db.prepare(`
        INSERT INTO users (username, email, password, firstName, lastName, role, isEmailVerified, isActive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        adminUsername,
        adminEmail,
        hashedPassword,
        'Admin',
        'User',
        'admin',
        1,
        1
      );
      
      console.log('✅ Admin user created:', {
        email: adminEmail,
        username: adminUsername,
        role: 'admin'
      });
    }
    
    console.log('\n✅ Admin credentials are now set!');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    db.close();
    process.exit(0);
  }
}

createAdminUser();

