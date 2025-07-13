import prisma from '../config/database';
import { NotificationResponseDto } from '../dtos';
import { transformNotificationToResponse } from '../utils/apiResponse';

export class NotificationService {
  async getNotifications(userId: number): Promise<NotificationResponseDto[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return notifications.map(notification => transformNotificationToResponse(notification));
  }

  async markAsRead(notificationId: number, userId: number): Promise<NotificationResponseDto> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('Unauthorized to update this notification');
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
      },
      include: {
        user: true,
      },
    });

    return transformNotificationToResponse(updatedNotification);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }
}
