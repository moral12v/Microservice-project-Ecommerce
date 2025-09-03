import { body } from "express-validator";

enum ApprovalStatus {
  Pending = "pending",
  Completed = "completed",
  Rejected = "rejected",
}

export const AggregatorproductValidators = [
 
  body("categoryId").notEmpty().withMessage("Category ID is required"),
  body("subCategoryId")
    .isArray()
    .withMessage("Sub-Category ID must be an array of strings"),
  body("productTitle")
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "Product title is required and must be between 1 and 50 characters"
    ),
  body("productDescription")
    .notEmpty()
    .isLength({ min: 1, max: 250 })
    .withMessage(
      "Product description is required and must be between 1 and 250 characters"
    ),
  body("stock").isNumeric().withMessage("stock must be a number"),
  body("sellingPrice")
    .isNumeric()
    .withMessage("Selling price must be a number"),
  body("actualPrice").isNumeric().withMessage("Actual price must be a number"),
  body("gst").isNumeric().withMessage("GST must be a number"),
  body("packingCharge")
    .isNumeric()
    .withMessage("Packing charge must be a number"),
  body("freeDelivery")
    .isBoolean()
    .withMessage("Free delivery must be a boolean"),
  body("deliveryFee")
    .optional()
    .isNumeric()
    .withMessage("Delivery fee must be a number"),
  body("foodType")
    .optional()
    .isString()
    .withMessage("Food type must be a string"),
  body("weigth").optional().isNumeric().withMessage("Weight must be a number"),
  body("productImageUrl")
    .optional()
    .isString()
    .withMessage("Product image URL must be a string"),
  body("isExchange").isBoolean().withMessage("Exchange must be a boolean"),
  body("exchangePolicy").notEmpty().withMessage("Exchange policy is required"),
  body("isCancellation")
    .isBoolean()
    .withMessage("Cancellation must be a boolean"),
  body("cancellationPolicy")
    .notEmpty()
    .withMessage("Cancellation policy is required"),
];

export const UpdateAggregatorProductValidators = [
  body("aggregatorId")
    .optional()
    .notEmpty()
    .withMessage("Aggregator ID is required"),
  body("approved")
    .optional()
    .isIn(Object.values(ApprovalStatus))
    .withMessage(
      "Approved status must be 'pending', 'completed', or 'rejected'"
    ),
  body("categoryId")
    .optional()
    .notEmpty()
    .withMessage("Category ID is required"),
  body("subCategoryId")
    .optional()
    .isArray()
    .withMessage("Sub-Category ID must be an array of strings"),
  body("productTitle")
    .optional()
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage("Product title must be between 1 and 50 characters"),
  body("productDescription")
    .optional()
    .notEmpty()
    .isLength({ min: 1, max: 250 })
    .withMessage("Product description must be between 1 and 250 characters"),
  body("stock").optional().isNumeric().withMessage("stock must be a number"),
  body("sellingPrice")
    .optional()
    .isNumeric()
    .withMessage("Selling price must be a number"),
  body("actualPrice")
    .optional()
    .isNumeric()
    .withMessage("Actual price must be a number"),
  body("gst").optional().isNumeric().withMessage("GST must be a number"),
  body("packingCharge")
    .optional()
    .isNumeric()
    .withMessage("Packing charge must be a number"),
  body("freeDelivery")
    .optional()
    .isBoolean()
    .withMessage("Free delivery must be a boolean"),
  body("deliveryFee")
    .optional()
    .isNumeric()
    .withMessage("Delivery fee must be a number"),
  body("foodType")
    .optional()
    .isString()
    .withMessage("Food type must be a string"),
  body("weigth").optional().isNumeric().withMessage("Weight must be a number"),
  body("productImageUrl")
    .optional()
    .isString()
    .withMessage("Product image URL must be a string"),
  body("isExchange")
    .optional()
    .isBoolean()
    .withMessage("Exchange must be a boolean"),
  body("exchangePolicy")
    .optional()
    .notEmpty()
    .withMessage("Exchange policy is required"),
  body("isCancellation")
    .optional()
    .isBoolean()
    .withMessage("Cancellation must be a boolean"),
  body("cancellationPolicy")
    .optional()
    .notEmpty()
    .withMessage("Cancellation policy is required"),
];
