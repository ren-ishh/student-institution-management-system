import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getMyAttendance, markAttendance,
         getDeptAttendanceSummary } from '../controllers/attendanceController.js';

const router = Router();
router.get('/me',      authenticate, authorize('student'),          getMyAttendance);
router.post('/',       authenticate, authorize('faculty'),           markAttendance);
router.get('/summary', authenticate, authorize('admin'),             getDeptAttendanceSummary);
export default router;