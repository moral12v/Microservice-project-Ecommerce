import TransactionHistoryRepository from "../repositories/transcitionHistoryRepository";
import { CreateTranscitionHistoryDTO, UpdateTranscitionHistoryDTO } from "src/dtos/transcitionHistoryDTO";


class TransactionHistoryService {
  private static transactionHistoryRepository = new TransactionHistoryRepository();

  static async createTransactionHistory(dto: CreateTranscitionHistoryDTO) {
    return this.transactionHistoryRepository.CreateTransactionHistory(dto);
  }

  static async getTransactionHistoryById(id: number) {
    return this.transactionHistoryRepository.getTransactionHistoryById(id);
  }

  static async getAllTransactionHistory() {
    return this.transactionHistoryRepository.getAllTransactionHistory();
  }

  static async deleteTransactionHistory(id: number) {
    return this.transactionHistoryRepository.deleteTransactionHistory(id);
  }
}

export default TransactionHistoryService;
