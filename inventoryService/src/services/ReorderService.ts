import { getOrderDetailsById } from "../gRPC/controller/orderDetails";
import { cartRepository } from "../repositories/cartRepository";
import { Span, trace } from "@opentelemetry/api";

class ReorderService {
  async getReorderDetails(customerId: string, orderId: string) {
    const tracer = trace.getTracer("inventory-service");
    const span: Span = tracer.startSpan("reOrder");

    try {
      const orderDetails = await getOrderDetailsById(orderId, span);

      if (!orderDetails) {
        throw new Error("Order not found.");
      }
      console.log(orderDetails?.order?.orderItems , orderDetails?.order?.merchantDetails);
      //   // Assuming you have a method to add items to the cart
      //   const cart = await cartRepository.createCartForCustomer(customerId, orderDetails.items);

      //   // Optionally return both orderDetails and the newly created cart
      //   return { orderDetails, cart };
    } finally {
      span.end(); // Ensure span is ended in a finally block
    }
  }
}

export const reOrderService = new ReorderService();
