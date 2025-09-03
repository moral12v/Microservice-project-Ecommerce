import { Request, Response, NextFunction } from "express";

import { notificationService } from "../services/notificationService";
import { errorResponse, responseWithData, responseWithoutData } from "../utils/response";
import logger from "../utils/logger";

class NotificationController {
    async createNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const notificationData = req.body;
            const newNotification = await notificationService.createNotification(notificationData);
            responseWithData(res, 201, true, "Notification created successfully.", newNotification);
        } catch (error: any) {
            logger.error(`Error creating notification: ${error.message}`);
            errorResponse(res, "Failed to create notification.");
        }
    }

    async getAllNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const notifications = await notificationService.getAllNotifications();
            responseWithData(res, 200, true, "Notifications retrieved successfully.", notifications);
        } catch (error: any) {
            logger.error(`Error retrieving notifications: ${error.message}`);
            errorResponse(res, "Failed to retrieve notifications.");
        }
    }

    async getNotificationById(req: Request, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.id;
            const notification = await notificationService.getNotificationById(notificationId);
            if (!notification) {
                return errorResponse(res, "Notification not found", 404);
            }
            responseWithData(res, 200, true, "Notification retrieved successfully.", notification);
        } catch (error: any) {
            logger.error(`Error retrieving notification: ${error.message}`);
            errorResponse(res, "Failed to retrieve notification.");
        }
    }

    async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await notificationService.markAllAsRead();
            responseWithoutData(res, 200, true, `Marked ${result.modifiedCount} notifications as read.`);
        } catch (error: any) {
            logger.error(`Error marking notifications as read: ${error.message}`);
            errorResponse(res, "Failed to mark notifications as read.");
        }
    }

    async filterReadNotifications(req: Request, res: Response, next: NextFunction) {
        try {
          const isRead = req.query.isRead === 'true'; 
          const notifications = await notificationService.filterReadNotifications(isRead);
          responseWithData(res, 200, true, `Notifications filtered by read status (${isRead}).`, notifications);
        } catch (error: any) {
          logger.error(`Error filtering notifications by read status: ${error.message}`);
          errorResponse(res, "Failed to filter notifications.");
        }
      }
}

export const notificationController = new NotificationController();
