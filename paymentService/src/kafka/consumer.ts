import kafka from "../config/kafkaConfig";
import { KAFKA_TOPICS } from "./topics";
import PaymentEventHandler from "./handdler/handlePaymentEvents";

const consumer = kafka.consumer({ groupId: "payment-group" });

export const initConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Kafka consumer connected successfully.");
    await consumer.subscribe({ topic: KAFKA_TOPICS.ORDER_CREATED, fromBeginning: true });
    console.log("Subscribed to ORDER_CREATED topic.");
    await PaymentEventHandler.handleEvents();
  } catch (error) {
    console.error("Failed to initialize Kafka consumer:", error);
  }
};

export { consumer };
