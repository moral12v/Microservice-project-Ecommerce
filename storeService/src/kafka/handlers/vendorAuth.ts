import { producer } from "../storeProducer";
import { KAFKA_TOPICS } from "../topics";

const vendorResponses: Record<string, (data: any) => void> = {};

export const handleVendorAuth = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    vendorResponses[token] = resolve;
    console.log("Storing Vendor response handler for token:", token);
    producer
      .send({
        topic: KAFKA_TOPICS.VENDOR_AUTH_REQUEST_01,
        messages: [{ value: JSON.stringify({ token }) }],
      })
      .then(() => {
        console.log("Message sent successfully for Vendor Auth");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        reject(error);
      });
  });
};

export const handleVendorAuthResponse = (response: any) => {
  console.log("Processing VENDOR_AUTH_RESPONSE_01 message:", response);

  try {
    const parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;
    const data =
      typeof parsedResponse.data === "string"
        ? JSON.parse(parsedResponse.data)
        : parsedResponse.data;
    const { token, isValid, vendorData } = data;
    if (vendorResponses[token]) {
      vendorResponses[token]({ isValid, vendorData });
      delete vendorResponses[token];
    } else {
      console.log("No matching handler found for token:", token);
    }
  } catch (error) {
    console.error("Error processing VENDOR_AUTH_RESPONSE_01 message:", error);
  }
};
