import { Request, Response, NextFunction } from "express";
import { responseWithoutData } from "../utils/response";
import { Span, trace } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { VendorAuthResponse } from "../gRPC/types/user_service_pb";
import { authenticateAggregator } from "../gRPC/controller/authenticateAggregator";

interface VendorData {
  _id: string;
  fullName: string;
  mobile: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: VendorData;
      traceId?: string;
      spanId?: string;
      span?: Span; 
    }
  }
}


export const vendorAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tracer = trace.getTracer("store-service");
  const span: Span = tracer.startSpan("vendorAuthentication");
  req.traceId = span.spanContext().traceId;
  req.spanId = span.spanContext().spanId;
  req.span = span;

  try {
    const token = req.headers["authorization"];
    if (!token) {
      span.setStatus({ code: 1, message: "No token provided" });
      console.warn("No token provided for authentication.");
      return next();
    }
    const metadata = new Metadata();
    metadata.add('x-trace-id', req.traceId);
    metadata.add('x-span-id', req.spanId);
    const authResponse: VendorAuthResponse = await authenticateAggregator(token, span, metadata);
    if (authResponse && authResponse.isValid) {
      req.user = authResponse.vendorData as VendorData;
      span.setStatus({ code: 0, message: "Authentication successful" });
      console.info("Aggregator authenticated successfully:", (req as any).customer);
      next();
    } else {
      span.setStatus({ code: 2, message: "Invalid Authorization Token" });
      console.warn("Invalid Authorization Token provided.");
      return responseWithoutData(res, 401, false, "Invalid Authorization Token");
    }
  } catch (error: any) {
    console.error("Authentication error:", error);
    span.setStatus({ code: 2, message: error.message });
    return responseWithoutData(res, 500, false, "Internal Server Error");
  } finally {
    span.end(); 
  }
};

