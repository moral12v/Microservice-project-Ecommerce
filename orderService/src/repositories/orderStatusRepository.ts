import { PrismaClient, OrderStatus } from '@prisma/client';
import { CreateOrderStatusDTO, UpdateOrderStatusDTO } from '../dtos/orderStatusDTO';

class OrderStatusRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createOrderStatus(data: CreateOrderStatusDTO): Promise<OrderStatus> {
    return this.prisma.orderStatus.create({ 
      data,
    });
  }

  async getOrderStatusById(id: number): Promise<OrderStatus | null> {  
    return this.prisma.orderStatus.findUnique({
      where: { id }
    });
  }

  async getAllOrderStatuses(): Promise<OrderStatus[]> {  
    return this.prisma.orderStatus.findMany();
  }

  async updateOrderStatus(id: number, data: UpdateOrderStatusDTO): Promise<OrderStatus> {  
    return this.prisma.orderStatus.update({
      where: { id },
      data,
    });
  }
}

export default OrderStatusRepository;
