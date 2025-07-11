import prisma from '../config/database';
import { Notification } from '../interfaces';

export class NotificationService {
  async getNotifications(userId: number): Promise<Notification[]> {
    return await prisma.notification.findMany({
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
  }

  async markAsRead(notificationId: number, userId: number): Promise<Notification> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('Unauthorized to update this notification');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
      },
      include: {
        user: true,
      },
    });
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
