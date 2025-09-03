import { AuthRequest, AuthResponse } from '../types/user_service_pb';
import { verifyToken } from '../../services/jwtServices';
import { authValues } from '../../utils/customerAuthValues';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions, SpanContext, context, propagation, Link } from '@opentelemetry/api';

interface CustomerData {
  _id: string;
  fullName: string;
  mobile: string;
}

export const authenticateUser = async (
  call: ServerUnaryCall<AuthRequest, AuthResponse>,
  callback: sendUnaryData<AuthResponse>
): Promise<void> => {
  const metadata: Metadata = call.metadata;
  console.log("Incoming Metadata:", metadata);

  const traceId = metadata.get('x-trace-id')?.[0] as string | undefined;
  const spanId = metadata.get('x-span-id')?.[0] as string | undefined;

  const linkedSpanContext: SpanContext | undefined = traceId && spanId ? {
    traceId,
    spanId,
    traceFlags: 1,
    isRemote: true,
    traceState: undefined
  } : undefined;

  console.log("Linked Span Context:", linkedSpanContext);

  const tracer = trace.getTracer('user-service');
  const links: Link[] = linkedSpanContext ? [{
    context: {
        traceId: linkedSpanContext.traceId,
        spanId: linkedSpanContext.spanId,
        traceFlags: 1,
        isRemote: true,
    }
}] : [];

  const spanOptions: SpanOptions = {
    kind: 1, 
    links: links,
    attributes: {
      'request.token': call.request.token,     
    },
    
  };


  const span: Span = tracer.startSpan('authenticateUser', spanOptions);
  const ctx = trace.setSpan(context.active(), span);

  try {
    const { token } = call.request;

    await context.with(ctx, async () => {
      const verifiedToken = verifyToken(token);

      if (!verifiedToken) {
        span.setStatus({ code: 2, message: 'Invalid token' });
        callback(null, { success: false, message: 'Invalid Token', traceId, spanId });
        return;
      }

      const decoded = await authValues(verifiedToken);

      if (!decoded) {
        span.setStatus({ code: 2, message: 'Token decoding failed' });
        callback(null, { success: false, message: 'Token decoding failed', isValid: false, traceId, spanId });
        return;
      }

      const customerData: CustomerData = { 
        _id: decoded._id, 
        fullName: decoded.fullName, 
        mobile: decoded.mobile 
      };

      const response: AuthResponse = { 
        success: true, 
        message: 'Authentication successful', 
        customerData, 
        isValid: true, 
        traceId, 
        spanId 
      };

      span.setStatus({ code: 1, message: 'Success' });
      callback(null, response);
    });
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    callback(null, { success: false, message: 'Authentication failed', isValid: false, traceId, spanId });
  } finally {
    span.end(); 
  }
};
