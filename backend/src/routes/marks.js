import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getMyMarks, upsertMarks,
         getSubjectMarks } from '../controllers/marksController.js';

const router = Router();
router.get('/me',            authenticate, authorize('student'),      getMyMarks);
router.post('/',             authenticate, authorize('faculty'),       upsertMarks);
router.get('/subject/:subject_id', authenticate, authorize('faculty','admin'), getSubjectMarks);
export default router;