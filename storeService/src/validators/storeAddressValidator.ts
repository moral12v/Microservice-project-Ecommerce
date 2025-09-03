import { body } from 'express-validator';

export const registerstoreAddressValidator = [
    body('city').notEmpty().withMessage('city is required').isString().withMessage('city must be a string'),
    body('state').notEmpty().withMessage('state is required').isString().withMessage('state must be a string'),
    body('country').notEmpty().withMessage('country is required').isString().withMessage('country must be a string'),
    body('pincode').notEmpty().isLength({ min: 6, max: 6 }).withMessage('pincode is required').isString().withMessage('pincode must be a string'),
    body('area').notEmpty().withMessage('area is required').isString().withMessage('area must be a string'),
    body('streetNumber').notEmpty().withMessage('streetNumber is required').isInt().withMessage('streetNumber must be an integer'),
    body('landmark').optional().isString().withMessage('landmark must be a string'),
    body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('lat must be a valid latitude'),
    body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('lng must be a valid longitude'),
];

export const updateStoreAddressValidator = [
    body('city').notEmpty().withMessage('city cannot be empty').isString().withMessage('city must be a string'),
    body('state').notEmpty().withMessage('state cannot be empty').isString().withMessage('state must be a string'),
    body('country').notEmpty().withMessage('country cannot be empty').isString().withMessage('country must be a string'),
    body('pincode').isLength({ min: 6, max: 6 }).notEmpty().withMessage('pincode cannot be empty').isString().withMessage('pincode must be a string'),
    body('area').notEmpty().withMessage('area cannot be empty').isString().withMessage('area must be a string'),
    body('streetNumber').notEmpty().withMessage('streetNumber cannot be empty').isInt().withMessage('streetNumber must be an integer'),
    body('landmark').optional().isString().withMessage('landmark must be a string'),
    body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('lat must be a valid latitude'),
    body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('lng must be a valid longitude'),
];