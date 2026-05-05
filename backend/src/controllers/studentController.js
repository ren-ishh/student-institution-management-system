import pool from '../db/pool.js';
import { supabaseAdmin } from '../utils/supabase.js';

export async function getAllStudents(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT s.id, s.name, s.roll_number, s.semester, s.batch,
             u.email, d.name AS department,
             ROUND(
               COUNT(*) FILTER (WHERE a.status = 'present') * 100.0
               / NULLIF(COUNT(a.*), 0), 1
             ) AS attendance_percent
      FROM students s
      JOIN users u ON u.id = s.user_id
      JOIN departments d ON d.id = s.department_id
      LEFT JOIN attendance a ON a.student_id = s.id
      WHERE s.institution_id = $1
      GROUP BY s.id, s.name, s.roll_number, s.semester,
               s.batch, u.email, d.name
      ORDER BY s.roll_number
    `, [req.user.institutionId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getStudentsBySubject(req, res) {
  const { subject_code } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT s.id, s.name, s.roll_number,
             ROUND(
               COUNT(*) FILTER (WHERE a.status = 'present') * 100.0
               / NULLIF(COUNT(a.*), 0), 1
             ) AS attendance
      FROM enrollments e
      JOIN students s ON s.id = e.student_id
      JOIN subjects sub ON sub.id = e.subject_id
      LEFT JOIN attendance a ON a.student_id = s.id AND a.subject_id = sub.id
      WHERE sub.code = $1
      GROUP BY s.id, s.name, s.roll_number
      ORDER BY s.roll_number
    `, [subject_code]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function addStudent(req, res) {
  const { email, password, name, roll_number, semester, batch, department_id } = req.body;
  const institution_id = req.user.institutionId;

  if (!email || !name || !roll_number) {
    return res.status(400).json({ error: 'Email, name, and roll number are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create Supabase Auth User
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'password123',
      email_confirm: true
    });

    if (authError) {
      throw new Error(`Supabase Auth error: ${authError.message}`);
    }

    // 2. Create local User
    const { rows: userRows } = await client.query(
      'INSERT INTO users (institution_id, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [institution_id, email, 'SUPABASE_AUTH', 'student']
    );
    const userId = userRows[0].id;

    // 3. Create Student profile
    const { rows: studentRows } = await client.query(
      'INSERT INTO students (user_id, institution_id, department_id, name, roll_number, semester, batch) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, institution_id, department_id, name, roll_number, semester, batch]
    );
    const studentId = studentRows[0].id;

    // 4. Auto-enroll in subjects for this semester/dept
    await client.query(`
      INSERT INTO enrollments (student_id, subject_id)
      SELECT $1, id
      FROM subjects
      WHERE department_id = $2 AND semester = $3
    `, [studentId, department_id, semester]);

    await client.query('COMMIT');
    res.status(201).json(studentRows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Add Student Error:', err);
    res.status(500).json({ error: err.message || 'Failed to add student' });
  } finally {
    client.release();
  }
}