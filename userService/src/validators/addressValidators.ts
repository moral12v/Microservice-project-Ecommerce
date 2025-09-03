import { body } from 'express-validator';

export const registerAddressValidators = [
  body('fullName')
    .notEmpty()
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage('fullName is required'),
  body('city').notEmpty().withMessage('city is required'),
  body('state').notEmpty().withMessage('state is required'),
  body('country').notEmpty().withMessage('country is required'),
  body('area').notEmpty().withMessage('area is required'),
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile is required'),
  body('zipcode')
    .notEmpty()
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage('zipcode is required'),
];

export const updateAddressValidator = [
  body('fullName')
    .notEmpty()
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage('fullName cannot be empty'),
  body('city').notEmpty().withMessage('city cannot be empty'),
  body('state').notEmpty().withMessage('state cannot be empty'),
  body('country').notEmpty().withMessage('country cannot be empty'),
  body('area').notEmpty().withMessage('area cannot be empty'),
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile cannot be empty'),
  body('zipcode')
    .notEmpty()
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage('zipcode cannot be empty'),
];
