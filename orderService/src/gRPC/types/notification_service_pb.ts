export interface SendNotificationRequest {
    title: string;
    body: string;
    image: string;
    deviceId: string;
  }
  
  export interface  SendNotificationResponse {
    success: boolean;
    message: string;
  }
  