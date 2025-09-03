import { AuthRequest, AuthResponse, VendorAuthResponse } from '../types/user_service_pb';
import MerchantAccessToken from '../../models/StoreAccessModel';
import { verifyToken } from '../../services/jwtService';
import { authValues } from "../../utils/authValues";
import { ServerUnaryCall, sendUnaryData, Metadata } from '@grpc/grpc-js';
import { trace, Span, SpanOptions } from '@opentelemetry/api';
import { MerchantAuthResponse, MerchantData } from '../types/store_service_pb';


export const authenticateMerchant = async (
  call: ServerUnaryCall<AuthRequest, AuthResponse>,
  callback: sendUnaryData<AuthResponse>
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

  const span: Span = tracer.startSpan('authenticateMerchant', spanOptions);

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

    // const accessTokenExists = await MerchantAccessToken.exists({
    //   storeId: decoded._id,
    //   accessToken: tok
    //   isActive: true,
    // });
    // if (!accessTokenExists) {
    //   span.setStatus({ code: 2, message: 'Access token not found or inactive' });
    //   console.warn('Access token not found or inactive for merchant:', decoded._id);
    //   callback(null, { success: false, message: 'Access token not found or inactive', isValid: false, traceId, spanId });
    //   return;
    // }

    const merchantData: MerchantData = {
      _id: decoded._id,
      name: decoded.name
    };

    const response: MerchantAuthResponse = {
      success: true,
      message: 'Authentication successful',
      merchantData: merchantData,
      isValid: true,
      traceId,
      spanId,
    };

    span.setStatus({ code: 1, message: 'Success' });
    console.info('Authentication successful for merchant:', merchantData);
    callback(null, response);
  } catch (error: any) {
    span.setStatus({ code: 2, message: error.message });
    console.error(`Error in authenticateMerchant: ${error.message}`);
    callback(null, { success: false, message: 'Authentication failed', isValid: false, traceId, spanId });
  } finally {
    span.end();
  }
};