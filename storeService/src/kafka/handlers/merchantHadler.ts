import { authValues } from "../../utils/authValues";
import { verifyToken } from "../../services/jwtService";
import { getStoreById } from "../../services/storeService";
import { producer } from "../storeProducer";
import { KAFKA_TOPICS } from "../topics";

export const handleMerchantRequest = async (messageValue: string) => {
  try {
    const request = JSON.parse(messageValue);
    const { merchantId } = request;
    console.log(`Processing request for merchantId: ${merchantId}`);

    if (!merchantId) {
      console.warn("Received request with missing merchantId");
      return;
    }

    try {
      const merchantDetails = await getStoreById(merchantId);
      if (merchantDetails) {
        await producer.send({
          topic: KAFKA_TOPICS.MERCHANT_RESPONSE,
          messages: [
            {
              value: JSON.stringify({
                success: true,
                data: merchantDetails,
              }),
            },
          ],
        });
        console.log(`Merchant details sent for ID: ${merchantId}`);
      } else {
        console.warn(`No merchant found for ID: ${merchantId}`);
      }
    } catch (error: any) {
      console.error(`Failed to fetch merchant details: ${error.message}`);
    }
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};

export const handleMerchantRequestV2 = async (messageValue: string) => {
  try {

    const parsedResponse =
    typeof messageValue === "string"
      ? JSON.parse(messageValue)
      : messageValue;
      const { merchantId } = parsedResponse;
    console.log(merchantId, "merchantId_request");
    //   if (!merchantId) {
    //     console.warn("Received request with missing merchantId");
    //     return;
    //   }
    //   try {
    //     const merchantDetails = await getStoreById(merchantId);
    //     if (merchantDetails) {
    //       await producer.send({
    //         topic: KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER,
    //         messages: [
    //           {
    //             value: JSON.stringify({
    //               success: true,
    //               data: merchantDetails,
    //             }),
    //           },
    //         ],
    //       });
    //       console.log(`Merchant details sent for ID: ${merchantId}`);
    //     } else {
    //       console.warn(`No merchant found for ID: ${merchantId}`);
    //     }
    //   } catch (error: any) {
    //     console.error(`Failed to fetch merchant details: ${error.message}`);
    //   }
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};

export const handleMerchantRequestV3 = async (messageValue: any) => {
  try {
    const parsedResponse =
      typeof messageValue === "string"
        ? JSON.parse(messageValue)
        : messageValue;
    const token = parsedResponse?.token;
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return {
        status: false,
        msg: "Invalid Token",
      };
    }
    const decoded = await authValues(verifiedToken);
    if (!decoded) {
      return {
        status: false,
        msg: "Token decoding failed",
      };
    }
    const isValid = true;
    const VendorData = decoded;

    await producer.send({
      topic: KAFKA_TOPICS.MERCHANT_AUTH_RESPONSE_CHAT,
      messages: [
        {
          value: JSON.stringify({
            success: true,
            data: {
              token,
              isValid,
              VendorData,
            },
          }),
        },
      ],
    });
    console.log(`Merchant details sent for Token: ${token}`);
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};



export const handleMerchantRequestV4 = async (messageValue: any) => {
  try {
    const parsedResponse =
      typeof messageValue === "string"
        ? JSON.parse(messageValue)
        : messageValue;
    const token = parsedResponse?.token;
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return {
        status: false,
        msg: "Invalid Token",
      };
    }
    const decoded = await authValues(verifiedToken);
    if (!decoded) {
      return {
        status: false,
        msg: "Token decoding failed",
      };
    }
    const isValid = true;
    const VendorData = decoded;

    await producer.send({
      topic: KAFKA_TOPICS.MERCHANT_AUTH_RESPONSE,
      messages: [
        {
          value: JSON.stringify({
            success: true,
            data: {
              token,
              isValid,
              VendorData,
            },
          }),
        },
      ],
    });
    console.log(`Merchant details sent for Token: ${token}`);
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};


export const handleMerchantRequestV5 = async (messageValue: any) => {
  try {
    const parsedResponse =
      typeof messageValue === "string"
        ? JSON.parse(messageValue)
        : messageValue;
    const token = parsedResponse?.token;
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return {
        status: false,
        msg: "Invalid Token",
      };
    }
    const decoded = await authValues(verifiedToken);
    if (!decoded) {
      return {
        status: false,
        msg: "Token decoding failed",
      };
    }
    const isValid = true;
    const VendorData = decoded;

    await producer.send({
      topic: KAFKA_TOPICS.MERCHANT_RESPONSE_ORDER_02,
      messages: [
        {
          value: JSON.stringify({
            success: true,
            data: {
              token,
              isValid,
              VendorData,
            },
          }),
        },
      ],
    });
    console.log(`Merchant details sent for Token: ${token}`);
  } catch (error: any) {
    console.error(`Error parsing message: ${error.message}`);
  }
};