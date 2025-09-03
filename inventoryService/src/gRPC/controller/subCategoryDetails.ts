import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { getSubcategoryById } from '../../services/subcategoryService';
import { SubCategoryDetailsRequest, SubCategoryDetailsResponse } from '../types/inventory_service_pb';


export const subCategoryDetails = async (
  call: ServerUnaryCall<SubCategoryDetailsRequest, SubCategoryDetailsResponse>,
  callback: sendUnaryData<SubCategoryDetailsResponse>
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  const traceId = metadata.get('x-trace-id')?.[0] as string | undefined;
  const spanId = metadata.get('x-span-id')?.[0] as string | undefined;

  const linkedSpanContext = traceId && spanId
    ? { traceId, spanId, traceFlags: 1, isRemote: true }
    : undefined;

  const tracer = trace.getTracer('inventory-service');
  const spanOptions: SpanOptions = {
    kind: 1, 
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan('subCategoryDetails', spanOptions);

  try {
    const { subCategoryId } = call.request;

    const subCategoryDetails = await getSubcategoryById(subCategoryId);

    if (!subCategoryDetails) {
      throw new Error(`SubCategory not found for subCategoryId: ${subCategoryId}`);
    }

    const response: SubCategoryDetailsResponse = {
      success: true,
      message: 'SubCategory details fetched successfully',
      subCategory: subCategoryDetails, 
      traceId: traceId || '',
      spanId: spanId || '', 
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info(`SubCategory details fetched for subCategoryId: ${subCategoryId}`);

  
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in subCategoryDetails: ${error.message}`);

    callback(null, {
      success: false,
      message: 'Failed to fetch sub-category details',
      traceId: traceId || '',
      spanId: spanId || '',
    });
  } finally {
    span.end();
  }
};
