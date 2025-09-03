import { body } from "express-validator";

export const productValidation = () => {
  return [
    body("packingCharge")
      .optional()
      .isNumeric()
      .withMessage("Packing Charge must be a number"),

    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

    body("hasTime")
      .notEmpty()
      .withMessage("Has Time is required")
      .isBoolean()
      .withMessage("Has Time must be a boolean"),

    body("openTime")
      .optional()
      .isString()
      .withMessage("Open Time must be a string"),

    body("closeTime")
      .optional()
      .isString()
      .withMessage("Close Time must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    body("approve")
      .notEmpty()
      .withMessage("Approve is required")
      .isBoolean()
      .withMessage("Approve must be a boolean"),

    body("storeId")
      .optional()
      .isObject()
      .withMessage("Store ID must be an object"),

    body("available")
      .notEmpty()
      .withMessage("Available is required")
      .isBoolean()
      .withMessage("Available must be a boolean"),

    body("soldCount")
      .notEmpty()
      .withMessage("Sold Count is required")
      .isNumeric()
      .withMessage("Sold Count must be a number"),

    body("quantity")
      .optional()
      .isNumeric()
      .withMessage("Quantity must be a number"),

    body("price").optional().isNumeric().withMessage("Price must be a number"),

    body("comparePrice")
      .optional()
      .isNumeric()
      .withMessage("Compare Price must be a number"),

    body("gst").optional().isNumeric().withMessage("GST must be a number"),

    body("vendorId")
      .notEmpty()
      .withMessage("Vendor ID is required")
      .isObject()
      .withMessage("Vendor ID must be an object"),
     
  ];
};
