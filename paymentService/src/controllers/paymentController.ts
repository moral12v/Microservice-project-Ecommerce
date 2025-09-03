import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/paymentService";
import logger from "../utils/logger";
import { UpdateTranscitionHistoryDTO } from "../dtos/transacionhistoryDTO";
import TransactionHistoryService from "../services/transactionHistoryService";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../config";
import crypto from "crypto";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import PaymentCallbackHandler from "../kafka/handdler/handlePaymentCallback";
import { responseWithoutData } from "../utils/response";

class PaymentController {
  static initiatePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      logger.info("Initiating Payment...");
      const { amount, email, orderId, merchantId} = req.body;

      const { paymentOrderId, paymentLink } =
        await PaymentService.initiatePayment(amount, email, orderId,merchantId);

      res.status(200).json({ paymentOrderId, paymentLink });
    } catch (error: any) {
      logger.error(`Error initiating payment: ${error.message}`);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  };

  static async handlePaymentCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      logger.info("Handling Payment Callback...");
      return res
        .status(200)
        .json({ message: "Payment callback handled successfully" });
    } catch (error: any) {
      logger.error(`Error handling payment callback: ${error.message}`);
      return res
        .status(500)
        .json({ message: "Failed to handle payment callback" });
    }
  }
  static async renderPaymentConfirmation(req: Request, res: Response) {
    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
    } = req.query;
    const PaymentId =
      typeof razorpay_payment_id === "string" ? razorpay_payment_id : "";
    const PaymentlinkId =
      typeof razorpay_payment_link_id === "string"
        ? razorpay_payment_link_id
        : "";
    const PaymentLinkReferenceId =
      typeof razorpay_payment_link_reference_id === "string"
        ? razorpay_payment_link_reference_id
        : "";
    const PaymentLinkStatus =
      typeof razorpay_payment_link_status === "string"
        ? razorpay_payment_link_status
        : "";
    const signature =
      typeof razorpay_signature === "string" ? razorpay_signature : "";
    if (
      !PaymentId ||
      !PaymentlinkId ||
      !PaymentLinkReferenceId ||
      !PaymentLinkStatus ||
      !signature
    ) {
      return res.status(400).json({ message: "Missing required parameters" });
    }
    const isValidSignature = validatePaymentVerification(
      {
        payment_link_id: PaymentlinkId,
        payment_id: PaymentId,
        payment_link_reference_id: PaymentLinkReferenceId,
        payment_link_status: PaymentLinkStatus,
      },
      signature,
      RAZORPAY_KEY_SECRET
    );

    if (!isValidSignature) {
      logger.error("Invalid payment signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    try {
      const payment = await instance.payments.fetch(PaymentId);
      console.log(payment);
      if (payment.captured) {
        var transactionHistory =
          await TransactionHistoryService.findTransactionHistoryByReferenceId(
            PaymentLinkReferenceId
          );
        if (!transactionHistory) {
          logger.error(
            `Transaction history not found for referenceId: ${PaymentLinkReferenceId}`
          );
          return res
            .status(404)
            .json({ message: "Transaction history not found" });
        }
        const updateData: any = {
          userId: transactionHistory.userId,
          currency: transactionHistory.currency,
          type: transactionHistory.type,
          referenceId: PaymentLinkReferenceId,
          paymentOrderId: payment?.order_id,
          status: "PAID",
          paymentMethod: payment?.method.toUpperCase(),
          description: `Payment ${"PAID"} for order ${
            transactionHistory.orderId
          }`,
        };
        await TransactionHistoryService.updateTransactionHistory(
          transactionHistory.id,
          updateData
        );

        logger.info(
          `Transaction history updated successfully for referenceId: ${PaymentLinkReferenceId}`
        );
      }
      res.render("paymentConfirmation.ejs");
    } catch (error: any) {
      logger.error("Error fetching payment details: " + error.message);
      return res
        .status(500)
        .json({ message: "Error fetching payment details" });
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      const instance = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
      if (razorpay_signature !== expectedSign) {
        logger.error(`Invalid signature for referenceId: ${razorpay_order_id}`);
        return responseWithoutData(res, 400, false, "Invalid Signature!!");
      }
      const payment = await instance.payments.fetch(razorpay_payment_id);
      const transactionHistory =
        await TransactionHistoryService.findTransactionHistoryByReferenceId(
          razorpay_order_id
        );
      if (!transactionHistory) {
        logger.error(
          `Transaction history not found for referenceId: ${razorpay_order_id}`
        );
        return res
          .status(404)
          .json({ message: "Transaction history not found", success:true });
      }
      if (payment.status !== "captured") {
        logger.error(
          `Payment not captured for referenceId: ${razorpay_order_id}, status: ${payment.status}`
        );
        await PaymentCallbackHandler.handleCallbacks(
        Number(  transactionHistory.orderId),
          payment.status.toUpperCase(),
          razorpay_payment_id
        );
        return responseWithoutData(res, 400, false, "Payment not captured.");
      }

      const updateData: any = {
        userId: transactionHistory.userId,
        currency: transactionHistory.currency,
        type: transactionHistory.type,
        referenceId: razorpay_order_id,
        paymentOrderId: razorpay_order_id,
        status: "PAID",
        paymentMethod: payment.method.toUpperCase(),
        description: `Payment ${"PAID"} for order ${
          transactionHistory.orderId
        }`,
      };
      await TransactionHistoryService.updateTransactionHistory(
        transactionHistory.id,
        updateData
      );
      logger.info(
        `Transaction history updated successfully for referenceId: ${razorpay_order_id}`
      );
      await PaymentCallbackHandler.handleCallbacks(
      Number(transactionHistory.orderId),
        payment.status.toUpperCase(),
        razorpay_payment_id
      );
      return res
        .status(200)
        .json({ message: "Payment verified and updated successfully" , success:true });
    } catch (error: any) {
      console.log(error)
      logger.error(`Error verifying payment: ${error}`);
      return responseWithoutData(res, 500, false, "Internal Server Error");
    }
  }
}

export default PaymentController;
