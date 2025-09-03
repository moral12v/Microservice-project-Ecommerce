import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const deleteCartResponses: any = {};

export const deleteCart = async (customerId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    deleteCartResponses[customerId] = resolve;
    producer
      .send({
        topic: KAFKA_TOPICS.CART_DELETE_REQUEST,
        messages: [{ value: JSON.stringify({ customerId }) }],
      })
      .then(() => {
        console.log("Delete cart request sent successfully");
      })
      .catch((error) => {
        console.error("Failed to send delete cart request:", error);
        reject(error);
      });
  });
};

export const handleDeleteCartResponse = (response: any) => {
  const parsedResponse =
    typeof response === "string" ? JSON.parse(response) : response;
  const customerId = parsedResponse.customerId;
  if (!customerId) {
    console.warn("customerId is missing in delete cart response");
    return;
  }
  if (deleteCartResponses[customerId]) {
    deleteCartResponses[customerId]();
    delete deleteCartResponses[customerId];
  }
};
