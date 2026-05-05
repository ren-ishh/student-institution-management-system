import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getMyLeaves, applyLeave,
         getPendingLeaves, reviewLeave } from '../controllers/leaveController.js';

const router = Router();
router.get('/',           authenticate, authorize('student'),        getMyLeaves);
router.post('/',          authenticate, authorize('student'),        applyLeave);
router.get('/pending',    authenticate, authorize('admin'),          getPendingLeaves);
router.patch('/:id',      authenticate, authorize('admin'),          reviewLeave);
export default router;