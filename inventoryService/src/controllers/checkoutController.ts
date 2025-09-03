import { Request, Response } from "express";
import CheckoutService from "../services/checkout";
import { responseWithData, errorResponse } from "../utils/response";
import logger from "../utils/logger";
import { cartService } from "../services/cartService";
import { getMerchantDetailsById } from "../gRPC/controller/merchantDetails";
import { trace, Span } from "@opentelemetry/api";

class CheckoutController {
  async handleCheckout(req: Request, res: Response) {
    const parentSpan: Span = req.span as any;
    const tracer = trace.getTracer("inventory-service");
    const span: Span = tracer.startSpan("handleCheckout", {
      links: [{ context: parentSpan.spanContext() }],
    });
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { deliveryType, couponCode, addressId } = req?.body;
      const cart = await cartService.getCartByCustomerId(customerId);
      const merchantDetails = await getMerchantDetailsById(
        cart?.merchantId,
        span
      );
      const checkoutResult = await CheckoutService.checkout(
        customerId,
        cart?._id,
        deliveryType,
        couponCode,
        addressId,
        merchantDetails?.merchantData
      );
      return responseWithData(
        res,
        200,
        true,
        "Checkout successful",
        checkoutResult
      );
    } catch (error: any) {
      logger.error(`Error calculating Checkout: ${error.message}`);
      errorResponse(res, error.message || "Failed to calculate checkout.");
    } finally {
      span.end();
    }
  }
}
export default new CheckoutController();
