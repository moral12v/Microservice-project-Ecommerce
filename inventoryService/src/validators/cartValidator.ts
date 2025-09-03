import { body } from "express-validator";

export const addToCartValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than zero"),
];

export const updateCartItemValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than zero"),
];

export const removeFromCartValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
];
