import { check, ValidationChain } from "express-validator";

export const registerMallValidators: ValidationChain[] = [
  check("mallName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Mall name must be at least 3 characters long"),

  check("mallAddress")
    .optional()
    .notEmpty()
    .withMessage("Mall address is required"),

  check("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  check("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];

export const updateMallValidators: ValidationChain[] = [
  check("mallName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Mall name must be at least 3 characters long"),

  check("mallAddress")
    .optional()
    .notEmpty()
    .withMessage("Mall address is required"),

  check("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  check("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];
