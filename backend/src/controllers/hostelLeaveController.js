import pool from '../db/pool.js';

export async function getMyHostelLeaves(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT h.*, s.name AS student_name
      FROM hostel_leaves h
      JOIN students s ON s.id = h.student_id
      WHERE s.user_id = $1
      ORDER BY h.applied_on DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function applyHostelLeave(req, res) {
  const { reason, description, from_date, from_time,
          to_date, to_time, destination, parent_phone } = req.body;

  if (!reason || !from_date || !from_time || !to_date || !to_time
      || !destination || !parent_phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows: student } = await pool.query(
      'SELECT id FROM students WHERE user_id = $1', [req.user.id]
    );

    const { rows } = await pool.query(`
      INSERT INTO hostel_leaves
        (student_id, reason, description, from_date, from_time,
         to_date, to_time, destination, parent_phone)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `, [student[0].id, reason, description, from_date, from_time,
        to_date, to_time, destination, parent_phone]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getPendingHostelLeaves(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT h.*, s.name AS student_name, s.roll_number,
             d.name AS department
      FROM hostel_leaves h
      JOIN students s ON s.id = h.student_id
      JOIN departments d ON d.id = s.department_id
      WHERE h.status = 'pending'
      ORDER BY h.applied_on ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function reviewHostelLeave(req, res) {
  const { id } = req.params;
  const { status, warden_comment } = req.body;

  if (!['approved','rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const { rows } = await pool.query(`
      UPDATE hostel_leaves
      SET status = $1, warden_comment = $2,
          reviewed_on = NOW(), reviewed_by = $3
      WHERE id = $4
      RETURNING *
    `, [status, warden_comment || '', req.user.id, id]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}