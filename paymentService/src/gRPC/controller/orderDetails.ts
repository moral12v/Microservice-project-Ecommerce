import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { OrderDetailsResponse, OrderDetailsRequest } from "../types/order_service_pb";
import { orderServiceClient } from "../grpcClient";

export const getOrderDetailsById = (
  orderId: string,
  parentSpan: Span
): Promise<OrderDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("payment-service");
    const metadata = new Metadata();
    const spanOptions: SpanOptions = {
      kind: 2,
      links: [
        {
          context: parentSpan.spanContext(),
        },
      ],
    };

    const span: Span = tracer.startSpan(
      "getOrderDetailsById",
      spanOptions,
      context.active()
    );
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: OrderDetailsRequest = {
      orderId,
      traceId,
      spanId,
    };

    orderServiceClient.orderDetails(
      request,
      metadata,
      (error: any, response: OrderDetailsResponse) => {
        if (error) {
          console.error("Error fetching order details:", error);
          span.setStatus({ code: 2, message: "Error during order details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Order details service unavailable",
          });
        }
        console.info("Order details retrieved successfully:", {
          response,
          traceId,
          spanId,
        });
        span.setStatus({ code: 1, message: "Success" });
        span.end();
        resolve(response);
      }
    );
  });
};
