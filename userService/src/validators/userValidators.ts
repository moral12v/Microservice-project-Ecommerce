import { body } from 'express-validator';

export const registerUserValidators = [
  body('fullName')
    .notEmpty()
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage('full Name is required'),
  body('email').isEmail().withMessage('Email  is required  must be valid'),
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
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no  is required'),
];

export const updateUserValidators = [
  body('fullName')
    .notEmpty()
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage('full Name is required'),
  body('email').optional().isEmail().withMessage('Email  is required must be valid'),
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
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no  is required'),
];
