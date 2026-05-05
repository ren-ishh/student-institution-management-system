// ============================================
//  EDUPORTAL BACKEND SERVER
// ============================================

import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';

import authRoutes        from './routes/auth.js';
import leaveRoutes       from './routes/leaves.js';
import hostelRoutes      from './routes/hostelLeaves.js';
import attendanceRoutes  from './routes/attendance.js';
import marksRoutes       from './routes/marks.js';
import studentRoutes     from './routes/students.js';
import noticeRoutes      from './routes/notices.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({
  status: 'ok',
  server: 'EduPortal API',
  time:   new Date().toISOString(),
}));

// Routes
app.use('/api/auth',        authRoutes);
app.use('/api/leaves',      leaveRoutes);
app.use('/api/hostel',      hostelRoutes);
app.use('/api/attendance',  attendanceRoutes);
app.use('/api/marks',       marksRoutes);
app.use('/api/students',    studentRoutes);
app.use('/api/notices',     noticeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 EduPortal API running at http://localhost:${PORT}`);
});