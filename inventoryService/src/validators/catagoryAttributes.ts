
import { body } from 'express-validator';

export const categoryAttributesValidation = () => {
  return [
    body('id')
      .notEmpty().withMessage('ID is required')
      .isObject().withMessage('ID must be an object'),
    body('categoryId')
      .notEmpty().withMessage('Category ID is required')
      .isObject().withMessage('Category ID must be an object'),
    body('attributeName')
      .notEmpty().withMessage('Attribute Name is required')
      .isString().withMessage('Attribute Name must be a string')
      .trim()
      .isLength({ min: 1 }).withMessage('Attribute Name must be at least 1 character long'),
  ];
};
