import { Request, Response } from "express";
import OrderService from "../services/orderService";
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  FilterOrdersDTO,
} from "../dtos/orderDTO";
import { responseWithData, responseWithoutData } from "../utils/response";

class OrderController {
  static async placeOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderDto: CreateOrderDTO = req.body;
      const customer = req?.customer ? req?.customer : "";
      const order = await OrderService.placeOrder(orderDto, customer);
      res.status(200).json({
        success: true,
        order,
        message: "Order placed successfully, awaiting payment confirmation.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrdersByCustomerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        status, 
        page = "1",
        limit = "10",
        isPagination = "true",
      } = req.query;
  
      const filter: FilterOrdersDTO = {
        statusId: typeof status === "string" ?status: undefined,
        page: typeof page === "string" ? parseInt(page, 10) : undefined,
        limit: typeof limit === "string" ? parseInt(limit, 10) : undefined,
        isPagination:
          typeof isPagination === "string" ? isPagination === "true" : undefined,
      };
  
      const customerId = (req as any).customer ? (req as any).customer._id : "";
      const orders = await OrderService.getOrdersByCustomerId(
        customerId,
        filter.statusId,
        filter.page,
        filter.limit,
        filter.isPagination
      );
  
      res.status(200).json({
        "success": true,
        data:orders,
        message: "Orders retrieved successfully.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrdersByMerchantId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        status,
        page = "1",
        limit = "10",
        paymentStatus,
        deliveryType,
        isPagination = "true",
      } = req.query;

      const filter: FilterOrdersDTO = {
        statusId: typeof status === "string" ? status : undefined,
        page: typeof page === "string" ? parseInt(page, 10) : undefined,
        limit: typeof limit === "string" ? parseInt(limit, 10) : undefined,
        isPagination:
          typeof isPagination === "string"
            ? isPagination === "true"
            : undefined,
      };
      const merchantIdString = req?.merchant?._id;

      const orders = await OrderService.getOrdersByMerchantId(
        merchantIdString,
        filter.statusId,
        filter.page,
        filter.limit,
        filter.isPagination
      );

      res.status(200).json({
        data:orders,
        message: "Orders for the merchant retrieved successfully.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderByIdV2(orderId);
      if (!order) {
        responseWithoutData(res, 200, true, "Order not found");
      }
      responseWithData(
        res,
        200,
        true,
        "Order retrieved successfully for the merchant.",
        order
      );
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, status } = req.body;
      if (!orderId || !status) {
        res.status(400).json({
          success: false,
          message: "Order ID and status are required.",
        });
        return;
      }

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status
      );
      res.status(200).json({
        updatedOrder,
        message: "Order status updated successfully.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        statusId,
        page = "1",
        limit = "10",
        isPagination = "true",
        merchantId,
        deliveryTypeId,
      } = req.query;

      const filter: any = {
        status: typeof statusId === "string" ? statusId : undefined,
        merchantId: typeof merchantId === "string" ? merchantId : undefined,
        deliveryTypeId:
          typeof deliveryTypeId === "string" ? deliveryTypeId : undefined,
        page: typeof page === "string" ? parseInt(page, 10) : undefined,
        limit: typeof limit === "string" ? parseInt(limit, 10) : undefined,
        isPagination:
          typeof isPagination === "string"
            ? isPagination === "true"
            : undefined,
      };

      const orders = await OrderService.getAllOrders(
        filter.merchantId,
        filter.status,
        filter.deliveryType,
        filter.page,
        filter.limit,
        filter.isPagination
      );

      res.status(200).json({
        orders,
        message: "All orders retrieved successfully.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrdersAggregator(req: Request, res: Response): Promise<void> {
    try {
      const {
        statusId,
        page = "1",
        limit = "10",
        paymentStatus,
        deliveryType,
        isPagination = "true",
        merchantId,
      } = req.query;

      if (!merchantId || typeof merchantId !== "string") {
        res.status(400).json({
          success: false,
          message: "merchantId is required.",
        });
        return;
      }

      const filter: FilterOrdersDTO = {
        statusId: typeof statusId === "string" ? statusId : undefined,
        page: typeof page === "string" ? parseInt(page, 10) : undefined,
        limit: typeof limit === "string" ? parseInt(limit, 10) : undefined,
        isPagination:
          typeof isPagination === "string"
            ? isPagination === "true"
            : undefined,
      };
      const merchantIdString = merchantId as string;

      const orders = await OrderService.getOrdersByMerchantId(
        merchantIdString,
        filter.statusId,
        filter.page,
        filter.limit,
        filter.isPagination
      );

      res.status(200).json({
        orders,
        message: "Orders for the merchant retrieved successfully.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getActiveOrders(req: Request, res: Response): Promise<void> {
    try {
      const customerId = (req as any).customer ? (req as any).customer._id : "";
      if (!customerId) {
        res.status(400).json({
          success: false,
          message: "Customer ID is required.",
        });
        return;
      }

      const activeOrders = await OrderService.getActiveOrders(customerId);

      res.status(200).json({
        success: true,
        orders: activeOrders,
        message: "Active orders retrieved successfully.",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch active orders.",
      });
    }
  }

  static async reOrderHanddler(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      console.log(order, "orderorderorderorderorderorderorderorderorder");
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default OrderController;
