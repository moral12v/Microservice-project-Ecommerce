import { body } from "express-validator";

export const subcategoryValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

    body("isActive")
      .notEmpty()
      .withMessage("Active status is required")
      .isBoolean()
      .withMessage("Active status must be a boolean"),

    body("imageUrl")
      .notEmpty()
      .withMessage("Image URL is required")
      .isString()
      .withMessage("Image URL must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ];
};
