import axios from "axios";

import { ShippingProvider } from "./shippingProvider";
import {
  FLASH_ACCESS_TOKEN,
  FLASH_BASE_URL,
  FLASH_CANCEL_ORDER,
  FLASH_CREATE_ORDER,
  FLASH_GET_SERVICIBILITY,
  FLASH_PARENT_ID,
  FLASH_STORE_ID,
  FLASH_TRACK_ORDER,
} from "../config";

export class UnengageShippingProvider implements ShippingProvider {
  async getServicability(pickupDetails: any, dropDetails: any): Promise<any> {
    const response = await axios({
      method: "GET",
      url: `${FLASH_BASE_URL}${FLASH_GET_SERVICIBILITY}`,
      headers: {
        "Content-Type": "application/json",
        "access-token": FLASH_ACCESS_TOKEN,
        parentId: FLASH_PARENT_ID,
      },
      data: {
        store_id: FLASH_STORE_ID,
        parentId: FLASH_PARENT_ID,
        pickupDetails,
        dropDetails,
      },
    });
    return response.data;
  }

 async placeOrder(orderDetails: any, pickupDetails: any, dropDetails: any, orderItems: any): Promise<any> {
    try {
      const response = await axios({
        method: "POST",
        url: `${FLASH_BASE_URL}${FLASH_CREATE_ORDER}`,
        headers: {
          "Content-Type": "application/json",
          "access-token": FLASH_ACCESS_TOKEN,
          parentId: FLASH_PARENT_ID,
        },
        data: {
          storeId: FLASH_STORE_ID,
          order_details: { ...orderDetails, paid: "true" },
          pickup_details: pickupDetails,
          drop_details: dropDetails,
          order_items: orderItems,
   
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error placing order:`);
    }
  }

  async cancelOrder(taskId: string): Promise<any> {
    try {
      const response = await axios({
        method: "POST",
        url: `${FLASH_BASE_URL}${FLASH_CANCEL_ORDER}`,
        headers: {
          "Content-Type": "application/json",
          "access-token": FLASH_ACCESS_TOKEN,
          parentId: FLASH_PARENT_ID,
        },
        data: {
          storeId: FLASH_STORE_ID,
          taskId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error cancelling order:`);
    }
  }

  async trackOrder(taskId: string): Promise<any> {
    try {
      const response = await axios({
        method: "POST",
        url: `${FLASH_BASE_URL}${FLASH_TRACK_ORDER}`,
        headers: {
          "Content-Type": "application/json",
          "access-token": FLASH_ACCESS_TOKEN,
          parentId: FLASH_PARENT_ID,
        },
        data: {
          storeId: FLASH_STORE_ID,
          taskId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error tracking order:`);
    }
  }

  async updateOrderStatusWebhook(payload: any): Promise<any> {
    try {
      const { status, data: { taskId }, status_code } = payload;

      if (status && status_code === 'DELIVERED') {
        console.log("Order delivered, updating status...");
      }
      
      return { status: true, message: "Webhook Processed" };
    } catch (error) {
      throw new Error(`Error processing webhook: `);
    }
  }
}

