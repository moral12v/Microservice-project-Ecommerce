import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoiceDTO';
import InvoiceRepository from '../repositories/invoiceRepository';

class InvoiceService {
  private static invoiceRepository = new InvoiceRepository();

  static async createInvoice(dto: CreateInvoiceDTO) {
    return this.invoiceRepository.createInvoice(dto);
  }
  static async getAllInvoices() {
    return this.invoiceRepository.getAllInvoices();
  }

  static async getInvoicesByMerchantId(merchantId: number) {
    return this.invoiceRepository.getInvoicesByMerchantId(merchantId);
  }

  static async getInvoicesByCustomerId(customerId: number) {
    return this.invoiceRepository.getInvoicesByCustomerId(customerId);
  }
}

export default InvoiceService;
