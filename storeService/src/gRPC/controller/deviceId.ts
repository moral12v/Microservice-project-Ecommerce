import { ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";
import { trace, Span, SpanOptions } from "@opentelemetry/api";
import { storeRepository } from "../../repositories/storeRespository";
import {
  DeviceDetailsRequest,
  DeviceDetailsResponse,
} from "../types/store_service_pb";

export const getDeviceDetailsByStoreId = async (
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

  const tracer = trace.getTracer("device-service");
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };
  const span: Span = tracer.startSpan("getDeviceDetailsByStoreId", spanOptions);

  try {
    const { storeId } = call.request;
    const deviceDetails: any = await storeRepository.getDeviceId(
      storeId
    );
    const deviceId = deviceDetails?.deviceToken;
    console.log(deviceId, "device Id Details");
    if (!deviceId) {
      span.setStatus({ code: 2, message: "Device not found for store" });
      console.warn(`No device found for store ID ${storeId}.`);
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
    console.info(`Device ID fetched successfully for store ID: ${storeId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getDeviceDetailsByStoreId: ${error.message}`);
    callback(null, {
      success: false,
      message: "Failed to fetch device ID",
    });
  } finally {
    span.end();
  }
};
