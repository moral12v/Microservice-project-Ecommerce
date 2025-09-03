import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { PriceDetailsRequest, PriceDetailsResponse } from "../types/inventory_service_pb";
import { inventoryServiceClient } from "../grpcClient";

export const getPriceDetails = (
  customerId: string,
  cartId: string,
  deliveryType: string,
  parentSpan: any,
  couponCode?: string,
  addressId?: string,
): Promise<PriceDetailsResponse> => {
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
      "getPriceDetails",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: PriceDetailsRequest = {
      customerId,
      cartId,
      deliveryType,
      couponCode,
      addressId,
      traceId,
      spanId,
    };

    inventoryServiceClient.priceDetails(
      request,
      metadata,
      (error: any, response: PriceDetailsResponse) => {
        if (error) {
          console.error("Error fetching price details:", error);
          span.setStatus({ code: 2, message: "Error during price details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Price details service unavailable",
          });
        }
        console.info("Price details retrieved successfully:", {
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
