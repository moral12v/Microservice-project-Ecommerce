import { body } from "express-validator";
import mongoose from "mongoose";

export const MerchantProductValidators = [
  body("aggregatorProductId")
    .notEmpty()
    .withMessage("Aggregator Product ID is required")
    .isMongoId()
    .withMessage("Aggregator Product ID must be a valid ObjectId"),
  body("merchantId")
    .notEmpty()
    .withMessage("Merchant ID is required")
    .isMongoId()
    .withMessage("Merchant ID must be a valid ObjectId"),
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId"),
  body("subCategoryId")
    .isArray()
    .withMessage("SubCategory ID must be an array")
    .custom((value) =>
      value.every((id: any) => mongoose.Types.ObjectId.isValid(id))
    )
    .withMessage("Each SubCategory ID must be a valid ObjectId"),
  body("productTitle").notEmpty().withMessage("Product Title is required"),
  body("productDescription")
    .notEmpty()
    .withMessage("Product Description is required"),
  body("packingCharge")
    .isNumeric()
    .withMessage("Packing Charge must be a number")
    .isInt({ min: 0 })
    .withMessage("Packing Charge must be at least 0"),
  body("stock")
    .isNumeric()
    .withMessage("stock must be a number")
    .isInt({ min: 0 })
    .withMessage("stock must be at least 0"),
  body("sellingPrice")
    .isNumeric()
    .withMessage("Selling Price must be a number")
    .isInt({ min: 0 })
    .withMessage("Selling Price must be at least 0"),
  body("actualPrice")
    .isNumeric()
    .withMessage("Actual Price must be a number")
    .isInt({ min: 0 })
    .withMessage("Actual Price must be at least 0"),
  body("gst")
    .isNumeric()
    .withMessage("GST must be a number")
    .isInt({ min: 0, max: 100 })
    .withMessage("GST must be between 0 and 100"),
  body("freeDelivery")
    .isBoolean()
    .withMessage("Free Delivery must be a boolean"),
  body("foodType")
    .optional()
    .isString()
    .withMessage("Food Type must be a string"),
  body("weight").optional().isNumeric().withMessage("Weight must be a number"),
  body("isExchange").isBoolean().withMessage("Is Exchange must be a boolean"),
  body("exchangePolicy")
    .optional()
    .isString()
    .withMessage("Exchange Policy must be a string"),
  body("isCancellation")
    .isBoolean()
    .withMessage("Is Cancellation must be a boolean"),
  body("cancellationPolicy")
    .optional()
    .isString()
    .withMessage("Cancellation Policy must be a string"),
  body("deliveryFee")
    .optional()
    .isNumeric()
    .withMessage("Delivery Fee must be a number")
    .isInt({ min: 0 })
    .withMessage("Delivery Fee must be at least 0"),
  body("productImageUrl")
    .notEmpty()
    .withMessage("Product Image URL is required")
    .isString()
    .withMessage("Product Image URL must be a string"),
  body("hasTime")
    .optional()
    .isBoolean()
    .withMessage("Has Time must be a boolean"),
  body("startTime")
    .optional()
    .isString()
    .withMessage("Start Time must be a string")
    .isLength({ min: 5, max: 5 })
    .withMessage("Start Time must be in HH:MM format"),
  body("endTime")
    .optional()
    .isString()
    .withMessage("End Time must be a string")
    .isLength({ min: 5, max: 5 })
    .withMessage("End Time must be in HH:MM format"),
];

export const UpdateMerchantProductValidators = [
  body("aggregatorProductId")
    .optional()
    .notEmpty()
    .withMessage("Aggregator Product ID is required")
    .isMongoId()
    .withMessage("Aggregator Product ID must be a valid ObjectId"),
  body("merchantId")
    .optional()
    .notEmpty()
    .withMessage("Merchant ID is required")
    .isMongoId()
    .withMessage("Merchant ID must be a valid ObjectId"),
  body("categoryId")
    .optional()
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId"),
  body("subCategoryId")
    .optional()
    .isArray()
    .withMessage("SubCategory ID must be an array")
    .custom((value) =>
      value.every((id: any) => mongoose.Types.ObjectId.isValid(id))
    )
    .withMessage("Each SubCategory ID must be a valid ObjectId"),
  body("productTitle")
    .optional()
    .notEmpty()
    .withMessage("Product Title is required"),
  body("productDescription")
    .optional()
    .notEmpty()
    .withMessage("Product Description is required"),
  body("packingCharge")
    .optional()
    .isNumeric()
    .withMessage("Packing Charge must be a number")
    .isInt({ min: 0 })
    .withMessage("Packing Charge must be at least 0"),
  body("stock")
    .optional()
    .isNumeric()
    .withMessage("stock must be a number")
    .isInt({ min: 0 })
    .withMessage("stock must be at least 0"),
  body("sellingPrice")
    .optional()
    .isNumeric()
    .withMessage("Selling Price must be a number")
    .isInt({ min: 0 })
    .withMessage("Selling Price must be at least 0"),
  body("actualPrice")
    .optional()
    .isNumeric()
    .withMessage("Actual Price must be a number")
    .isInt({ min: 0 })
    .withMessage("Actual Price must be at least 0"),
  body("gst")
    .optional()
    .isNumeric()
    .withMessage("GST must be a number")
    .isInt({ min: 0, max: 100 })
    .withMessage("GST must be between 0 and 100"),
  body("freeDelivery")
    .optional()
    .isBoolean()
    .withMessage("Free Delivery must be a boolean"),
  body("foodType")
    .optional()
    .isString()
    .withMessage("Food Type must be a string"),
  body("weight").optional().isNumeric().withMessage("Weight must be a number"),
  body("isExchange")
    .optional()
    .isBoolean()
    .withMessage("Is Exchange must be a boolean"),
  body("exchangePolicy")
    .optional()
    .isString()
    .withMessage("Exchange Policy must be a string"),
  body("isCancellation")
    .optional()
    .isBoolean()
    .withMessage("Is Cancellation must be a boolean"),
  body("cancellationPolicy")
    .optional()
    .isString()
    .withMessage("Cancellation Policy must be a string"),
  body("deliveryFee")
    .optional()
    .isNumeric()
    .withMessage("Delivery Fee must be a number")
    .isInt({ min: 0 })
    .withMessage("Delivery Fee must be at least 0"),
  body("productImageUrl")
    .optional()
    .notEmpty()
    .withMessage("Product Image URL is required")
    .isString()
    .withMessage("Product Image URL must be a string"),
  body("hasTime")
    .optional()
    .isBoolean()
    .withMessage("Has Time must be a boolean"),
  body("startTime")
    .optional()
    .isString()
    .withMessage("Start Time must be a string")
    .isLength({ min: 5, max: 5 })
    .withMessage("Start Time must be in HH:MM format"),
  body("endTime")
    .optional()
    .isString()
    .withMessage("End Time must be a string")
    .isLength({ min: 5, max: 5 })
    .withMessage("End Time must be in HH:MM format"),
];
