import { body } from 'express-validator';

export const registerCombinationDetailsValidators = [
  body('id').notEmpty().withMessage('id is required'),
  body('combination_id').isEmail().withMessage('combination_id must be valid'),
  body('attribute_id').notEmpty().withMessage('attribute_id is required'),
  body('attribute_value').notEmpty().withMessage('attribute_value is required'),
];

export const updateCombinationDetailsValidators = [
  body('id').notEmpty().withMessage('id is required'),
  body('combination_id').isEmail().withMessage('combination_id must be valid'),
  body('attribute_id').notEmpty().withMessage('attribute_id is required'),
  body('attribute_value').notEmpty().withMessage('attribute_value is required'),
]