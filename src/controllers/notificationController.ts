import { Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { AuthRequest } from '../interfaces';
import { ApiResponseHandler } from '../utils/apiResponse';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const notifications = await notificationService.getNotifications(req.user.id);

      ApiResponseHandler.success(res, 'Notifications fetched successfully', { notifications });
    } catch (error: any) {
      ApiResponseHandler.internalError(res, error.message);
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const notificationId = parseInt(req.params.id);
      const notification = await notificationService.markAsRead(notificationId, req.user.id);

      ApiResponseHandler.success(res, 'Notification marked as read successfully', { notification });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const count = await notificationService.getUnreadCount(req.user.id);

      ApiResponseHandler.success(res, 'Unread count fetched successfully', { unreadCount: count });
    } catch (error: any) {
      ApiResponseHandler.internalError(res, error.message);
    }
  }
}
