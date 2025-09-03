import { CustomerData, CustomerDetailsRequest, CustomerDetailsResponse } from '../types/user_service_pb';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { getCustomerById } from '../../services/customerService'; 

export const getCustomerDetailsById = async (
  call: ServerUnaryCall<CustomerDetailsRequest, CustomerDetailsResponse>,
  callback: sendUnaryData<CustomerDetailsResponse>
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

  const tracer = trace.getTracer('customer-service');
  const spanOptions: SpanOptions = {
    kind: 1, // SpanKind.SERVER for gRPC server
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan('getCustomerDetailsById', spanOptions);

  try {
    const { customerId } = call.request; // Get customerId from the request

    // Fetch customer details using the customer service method
    const customer = await getCustomerById(customerId);

    if (!customer) {
      span.setStatus({ code: 2, message: 'Customer not found' });
      console.warn(`Customer with ID ${customerId} not found.`);
      callback(null, {
        success: false,
        message: 'Customer not found',
        traceId,
        spanId,
      });
      return;
    }

    const response: CustomerDetailsResponse = {
      success: true,
      message: 'Customer details fetched successfully',
      customerData: customer, // Assuming customer is the format expected for `customerData`
      traceId,
      spanId,
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info(`Customer details fetched successfully for ID: ${customerId}`);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in getCustomerDetailsById: ${error.message}`);
    callback(null, {
      success: false,
      message: 'Failed to fetch customer details',
      traceId,
      spanId,
    });
  } finally {
    span.end();
  }
};
