export interface PaymentProvider {
  initiatePayment(amount: number, customerEmail: string, orderId:number, merchantId:string): Promise<{ paymentOrderId: string, paymentLink: string, razorpayKey:string }>;
}
