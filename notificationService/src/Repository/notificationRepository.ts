import Notification, { NotificationDoc } from "../models/notification";

export class NotificationRepository {
  async createNotification(notificationData: Partial<NotificationDoc>): Promise<NotificationDoc> {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async getNotificationById(notificationId: string): Promise<NotificationDoc | null> {
    return await Notification.findById(notificationId).exec();
  }
  
  async getAllNotifications(): Promise<NotificationDoc[]> {
    return await Notification.find().exec();
  }

  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany({}, { $set: { isRead: true } }).exec();
    return { modifiedCount: result.modifiedCount };
  }

  async filterNotificationsByReadStatus(isRead: boolean): Promise<NotificationDoc[]> {
    return await Notification.find({ isRead }).exec();
  }

}


export const notificationRepository = new NotificationRepository();
