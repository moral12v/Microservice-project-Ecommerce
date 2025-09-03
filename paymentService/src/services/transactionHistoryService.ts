import TransactionHistoryRepository from "../repositories/transactionhistoryRepository";
import {
  CreateTranscitionHistoryDTO,
  UpdateTranscitionHistoryDTO,
} from "../dtos/transacionhistoryDTO";
import { getOrderDetailsById } from "../gRPC/controller/orderDetails";
import { trace, Span } from "@opentelemetry/api";

class TransactionHistoryService {
  private static transactionHistoryRepository =
    new TransactionHistoryRepository();

  static async createTransactionHistory(dto: CreateTranscitionHistoryDTO) {
    return this.transactionHistoryRepository.createTransactionHistory(dto);
  }

  static async getTransactionHistoryById(id: number) {
    return this.transactionHistoryRepository.getTransactionHistoryById(id);
  }

  static async getAllTransactionHistory(aggregatorStatus: string = "unpaid") {
    return this.transactionHistoryRepository.getAllTransactionHistory(aggregatorStatus);
  }
  

  static async updateTransactionHistory(
    id: number,
    dto: UpdateTranscitionHistoryDTO
  ) {
    return this.transactionHistoryRepository.updateTransactionHistory(id, dto);
  }


  static async updateTransactionHistoryV2(
    updates: UpdateTranscitionHistoryDTO[]
  ) {
    return Promise.all(updates.map(async (dto) => {
      const { id, ...updateData } = dto;
      return this.transactionHistoryRepository.updateTransactionHistory(Number(dto.id), updateData);
    }));
  }
  
  static async findTransactionHistoryByReferenceId(referenceId: string) {
    return this.transactionHistoryRepository.findByReferenceId(referenceId);
  }

  static async findAllTransactionHistoryByMerchantId(merchantId: string) {
    const tracer = trace.getTracer("payment-service");
    const span: Span = tracer.startSpan(
      "findAllTransactionHistoryByMerchantId"
    );

    try {
      const transactionHistory =
        await this.transactionHistoryRepository.findAllByMerchantId(merchantId);

      const transactionsWithOrderDetails = await Promise.all(
        transactionHistory.map(async (transaction: any) => {
          const orderDetails = await getOrderDetailsById(
            transaction.orderId,
            span
          );
          return {
            ...transaction,
            orderDetails: orderDetails?.order,
          };
        })
      );

      return transactionsWithOrderDetails;
    } catch (error: any) {
      console.error(
        `Error fetching transaction history for merchant ${merchantId}:`,
        error
      );
      throw error;
    } finally {
      span.end();
    }
  }
<<<<<<< HEAD

  static async findByAggregatorTokenAndMerchantId (merchantId: string) {
    return this.transactionHistoryRepository.findByAggregatorTokenAndMerchantId(merchantId);
  }

=======
>>>>>>> 260fff3024e2fb246d7bd651f4676fbda7e2e07c
}

export default TransactionHistoryService;
