import { PrismaClient, Invoice } from '@prisma/client';
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoiceDTO';

class InvoiceRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
    return this.prisma.invoice.create({
      data,
    });
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany();
  }


  async getInvoicesByMerchantId(merchantId: number): Promise<Invoice[]> {
    try {
      return await this.prisma.invoice.findMany({
        where: {
          merchantId: merchantId, 
        },
      });
    } catch (error) {
      console.error('Error fetching invoices by merchant ID:', error);
      throw error;
    }
  }

  async getInvoicesByCustomerId(customerId: number): Promise<Invoice[]> {
    try {
      return await this.prisma.invoice.findMany({
        where: {
          customerId: customerId,
        },
      });
    } catch (error) {
      console.error('Error fetching invoices by customer ID:', error);
      throw error;
    }
  }
}
  


export default InvoiceRepository;
