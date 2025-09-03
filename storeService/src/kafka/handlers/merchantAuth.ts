import { producer } from "../storeProducer";
import { KAFKA_TOPICS } from "../topics";

const merchantResponses: Record<string, (data: any) => void> = {};

export const handleMerchantAuth = async (token: string): Promise<any> => {
 
};

export const handleMerchantAuthResponse = (response: any) => {
  console.log("Processing CUSTOMER_AUTH_RESPONSE_01 message:", response);
  try {
    const parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;
    const data =
      typeof parsedResponse.data === "string"
        ? JSON.parse(parsedResponse.data)
        : parsedResponse.data;
    const { token, isValid, customerData } = data;
    if (merchantResponses[token]) {
        merchantResponses[token]({ isValid, customerData });
      delete merchantResponses[token];
    } else {
      console.log("No matching handler found for token:", token);
    }
  } catch (error) {
    console.error("Error processing CUSTOMER_AUTH_RESPONSE_01 message:", error);
  }
};
