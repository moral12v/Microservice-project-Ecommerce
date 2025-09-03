import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const merchantResponses: any = {};

export const getMerchantDetails = async (merchantId: string) => {
  return new Promise((resolve, reject) => {
    if (merchantResponses[merchantId]) {
      console.warn(`Request already sent for merchantId: ${merchantId}`);
      return;
    }

    merchantResponses[merchantId] = resolve;
    console.log("Sending request for merchantId_order:", merchantId);

    producer
      .send({
        topic: KAFKA_TOPICS.MERCHANT_REQUEST_ORDER,
        messages: [{ value: JSON.stringify({ merchantId }) }],
      })
      .then(() => {
        console.log("Message sent successfully for merchant details for order");
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
    console.warn("MerchantId is missing in response:");
    return;
  }
  if (merchantResponses[merchantId]) {
    merchantResponses[merchantId](data);
    delete merchantResponses[merchantId];
  }
};
