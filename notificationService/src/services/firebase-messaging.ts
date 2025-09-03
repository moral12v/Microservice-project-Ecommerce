import * as admin from 'firebase-admin';

const messaging = admin.messaging();

export async function sendPushNotification(token: string, message: string) {
    const payload = {
        notification: {
            title: "FCM Notification",
            body: message
        }
    };
    

    try {
        const response = await messaging.sendToDevice(token, payload);
        console.log('Message sent successfully:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}