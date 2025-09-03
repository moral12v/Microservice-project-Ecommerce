import Razorpay from "razorpay";
import {
  CALLBACK_URL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../config/index";
import { PaymentProvider } from "./paymentProvider";
import TransactionHistoryService from "./transactionHistoryService";
import { CreateTranscitionHistoryDTO } from "../dtos/transacionhistoryDTO";

export class RazorpayPaymentProvider implements PaymentProvider {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  async initiatePayment(
    amount: number,
    customerEmail: string,
    orderId: number,
    merchantId:any
  ): Promise<{
    orderId: number;
    paymentOrderId: string;
    paymentLink: string;
    razorpayKey: string;
  }> {
    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 15)}`,
      payment_capture: 1,
    };
    console.log("=========options=======>",options)
    try {
      const razorpayOrder = await this.instance.orders.create(options);
      const paymentLinkOptions = {
        amount: Number(amount)  * 100,
        currency: "INR",
        accept_partial: false,
        reference_id: razorpayOrder.id,
        description: `Payment for order ${orderId}`,
        customer: {
          email: customerEmail || "",
        },
        notify: {
          email: true,
          sms: false,
        },
        callback_url: CALLBACK_URL,
        callback_method: "get",
      };
      console.log("=================paymentLinkOptions============>",paymentLinkOptions)
      const paymentLink = await this.instance.paymentLink.create(
        paymentLinkOptions
      );
      const transactionHistoryData: CreateTranscitionHistoryDTO = {
        userId: "66c5c902cd50cad50a697d11",
        amount: Number(amount) ,
        currency: "INR",
        type: "DEBIT",
        orderId: orderId.toString(),
        paymentOrderId: razorpayOrder.id,
        description: `Payment for order CTB-ODR-001`,
        status: "PENDING",
        paymentMethod: "UPI",
        referenceId: razorpayOrder.id,
        merchantId: merchantId
      };
      await TransactionHistoryService.createTransactionHistory(
        transactionHistoryData
      );
      return {
        orderId: orderId,
        paymentOrderId: razorpayOrder.id,
        paymentLink: paymentLink.short_url,
        razorpayKey: razorpayOrder.id,
      };
    } catch (error: any) {
      console.error("Error initiating Razorpay payment:", error);
      throw new Error("Failed to initiate Razorpay payment");
    }
  }
}
