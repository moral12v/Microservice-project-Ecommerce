import { producer } from "../storeProducer";
import { KAFKA_TOPICS } from "../topics";

const productResponses: any = {};

export const getProductDetailsByMerchantId = async (
  merchantId: string,
  categoryId: string,
  customerId:string
) => {
  return new Promise((resolve, reject) => {
    productResponses[merchantId] = resolve;
    producer
      .send({
        topic: KAFKA_TOPICS.PRODUCT_DETAILS_REQUEST,
        messages: [{ value: JSON.stringify({ merchantId, categoryId, customerId }) }],
      })
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleProductDetailsResponse = (response: any) => {
  const { merchantId, data } = response;
  if (productResponses[merchantId]) {
    productResponses[merchantId](data);
    delete productResponses[merchantId];
  }
};
