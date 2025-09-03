import { Request, Response, NextFunction } from "express";
import { responseWithoutData } from "../utils/response";
import { authenticateInventoryMerchant } from "../gRPC/controller/merchantAuth";
import { Span, trace } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { MerchantAuthResponse, MerchantData } from "../gRPC/types/store_service_pb";

declare global {
  namespace Express {
    interface Request {
      merchant?: any;
      traceId?: string;
      spanId?: string;
      span?: Span; 
    }
  }
}
export const merchantAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tracer = trace.getTracer("inventory-service");
  const span: Span = tracer.startSpan("customerAuthentication");
  req.traceId = span.spanContext().traceId;
  req.spanId = span.spanContext().spanId;
  req.span = span;

  try {
    const token = req.headers["authorization"];
    if (!token) {
      span.setStatus({ code: 1, message: "No token provided" });
      console.warn("No token provided for authentication.");
 return responseWithoutData(res, 401, false, "Invalid Authorization Token");
    }
    const metadata = new Metadata();
    metadata.add('x-trace-id', req.traceId);
    metadata.add('x-span-id', req.spanId);
    const authResponse:MerchantAuthResponse = await authenticateInventoryMerchant(token, span, metadata);
    if (authResponse && authResponse.isValid) {
      req.merchant = authResponse.merchantData as MerchantData;
      console.log(authResponse)
      next();
    } else {
      return responseWithoutData(
        res,
        401,
        false,
        "Invalid Authorization Token"
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return responseWithoutData(res, 500, false, "Internal Server Error");
  }
};
