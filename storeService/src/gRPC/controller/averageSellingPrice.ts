import { context, trace, Span } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { inventoryServiceClient } from "../grpcClient";
import {
  GetAveragePriceRequest,
  GetAveragePriceResponse,
} from "../types/inventory_service_pb";

export const getAverageSellingPriceByMerchantId = (
  merchantId: string,
  metadata: Metadata
): Promise<GetAveragePriceResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("store-service");
    const span: Span = tracer.startSpan("getAverageSellingPriceByMerchantId");
    const ctx = trace.setSpan(context.active(), span);
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;

    const request: GetAveragePriceRequest = {
      merchantId,
      traceId,
      spanId,
    };

    context.with(ctx, () => {
      inventoryServiceClient.getAverageSellingPriceByMerchantId(
        request,
        metadata,
        (error: any, response: GetAveragePriceResponse) => {
          if (error) {
            console.error("Error fetching average selling price:", error);
            span.setStatus({
              code: 2,
              message: "Error during average selling price request",
            });
            span.end();
            return reject({
              success: false,
              message: "Inventory service unavailable",
            });
          }

          console.info("Average selling price fetched successfully:", {
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
