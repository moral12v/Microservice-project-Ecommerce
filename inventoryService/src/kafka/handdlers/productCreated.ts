import { producer } from "../producer"; 
import { KAFKA_TOPICS } from "../topics";

export const sendProductCreatedEvent = async (merchantId:any,subCategory: any): Promise<void> => {
  try {
    await producer.send({
      topic: KAFKA_TOPICS.PRODUCT_CREATED,
      messages: [
        {
          value: JSON.stringify({ merchantId,subCategory }),
        },
      ],
    });

    console.log(`Event sent for subCategoryId: ${subCategory?._id}`);
  } catch (error: any) {
    console.error(`Failed to send event for subCategoryId: ${error.message}`);
    throw new Error(`Kafka event failed: ${error.message}`);
  }
};
