import pool from '../db/pool.js';

export async function getNotices(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT n.*, u.email AS posted_by_email
      FROM notices n
      JOIN users u ON u.id = n.posted_by
      WHERE n.institution_id = $1
      ORDER BY n.created_at DESC
    `, [req.user.institutionId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function postNotice(req, res) {
  const { title, tag, department_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const { rows } = await pool.query(`
      INSERT INTO notices (institution_id, title, tag, department_id, posted_by)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [req.user.institutionId, title, tag || 'General',
        department_id || null, req.user.id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}