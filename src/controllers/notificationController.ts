import { Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { AuthRequest } from '../interfaces';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const notifications = await notificationService.getNotifications(req.user.id);

      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const notificationId = parseInt(req.params.id);
      const notification = await notificationService.markAsRead(notificationId, req.user.id);

      res.json({
        message: 'Notification marked as read',
        notification,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const count = await notificationService.getUnreadCount(req.user.id);

      res.json({ unreadCount: count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
