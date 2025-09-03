import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { userServiceClient } from "../grpcClient";
import { AuthResponse } from "src/gRPC/types/user_service_pb";

export const authenticateStoreUser = (
  token: string,
  metadata: Metadata
): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("store-service");

    const span: Span = tracer.startSpan("authenticateStoreUser");

    const ctx = trace.setSpan(context.active(), span);

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;

    context.with(ctx, () => {
      userServiceClient.authenticateUser(
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
  });
};
