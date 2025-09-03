import logger from "../../utils/logger";
import { userServiceClient } from "../grpcClient";
import { context, trace, Span } from '@opentelemetry/api';
import { Metadata } from '@grpc/grpc-js'; 

export const authenticateStoreUser = (token: string): Promise<{
  success: boolean;
  message: string;
  customerData: any;
  traceId?: string;
  spanId?: string;
  span?: Span;
}> => {
  return new Promise((resolve, reject) => {
    const tracer = trace.getTracer('store-service'); 
    const span = tracer.startSpan('authenticateStoreUser'); 
    context.with(trace.setSpan(context.active(), span), () => {
      const traceId = span.spanContext().traceId; 
      const spanId = span.spanContext().spanId; 
      const metadata = new Metadata();
      metadata.add('x-trace-id', traceId);
      metadata.add('x-span-id', spanId);
      userServiceClient.authenticateUser({ token }, metadata, (error: any, response: any) => {
        if (error) {
          logger.error('Error authenticating user:', { error, traceId, spanId });
          span.setStatus({ code: 2, message: 'Error' }); 

          return reject({
            success: false,
            message: 'Authentication service unavailable',
            traceId, 
            spanId,    
            span      
          });
        }
        logger.info('User authenticated successfully:', { response, traceId, spanId });
        resolve({
          ...response,
          traceId,  
          spanId,    
          span       
        });
      });
    });
  });
};
