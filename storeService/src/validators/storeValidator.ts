import { body } from 'express-validator';

export const registerStoreValidators = [
    body('gstNumber').notEmpty().withMessage('gstNumber is required'),
    body('email').notEmpty().withMessage('email is required'),
    body("mobile").notEmpty().isLength({ min: 10, max: 10 }).withMessage("Mobile number is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match password");
      }
      return true;
    }),
    body('pincode').notEmpty().isLength({ min: 6, max: 6 }).isNumeric().withMessage('pincode is required'),
];

export const updateStoreValidator = [
  body('gstNumber').notEmpty().withMessage('gstNumber cannot be empty'),
  body('email').notEmpty().withMessage('email cannot be empty'),
  body("mobile").notEmpty().isLength({ min: 10, max: 10 }).withMessage("Mobile number is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match password");
      }
      return true;
    }),
  body('pincode').notEmpty().isNumeric().isLength({ min: 6, max: 6 }).withMessage('pincode is required'),
]