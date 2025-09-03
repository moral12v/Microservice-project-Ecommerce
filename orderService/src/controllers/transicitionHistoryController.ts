import { Request, Response } from "express";
import TransactionHistoryService from "../services/transcitionHistory";
import {
  CreateTranscitionHistoryDTO,
  UpdateTranscitionHistoryDTO,
} from "../dtos/transcitionHistoryDTO";


class TranscitionHistoryController {
  static async createTranscitionHistory(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateTranscitionHistoryDTO = req.body;
      const transcitionHistory = await TransactionHistoryService.createTransactionHistory(dto);
      res.status(201).json({ success: true, data: transcitionHistory });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTranscitionHistoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const transcitionHistory = await TransactionHistoryService.getTransactionHistoryById(id);
      if (transcitionHistory) {
        res.status(200).json({ success: true, data: transcitionHistory });
      } else {
        res.status(404).json({ success: false, message: "TranscitionHistory not found" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllTranscitionHistory(req: Request, res: Response): Promise<void> {
    try {
      const transcitionHistory = await TransactionHistoryService.getAllTransactionHistory();
      res.status(200).json({ success: true, data: transcitionHistory });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteTranscitionHistory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await TransactionHistoryService.deleteTransactionHistory(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default TranscitionHistoryController;
