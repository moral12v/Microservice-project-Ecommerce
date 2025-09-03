export interface ShippingProvider {
  getServicability(pickupDetails: any, dropDetails: any): Promise<any>;
  placeOrder(orderDetails: any, pickupDetails: any, dropDetails: any, orderItems: any): Promise<any>;
  cancelOrder(taskId: string): Promise<any>;
  trackOrder(taskId: string): Promise<any>;
  updateOrderStatusWebhook(payload: any): Promise<any>;
}
