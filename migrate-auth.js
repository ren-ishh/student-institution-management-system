import pool from './backend/src/db/pool.js';
import { supabaseAdmin } from './backend/src/utils/supabase.js';

async function migrateUsers() {
  console.log('🚀 Starting user migration to Supabase Auth...');

  try {
    const { rows: users } = await pool.query('SELECT email FROM users');
    console.log(`Found ${users.length} users to migrate.`);

    for (const user of users) {
      console.log(`Migrating ${user.email}...`);
      
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: 'password123',
        email_confirm: true // This sets it as confirmed immediately
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✅ ${user.email} already exists in Supabase Auth.`);
        } else {
          console.error(`❌ Failed to migrate ${user.email}:`, error.message);
        }
      } else {
        console.log(`✨ Successfully created ${user.email} in Supabase Auth.`);
      }
    }

    console.log('🏁 Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('💥 Fatal error during migration:', err);
    process.exit(1);
  }
}

migrateUsers();
