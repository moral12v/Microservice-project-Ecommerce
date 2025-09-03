import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import {
  CreateTaskRequest,
  CreateTaskResponse,
} from "../types/shipping_service_pb";
import { shippingServiceClient } from "../grpcClient";

export const createTask = (
  orderDetails: any,
  pickupDetails: any,
  dropDetails: any,
  orderItems: any,
  parentSpan: any
): Promise<CreateTaskResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("shipping-service");
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
      "createTask",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);
    const request: CreateTaskRequest = {
      orderDetails,
      pickupDetails,
      dropDetails,
      orderItems,
      traceId,
      spanId,
    };
    console.log(request, "requestrequestrequest");
    shippingServiceClient.createTask(
      request,
      metadata,
      (error: any, response: CreateTaskResponse) => {
        if (error) {
          console.error("Error creating task in shipping service:", error);
          span.setStatus({ code: 2, message: "Error during task creation" });
          span.end();
          return reject({
            success: false,
            message: "Shipping service unavailable",
          });
        }
        console.info("Task created successfully:", {
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
