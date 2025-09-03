import { MerchantData, MerchantDetailsRequest, MerchantDetailsResponse } from '../types/store_service_pb';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { getStoreById } from '../../services/storeService';

export const getMerchantDetailsById = async (
  call: ServerUnaryCall<MerchantDetailsRequest, MerchantDetailsResponse>,
  callback: sendUnaryData<MerchantDetailsResponse>
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  const traceId = metadata.get('x-trace-id')?.[0] as string | undefined;
  const spanId = metadata.get('x-span-id')?.[0] as string | undefined;
  const linkedSpanContext = traceId && spanId ? {
    traceId,
    spanId,
    traceFlags: 1,
    isRemote: true,
  } : undefined;
  const tracer = trace.getTracer('store-service');
  const spanOptions: SpanOptions = {
    kind: 1, 
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };
  const span: Span = tracer.startSpan('getMerchantDetailsById', spanOptions);
  try {
    const { merchantId } = call.request;

    const merchant :any= await getStoreById(merchantId);

    if (!merchant) {
      span.setStatus({ code: 2, message: 'Merchant not found' });
      console.warn(`Merchant with ID ${merchantId} not found.`);
      callback(null, {
        success: false,
        message: 'Merchant not found',
        traceId,
        spanId,
      });
      return;
    }
    const response: MerchantDetailsResponse = {
      success: true,
      message: 'Merchant details fetched successfully',
      merchantData:merchant,
      traceId,
      spanId,
    };
    console.log(response,"------------------------->response")
    span.setStatus({ code: 1, message: 'Success' });
    console.info(`Merchant details fetched successfully for ID: ${merchantId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getMerchantDetailsById: ${error.message}`);
    callback(null, {
      success: false,
      message: 'Failed to fetch merchant details',
      traceId,
      spanId,
    });
  } finally {
    span.end();
  }
};
