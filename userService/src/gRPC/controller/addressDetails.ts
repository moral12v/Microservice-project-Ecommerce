import { AddressData, AddressDetailsRequest, AddressDetailsResponse } from '../types/user_service_pb';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { getAddressById } from '../../services/addressService';

export const getAddressDetailsById = async (
  call: ServerUnaryCall<AddressDetailsRequest, AddressDetailsResponse>,
  callback: sendUnaryData<AddressDetailsResponse>,
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
        }
      : undefined;

  const tracer = trace.getTracer('address-service');
  const spanOptions: SpanOptions = {
    kind: 1,
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan('getAddressDetailsById', spanOptions);

  try {
    const { addressId } = call.request;

    const address: any = await getAddressById(addressId);

    if (!address) {
      span.setStatus({ code: 2, message: 'Address not found' });
      console.warn(`Address with ID ${addressId} not found.`);
      callback(null, {
        success: false,
        message: 'Address not found',
        traceId,
        spanId,
      });
      return;
    }

    const response: AddressDetailsResponse = {
      success: true,
      message: 'Address details fetched successfully',
      addressData: address,
      traceId,
      spanId,
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info(`Address details fetched successfully for ID: ${addressId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getAddressDetailsById: ${error.message}`);
    callback(null, {
      success: false,
      message: 'Failed to fetch address details',
      traceId,
      spanId,
    });
  } finally {
    span.end();
  }
};
