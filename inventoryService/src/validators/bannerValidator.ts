import { body } from "express-validator";

export const BannerValidators = () => {
    return [
      body('webBannerUrl')
        .optional()
        .isString().withMessage('Web Banner URL must be a string'),
      body('appBannerUrl')
        .optional() 
        .isString().withMessage('App Banner URL must be a string'),
      body('categoryId')
        .notEmpty().withMessage('Category ID is required')
        .isString().withMessage('Category ID must be a string'),
      body('active')
        .optional() 
        .isBoolean().withMessage('Active must be a boolean'),
      body('showInApp')
        .optional()
        .isBoolean().withMessage('Show In App must be a boolean'),
    ];
  };

export const UpdatebannerValidation = () => {
    return [
      body('webBannerUrl')
        .optional()
        .isString().withMessage('Web Banner URL must be a string'),
      body('appBannerUrl')
        .optional() 
        .isString().withMessage('App Banner URL must be a string'),
      body('categoryId')
        .notEmpty().withMessage('Category ID is required')
        .isString().withMessage('Category ID must be a string'),
      body('active')
        .optional() 
        .isBoolean().withMessage('Active must be a boolean'),
      body('showInApp')
        .optional()
        .isBoolean().withMessage('Show In App must be a boolean'),
    ];
};

