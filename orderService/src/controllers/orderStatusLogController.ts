import { Request, Response } from 'express';
import OrderStatusLogService from '../services/orderStatusLogService';
import {
  CreateOrderStatusLogDTO,
  UpdateOrderStatusLogDTO,
} from '../dtos/orderStatusLogDTO';

class OrderStatusLogController {
  static async createOrderStatusLog(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateOrderStatusLogDTO = req.body;
      const orderStatusLog = await OrderStatusLogService.createOrderStatusLog(dto);
      res.status(201).json({ success: true, data: orderStatusLog });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOrderStatusLogById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const orderStatusLog = await OrderStatusLogService.getOrderStatusLogById(id);
      if (orderStatusLog) {
        res.status(200).json({ success: true, data: orderStatusLog });
      } else {
        res.status(404).json({ success: false, message: 'Order Status Log not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllOrderStatusLogs(req: Request, res: Response): Promise<void> {
    try {
      const orderStatusLogs = await OrderStatusLogService.getAllOrderStatusLogs();
      res.status(200).json({ success: true, data: orderStatusLogs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateOrderStatusLog(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const dto: UpdateOrderStatusLogDTO = req.body;
      const orderStatusLog = await OrderStatusLogService.updateOrderStatusLog(id, dto);
      res.status(200).json({ success: true, data: orderStatusLog });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  static async deleteOrderStatusLogById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const orderStatusLog = await OrderStatusLogService.deleteOrderStatusLog(id);
      if (orderStatusLog) {
        res.status(200).json({ success: true, data: orderStatusLog });
      } else {
        res.status(404).json({ success: false, message: 'Order Status Log not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

export default OrderStatusLogController;
