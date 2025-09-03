import { VendorAuthRequest, VendorAuthResponse } from '../types/user_service_pb'; 
import VendorAccessToken from '../../models/vendorAccessModel';
import { verifyToken } from '../../services/jwtServices';
import { authValues } from '../../utils/vendorAuthValues';
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';

interface VendorData {
  _id: string;        
  fullName: string;      
  mobile: string;       
}

export const authenticateAggregator = async (
  call: ServerUnaryCall<VendorAuthRequest, VendorAuthResponse>,
  callback: sendUnaryData<VendorAuthResponse>                   
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
  const tracer = trace.getTracer('user-service');
  const spanOptions: SpanOptions = {
    kind: 1, 
    links: linkedSpanContext ? [{ context: linkedSpanContext }] : [],
  };

  const span: Span = tracer.startSpan('authenticateVendor', spanOptions);

  try {
    const { token } = call.request;
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      span.setStatus({ code: 2, message: 'Invalid token' });
      console.warn('Invalid token received.');
      callback(null, { success: false, message: 'Invalid Token', traceId, spanId });
      return;
    }

    const decoded = await authValues(verifiedToken);
    if (!decoded) {
      span.setStatus({ code: 2, message: 'Token decoding failed' });
      console.warn('Token decoding failed.');
      callback(null, { success: false, message: 'Token decoding failed', isValid: false, traceId, spanId });
      return;
    }

    const accessTokenExists = await VendorAccessToken.exists({
      vendorId: decoded._id,
      accessToken: token,
      isActive: true,
    });
    if (!accessTokenExists) {
      span.setStatus({ code: 2, message: 'Access token not found or inactive' });
      console.warn('Access token not found or inactive for vendor:', decoded._id);
      callback(null, { success: false, message: 'Access token not found or inactive', isValid: false, traceId, spanId });
      return;
    }

    const vendorData: VendorData = {
      _id: decoded._id,
      fullName: decoded.fullName,
      mobile: decoded.mobile,
    };

    const response: VendorAuthResponse = {
      success: true,
      message: 'Authentication successful',
      vendorData: vendorData, 
      isValid: true,
      traceId,
      spanId,
    };
    
    span.setStatus({ code: 1, message: 'Success' });
    console.info('Authentication successful for vendor:', vendorData);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in authenticateVendor: ${error.message}`);
    callback(null, { success: false, message: 'Authentication failed', isValid: false, traceId, spanId });
  } finally {
    span.end();
  }
};
