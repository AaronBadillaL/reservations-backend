import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const notificationController = new NotificationController();

// All notification routes require authentication
router.get('/', authMiddleware, notificationController.getNotifications.bind(notificationController));
router.put('/:id/read', authMiddleware, notificationController.markAsRead.bind(notificationController));
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount.bind(notificationController));

export default router;
