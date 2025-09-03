
import { body } from 'express-validator';

export const productVarientValidation = () => {
  return [
    body('productId')
      .notEmpty().withMessage('Product ID is required')
      .isObject().withMessage('Product ID must be an object'),
    
    body('stock')
      .notEmpty().withMessage('stock is required')
      .isNumeric().withMessage('stock must be a number'),
    
    body('price')
      .notEmpty().withMessage('Price is required')
      .isNumeric().withMessage('Price must be a number'),
  ];
};
