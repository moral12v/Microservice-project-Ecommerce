import kafka from "../config/kafkaConfig";
import { Partitioners, Producer } from "kafkajs";

export const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export const initProducer = async () => {
  try {
    console.log("Connecting Kafka producer...");
    await producer.connect();
    console.log("Kafka producer connected successfully.");
  } catch (error) {
    console.error("Failed to connect Kafka producer:", error);
    throw error;
  }
};

export const sendMessage = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to ${topic}`);
  } catch (error) {
    console.error(`Failed to send message to ${topic}:`, error);
    throw error;
  }
};
