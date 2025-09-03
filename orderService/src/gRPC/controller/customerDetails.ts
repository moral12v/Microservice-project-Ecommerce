import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { userServiceClient } from "../grpcClient"; 
import { CustomerDetailsResponse, CustomerDetailsRequest } from "../types/user_service_pb";

export const getCustomerDetailsById = (
  customerId: any,
  parentSpan: Span
): Promise<CustomerDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("order-service");
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
      "getCustomerDetailsById",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: CustomerDetailsRequest = {
      customerId,
      traceId,
      spanId,
    };

    userServiceClient.getCustomerDetailsById(
      request,
      metadata,
      (error: any, response: CustomerDetailsResponse) => {
        if (error) {
          console.error("Error fetching customer details:", error);
          span.setStatus({ code: 2, message: "Error during customer details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Customer details service unavailable",
          });
        }

        console.info("Customer details retrieved successfully:", {
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
