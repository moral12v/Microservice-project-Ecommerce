import { body } from 'express-validator';

export const registerStoreTimingValidators = [
    body('open-time').notEmpty().withMessage('open-time is required'),
    body('close-time').notEmpty().withMessage('close-time is required'),
    body('isOpen').notEmpty().isBoolean().withMessage('isOpen is required'),
   
];

export const updateStoreTimingValidator = [
  body('open-time').notEmpty().withMessage('open-time cannot be empty'),
  body('close-time').notEmpty().withMessage('close-time cannot be empty'),
  body('isOpen').notEmpty().isBoolean().withMessage('isOpen cannot be empty'),
  
];
