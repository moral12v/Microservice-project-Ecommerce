import { PrismaClient, transactionHistory } from '@prisma/client';
import { CreateTranscitionHistoryDTO, UpdateTranscitionHistoryDTO } from '../dtos/transacionhistoryDTO';

class TransactionHistoryRepository {  
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTransactionHistory(data: CreateTranscitionHistoryDTO): Promise<transactionHistory> {
    return this.prisma.transactionHistory.create({ 
      data,
    });
  }

  async getTransactionHistoryById(id: number): Promise<transactionHistory | null> {
    return this.prisma.transactionHistory.findUnique({
      where: { id },
    });
  }

  async getAllTransactionHistory(aggregatorStatus: string = "unpaid"): Promise<transactionHistory[]> {
    return this.prisma.transactionHistory.findMany({
      where: { aggregatorStatus },
    });
  }

  async updateTransactionHistory(
    id: number,
    data: any
  ): Promise<transactionHistory> {
    return this.prisma.transactionHistory.update({
      where: { id },
      data,
    });
  }
  
  

  async findByReferenceId(referenceId: string): Promise<transactionHistory | null> {
    return this.prisma.transactionHistory.findFirst({
      where: {
        referenceId: referenceId.toString(),
      },
    });
  }
  
  async findAllByMerchantId(merchantId:string): Promise<any> {
    return this.prisma.transactionHistory.findMany({
      where: {
        merchantId: merchantId,
      },
    });
  }

  async findByAggregatorTokenAndMerchantId( merchantId: string): Promise<transactionHistory[]> {
    return this.prisma.transactionHistory.findMany({
      where: {
        merchantId: merchantId,
      },
    });
  }


}

export default TransactionHistoryRepository;  

