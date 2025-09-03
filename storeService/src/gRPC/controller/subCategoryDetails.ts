import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { inventoryServiceClient } from "../grpcClient";
import {
  SubCategoryDetailsRequest,
  SubCategoryDetailsResponse,
} from "../types/inventory_service_pb";

export const getSubcategoryDetails = (
  subCategoryId: string,
  metadata: Metadata
): Promise<SubCategoryDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer("store-service");
    const span: Span = tracer.startSpan("getSubcategoryDetails");
    const ctx = trace.setSpan(context.active(), span);
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    
    const request: SubCategoryDetailsRequest = {
      subCategoryId,
      traceId,
      spanId,
    };

    context.with(ctx, () => {
      inventoryServiceClient.SubCategoryDetails(
        request,
        metadata,
        (error: any, response: SubCategoryDetailsResponse) => {
          if (error) {
            console.error("Error fetching subcategory details:", error);
            span.setStatus({
              code: 2,
              message: "Error during subcategory request",
            });
            span.end();
            return reject({
              success: false,
              message: "Inventory service unavailable",
            });
          }

          console.info("Subcategory details fetched successfully:", {
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
