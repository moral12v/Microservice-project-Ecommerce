import { DeliveryData, DeliveryDetailsRequest, DeliveryDetailsResponse } from '../types/store_service_pb';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { getDeliveryTypeById } from "../../services/deliveryTypeService"

export const getDeliveryDetailsById = async (
  call: ServerUnaryCall<DeliveryDetailsRequest, DeliveryDetailsResponse>,
  callback: sendUnaryData<DeliveryDetailsResponse>,
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  const traceId = metadata.get('x-trace-id')?.[0] as string | undefined;
  const spanId = metadata.get('x-span-id')?.[0] as string | undefined;
  const linkedSpanContext =
    traceId && spanId
    
      ? {
          traceId,
          spanId,
          traceFlags: 1,
          isRemote: true,
        }: undefined;

  const tracer = trace.getTracer('store-service');
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan('getDeliveryDetailsById', spanOptions);
  try {
    const { deliveryId } = call.request;
    const delivery: any = await getDeliveryTypeById(deliveryId);
    console.log(delivery,"deliverydeliverydelivery")
    if (!delivery) {
      span.setStatus({ code: 2, message: 'Delivery not found' });
      console.warn(`Delivery with ID ${deliveryId} not found.`);
      callback(null, {
        success: false,
        message: 'Delivery not found',
        traceId,
        spanId,
      });
      return;
    }

    const response: DeliveryDetailsResponse = {
      success: true,
      message: 'Delivery details fetched successfully',
      deliveryData: delivery,
      traceId,
      spanId,
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info(`Delivery details fetched successfully for ID: ${deliveryId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getDeliveryDetailsById: ${error.message}`);
    callback(null, {
      success: false,
      message: 'Failed to fetch delivery details',
      traceId,
      spanId,
      
    });
  } finally {
    span.end();
  }
};
