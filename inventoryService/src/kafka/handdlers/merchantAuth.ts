import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const merchantResponse: Record<string, (data: any) => void> = {};

export const handleMerchantAuth = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    merchantResponse[token] = resolve;
    producer
      .send({
        topic: KAFKA_TOPICS.MERCHANT_AUTH_REQUEST,
        messages: [{ value: JSON.stringify({ token }) }],
      })
      .then(() => {
        console.log("Message sent successfully for Merchant Auth");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleMerchantAuthResponse = (response: any) => {
  try {
    const parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;
    const data = parsedResponse.data;
    const { token, isValid, VendorData } = data;
    if (merchantResponse[token]) {
      merchantResponse[token]({ isValid, VendorData });
      delete merchantResponse[token];
    } else {
      console.log("No matching handler found for token:", token);
    }
  } catch (error) {
    console.error("Error processing VENDOR_AUTH_RESPONSE_02 message:", error);
  }
};
