
import { body } from 'express-validator';

export const serviceValidation = () => {
  return [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string'),
    
    body('isActive')
      .notEmpty().withMessage('Active status is required')
      .isBoolean().withMessage('Active status must be a boolean'),
  ];
};
