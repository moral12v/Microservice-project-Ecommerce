import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service-client',
  brokers: ["localhost:9092"],
});

export default kafka;
