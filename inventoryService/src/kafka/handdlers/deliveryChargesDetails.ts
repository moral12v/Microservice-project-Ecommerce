import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const sellerDeliveryChargesResponses: any = {};

export const getSellerDeliveryChargesDetails = async (
  merchantId: string,
  km: any
) => {
  return new Promise((resolve, reject) => {
    sellerDeliveryChargesResponses[merchantId] = resolve;
    producer
      .send({
        topic: KAFKA_TOPICS.SELLER_DELIVERY_CHARGE_REQUEST,
        messages: [{ value: JSON.stringify({ merchantId, km }) }],
      })
      .then(() => {
        console.log("Message sent successfully for Delivery Changes");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleSellerDeliveryChargesResponse = (response: any) => {
  const parsedResponse =
    typeof response === "string" ? JSON.parse(response) : response;
  const merchantId = parsedResponse.merchantId || parsedResponse.data?._id;
  const data = parsedResponse.data;

  if (!merchantId) {
    console.warn("merchantId is missing in response:");
    return;
  }
  if (sellerDeliveryChargesResponses[merchantId]) {
    sellerDeliveryChargesResponses[merchantId](data);
    delete sellerDeliveryChargesResponses[merchantId];
  }
};
