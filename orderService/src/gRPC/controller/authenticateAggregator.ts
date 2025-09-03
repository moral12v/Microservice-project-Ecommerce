import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { userServiceClient } from "../grpcClient";
import { VendorAuthResponse } from "src/gRPC/types/user_service_pb";

export const authenticateAggregator = (
  token: string,
  parentSpan: Span,
  metadata: Metadata
): Promise<VendorAuthResponse> => {
  return new Promise((resolve, reject) => {
    console.log(parentSpan.spanContext());
    
    const tracer = trace.getTracer("vendor-service");
    const spanOptions: SpanOptions = {
      kind: 2,
      links: [
        {
          context: parentSpan.spanContext(),
        },
      ],
    };
    
    const span: Span = tracer.startSpan(
      "authenticateVendor",
      spanOptions,
      context.active()
    );
    
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);
    userServiceClient.authenticateAggregator(
      { token },
      metadata,
      (error: any, response: VendorAuthResponse) => {
        if (error) {
          console.error("Error authenticating vendor:", error);
          span.setStatus({ code: 2, message: "Error during vendor authentication" });
          span.end();
          return reject({
            success: false,
            message: "Authentication service unavailable",
          });
        }

        console.info("Vendor authenticated successfully:", {
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
