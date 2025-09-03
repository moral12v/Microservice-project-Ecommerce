import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { MerchantProductRepository } from "../../repositories/merchantProduct"
import { GetAveragePriceRequest, GetAveragePriceResponse } from '../types/inventory_service_pb';

export const getAverageSellingPriceByMerchantId = async (
  call: ServerUnaryCall<GetAveragePriceRequest, GetAveragePriceResponse>,
  callback: sendUnaryData<GetAveragePriceResponse>
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
  const tracer = trace.getTracer('product-service');
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };
  const span: Span = tracer.startSpan('getAverageSellingPriceByMerchantProduct', spanOptions);
  try {
    const { merchantId } = call.request;
    const repository = new MerchantProductRepository();
    const averageSellingPrice = await repository.getAverageSellingPrice(merchantId);
    const response: GetAveragePriceResponse = {
      success: true,
      message: 'Average selling price calculated successfully',
      // averageSellingPrice,
      traceId,
      spanId,
    };
    span.setStatus({ code: 1, message: 'Success' });
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    callback(null, {
      success: false,
      message: 'Failed to calculate average selling price',
      averageSellingPrice: 0,
      traceId,
      spanId,
    });
  } finally {
    span.end();
  }
};
