
import { body } from 'express-validator';

export const categoryValidation = () => {
  return [
    body('name')
      .notEmpty().withMessage('Category name is required')
     
      .trim()
      .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long'),
    body('isActive')
      .notEmpty().withMessage('Active status is required')
      
  ];
};
