import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'store-service-client',
  brokers: ["localhost:9092"],
});

export default kafka;
