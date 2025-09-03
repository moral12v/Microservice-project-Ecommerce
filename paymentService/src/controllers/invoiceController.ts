import { CreateInvoiceDTO, UpdateInvoiceDTO } from "../dtos/invoiceDTO";
import InvoiceService from "../services/invoiveService";
import { Request, Response } from "express";

class InvoiceController {
  static async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateInvoiceDTO = req.body;
      const invoice = await InvoiceService.createInvoice(dto);
      res.status(201).json({ success: true, data: invoice });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  static async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await InvoiceService.getAllInvoices();
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  static async getInvoicesByMerchantId(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = parseInt(req.params.merchantId, 10);
      const invoices = await InvoiceService.getInvoicesByMerchantId(merchantId);
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getInvoicesByCustomerId(req: Request, res: Response): Promise<void> {
    try {
      const customerId = parseInt(req.params.customerId, 10);
      const invoices = await InvoiceService.getInvoicesByCustomerId(customerId);
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default InvoiceController;
