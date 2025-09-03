import OrderService from "../../services/orderService";
import logger from "../../utils/logger";
import { consumer } from "../consumer";
import { KAFKA_TOPICS } from "../topics";

class OrderEventHandler {
  static async handlePaymentEvents() {
 

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const eventData = JSON.parse(message.value?.toString() || "{}");
        switch (topic) {
          case KAFKA_TOPICS.PAYMENT_INITIATED:
            const { orderId, paymentOrderId, paymentLink } = eventData;
            await OrderService.updateOrderStatus(orderId, "WAITING FOR PAYMENTS");
            logger.info(`Order ${orderId} payment completed. Payment Link: ${paymentLink}`);
            break;
          case KAFKA_TOPICS.PAYMENT_FAILED:
            const { orderId: failedOrderId } = eventData;
            await OrderService.updateOrderStatus(failedOrderId, "WAITING FOR PAYMENTS");
            logger.error(`Order ${failedOrderId} payment failed.`);
            break;

          default:
            logger.warn(`Unhandled topic: ${topic}`);
        }
      },
    });
  }
}

export default OrderEventHandler;
