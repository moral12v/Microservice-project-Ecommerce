import { NotificationDoc } from "../models/notification";
import { notificationRepository } from "../Repository/notificationRepository";

class NotificationService {
  async createNotification(notificationData: Partial<NotificationDoc>): Promise<NotificationDoc> {
    return await notificationRepository.createNotification(notificationData);
  }

  async getAllNotifications(): Promise<NotificationDoc[]> {
    return await notificationRepository.getAllNotifications();
  }

  async getNotificationById(notificationId: string): Promise<NotificationDoc | null> {
    return await notificationRepository.getNotificationById(notificationId);
  }

  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    return await notificationRepository.markAllAsRead();
  }

  async filterReadNotifications(isRead: boolean): Promise<NotificationDoc[]> {
    return await notificationRepository.filterNotificationsByReadStatus(isRead);
  }
  
}

export const notificationService = new NotificationService();
