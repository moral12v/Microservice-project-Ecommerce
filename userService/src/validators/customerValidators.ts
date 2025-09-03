import { body } from 'express-validator';

export const registercustomerValidators = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('Mobile number is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];

export const updatecustomerValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no cannot be empty'),
];

export const verifyOTPValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
];

export const resendOTPValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
];

export const loginValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({
      min: 8,
    })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password does not match password');
      }
      return true;
    }),
];

export const sendOTPValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
];

export const loginOTPValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
];
