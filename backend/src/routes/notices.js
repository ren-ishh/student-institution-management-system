import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize }     from '../middleware/role.js';
import { getNotices, postNotice } from '../controllers/noticeController.js';

const router = Router();
router.get('/',  authenticate, getNotices);
router.post('/', authenticate, authorize('admin'), postNotice);
export default router;