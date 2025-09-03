import kafka from "../config/kafkaConfig";
import { handleCartResponse } from "./handdlers/cartDetails";
import { handleCustomerAuthResponse } from "./handdlers/customerAuth";
import { handleDeleteCartResponse } from "./handdlers/deleteCart";
import { getMerchantDetails } from "./handdlers/getMerchantDetails";
import OrderEventHandler from "./handdlers/handleOrderEvents";
import {
  handlePaymentLink,
  handlePaymentStatus,
} from "./handdlers/handlePayment";
import { handleMerchantAuthResponse } from "./handdlers/merchantAuth";
import { handleVendorAuthResponse } from "./handdlers/vendorAuth";
import { KAFKA_TOPICS } from "./topics";
import { KafkaMessage } from "kafkajs";

const consumer = kafka.consumer({ groupId: "order-group" });

export const initConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE_ORDER,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.PAYMENT_INITIATED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.PAYMENT_FAILED,
      fromBeginning: true,
    });
    await consumer.subscribe({ topic: KAFKA_TOPICS.PAYMENT_INITIATED });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.CART_RESPONE,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_PAYMENT_STATUS_UPDATED,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER_02,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_03,
    });
    await consumer.subscribe({ topic: KAFKA_TOPICS.CART_DELETE_RESPONSE });
    console.log("Kafka consumer initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Kafka consumer:", error);
  }
};

export const startConsumer = async () => {
  try {
    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: {
        topic: string;
        partition: number;
        message: KafkaMessage;
      }) => {
        if (message.value) {
          const messageValue = message.value.toString();
          try {
            switch (topic) {
              case KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE_ORDER:
                console.log("Processing CUSTOMER_AUTH_RESPONSE_ORDER message");
                await handleCustomerAuthResponse(messageValue);
                break;
              case KAFKA_TOPICS.PAYMENT_INITIATED:
                await handlePaymentLink(messageValue);
                // await OrderEventHandler.handlePaymentEvents();
                break;
              case KAFKA_TOPICS.CART_RESPONE:
                await handleCartResponse(messageValue);
                break;
              case KAFKA_TOPICS.ORDER_PAYMENT_STATUS_UPDATED:
                await handlePaymentStatus(messageValue);
                break;
              case KAFKA_TOPICS.CART_DELETE_RESPONSE:
                await handleDeleteCartResponse(messageValue);
                break;
              case KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER:
                await getMerchantDetails(messageValue);
                break;
              case KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER_02:
                await handleMerchantAuthResponse(messageValue);
                break;
                case KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_03:
                  await handleVendorAuthResponse(messageValue);
                  break;
              default:
                console.warn(`Unhandled topic: ${topic}`);
            }
            await consumer.commitOffsets([
              {
                topic: topic,
                partition: partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);

            console.log(
              `Offset committed for topic: ${topic}, partition: ${partition}, offset: ${message.offset}`
            );
          } catch (error) {
            console.error(
              `Error processing message from topic ${topic}:`,
              error
            );
          }
        }
      },
    });
    console.log("Kafka consumer is now running.");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
  }
};

export { consumer };
