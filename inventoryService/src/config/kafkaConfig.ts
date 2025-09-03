import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-service-client',
  brokers: ["localhost:9092"],
});

export default kafka;
