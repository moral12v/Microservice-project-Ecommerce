import { Request, Response } from "express";
import TransactionHistoryService from "../services/transactionHistoryService";
import {
  CreateTranscitionHistoryDTO,
  UpdateTranscitionHistoryDTO,
} from "../dtos/transacionhistoryDTO";

class TranscitionHistoryController {
  static async createTranscitionHistory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const dto: CreateTranscitionHistoryDTO = req.body;
      const transcitionHistory =
        await TransactionHistoryService.createTransactionHistory(dto);
      res.status(201).json({ success: true, data: transcitionHistory });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTranscitionHistoryById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const transcitionHistory =
        await TransactionHistoryService.getTransactionHistoryById(id);
      if (transcitionHistory) {
        res.status(200).json({ success: true, data: transcitionHistory });
      } else {
        res
          .status(404)
          .json({ success: false, message: "TranscitionHistory not found" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllTranscitionHistory(req: Request, res: Response): Promise<void> {
    try {
      const aggregatorStatus = req.query.aggregatorStatus as string || "unpaid"; 
      const transcitionHistory = await TransactionHistoryService.getAllTransactionHistory(aggregatorStatus);
  
      res.status(200).json({ success: true, data: transcitionHistory });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  

  static async updateTranscitionHistory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const updates: UpdateTranscitionHistoryDTO[] = req.body; 
      const updatedProducts = await TransactionHistoryService.updateTransactionHistoryV2(updates);
      res.status(200).json({ success: true, data: updatedProducts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  static async getTransactionHistoryByMerchantId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const merchantId = req.merchant._id;
      if (!merchantId) {
        res
          .status(400)
          .json({ success: false, message: "Merchant ID is required" });
        return;
      }

      const transactions =
        await TransactionHistoryService.findAllTransactionHistoryByMerchantId(
          merchantId
        );
      if (transactions.length === 0) {
        res
          .status(404)
          .json({
            success: false,
            message: "No transaction history found for this merchant",
          });
      } else {
        res.status(200).json({ success: true, data: transactions });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  static async getTransactionHistoryByMerchantIdV2(
    req: Request,
    res: Response
  ): Promise<void> {
    try {

      const {merchantId} = req?.query;
      
      if (!merchantId) {
        res
          .status(400)
          .json({ success: false, message: "Merchant ID is required" });
        return;
      }

      const merchantIdString = merchantId as string;


      const transactions =
        await TransactionHistoryService.findAllTransactionHistoryByMerchantId(
          merchantIdString
        );
      if (transactions.length === 0) {
        res
          .status(404)
          .json({
            success: false,
            message: "No transaction history found for this merchant",
          });
      } else {
        res.status(200).json({ success: true, data: transactions });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTransactionByAggregatorTokenAndMerchantId(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId } = req.query; 

      if (merchantId) {
        res.status(400).json({ success: false, message: " merchant ID are required" });
        return;
      }

      const transactions = await TransactionHistoryService.findByAggregatorTokenAndMerchantId(
        merchantId as string
      );

      if (transactions.length === 0) {
        res.status(404).json({ success: false, message: "No transactions found for the given aggregator token and merchant ID" });
      } else {
        res.status(200).json({ success: true, data: transactions });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  
}

export default TranscitionHistoryController;
