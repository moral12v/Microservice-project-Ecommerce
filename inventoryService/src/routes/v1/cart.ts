import { Router } from "express";
import { cartController } from "../../controllers/cartController";
import { customerAuthentication } from "../../middlewares/validateUser";
import {
  addToCartValidator,
  removeFromCartValidator,
  updateCartItemValidator,
} from "../../validators/cartValidator";
import { validateRequest } from "../../middlewares/validateRequest";

export const cartRoutes = Router();

cartRoutes.get("/", customerAuthentication, cartController.getCart);
cartRoutes.post( "/",
  customerAuthentication,
  addToCartValidator,
  validateRequest,
  cartController.addItem
);
cartRoutes.patch(
  "/",
  customerAuthentication,
  updateCartItemValidator,
  cartController.updateItem
);
cartRoutes.delete(
  "/",
  customerAuthentication,
  removeFromCartValidator,
  cartController.removeItem
);
cartRoutes.delete("/clear", customerAuthentication, cartController.clearCart);
