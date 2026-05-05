import pool from '../db/pool.js';

export async function getMyMarks(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT sub.name AS subject, sub.code,
             m.internal, m.external, m.total, m.exam_type
      FROM enrollments e
      JOIN subjects sub ON sub.id = e.subject_id
      JOIN students s ON s.id = e.student_id
      LEFT JOIN marks m ON m.student_id = s.id AND m.subject_id = sub.id
      WHERE s.user_id = $1
      ORDER BY sub.code
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function upsertMarks(req, res) {
  const { student_id, subject_id, exam_type, internal, external } = req.body;

  try {
    const { rows: fac } = await pool.query(
      'SELECT id FROM faculty WHERE user_id = $1', [req.user.id]
    );

    const { rows } = await pool.query(`
      INSERT INTO marks (student_id, subject_id, exam_type, internal, external, entered_by)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (student_id, subject_id, exam_type)
      DO UPDATE SET internal = $4, external = $5,
                    entered_by = $6, updated_at = NOW()
      RETURNING *
    `, [student_id, subject_id, exam_type || 'semester',
        internal, external, fac[0]?.id]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getSubjectMarks(req, res) {
  const { subject_id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT s.name AS student_name, s.roll_number,
             m.internal, m.external, m.total
      FROM marks m
      JOIN students s ON s.id = m.student_id
      WHERE m.subject_id = $1
      ORDER BY m.total DESC
    `, [subject_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}