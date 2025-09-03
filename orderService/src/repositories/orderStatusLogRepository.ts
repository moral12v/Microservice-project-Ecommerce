import { PrismaClient, OrderStatusLog } from '@prisma/client';
import { CreateOrderStatusLogDTO, UpdateOrderStatusLogDTO } from '../dtos/orderStatusLogDTO';

class OrderStatusLogRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createOrderStatusLog(data: CreateOrderStatusLogDTO): Promise<OrderStatusLog> {
    return this.prisma.orderStatusLog.create({
      data,
    });
  }

  async getOrderStatusLogById(id: number): Promise<OrderStatusLog | null> {
    return this.prisma.orderStatusLog.findUnique({
      where: { id },
    });
  }

  async getAllOrderStatusLogs(): Promise<OrderStatusLog[]> {
    return this.prisma.orderStatusLog.findMany();
  }

  async updateOrderStatusLog(id: number, data: UpdateOrderStatusLogDTO): Promise<OrderStatusLog> {
    return this.prisma.orderStatusLog.update({
      where: { id },
      data,
    });
  }

  async deleteOrderStatusLog(id: number): Promise<OrderStatusLog> {
    return this.prisma.orderStatusLog.delete({
      where: { id },
    });
  }
}

export default OrderStatusLogRepository;
