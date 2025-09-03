import { Kafka } from "kafkajs";
import { HOST, KAFKA_BROKER_PROT, KAFKA_CLIENT_ID } from "../config";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`${HOST}:${KAFKA_BROKER_PROT}`],
});

export default kafka;
