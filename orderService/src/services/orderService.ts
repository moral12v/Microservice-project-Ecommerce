import OrderRepository from "../repositories/orderRepository";
import { CreateOrderDTO, OrderItemDTO, PlaceOrderDTO } from "../dtos/orderDTO";
import logger from "../utils/logger";
import {produceOrderCreatedEvent,waitForPaymentLink,
} from "../kafka/handdlers/handlePayment";
import { getPriceDetails } from "../gRPC/controller/priceDetails";
import { Span, trace } from "@opentelemetry/api";
import { getMerchantDetailsById } from "../gRPC/controller/merchantDetails";
import { getCustomerDetailsById } from "../gRPC/controller/customerDetails";
import { getAddressDetailsById } from "../gRPC/controller/addressDetails";
import { getDeliveryDetailsById } from "../gRPC/controller/deliveryType";

class OrderService {
  private static orderRepository = new OrderRepository();

  static customerFilterConfig = [
    { value: "all", title: "All" },
    { value: "pending", title: "Pending" },
    { value: "completed", title: "Completed" },
    { value: "cancelled", title: "Cancelled" },
  ];


  static merchantFilterConfig = [
    { value: "all", title: "All" },
    { value: "unaccepted", title: "Unaccepted" }, 
    { value: "accepted", title: "Accepted" },    
    { value: "completed", title: "Completed" },   
    { value: "rejected", title: "Rejected" },     
  ];

  static async placeOrder(dto: CreateOrderDTO, customer: any) {
    const tracer = trace.getTracer("order-service");
    const span: Span = tracer.startSpan("placeOrder");
    try {
      const priceDetailsResponse = await getPriceDetails(
        customer._id,
        dto.cartId,
        dto.deliveryType || "",
        span,
        dto.couponCode,
        dto.addressId
      );
      if (!priceDetailsResponse.success) {
        logger.warn(
          `Failed to fetch price details: ${priceDetailsResponse.message}`
        );
        return {
          message: "Failed to fetch price details. Please try again later.",
        };
      }

      const priceDetails = priceDetailsResponse.data;
      logger.info(
        `Placing order for customer ${customer._id} with total amount ${priceDetails?.totalAmount}`
      );
      const orderId = await this.orderRepository.generateOrderId();
      const orderItems: OrderItemDTO[] = (priceDetails?.products || []).map(
        (item: any) => ({
          productId: item.productId,
          productName: item?.name,
          quantity: item.cartQuantity,
          sellingPrice: item.price || 0,
          actualPrice: item.actualPrice,
          packagingCharge: item.packagingCharge || 0,
          addons: item.addons || [],
        })
      );

      const orderDto: PlaceOrderDTO = {
        statusId: 1,
        orderId: await this.orderRepository.generateOrderId(),
        userId: customer._id,
        merchantId: priceDetails?.merchantId || "",
        subTotalAmount: priceDetails?.subTotal || 0,
        totalAmount: priceDetails?.grandTotal || 0,
        shippingAmount: priceDetails?.deliveryCharge || 0,
        gst: priceDetails?.gstCost || 0,
        discount: priceDetails?.discount || 0,
        packingCharges: priceDetails?.packagingCharge || 0,
        convenienceCharges: priceDetails?.platformFee || 0,
        orderItems,
        addressId: dto.addressId,
        cartId: dto.cartId || "",
        scheduleOrderDate: null,
        deliveryTypeId: priceDetails?.selectedDeliveryType?._id,
      };
      const order = await this.orderRepository.createOrder(orderDto);
      logger.info(`Order created successfully with ID: ${order.id}`);
      await produceOrderCreatedEvent(
        order.id.toString(),
        Number(priceDetails?.totalAmount || 1),
        customer,
        priceDetails?.merchantId
      );

      const { paymentLink, razorpayKey } = await waitForPaymentLink(
        order.id.toString()
      );
      const paymentDetails = {
        paymentLink,
        paymentOrderId: razorpayKey,
      };

      return {
        ...order,
        paymentDetails,
      };
    } catch (error: any) {
      logger.error(
        `Failed to place order for customer ${customer._id}: ${error.message}`
      );
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  }

  static async updateOrderPaymentStatus(
    orderId: number,
    statusId: number,
    paymentCompletedAt: Date
  ) {
    try {
      logger.info(`Updating order ID: ${orderId} to status: ${statusId}`);

      const updatedOrder = await this.orderRepository.updateOrder(orderId, {
        orderStatus: {
          connect: { id: statusId },
        },
        paymentCompletedAt,
      });

      logger.info(`Order ID: ${orderId} updated successfully.`);

      return updatedOrder;
    } catch (error: any) {
      logger.error(`Failed to update order ID: ${orderId}: ${error.message}`);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: number, statusId: string) {
    try {
      logger.info(`Updating order ID: ${orderId} to statusId: ${statusId}`);

      const updatedOrder = await this.orderRepository.updateOrder(orderId, {
        orderStatus: {
          connect: { id: Number(statusId) },
        },
      });

      logger.info(`Order ID: ${orderId} updated successfully.`);

      return updatedOrder;
    } catch (error: any) {
      logger.error(`Failed to update order ID: ${orderId}: ${error.message}`);
      throw error;
    }
  }

  static async getOrdersByCustomerId(
    customerId: string,
    statusId?: string,
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ) {
    try {
      const tracer = trace.getTracer("order-service");
      const span: Span = tracer.startSpan("getOrderByCustomerToken");
      logger.info(
        `Fetching orders for customer ${customerId} with status ${statusId} on page ${page} with limit ${limit} and pagination ${isPagination}`
      );

      const statusMapping: { [key: string]: number[] | undefined } = {
        all: [],
        pending: [1, 2, 3, 4, 5, 6, 8, 9],
        completed: [10],
        cancelled: [7],
      };
      const filteredStatusIds =
        statusMapping[statusId as keyof typeof statusMapping] || [];
      const orders = await this.orderRepository.getOrdersByCustomerId(
        customerId,
        filteredStatusIds,
        page,
        limit,
        isPagination
      );

      const ordersWithMerchantDetails = await Promise.all(
        orders.map(async (order: any) => {
          const merchant = await getMerchantDetailsById(order.merchantId, span);
          const customerDetails = await getCustomerDetailsById(
            order?.userId,
            span
          );
          const addressDetails = await getAddressDetailsById(
            order?.addressId,
            span
          );
          const deliveryTypeDetails = await getDeliveryDetailsById(
            order?.deliveryTypeId,
            span
          );
          const merchantDetails = merchant?.merchantData;

          const simplifiedMerchantDetails = {
            _id: merchantDetails?._id || null,
            name: merchantDetails?.name || null,
            mobile: merchantDetails?.mobile || null,
            email: merchantDetails?.email || null,
            imgUrl: merchantDetails?.imgUrl || null,
            pincode: merchantDetails?.pincode || null,
            area: merchantDetails?.area || null,
            city: merchantDetails?.city || null,
            state: merchantDetails?.state || null,
            country: merchantDetails?.country || null,
            location: merchantDetails?.location || null,
          };

          return {
            ...order,
            merchantDetails: simplifiedMerchantDetails,
            customerDetails: customerDetails?.customerData || null,
            addressDetails: addressDetails?.addressData || null,
            deliveryTypeDetails: deliveryTypeDetails?.deliveryData || null,
          };
        })
      );

      return {
        orders: ordersWithMerchantDetails,
        filters: this.customerFilterConfig,
      };
    } catch (error: any) {
      logger.error(
        `Failed to fetch orders for customer ${customerId}: ${error.message}`
      );
      throw error;
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.orderRepository.deleteOrder(orderId);
      logger.info(`Order with ID ${orderId} processed for deletion.`);
    } catch (error: any) {
      logger.error(
        `Error in OrderService while deleting order ID ${orderId}: ${error.message}`
      );
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<any> {
    try {
      const order = await this.orderRepository.getOrderById(orderId);
      if (order) {
        logger.info(`Order with ID ${orderId} retrieved successfully.`);
      } else {
        logger.warn(`Order with ID ${orderId} not found.`);
      }
      return order;
    } catch (error: any) {
      logger.error(
        `Error in OrderService while retrieving order ID ${orderId}: ${error.message}`
      );
      throw error;
    }
  }

  static async getOrdersByMerchantId(
    merchantId: string,
    statusId?: string,
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ) {
    try {
      const tracer = trace.getTracer("order-service");
      const span: Span = tracer.startSpan("getOrderByCustomerToken");
      logger.info(
        `Fetching orders for merchant ${merchantId} with status ${statusId} on page ${page} with limit ${limit} and pagination ${isPagination}`
      );
      const statusMapping: { [key: string]: number[] } = {
        unaccepted: [2],
        accepted: [6, 8, 9],
        completed: [10],
        rejected: [7],
      };
      const filteredStatusIds =
        statusMapping[statusId as keyof typeof statusMapping] || [];
      const orders = await this.orderRepository.getOrdersByMerchantId(
        merchantId,
        filteredStatusIds.length ? { in: filteredStatusIds } : undefined,
        page,
        limit,
        isPagination
      );
      const ordersWithMerchantDetails = await Promise.all(
        orders.map(async (order) => {
          const merchant = await getMerchantDetailsById(merchantId, span);
          const customerDetails = await getCustomerDetailsById(
            order?.userId,
            span
          );
          const addressDetails = await getAddressDetailsById(
            order?.addressId,
            span
          );
          const deliveryType = await getDeliveryDetailsById(
            "66c9909073f5fa2901f020fe",
            span
          );
          const merchantDetails = merchant?.merchantData;

          const simplifiedMerchantDetails = {
            _id: merchantDetails?._id || null,
            name: merchantDetails?.name || null,
            mobile: merchantDetails?.mobile || null,
            email: merchantDetails?.email || null,
            imgUrl: merchantDetails?.imgUrl || null,
            pincode: merchantDetails?.pincode || null,
            area: merchantDetails?.area || null,
            city: merchantDetails?.city || null,
            state: merchantDetails?.state || null,
            country: merchantDetails?.country || null,
            location: merchantDetails?.location || null,
          };

          return {
            ...order,
            merchantDetails: simplifiedMerchantDetails || null,
            customerDetails: customerDetails?.customerData || null,
            addressDetails: addressDetails?.addressData || null,
            deliveryType: deliveryType?.deliveryData || null,
          };
        })
      );

      return {
        orders: ordersWithMerchantDetails,
        filters: this.merchantFilterConfig,
      };
    } catch (error: any) {
      logger.error(
        `Failed to fetch orders for merchant ${merchantId}: ${error.message}`
      );
      throw error;
    }
  }

  static async getAllOrders(
    merchantId?: string,
    statusId?: string,
    deliveryTypeId?: string,
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ) {
    try {
      const tracer = trace.getTracer("order-service");
      const span: Span = tracer.startSpan("getAllOrder");
      const orders = await this.orderRepository.getAllOrders(
        merchantId,
        statusId,
        deliveryTypeId,
        page,
        limit,
        isPagination
      );

      const ordersWithMerchantDetails = await Promise.all(
        orders.map(async (order) => {
          const merchantDetails = await getMerchantDetailsById(
            merchantId,
            span
          );
          const customerDetails = await getCustomerDetailsById(
            order?.userId,
            span
          );
          const addressDetails = await getAddressDetailsById(
            order?.addressId,
            span
          );
          const deliveryType = await getDeliveryDetailsById(
            order?.deliveryTypeId,
            span
          );
          return {
            ...order,
            merchantDetails: merchantDetails?.merchantData,
            customerDetails: customerDetails?.customerData,
            addressDetails: addressDetails?.addressData,
            deliveryType: deliveryType?.deliveryData,
          };
        })
      );

      return ordersWithMerchantDetails;
    } catch (error: any) {
      logger.error(`Failed to fetch all orders: ${error.message}`);
      throw error;
    }
  }

  static async getOrderByIdV2(orderId: string): Promise<any> {
    try {
      const tracer = trace.getTracer("order-service");
      const span: Span = tracer.startSpan("getByIdOrder");
      const order = await this.orderRepository.getOrderById(orderId);
      if (order) {
        logger.info(`Order with ID ${orderId} retrieved successfully.`);
      } else {
        logger.warn(`Order with ID ${orderId} not found.`);
      }
      const merchant = await getMerchantDetailsById(order?.merchantId, span);
      const customerDetails = await getCustomerDetailsById(order?.userId, span);
      const addressDetails = await getAddressDetailsById(
        order?.addressId,
        span
      );
      const deliveryType = await getDeliveryDetailsById(
        order?.deliveryTypeId,
        span
      );

      const merchantDetails = merchant?.merchantData;
      const simplifiedMerchantDetails = {
        _id: merchantDetails?._id || null,
        name: merchantDetails?.name || null,
        mobile: merchantDetails?.mobile || null,
        email: merchantDetails?.email || null,
        imgUrl: merchantDetails?.imgUrl || null,
        pincode: merchantDetails?.pincode || null,
        area: merchantDetails?.area || null,
        city: merchantDetails?.city || null,
        state: merchantDetails?.state || null,
        country: merchantDetails?.country || null,
        location: merchantDetails?.location || null,
        address: `${merchantDetails?.area || ""}, ${
          merchantDetails?.landmark || ""
        }, ${merchantDetails?.city || ""}, ${merchantDetails?.state || ""}, ${
          merchantDetails?.country || ""
        }, ${merchantDetails?.pincode || ""}`.trim(),
        latitude: merchantDetails?.location?.coordinates?.[1] || 0,
        longitude: merchantDetails?.location?.coordinates?.[0] || 0,
      };
      const orderWithDetails = {
        ...order,
        merchantDetails: simplifiedMerchantDetails || null,
        customerDetails: customerDetails?.customerData || null,
        addressDetails: addressDetails?.addressData || null,
        deliveryType: deliveryType?.deliveryData || null,
      };

      logger.info(`Order details fetched successfully for ID: ${orderId}`);
      span.setStatus({ code: 1, message: "Success" });
      return orderWithDetails;
    } catch (error: any) {
      logger.error(
        `Error in OrderService while retrieving order ID ${orderId}: ${error.message}`
      );
      throw error;
    }
  }

  static async getActiveOrders(customerId: string) {
    try {
      const tracer = trace.getTracer("order-service");
      const span: Span = tracer.startSpan("getActiveOrders");

      const activeOrders = await this.orderRepository.getActiveOrders(
        customerId
      );
      const ordersWithDetails = await Promise.all(
        activeOrders.map(async (order) => {
          const merchant = await getMerchantDetailsById(order.merchantId, span);
          const customerDetails = await getCustomerDetailsById(
            order?.userId,
            span
          );
          const addressDetails = await getAddressDetailsById(
            order?.addressId,
            span
          );
          const deliveryType = await getDeliveryDetailsById(
            order?.deliveryTypeId,
            span
          );

          const merchantDetails = merchant?.merchantData;
          const simplifiedMerchantDetails = {
            _id: merchantDetails?._id || null,
            name: merchantDetails?.name || null,
            mobile: merchantDetails?.mobile || null,
            email: merchantDetails?.email || null,
            imgUrl: merchantDetails?.imgUrl || null,
            pincode: merchantDetails?.pincode || null,
            area: merchantDetails?.area || null,
            city: merchantDetails?.city || null,
            state: merchantDetails?.state || null,
            country: merchantDetails?.country || null,
            location: merchantDetails?.location || null,
          };
          return {
            ...order,
            merchantDetails: simplifiedMerchantDetails || null,
            customerDetails: customerDetails?.customerData || null,
            addressDetails: addressDetails?.addressData || null,
            deliveryType: deliveryType?.deliveryData || null,
          };
        })
      );

      span.setStatus({ code: 1, message: "Success" });
      return ordersWithDetails;
    } catch (error: any) {
      logger.error(
        `Failed to fetch active orders for customer ${customerId}: ${error.message}`
      );
      throw error;
    }
  }
}

export default OrderService;
