import { Router } from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // every messaging route requires login

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/', sendMessage);

export default router;
