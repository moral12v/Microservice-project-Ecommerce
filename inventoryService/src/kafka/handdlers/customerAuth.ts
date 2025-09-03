import { producer } from "../producer";
import { KAFKA_TOPICS } from "../topics";

const customerResponses: Record<string, (data: any) => void> = {};

export const handleCustomerAuth = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    customerResponses[token] = resolve;
    console.log("Storing customer response handler for token:", token);
    producer
      .send({
        topic: KAFKA_TOPICS.CUSTOMER_AUTH_REQUEST,
        messages: [{ value: JSON.stringify({ token }) }],
      })
      .then(() => {
        console.log("Message sent successfully for customer Auth");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleCustomerAuthResponse = (response: any) => {
  console.log("Processing CUSTOMER_AUTH_RESPONSE message:", response);
  try {
    const parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;
    const data =
      typeof parsedResponse.data === "string"
        ? JSON.parse(parsedResponse.data)
        : parsedResponse.data;
    const { token, isValid, customerData } = data;
    if (customerResponses[token]) {
      customerResponses[token]({ isValid, customerData });
      delete customerResponses[token];
    } else {
      console.log("No matching handler found for token:", token);
    }
  } catch (error) {
    console.error("Error processing CUSTOMER_AUTH_RESPONSE message:", error);
  }
};
