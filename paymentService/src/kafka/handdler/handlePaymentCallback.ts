import { KafkaMessage } from "kafkajs";
import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";
import logger from "../../utils/logger";

class PaymentCallbackHandler {
  static async handleCallbacks(orderId:number,paymentStatus:string,transactionId:string ) {
            try {
              await producer.send({
                topic: KAFKA_TOPICS.ORDER_PAYMENT_STATUS_UPDATED,
                messages: [
                  {
                    value: JSON.stringify({
                      orderId,
                      paymentStatus,
                      transactionId
                    }),
                  },
                ],
              });
            } catch (error: any) {
              logger.error(
                `Failed to update payment status for orderId: ${orderId}, error: ${error.message}`
              );
            }
        }     
}

export default PaymentCallbackHandler;
