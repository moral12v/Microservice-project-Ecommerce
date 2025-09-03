import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { storeServiceClient, userServiceClient } from "../grpcClient";
import { AuthResponse } from "src/gRPC/types/user_service_pb";

export const authenticateOrderMerchant = (
  token: string,
  parentSpan: Span,
  metadata: Metadata
): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    console.log( parentSpan.spanContext());
    const tracer = trace.getTracer("store-service");
    const spanOptions: SpanOptions = {
      kind: 2,
      links: [
        {
          context: parentSpan.spanContext(),
        },
      ],
    };
    const span: Span = tracer.startSpan(
      "authenticateStoreUser",
      spanOptions,
      context.active()
    );
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);
    storeServiceClient.authenticateMerchant(
      { token },
      metadata,
      (error: any, response: AuthResponse) => {
        if (error) {
          console.error("Error authenticating user:", error);
          span.setStatus({ code: 2, message: "Error during authentication" });
          span.end();
          return reject({
            success: false,
            message: "Authentication service unavailable",
          });
        }
        console.info("User authenticated successfully:", {
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
