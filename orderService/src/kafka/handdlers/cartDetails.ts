import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const cartResponses: any = {};

export const getCartDetails = async (cartId: string) => {
  return new Promise((resolve, reject) => {
    cartResponses[cartId] = resolve;
    producer
      .send({
        topic: KAFKA_TOPICS.CART_REQUEST,
        messages: [{ value: JSON.stringify({ cartId }) }],
      })
      .then(() => {
        console.log("Message sent successfully for cart details");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleCartResponse = (response: any) => {
  const parsedResponse =
    typeof response === "string" ? JSON.parse(response) : response;
  const cartId = parsedResponse.cartId || parsedResponse.data?._id;
  const data = parsedResponse.data;

  if (!cartId) {
    console.warn("CartId is missing in response:");
    return;
  }
  if (cartResponses[cartId]) {
    cartResponses[cartId](data);
    delete cartResponses[cartId];
  }
};
