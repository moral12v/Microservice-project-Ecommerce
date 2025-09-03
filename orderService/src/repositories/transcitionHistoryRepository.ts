import { PrismaClient, TransactionHistory  } from '@prisma/client';
import { CreateTranscitionHistoryDTO, UpdateTranscitionHistoryDTO, } from '../dtos/transcitionHistoryDTO';

class TransactionHistoryRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async CreateTransactionHistory(data: CreateTranscitionHistoryDTO): Promise<TransactionHistory> {
    return this.prisma.transactionHistory.create({
      data: {
        ...data,
        transactionId: data.transactionId.toString(), 
        planId: data.planId.toString(),               
        paymentRefId: data.paymentRefId.toString(),  
      },
    });
  }
  

  async getTransactionHistoryById(id: number): Promise<TransactionHistory | null> {
    return this.prisma.transactionHistory.findUnique({
      where: { id },
    });
  }

  async getAllTransactionHistory(): Promise<TransactionHistory[]> {
    return this.prisma.transactionHistory.findMany(
    );
  }


  async deleteTransactionHistory(id: number): Promise<TransactionHistory> {
    return this.prisma.transactionHistory.delete({
      where: { id },
    });
  }
}

export default TransactionHistoryRepository;
