import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { userServiceClient } from "../grpcClient"; 
import { AddressDetailsResponse, AddressDetailsRequest } from "../types/user_service_pb";

export const getAddressDetailsById = (
  addressId: string,
  parentSpan: Span
): Promise<AddressDetailsResponse> => {
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
      "getAddressDetailsById",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: AddressDetailsRequest = {
      addressId,
      traceId,
      spanId,
    };

    userServiceClient.getAddressDetailsById(
      request,
      metadata,
      (error: any, response: AddressDetailsResponse) => {
        if (error) {
          console.error("Error fetching address details:", error);
          span.setStatus({ code: 2, message: "Error during address details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Address details service unavailable",
          });
        }

        console.info("Address details retrieved successfully:", {
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
