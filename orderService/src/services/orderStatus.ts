import { CreateOrderStatusDTO, UpdateOrderStatusDTO } from '../dtos/orderStatusDTO';
import OrderStatusRepository from '../repositories/orderStatusRepository';

class OrderStatusService {
  private static orderStatusRepository = new OrderStatusRepository();

  static async createOrderStatus(dto: CreateOrderStatusDTO) {
    return this.orderStatusRepository.createOrderStatus(dto);
  }

  static async getOrderStatusById(id: number) {
    return this.orderStatusRepository.getOrderStatusById(id);
  }

  static async getAllOrderStatuses() {
    return this.orderStatusRepository.getAllOrderStatuses();
  }

  static async updateOrderStatus(id: number, dto: UpdateOrderStatusDTO) {
    return this.orderStatusRepository.updateOrderStatus(id, dto);
  }
}

export default OrderStatusService;
