import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getAllStudents, getStudentsBySubject, addStudent } from '../controllers/studentController.js';

const router = Router();
router.get('/', authenticate, authorize('admin','faculty'), getAllStudents);
router.post('/', authenticate, authorize('admin','faculty'), addStudent);
router.get('/subject/:subject_code', authenticate, authorize('faculty', 'admin'), getStudentsBySubject);
export default router;