import { RazorpayPaymentProvider } from "./razorpayProvider";
import TransactionHistoryService from "./transactionHistoryService";
import { CreateTranscitionHistoryDTO } from "../dtos/transacionhistoryDTO";
import logger from "../utils/logger";

class PaymentService {
  private static paymentProvider = new RazorpayPaymentProvider();

  static async initiatePayment(
    amount: number,
    customerEmail: string,
    orderId: number,
    merchantId:string
  ) {
    try {
      const { paymentOrderId, paymentLink, razorpayKey } =
        await this.paymentProvider.initiatePayment(
          amount,
          customerEmail,
          orderId,
          merchantId
        );
      return { paymentOrderId, paymentLink, razorpayKey };
    } catch (error: any) {
      logger.error("Error initiating payment:", error);
      throw new Error("Failed to initiate payment");
    }
  }
}

export default PaymentService;
