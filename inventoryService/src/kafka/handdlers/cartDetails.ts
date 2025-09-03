import { cartService } from "../../services/cartService";
import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

export const handleCartDetailsRequest = async (messageValue: string) => {
  try {
    const request = JSON.parse(messageValue);
    const { cartId } = request;
    console.log(`Processing request for cartId: ${cartId}`);
    if (!cartId) {
      console.warn("Received request with missing cartId");
      return;
    }
    try {
      const cartDetails = await cartService.getCartId(cartId);
      if (cartDetails) {
        await producer.send({
          topic: KAFKA_TOPICS.CART_RESPONE,
          messages: [
            {
              value: JSON.stringify({
                cartId,
                success: true,
                data: cartDetails,
              }),
            },
          ],
        });
        console.log(`Cart details sent for cartId: ${cartId}`);
      } else {
        console.warn(`No Cart found for cartId: ${cartId}`);
      }
    } catch (error: any) {
      console.error(`Failed to fetch Cart details: ${error.message}`);
    }
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};
