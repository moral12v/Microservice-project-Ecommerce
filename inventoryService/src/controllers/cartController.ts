import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cartService";
import {
  errorResponse,
  responseWithData,
  responseWithoutData,
} from "../utils/response";
import logger from "../utils/logger";
import { trace, context } from "@opentelemetry/api";
import { getMerchantDetailsById } from "../gRPC/controller/merchantDetails";
class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer("inventory-service");
    const parentSpan = trace.getSpan(context.active());
    const span = tracer.startSpan("getCart", undefined, context.active());
    try {
      const customerId = req.customer ? req.customer._id : "";
      const cart = await cartService.getCartByCustomerId(customerId);
      let totalSellingPrice = 0;
      let totalActualPrice = 0;

      if (!cart || !cart.items || cart.items.length === 0) {
        return responseWithoutData(
          res,
          404,
          false,
          "Cart is empty or not found."
        );
      }

      cart.items.forEach((item: any) => {
        const product = item.product;
        const selectedVariant = item.selectedVariant;

        let productSellingPrice = selectedVariant
          ? Number(selectedVariant.sellingPrice)
          : Number(product.sellingPrice);
        let productActualPrice = selectedVariant
          ? Number(selectedVariant.actualPrice)
          : Number(product.actualPrice);

        const productTotalSellingPrice =
          productSellingPrice * Number(item.quantity);
        const productTotalActualPrice =
          productActualPrice * Number(item.quantity);
        totalSellingPrice += productTotalSellingPrice;
        totalActualPrice += productTotalActualPrice;

        item.selectedAddOns.forEach((addon: any) => {
          if (addon.choiceId) {
            totalSellingPrice += Number(addon.choices.sellingPrice);
            totalActualPrice += Number(addon.choices.actualPrice);
          }
        });
      });

      const merchantDetails: any = await getMerchantDetailsById(
        cart?.merchantId,
        span
      );
      const { timings, password, ...restMerchantDetails } =
        merchantDetails?.merchantData || {};
      const cartData = {
        cartDetails: cart,
        totalSellingPrice,
        totalActualPrice,
        merchantDetails: restMerchantDetails,
      };

      span.setStatus({ code: 1, message: "Success" });
      span.end();
      responseWithData(
        res,
        200,
        true,
        "Cart retrieved successfully.",
        cartData
      );
    } catch (error: any) {
      logger.error(`Error retrieving cart: ${error.message}`);
      span.setStatus({ code: 2, message: `Error: ${error.message}` });
      span.end();
      errorResponse(res, "Failed to retrieve cart.");
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const tracer = trace.getTracer("inventory-service");
      const span = tracer.startSpan("getCart", undefined, context.active());
      const customerId = req.customer ? req.customer._id : "";
      const { merchantId, productId, variantId, quantity, addons } = req.body;
      const item = {
        productId,
        variantId,
        quantity,
        addons,
      };
      let cart = await cartService.getCartByCustomerId(customerId);
      if (cart?.cart && cart?.cart?.merchantId != merchantId) {
        return responseWithoutData(
          res,
          404,
          false,
          "Item is in cart from another merchant."
        );
      }
      if (!cart) {
        const merchantDetails: any = await getMerchantDetailsById(
          merchantId,
          span
        );
        const deliveryType = merchantDetails?.merchantData?.deliveryTypes[0];

        cart = await cartService.createCart(
          customerId,
          merchantId,
          deliveryType
        );
      }

      const updatedCart = await cartService.addItemToCart(customerId, item);
      responseWithData(
        res,
        200,
        true,
        "Item added to cart successfully.",
        updatedCart
      );
    } catch (error: any) {
      logger.error(`Error adding item to cart: ${error.message}`);
      errorResponse(res, "Failed to add item to cart.");
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { productId, quantity, addons, variantId } = req.body;

      const cart = await cartService.getCartByCustomerId(customerId);
      if (!cart) {
        return responseWithoutData(res, 404, false, "Cart not found.");
      }

      const { cart: updatedCart, message } = await cartService.updateCartItem(
        customerId,
        {
          productId,
          quantity,
          addons,
          variantId,
        }
      );

      responseWithData(
        res,
        200,
        true,
        message || "Cart item updated successfully.",
        { cart: updatedCart }
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
      responseWithoutData(
        res,
        500,
        false,
        "An error occurred while updating the cart."
      );
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { productId, addons, variantId } = req.body;

      const cart = await cartService.getCartByCustomerIdV2(customerId);
      if (!cart) {
        return responseWithoutData(res, 404, false, "Cart not found.");
      }
      console.log(cart)

      const cartItem = cart.items.find(
        (item: any) => item.productId.toString() === productId
      );
      if (!cartItem) {
        return responseWithoutData(
          res,
          404,
          false,
          "Item not found in the cart."
        );
      }
      const updatedCart = await cartService.removeItemFromCart(
        customerId,
        productId,
        addons,
        variantId
      );
      responseWithData(
        res,
        200,
        true,
        "Item removed from cart successfully.",
        updatedCart
      );
    } catch (error: any) {
      logger.error(`Error removing item from cart: ${error.message}`);
      errorResponse(res, "Failed to remove item from cart.");
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const cart = await cartService.getCartByCustomerId(customerId);
      if (!cart) {
        return responseWithoutData(res, 404, false, "Cart not found.");
      }
      const updatedCart = await cartService.clearCart(customerId);
      responseWithData(
        res,
        200,
        true,
        "Cart cleared successfully.",
        updatedCart
      );
    } catch (error: any) {
      logger.error(`Error clearing cart: ${error.message}`);
      errorResponse(res, "Failed to clear cart.");
    }
  }
}

export const cartController = new CartController();
