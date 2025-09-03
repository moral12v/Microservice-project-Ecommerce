import { ConnectionStates } from "mongoose";
import { getMerchantsProductsBymerchantId } from "../../services/merchantProductService";
import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

export const handleProductDetailsRequest = async (messageValue: string) => {
  try {
    const request = JSON.parse(messageValue);
    const { merchantId, categoryId, customerId } = request;
    console.log(
      `Processing request for merchantId: ${merchantId} and categoryId :${categoryId} , customerId:${customerId}`
    );
    if (!merchantId) {
      console.warn("Received request with missing merchantId");
      return;
    }
    try {
      const productDetails = await getMerchantsProductsBymerchantId(
        merchantId,
        categoryId,
        customerId
      );
      if (productDetails) {
        await producer.send({
          topic: KAFKA_TOPICS.PRODUCT_DETAILS_RESPONSE,
          messages: [
            {
              value: JSON.stringify({
                merchantId,
                success: true,
                data: productDetails,
              }),
            },
          ],
        });
        console.log(`Product details sent for ID: ${merchantId}`);
      } else {
        console.warn(`No Product found for ID: ${merchantId}`);
      }
    } catch (error: any) {
      console.error(`Failed to fetch Product details: ${error.message}`);
    }
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};
