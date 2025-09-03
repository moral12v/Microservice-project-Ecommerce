import { producer } from "../producer";
import { consumer } from "../consumer";
import { KAFKA_TOPICS } from "../topics";
import logger from "../../utils/logger";
import OrderService from "../../services/orderService";
import { deleteCart } from "./deleteCart";
import { createTask } from "../../gRPC/controller/shipping";
import { Span, trace } from "@opentelemetry/api";
import { getMerchantDetailsById } from "../../gRPC/controller/merchantDetails";
import {
  DropDetails,
  PickupDetails,
} from "../../gRPC/types/shipping_service_pb";
import { getAddressDetailsById } from "../../gRPC/controller/addressDetails";
import { getDeviceIdByStoreId } from "../../gRPC/controller/deviceId";
import { sendOrderNotification } from "../../gRPC/controller/sendNotification";
export const produceOrderCreatedEvent = async (
  orderId: string,
  amount: number,
  customer: any,
  merchantId: any
) => {
  try {
    await producer.send({
      topic: KAFKA_TOPICS.ORDER_CREATED,
      messages: [
        {
          value: JSON.stringify({
            amount,
            customerEmail: customer.email,
            orderId: orderId,
            merchantId: merchantId,
          }),
        },
      ],
    });
    logger.info(`Order created event sent to Kafka for order ID: ${orderId}`);
  } catch (error: any) {
    logger.error(`Failed to produce ORDER_CREATED event: ${error.message}`);
    throw error;
  }
};

const paymentResponses: {
  [orderId: string]: (data: {
    paymentLink: string;
    razorpayKey: string;
  }) => void;
} = {};

export const waitForPaymentLink = (
  orderId: string
): Promise<{ paymentLink: string; razorpayKey: string }> => {
  return new Promise<{ paymentLink: string; razorpayKey: string }>(
    (resolve, reject) => {
      paymentResponses[orderId] = resolve;

      setTimeout(() => {
        if (paymentResponses[orderId]) {
          delete paymentResponses[orderId];
          reject(
            new Error("Payment link not received within the expected time.")
          );
        }
      }, 30000);
    }
  );
};

export const handlePaymentLink = (response: any) => {
  console.log("Processing PAYMENT_INITIATED message:", response);
  try {
    const parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;

    const { orderId, paymentLink, razorpayKey } = parsedResponse;

    if (paymentResponses[orderId]) {
      paymentResponses[orderId]({ paymentLink, razorpayKey });
      delete paymentResponses[orderId];
      logger.info(
        `Payment link and razorpayKey received for order ID: ${orderId}`
      );
    } else {
      logger.warn(`No matching handler found for order ID: ${orderId}`);
    }
  } catch (error) {
    logger.error("Error processing PAYMENT_INITIATED message:", error);
  }
};

export const handlePaymentStatus = async (response: any) => {
  console.log("Processing ORDER_PAYMENT_STATUS_UPDATED message:", response);
  try {
    const eventData = JSON.parse(response.toString() || "{}");
    const { orderId, paymentStatus } = eventData;
    const tracer = trace.getTracer("order-service");
    const span: Span = tracer.startSpan("orderPaymentVerification");

    if (paymentStatus === "CAPTURED") {
      const orderDetails = await OrderService.getOrderById(orderId);
      if (!orderDetails) {
        throw new Error(`Order not found: ${orderId}`);
      }
      await OrderService.updateOrderPaymentStatus(
        orderId,
        3,
        new Date()
      );
      deleteCart(orderDetails?.userId);
      const merchantDetails: any = await getMerchantDetailsById(
        orderDetails.merchantId,
        span
      );
      const merchant = merchantDetails?.merchantData;
      if (!merchant) {
        throw new Error(
          `Merchant not found for ID: ${orderDetails.merchantId}`
        );
      }

      // const pickupDetails: PickupDetails = {
      //   name: merchant?.name || "N/A",
      //   contact_number: merchant?.mobile || "N/A",
      //   address: `${merchant?.area || ""}, ${merchant?.landmark || ""}, ${
      //     merchant?.city || ""
      //   }, ${merchant?.state || ""}, ${merchant?.country || ""}, ${
      //     merchant?.pincode || ""
      //   }`.trim(),
      //   city: merchant?.city || "N/A",
      //   latitude: merchant?.location?.coordinates?.[1] || 0,
      //   longitude: merchant?.location?.coordinates?.[0] || 0,
      // };

      // const customerAddressDetails = await getAddressDetailsById(
      //   orderDetails?.addressId,
      //   span
      // );
      // const addressData = customerAddressDetails?.addressData;
      // if (!addressData) {
      //   throw new Error(
      //     `Customer address not found: ${orderDetails?.addressId}`
      //   );
      // }

      // const dropDetails: DropDetails = {
      //   name: addressData?.fullName || "N/A",
      //   contact_number: addressData?.mobile || "N/A",
      //   address: `${addressData?.add1 || ""}, ${addressData?.city || ""}, ${
      //     addressData?.state || ""
      //   }, ${addressData?.country || ""}, ${addressData?.zipcode || ""}`.trim(),
      //   city: addressData?.city || "N/A",
      //   latitude: addressData?.lat || 0,
      //   longitude: addressData?.lng || 0,
      // };

      // if (
      //   !pickupDetails.name ||
      //   !pickupDetails.contact_number ||
      //   !pickupDetails.address ||
      //   !pickupDetails.city ||
      //   !dropDetails.name ||
      //   !dropDetails.contact_number ||
      //   !dropDetails.address ||
      //   !dropDetails.city
      // ) {
      //   throw new Error(`Missing required fields in order or address details.`);
      // }

      // const trackingDetails = await createTask(
      //   {
      //     ...orderDetails,
      //     vendor_order_id: orderDetails.orderId || "N/A",
      //     order_total: orderDetails.totalAmount || 0,
      //     order_source: "APP",
      //   },
      //   pickupDetails,
      //   dropDetails,
      //   orderDetails?.orderItems,
      //   span
      // );

      const deviceId: any = await getDeviceIdByStoreId(
        orderDetails.merchantId,
        span
      );
      const sendNotificationStatus = await sendOrderNotification(
        "New Order Recived!",
        `You've got a fresh order!  Order #${orderId} is ready for action!`,
        "",
        deviceId.deviceId,
        span
      );
      console.log(sendNotificationStatus,"sendNotificationStatussendNotificationStatus")

      if (
        orderDetails?.deliveryType === "66c9909073f5fa2901f020fe" ||
        orderDetails?.deliveryType === "CLOSETOBUY DELIVERY"
      ) {
      }
    } else {
      await OrderService.deleteOrder(orderId);
      logger.warn(
        `Payment failed for order ${orderId}. Order has been deleted.`
      );
    }
  } catch (error) {
    logger.error(
      "Error processing ORDER_PAYMENT_STATUS_UPDATED message:",
      error
    );
  }
};
