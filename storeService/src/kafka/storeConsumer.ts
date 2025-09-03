import kafka from "../config/kafkaConfig";
import { KAFKA_TOPICS } from "./topics";
import { KafkaMessage } from "kafkajs";
import {
  handleMerchantRequest,
  handleMerchantRequestV2,
  handleMerchantRequestV3,
  handleMerchantRequestV4,
  handleMerchantRequestV5,
} from "./handlers/merchantHadler";
import {
  getProductDetailsByMerchantId,
  handleProductDetailsResponse,
} from "./handlers/productDetailsHanddler";
import { handleVendorAuthResponse } from "./handlers/vendorAuth";
import { handleCustomerAuthResponse } from "./handlers/customerAuth";
import { handleMerchantAuthResponse } from "./handlers/merchantAuth";
import { handleProductCreateEvent } from "./handlers/productEvents";

const consumer = kafka.consumer({
  groupId: "store-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

export const initConsumer = async () => {
  try {
    console.log("Connecting Kafka consumer...");
    await consumer.connect();
    console.log("Subscribing to topics...");

    const topics = [
      KAFKA_TOPICS.MERCHANT_REQUEST,
      KAFKA_TOPICS.PRODUCT_DETAILS_RESPONSE,
      KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_01,
      KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE_01,
      KAFKA_TOPICS.MERCHANT_REQUEST_ORDER,
      KAFKA_TOPICS.MERCHANT_AUTH_REQUEST_CHAT,
      KAFKA_TOPICS.MERCHANT_AUTH_REQUEST,
      KAFKA_TOPICS.MERCHANT_REQUEST_ORDER_02,
      KAFKA_TOPICS.PRODUCT_CREATED
    ];

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }

    console.log(
      "Kafka consumer initialized and subscribed to topics successfully."
    );
  } catch (error) {
    console.error("Failed to initialize Kafka consumer:", error);
  }
};

export const startConsumer = async () => {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(topic, "topic in store");
        if (!message.value) {
          console.warn("Received message with null or undefined value");
          return;
        }
        const messageValue = message.value.toString();
        console.log(messageValue, "messageValue");
        try {
          let parsedMessage;
          console.log(messageValue, "messageValuemessageValue");
          if (typeof messageValue === "string") {
            try {
              parsedMessage = JSON.parse(messageValue);
            } catch (error) {
              console.error(`Error parsing message: ${messageValue}`, error);
              return;
            }
          } else {
            console.warn("Message value is not a string:", message.value);
            return;
          }

          switch (topic) {
            case KAFKA_TOPICS.MERCHANT_REQUEST:
              console.log("Processing MERCHANT_REQUEST message");
              await handleMerchantRequest(messageValue);
              break;
            case KAFKA_TOPICS.PRODUCT_DETAILS_RESPONSE:
              console.log("Processing PRODUCT_DETAILS_RESPONSE message");
              await handleProductDetailsResponse(parsedMessage);
              break;
            case KAFKA_TOPICS.VENDOR_AUTH_RESPONSE_01:
              console.log("Processing VENDOR_AUTH_RESPONSE_01 message");
              await handleVendorAuthResponse(parsedMessage);
              break;
            case KAFKA_TOPICS.CUSTOMER_AUTH_RESPONSE_01:
              console.log("Processing CUSTOMER_AUTH_RESPONSE_01 message");
              handleCustomerAuthResponse(parsedMessage);
              break;
            case KAFKA_TOPICS.MERCHANT_REQUEST_ORDER:
              console.log("Processing MERCHANT_REQUEST_ORDER message");
              // await handleMerchantRequestV2(parsedMessage);
              break;
              case KAFKA_TOPICS.MERCHANT_AUTH_REQUEST_CHAT:
                console.log("Processing MERCHANT_AUTH_REQUEST_CHAT message");
                await handleMerchantRequestV3(messageValue);
                break;
                case KAFKA_TOPICS.MERCHANT_AUTH_REQUEST:
                await handleMerchantRequestV4(messageValue);
                break;
                case KAFKA_TOPICS.MERCHANT_REQUEST_ORDER_02:
                  await handleMerchantRequestV5(messageValue);
                  break;
                  case KAFKA_TOPICS.PRODUCT_CREATED:
                    await handleProductCreateEvent(messageValue);
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
        } catch (error: any) {
          console.error(`Error processing message: ${error.message}`);
        }
      },
    });
    console.log("Kafka consumer is now running.");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
  }
};
export { consumer };
