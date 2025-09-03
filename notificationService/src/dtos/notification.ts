export interface CreateNotificationDTO {
    customerId: object;
    title: string;
    body: string;
    Image: string;
    url: string;
    isRead: boolean;
}

export interface UpdateNotificationDTO {
    customerId: object;
    title: string;
    body: string;
    Image: string;
    url: string;
    isRead: boolean;
}