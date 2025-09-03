import { PrismaClient, Order, Prisma } from "@prisma/client";
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderItemDTO,
  PlaceOrderDTO,
} from "../dtos/orderDTO";
interface OrderWithStatus extends Order {
  orderStatus: {
    id: number;
    name: string;
    image: string;
  };
  isActive: boolean;
}
class OrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createOrder(data: PlaceOrderDTO): Promise<Order> {
    const { cartId, merchantId, userId, orderItems, addressId, ...orderData } =
      data;

    return this.prisma.order.create({
      data: {
        ...orderData,
        addressId,
        merchantId,
        userId,
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            actualPrice: item.actualPrice,
            addons: {
              create:
                item.addons?.map((addon: any) => ({
                  groupName: addon.groupName,
                  choices: addon.choices || [],
                })) || [],
            },
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  }

  async updateOrder(
    orderId: number,
    data: Prisma.OrderUpdateInput
  ): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  async getOrdersByCustomerId(
    customerId: string,
    statusFilter?: number[],
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ): Promise<any> {
    const query: Prisma.OrderWhereInput = {
      userId: customerId,
      ...(statusFilter && statusFilter.length > 0
        ? { statusId: { in: statusFilter } }
        : {}),
    };

    const options: Prisma.OrderFindManyArgs = {
      where: query,
      skip: isPagination ? (page - 1) * limit : undefined,
      take: isPagination ? limit : undefined,
      include: {
        orderItems: {
          include: {
            addons: true,
          },
        },
        orderStatus: true,
      },
    };

    const orders = await this.prisma.order.findMany(options);

    const ordersWithActiveStatus = orders.map((order) => {
      const isActive = order.statusId !== 10 && order.statusId !== 7;

      return {
        ...order,
        isActive,
      };
    });

    return ordersWithActiveStatus;
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id: Number(orderId) },
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        orderItems: {
          include: {
            addons: true,
          },
        },
        orderStatus: true,
      },
    });
  }

  async getOrderByIdV2(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        orderItems: {
          include: {
            addons: true,
          },
        },
        orderStatus: true,
      },
    });
  }

  async generateOrderId(): Promise<string> {
    const lastOrder = await this.prisma.order.findFirst({
      orderBy: { id: "desc" },
      select: { orderId: true },
    });

    let lastNumber = 0;
    if (lastOrder && lastOrder.orderId) {
      const lastIdString = String(lastOrder.orderId);
      const lastIdParts = lastIdString.split("-");
      if (lastIdParts.length === 3 && !isNaN(Number(lastIdParts[2]))) {
        lastNumber = Number(lastIdParts[2]);
      }
    }

    const newNumber = (lastNumber + 1).toString().padStart(3, "0");
    return `CTB-ODR-${newNumber}`;
  }

  async updateOrderStatus(orderId: number, statusId: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { statusId },
    });
  }

  async getOrdersByMerchantId(
    merchantId: string,
    statusFilter?: { in?: number[] },
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ): Promise<Order[]> {
    const query: Prisma.OrderWhereInput = {
      merchantId,
      ...(statusFilter && statusFilter.in && statusFilter.in.length > 0
        ? { statusId: { in: statusFilter.in } }
        : {}),
    };

    const options: Prisma.OrderFindManyArgs = {
      where: query,
      skip: isPagination ? (page - 1) * limit : undefined,
      take: isPagination ? limit : undefined,
      include: {
        orderItems: {
          include: {
            addons: true,
          },
        },
        orderStatus: true,
      },
    };

    return this.prisma.order.findMany(options);
  }

  async getAllOrders(
    merchantId?: string,
    statusId?: string,
    deliveryTypeId?: string,
    page: number = 1,
    limit: number = 10,
    isPagination: boolean = true
  ): Promise<Order[]> {
    const query: Prisma.OrderWhereInput = {
      ...(merchantId ? { merchantId } : {}),
      ...(statusId ? { statusId: Number(statusId) } : {}),
      ...(deliveryTypeId ? { deliveryTypeId } : {}),
    };

    const options: Prisma.OrderFindManyArgs = {
      where: query,
      skip: isPagination ? (page - 1) * limit : undefined,
      take: isPagination ? limit : undefined,
      include: {
        orderItems: {
          include: {
            addons: true,
          },
        },
        orderStatus: true,
      },
    };

    return this.prisma.order.findMany(options);
  }

  async getActiveOrders(customerId: string): Promise<Order[]> {
    const query: Prisma.OrderWhereInput = {
      userId: customerId,
      statusId: { notIn: [3, 4] },
    };

    const options: Prisma.OrderFindManyArgs = {
      where: query,
      include: {
        orderItems: true,
      },
    };

    return this.prisma.order.findMany(options);
  }
}

export default OrderRepository;
