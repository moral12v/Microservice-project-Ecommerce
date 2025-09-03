import { ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";
import { trace, Span, SpanOptions } from "@opentelemetry/api";

import OrderService from "../../services/orderService";
import {
  OrderDetailsRequest,
  OrderDetailsResponse,
} from "../types/order_service_pb";

export const orderDetails = async (
  call: ServerUnaryCall<OrderDetailsRequest, OrderDetailsResponse>,
  callback: sendUnaryData<OrderDetailsResponse>
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  const traceId = metadata.get("x-trace-id")?.[0] as string | undefined;
  const spanId = metadata.get("x-span-id")?.[0] as string | undefined;

  const linkedSpanContext =
    traceId && spanId
      ? { traceId, spanId, traceFlags: 1, isRemote: true }
      : undefined;

  const tracer = trace.getTracer("order-service");
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan("orderDetails", spanOptions);

  try {
    const { orderId } = call.request;

    const orderDetails = await OrderService.getOrderByIdV2(orderId);

    if (!orderDetails) {
      throw new Error(`Order not found for orderId: ${orderId}`);
    }

    const response: any = {
      success: true,
      message: "Order details fetched successfully",
      order: orderDetails,
      traceId: traceId || "",
      spanId: spanId || "",
    };

    span.setStatus({ code: 1, message: "Success" });
    console.info(`Order details fetched for orderId: ${orderId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in orderDetails: ${error.message}`);

    callback(null, {
      success: false,
      message: "Failed to fetch order details",
      traceId: traceId || "",
      spanId: spanId || "",
    });
  } finally {
    span.end();
  }
};
