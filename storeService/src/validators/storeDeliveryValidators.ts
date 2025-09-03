import { body } from 'express-validator';

export const registerstoreDeliveryValidators = [
    body('VendorId').notEmpty().isNumeric().withMessage('VendorId is required'),
   
];

export const updatestoreDeliveryValidator = [
  body('VendorId').notEmpty().isNumeric().withMessage('VendorId cannot be empty'),

];

