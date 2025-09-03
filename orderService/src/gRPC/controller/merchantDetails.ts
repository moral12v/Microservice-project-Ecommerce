import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { storeServiceClient } from "../grpcClient";
import { MerchantDetailsResponse, MerchantDetailsRequest } from "../types/store_service_pb";

export const getMerchantDetailsById = (
  merchantId:any,
  parentSpan: Span
): Promise<MerchantDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("inventory-service");
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
      "getMerchantDetailsById",
      spanOptions,
      context.active()
    );
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);
    const request: MerchantDetailsRequest = {
      merchantId,
      traceId,
      spanId,
    };
    storeServiceClient.getMerchantDetailsById(
      request,
      metadata,
      (error: any, response: MerchantDetailsResponse) => {
        if (error) {
          console.error("Error fetching merchant details:", error);
          span.setStatus({ code: 2, message: "Error during merchant details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Merchant details service unavailable",
          });
        }
        console.info("Merchant details retrieved successfully:", {
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
