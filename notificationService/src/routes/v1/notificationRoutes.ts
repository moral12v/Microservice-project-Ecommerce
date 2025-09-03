import express from 'express';
import { handleOtpNotificationRequest } from '../../controllers/smsController';
import { notificationController } from '../../controllers/notificationController';

export const notifiactionRoute = express.Router();


notifiactionRoute.post('/send-otp', handleOtpNotificationRequest);




notifiactionRoute.post('/', notificationController.createNotification);
notifiactionRoute.get('/', notificationController.getAllNotifications);
notifiactionRoute.get('/:id', notificationController.getNotificationById);
notifiactionRoute.patch('/mark-all-read', notificationController.markAllAsRead);
notifiactionRoute.get('/filter', notificationController.filterReadNotifications);

