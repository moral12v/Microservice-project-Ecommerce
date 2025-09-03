import { Request, Response } from 'express';
import { reOrderService } from '../services/ReorderService';

class ReorderController {
   async reorderItems(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { orderId } = req.body; 

      if (!orderId) {
        res.status(400).json({ success: false, message: 'Order ID is required.' });
        return;
      }
      const orderDetails = await reOrderService.getReorderDetails(customerId, orderId);
      res.status(200).json({ success: true, data: orderDetails });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const reOrderController = new  ReorderController();
