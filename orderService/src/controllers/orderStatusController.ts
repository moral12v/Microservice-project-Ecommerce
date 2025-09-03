import { Request, Response } from 'express';
import OrderStatusService from '../services/orderStatus';
import {
  CreateOrderStatusDTO,
  UpdateOrderStatusDTO,
} from '../dtos/orderStatusDTO';

class OrderStatusController {
  static async createOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateOrderStatusDTO = req.body;
      const orderStatus = await OrderStatusService.createOrderStatus(dto);
      res.status(201).json({ success: true, data: orderStatus });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrderStatusById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const orderStatus = await OrderStatusService.getOrderStatusById(id);
      if (orderStatus) {
        res.status(200).json({ success: true, data: orderStatus });
      } else {
        res.status(404).json({ success: false, message: 'Order Status not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllOrderStatuses(req: Request, res: Response): Promise<void> {
    try {
      const orderStatuses = await OrderStatusService.getAllOrderStatuses();
      res.status(200).json({ success: true, data: orderStatuses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const dto: UpdateOrderStatusDTO = req.body;
      const orderStatus = await OrderStatusService.updateOrderStatus(id, dto);
      res.status(200).json({ success: true, data: orderStatus });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default OrderStatusController;
