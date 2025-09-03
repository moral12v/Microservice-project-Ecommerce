import { cartService } from "../../services/cartService";
import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

export const handleDeleteCartRequest = async (messageValue: string) => {
  try {
    const request = JSON.parse(messageValue);
    const { customerId } = request;
    console.log(`Processing request for deleting cart for userId: ${customerId}`);
    
    if (!customerId) {
      console.warn("Received request with missing userId");
      return;
    }

    try {
      const result = await cartService.deleteCartByUserId(customerId);

      if (result) {
        await producer.send({
          topic: KAFKA_TOPICS.CART_RESPONE,
          messages: [
            {
              value: JSON.stringify({
                customerId,
                success: true,
                message: `Cart deleted successfully for userId: ${customerId}`,
              }),
            },
          ],
        });
        console.log(`Cart deletion response sent for userId: ${customerId}`);
      } else {
        console.warn(`No Cart found to delete for userId: ${customerId}`);
      }
    } catch (error: any) {
      console.error(`Failed to delete Cart: ${error.message}`);
      await producer.send({
        topic: KAFKA_TOPICS.CART_RESPONE,
        messages: [
          {
            value: JSON.stringify({
                customerId,
              success: false,
              message: `Failed to delete cart for customerId: ${customerId}`,
            }),
          },
        ],
      });
    }
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};
