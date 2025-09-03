import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { cartService } from '../../services/cartService';
import CheckoutService from '../../services/checkout';
import { PriceDetailsRequest, PriceDetailsResponse } from '../types/inventory_service_pb';
import { getMerchantDetailsById } from './merchantDetails';

export const priceDetails = async (
  call: ServerUnaryCall<PriceDetailsRequest, PriceDetailsResponse>,
  callback: sendUnaryData<PriceDetailsResponse>
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

  const tracer = trace.getTracer('price-service');
  const spanOptions: SpanOptions = {
    kind: 1, 
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };
  const span: Span = tracer.startSpan('sendPriceDetails', spanOptions);

  try {
    const { customerId, deliveryType, couponCode, addressId } = call.request;

    const cart = await cartService.getCartByCustomerId(customerId);
    const merchantDetails = await getMerchantDetailsById(cart?.merchantId, span);
     console.log(merchantDetails)
    const checkoutResult = await CheckoutService.checkout(
      customerId,
      cart?._id,
      deliveryType,
      couponCode as string,
      addressId,
      merchantDetails?.merchantData
    );

    const response: PriceDetailsResponse = {
      success: true,
      message: 'Price details fetched successfully',
      data: checkoutResult.totals,
      traceId,
      spanId,
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info(`Price details fetched successfully for customer ID: ${customerId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in sendPriceDetails: ${error.message}`);
    
    callback(null, {
      success: false,
      message: 'Failed to fetch price details',
      traceId,
      spanId,
    });
  } finally {
    span.end();
  }
};
