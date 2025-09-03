import { context, trace, Span, SpanOptions } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { notificationServiceClient } from "../grpcClient"; 
import {
  SendNotificationRequest,
  SendNotificationResponse,
} from "../types/notification_service_pb";


export const sendOrderNotification = (
  title: string,
  body: string,
  image: string,
  deviceId: string,
  parentSpan: Span
): Promise<SendNotificationResponse> => {
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
      "sendOrderNotification",
      spanOptions,
      context.active()
    );

    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    metadata.add("x-trace-id", traceId);
    metadata.add("x-span-id", spanId);

    const request: SendNotificationRequest = {
      title,
      body,
      image,
      deviceId,
    };

    notificationServiceClient.sendNotification(
      request,
      metadata,
      (error: any, response: SendNotificationResponse) => {
        if (error) {
          console.error("Error sending notification:", error);
          span.setStatus({
            code: 2, // StatusCode.ERROR
            message: "Error during notification",
          });
          span.end();
          return reject({
            success: false,
            message: "Notification service unavailable",
          });
        }

        console.info("Notification sent successfully:", {
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
