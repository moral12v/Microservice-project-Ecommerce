import kafka from './kafkaClient';
import logger from '../utils/logger';
import { sendOtpSMS } from "../services/otpServices";

const consumer = kafka.consumer({ groupId: 'notification-service' });

export const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-registration', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value?.toString() || '{}');
      logger.info(`Received event from ${topic}: ${JSON.stringify(event)}`);

      const  { number, username , otp, purpose} = event;

      try {
        await sendOtpSMS(number, username , otp, purpose);
        logger.info(`Sent SMS to ${number} for user ${username}`);
      } catch (error:any) {
        logger.error(`Failed to send SMS: ${error.message}`);
      }
    },
  });
};
