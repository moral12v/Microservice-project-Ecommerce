import { ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";
import { trace, Span, SpanOptions } from "@opentelemetry/api";

import {
  DeviceDetailsRequest,
  DeviceDetailsResponse,
} from "../types/user_service_pb";
import { customerRepository } from "../../repositories/customerRepository";

export const getDeviceDetailsByUserId = async (
  call: ServerUnaryCall<DeviceDetailsRequest, DeviceDetailsResponse>,
  callback: sendUnaryData<DeviceDetailsResponse>
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  const traceId = metadata.get("x-trace-id")?.[0] as string | undefined;
  const spanId = metadata.get("x-span-id")?.[0] as string | undefined;
  const linkedSpanContext =
    traceId && spanId
      ? {
          traceId,
          spanId,
          traceFlags: 1,
          isRemote: true,
        }
      : undefined;

  const tracer = trace.getTracer("user-service");
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };
  const span: Span = tracer.startSpan("getDeviceDetailsByUserId", spanOptions);

  try {
    const { customerId } = call.request;
    const deviceDetails: any = await customerRepository.getDeviceByCustomerId(
      customerId
    );
    const deviceId = deviceDetails?.deviceToken;
    console.log(deviceId, "device Id Details");
    if (!deviceId) {
      span.setStatus({ code: 2, message: "Device not found for User" });
      console.warn(`No device found for user ID ${customerId}.`);
      callback(null, {
        success: false,
        message: "Device not found",
      });
      return;
    }
    const response: DeviceDetailsResponse = {
      success: true,
      message: "Device ID fetched successfully",
      deviceId,
    };

    span.setStatus({ code: 1, message: "Success" });
    console.info(`Device ID fetched successfully for user ID: ${customerId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getDeviceDetailsByUserId: ${error.message}`);
    callback(null, {
      success: false,
      message: "Failed to fetch device ID",
    });
  } finally {
    span.end();
  }
};
