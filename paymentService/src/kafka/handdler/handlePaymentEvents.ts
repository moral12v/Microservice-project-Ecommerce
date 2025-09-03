import { KafkaMessage } from "kafkajs";
import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";
import PaymentService from "../../services/paymentService";
import logger from "../../utils/logger";
import { consumer } from "../consumer";

class PaymentEventHandler {
  static async handleEvents() {
    try {
      await consumer.run({
        eachMessage: async ({
          topic,
          message,
        }: {
          topic: string;
          message: KafkaMessage;
        }) => {
          if (topic === KAFKA_TOPICS.ORDER_CREATED) {
            const eventData = JSON.parse(message.value?.toString() || "{}");
            const { orderId, amount, customerEmail, merchantId } = eventData;
            console.log(
              orderId,
              amount,
              customerEmail,
              merchantId,
              "orderId, amount, customerEmail , merchantIdorderId, amount, customerEmail , merchantId"
            );
            try {
              const { paymentOrderId, paymentLink, razorpayKey } =
                await PaymentService.initiatePayment(
                  Math.ceil(Number(amount)),
                  customerEmail,
                  Number(orderId),
                  merchantId
                );
              await producer.send({
                topic: KAFKA_TOPICS.PAYMENT_INITIATED,
                messages: [
                  {
                    value: JSON.stringify({
                      orderId,
                      paymentOrderId,
                      paymentLink,
                      razorpayKey,
                    }),
                  },
                ],
              });
              logger.info(
                `Payment initiated for order ${orderId}. Payment Link: ${paymentLink}`
              );
            } catch (error: any) {
              logger.error(
                `Payment initiation failed for orderId: ${orderId}, error: ${error.message}`
              );
              await producer.send({
                topic: KAFKA_TOPICS.PAYMENT_FAILED,
                messages: [
                  { value: JSON.stringify({ orderId, error: error.message }) },
                ],
              });
            }
          } else {
            logger.warn(`Unhandled topic: ${topic}`);
          }
        },
      });
      console.log("Payment Kafka consumer is now running.");
    } catch (error) {
      console.error("Failed to start Payment Kafka consumer:", error);
    }
  }
}

export default PaymentEventHandler;
