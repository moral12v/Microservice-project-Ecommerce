import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { DeviceDetailsRequest, DeviceDetailsResponse } from "../types/store_service_pb";
import { storeServiceClient } from "../grpcClient";

export const getDeviceIdByStoreId = (
  storeId: any,
  parentSpan: Span
): Promise<DeviceDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("notification-service");
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
      "getDeviceIdByStoreId",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: DeviceDetailsRequest = {
      storeId
    };

    storeServiceClient.getDeviceDetailsByStoreId(
      request,
      metadata,
      (error: any, response: DeviceDetailsResponse) => {
        if (error) {
          console.error("Error fetching device ID by store ID:", error);
          span.setStatus({ code: 2, message: "Error during device ID retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Store service unavailable",
          });
        }

        console.info("Device ID retrieved successfully for store:", {
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
