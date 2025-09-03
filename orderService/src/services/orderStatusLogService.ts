import { CreateOrderStatusLogDTO, UpdateOrderStatusLogDTO } from '../dtos/orderStatusLogDTO';
import OrderStatusLogRepository from '../repositories/orderStatusLogRepository';

class OrderStatusLogService {
  private static orderStatusLogRepository = new OrderStatusLogRepository();

  static async createOrderStatusLog(dto: CreateOrderStatusLogDTO) {
    return this.orderStatusLogRepository.createOrderStatusLog(dto);
  }

  static async getOrderStatusLogById(id: number) {
    return this.orderStatusLogRepository.getOrderStatusLogById(id);
  }

  static async getAllOrderStatusLogs() {
    return this.orderStatusLogRepository.getAllOrderStatusLogs();
  }

  static async updateOrderStatusLog(id: number, dto: UpdateOrderStatusLogDTO) {
    return this.orderStatusLogRepository.updateOrderStatusLog(id, dto);
  }

  static async deleteOrderStatusLog(id: number) {
    return this.orderStatusLogRepository.deleteOrderStatusLog(id);
  }
}

export default OrderStatusLogService;
