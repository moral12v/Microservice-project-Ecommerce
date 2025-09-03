import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const merchantResponses: any = {};

export const getMerchantDetails = async (merchantId: string) => {
  return new Promise((resolve, reject) => {
    merchantResponses[merchantId] = resolve;
    console.log("Sending request for merchantId:", merchantId);
    producer
      .send({
        topic: KAFKA_TOPICS.MERCHANT_REQUEST,
        messages: [{ value: JSON.stringify({ merchantId }) }],
      })
      .then(() => {
        console.log("Message sent successfully for merchant details");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleMerchantResponse = (response: any) => {
  const parsedResponse =
    typeof response === "string" ? JSON.parse(response) : response;
  const merchantId = parsedResponse.merchantId || parsedResponse.data?._id;
  const data = parsedResponse.data;

  if (!merchantId) {
    console.warn("merchantId is missing in response:");
    return;
  }
  if (merchantResponses[merchantId]) {
    merchantResponses[merchantId](data);
    delete merchantResponses[merchantId];
  }
};
