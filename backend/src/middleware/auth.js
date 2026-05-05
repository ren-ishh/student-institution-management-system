// ============================================
//  AUTH MIDDLEWARE
//  Verifies JWT token on every protected route
// ============================================

import { supabase } from '../utils/supabase.js';
import pool from '../db/pool.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    // 1. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 2. Fetch our custom user info (role, institutionId, etc) from our DB by email
    const { rows } = await pool.query(
      'SELECT id, role, institution_id FROM users WHERE email = $1',
      [user.email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found in application database' });
    }

    req.user = {
      id: rows[0].id,
      role: rows[0].role,
      institutionId: rows[0].institution_id,
      email: user.email
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({ error: 'Authentication service error' });
  }
}