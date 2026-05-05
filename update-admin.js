import pool from './backend/src/db/pool.js';
import { supabaseAdmin } from './backend/src/utils/supabase.js';

async function updateAdminCredentials() {
  const oldEmail = 'priya.mehta@greenfield.edu.in';
  const newEmail = 'renish@admin.in';
  const newPassword = '9487365973';

  console.log(`🔄 Updating admin credentials from ${oldEmail} to ${newEmail}...`);

  try {
    // 1. Find the user in Supabase Auth to get their ID
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;

    const supabaseUser = users.find(u => u.email === oldEmail);
    
    if (!supabaseUser) {
      console.error(`❌ Could not find user with email ${oldEmail} in Supabase Auth.`);
      process.exit(1);
    }

    console.log(`Found Supabase User ID: ${supabaseUser.id}`);

    // 2. Update Supabase Auth (Email and Password)
    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      supabaseUser.id,
      { 
        email: newEmail, 
        password: newPassword,
        email_confirm: true 
      }
    );

    if (updateAuthError) {
      console.error('❌ Failed to update Supabase Auth:', updateAuthError.message);
      process.exit(1);
    }
    console.log('✨ Supabase Auth updated successfully.');

    // 3. Update our internal database
    const { rowCount } = await pool.query(
      'UPDATE users SET email = $1 WHERE email = $2',
      [newEmail, oldEmail]
    );

    if (rowCount === 0) {
      console.error('⚠️ Could not find user in our PostgreSQL table. Migration might be incomplete.');
    } else {
      console.log('✨ PostgreSQL database updated successfully.');
    }

    console.log('\n✅ Admin credentials have been successfully changed!');
    console.log(`New Email: ${newEmail}`);
    console.log(`New Password: ${newPassword}`);
    
    process.exit(0);
  } catch (err) {
    console.error('💥 Fatal error during update:', err);
    process.exit(1);
  }
}

updateAdminCredentials();
