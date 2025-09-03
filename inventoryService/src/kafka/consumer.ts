import kafka from "../config/kafkaConfig";
import { KAFKA_TOPICS } from "./topics";
import { KafkaMessage } from "kafkajs";
import { handleMerchantResponse } from "./handdlers/getMerchantDetails";
import { handleProductDetailsRequest } from "./handdlers/productDetailsHanddler";
import { handleCustomerAuthResponse } from "./handdlers/customerAuth";
import { handleVendorAuthResponse } from "./handdlers/vendorAuth";
import { handleCartDetailsRequest } from "./handdlers/cartDetails";
import { handleDeleteCartRequest } from "./handdlers/deleteCart";
import { handleMerchantAuthResponse } from "./handdlers/merchantAuth";

const consumer = kafka.consumer({ groupId: "inventory-group" });

export const initConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: KAFKA_TOPICS.MERCHANT_RESPONSE,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.PRODUCT_DETAILS_REQUEST,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_02,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.CART_REQUEST,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.CART_DELETE_REQUEST,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.MERCHANT_AUTH_RESPONSE,
      fromBeginning: true,
    });
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
        message,
      }: {
        topic: string;
        message: KafkaMessage;
      }) => {
        if (message.value) {
          const messageValue = message.value.toString();
          try {
            switch (topic) {
              case KAFKA_TOPICS.MERCHANT_RESPONSE:
                console.log("Processing MERCHANT_RESPONSE message");
                await handleMerchantResponse(messageValue);
                break;
              case KAFKA_TOPICS.PRODUCT_DETAILS_REQUEST:
                console.log("Processing PRODUCT_DETAILS_REQUEST message");
                await handleProductDetailsRequest(messageValue);
                break;
              case KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE:
                console.log("Processing CUSTOMER_AUTH_RESPONSE message");
                await handleCustomerAuthResponse(messageValue);
                break;
              case KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_02:
                console.log("Processing VENDOR_AUTH_RESPONSE_02 message");
                await handleVendorAuthResponse(messageValue);
                break;
              case KAFKA_TOPICS.CART_REQUEST:
                console.log("Processing CART_REQUEST message");
                await handleCartDetailsRequest(messageValue);
                break;
              case KAFKA_TOPICS.CART_DELETE_REQUEST:
                console.log("Processing CART_DELETE_REQUEST message");
                await handleDeleteCartRequest(messageValue);
                break;
              case KAFKA_TOPICS.MERCHANT_AUTH_RESPONSE:
                await handleMerchantAuthResponse(messageValue);
                break;
              default:
                console.warn(`Unhandled topic: ${topic}`);
            }
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
