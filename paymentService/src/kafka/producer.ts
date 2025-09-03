import kafka from '../config/kafkaConfig';

export const producer = kafka.producer();

export const initProducer = async () => {
  await producer.connect();
};
