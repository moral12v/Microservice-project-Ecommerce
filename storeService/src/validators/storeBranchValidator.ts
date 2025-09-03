import { body } from 'express-validator';

export const registerstoreBranchValidators = [
  
    body('branchName').notEmpty().withMessage('branchName is required'),
    body('name').notEmpty().withMessage('name is required'), 
    body('gstNumber').notEmpty().withMessage('gstNumber is required'),
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
    body('email').notEmpty().withMessage('email is required'),
    body('add1').notEmpty().withMessage('add1 is required'),  
    body('city').notEmpty().withMessage('city is required'),
    body('state').notEmpty().withMessage('state is required'),
    body('country').notEmpty().withMessage('country is required'),
    body('pincode').notEmpty().isLength({ min: 6, max: 6 }).withMessage('pincode is required'),
    body('service_radius').notEmpty().withMessage('service_radius is required'),
    body('Id').notEmpty().isNumeric().withMessage('Id is required'),
    body('Approved').notEmpty().isBoolean().withMessage('Approved is required'),
  
];

export const updatestoreBranchValidator = [
  body('branchName').notEmpty().withMessage('branchName cannot be empty'),
  body('name').notEmpty().withMessage('name cannot be empty'),
  body('gstNumber').notEmpty().withMessage('gstNumber cannot be empty'),
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
  body('email').notEmpty().withMessage('email cannot be empty'),
  body('add1').notEmpty().withMessage('add1 cannot be empty'),
    body('city').notEmpty().withMessage('city is required'),
    body('state').notEmpty().withMessage('state is required'),
    body('country').notEmpty().withMessage('country is required'),
    body('pincode').notEmpty().isLength({ min: 6, max: 6 }).withMessage('pincode cannot be empty'),
    body('service_radius').notEmpty().withMessage('service_radius cannot be empty'),
    body('Id').notEmpty().isNumeric().withMessage('Id cannot be empty'),
    body('Approved').notEmpty().isBoolean().withMessage('Approved cannot be empty'),
];
