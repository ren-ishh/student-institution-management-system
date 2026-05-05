import pool from '../db/pool.js';

// Student: get my attendance
export async function getMyAttendance(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT sub.name AS subject, sub.code,
             COUNT(a.id) FILTER (WHERE a.status = 'present') AS present,
             COUNT(a.id) AS total,
             COALESCE(ROUND(
               COUNT(a.id) FILTER (WHERE a.status = 'present') * 100.0 / NULLIF(COUNT(a.id), 0), 1
             ), 0) AS percent
      FROM enrollments e
      JOIN subjects sub ON sub.id = e.subject_id
      JOIN students s ON s.id = e.student_id
      LEFT JOIN attendance a ON a.student_id = s.id AND a.subject_id = sub.id
      WHERE s.user_id = $1
      GROUP BY sub.id, sub.name, sub.code
      ORDER BY sub.code
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Faculty: mark attendance for a class
export async function markAttendance(req, res) {
  const { subject_id, date, records } = req.body;
  // records = [{ student_id, status }]

  if (!subject_id || !date || !records?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows: fac } = await pool.query(
      'SELECT id FROM faculty WHERE user_id = $1', [req.user.id]
    );

    const facultyId = fac[0]?.id;

    // Upsert each record
    const inserts = records.map(r =>
      pool.query(`
        INSERT INTO attendance (student_id, subject_id, date, status, marked_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (student_id, subject_id, date)
        DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by,
                      marked_at = NOW()
      `, [r.student_id, subject_id, date, r.status, facultyId])
    );

    await Promise.all(inserts);
    res.json({ message: `Attendance marked for ${records.length} students` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Admin: get department-wise summary
export async function getDeptAttendanceSummary(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT d.name AS department,
             COUNT(DISTINCT s.id) AS total_students,
             COUNT(*) FILTER (WHERE a.status = 'present') AS present,
             COUNT(*) AS total_records,
             ROUND(
               COUNT(*) FILTER (WHERE a.status = 'present') * 100.0 / NULLIF(COUNT(*),0), 1
             ) AS percent
      FROM attendance a
      JOIN students s ON s.id = a.student_id
      JOIN departments d ON d.id = s.department_id
      WHERE a.date = CURRENT_DATE
      GROUP BY d.id, d.name
      ORDER BY d.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}