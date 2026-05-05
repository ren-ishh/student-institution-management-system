import pool from '../db/pool.js';

// Student: get my leaves
export async function getMyLeaves(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, s.name AS student_name
      FROM leaves l
      JOIN students s ON s.id = l.student_id
      WHERE s.user_id = $1
      ORDER BY l.applied_on DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Student: apply for leave
export async function applyLeave(req, res) {
  const { type, from_date, to_date, days, reason, doc_url } = req.body;

  if (!type || !from_date || !to_date || !reason) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows: student } = await pool.query(
      'SELECT id FROM students WHERE user_id = $1', [req.user.id]
    );

    if (!student.length) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { rows } = await pool.query(`
      INSERT INTO leaves
        (student_id, type, from_date, to_date, days, reason, doc_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `, [student[0].id, type, from_date, to_date, days, reason, doc_url || null]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Admin: get all pending leaves
export async function getPendingLeaves(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, s.name AS student_name, s.roll_number,
             d.name AS department,
             (SELECT COUNT(*) FROM attendance a
              WHERE a.student_id = l.student_id
              AND a.status = 'present') AS present_count,
             (SELECT COUNT(*) FROM attendance a
              WHERE a.student_id = l.student_id) AS total_count
      FROM leaves l
      JOIN students s ON s.id = l.student_id
      JOIN departments d ON d.id = s.department_id
      WHERE l.status = 'pending'
      ORDER BY l.applied_on ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Admin: approve or reject leave
export async function reviewLeave(req, res) {
  const { id } = req.params;
  const { status, admin_comment } = req.body;

  if (!['approved','rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  try {
    const { rows } = await pool.query(`
      UPDATE leaves
      SET status = $1, admin_comment = $2,
          reviewed_on = NOW(), reviewed_by = $3
      WHERE id = $4
      RETURNING *
    `, [status, admin_comment || '', req.user.id, id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}