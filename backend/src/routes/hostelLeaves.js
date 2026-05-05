import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getMyHostelLeaves, applyHostelLeave,
         getPendingHostelLeaves, reviewHostelLeave } from '../controllers/hostelLeaveController.js';

const router = Router();
router.get('/',        authenticate, authorize('student'),       getMyHostelLeaves);
router.post('/',       authenticate, authorize('student'),       applyHostelLeave);
router.get('/pending', authenticate, authorize('admin'),         getPendingHostelLeaves);
router.patch('/:id',   authenticate, authorize('admin'),         reviewHostelLeave);
export default router;