import { Request, Response, NextFunction } from "express";
import { responseWithoutData } from "../utils/response";
import { handleCustomerAuth } from "../kafka/handdlers/customerAuth";
import { Span, trace } from "@opentelemetry/api";
import { AuthResponse } from "src/gRPC/types/user_service_pb";
import { Metadata } from "@grpc/grpc-js";
import { authenticateInventoryUser } from "../gRPC/controller/authenticateUser";
import { CustomerData } from "./validateUser";


declare global {
  namespace Express {
    interface Request {
      customer?: any;
      traceId?: string;
      spanId?: string;
      span?: Span; 
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      customer?: any;
      traceId?: string;
      spanId?: string;
      span?: Span; 
    }
  }
}


export const optionalCustomerAuthentication = async (
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
        return next();
      }
      const metadata = new Metadata();
      metadata.add('x-trace-id', req.traceId);
      metadata.add('x-span-id', req.spanId);
      const authResponse: AuthResponse = await authenticateInventoryUser(token, span, metadata);
      if (authResponse && authResponse.isValid) {
        req.customer = authResponse.customerData as CustomerData;
        span.setStatus({ code: 0, message: "Authentication successful" });
        console.info("Customer authenticated successfully:", req.customer);
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
  
  
  
