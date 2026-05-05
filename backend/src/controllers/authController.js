import pool from '../db/pool.js';
import { supabase } from '../utils/supabase.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find user by role
    let query, params;

    if (role === 'student') {
      query = `
        SELECT u.id, u.email, u.password_hash, u.role, u.institution_id,
               s.name, s.roll_number AS identifier
        FROM users u
        JOIN students s ON s.user_id = u.id
        WHERE (s.roll_number = $1 OR u.email = $1) AND u.role = 'student'
      `;
      params = [identifier];
    } else if (role === 'faculty') {
      query = `
        SELECT u.id, u.email, u.password_hash, u.role, u.institution_id,
               f.name, f.employee_id AS identifier
        FROM users u
        JOIN faculty f ON f.user_id = u.id
        WHERE (f.employee_id = $1 OR u.email = $1) AND u.role = 'faculty'
      `;
      params = [identifier];
    } else if (role === 'admin') {
      query = `
        SELECT u.id, u.email, u.password_hash, u.role, u.institution_id,
               u.email AS name, u.email AS identifier
        FROM users u
        WHERE u.email = $1 AND u.role = 'admin'
      `;
      params = [identifier];
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { rows } = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // 2. Verify password with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // 3. Return Supabase session info
    res.json({
      token: data.session.access_token,
      user: {
        id:            user.id,
        role:          user.role,
        name:          user.name,
        institutionId: user.institution_id,
        email:         user.email
      },
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
}

export async function getMe(req, res) {
  try {
    const { id, role } = req.user;
    let query;

    if (role === 'student') {
      query = `
        SELECT s.name, s.roll_number, s.semester, s.batch, s.phone,
               u.email, d.name AS department
        FROM students s
        JOIN users u ON u.id = s.user_id
        JOIN departments d ON d.id = s.department_id
        WHERE u.id = $1
      `;
    } else if (role === 'faculty') {
      query = `
        SELECT f.id as faculty_id, f.name, f.employee_id, f.designation, f.phone,
               u.email, d.name AS department
        FROM faculty f
        JOIN users u ON u.id = f.user_id
        JOIN departments d ON d.id = f.department_id
        WHERE u.id = $1
      `;
      const { rows } = await pool.query(query, [id]);
      if (rows[0]) {
        // Fetch subjects
        const subjQuery = `
          SELECT s.id, s.code, s.name, s.semester, s.section,
                 (SELECT COUNT(*) FROM enrollments e WHERE e.subject_id = s.id) as students
          FROM subjects s
          WHERE s.faculty_id = $1
        `;
        const subjRes = await pool.query(subjQuery, [rows[0].faculty_id]);
        rows[0].subjects = subjRes.rows.map(s => ({...s, students: parseInt(s.students)}));
      }
      return res.json(rows[0]);
    } else {
      query = `SELECT email AS name, email, role FROM users WHERE id = $1`;
    }

    const { rows } = await pool.query(query, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}