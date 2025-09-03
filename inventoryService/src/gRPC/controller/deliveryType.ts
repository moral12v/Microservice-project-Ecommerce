import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { storeServiceClient } from "../grpcClient"; 
import { DeliveryDetailsResponse, DeliveryDetailsRequest } from "../types/store_service_pb";

export const getDeliveryDetailsById = (
  deliveryId: any,
  parentSpan:any
): Promise<DeliveryDetailsResponse> => {
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
      "getDeliveryDetailsById",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: DeliveryDetailsRequest = {
      deliveryId,
      traceId,
      spanId,
    };

    storeServiceClient.getDeliveryDetailsById(
      request,
      metadata,
      (error: any, response: DeliveryDetailsResponse) => {
        if (error) {
          console.error("Error fetching delivery details:", error);
          span.setStatus({ code: 2, message: "Error during delivery details retrieval" });
          span.end();
          return reject({
            success: false,
            message: "Delivery details service unavailable",
          });
        }

        console.info("Delivery details retrieved successfully:", {
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
