import { body } from 'express-validator';


export const registervendorValidators = [
  body('fullName')
    .notEmpty()
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage('Full name is required'),
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('Mobile number is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({
      min: 8,
    })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password does not match password');
      }
      return true;
    }),
];

export const updateVendorValidators = [
  body('firstName')
    .optional()
    .isLength({
      min: 1,
      max: 20,
    })
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .isLength({
      min: 1,
      max: 20,
    })
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('dob').optional().isDate().withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be one of "male", "female", or "other"'),
  body('Mobile')
    .optional()
    .isLength({
      min: 10,
      max: 10,
    })
    .notEmpty()
    .withMessage(' mobile number cannot be empty'),
];

export const updateVendorAddressValidators = [
  body('country').optional().notEmpty().withMessage('Country cannot be empty'),
  body('state').optional().notEmpty().withMessage('State cannot be empty'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('pincode').optional().notEmpty().withMessage('Pincode cannot be empty'),
  body('area').optional().notEmpty().withMessage('Area cannot be empty'),
  body('add1').optional().notEmpty().withMessage('Address line 1 cannot be empty'),
  body('add2').optional().notEmpty().withMessage('Address line 2 cannot be empty'),
  body('landmark').optional().notEmpty().withMessage('Landmark cannot be empty'),
  body('identityProofName').optional().notEmpty().withMessage('Identity proof name cannot be empty'),
  body('identityProofFileUrl').optional().notEmpty().withMessage('Identity proof file URL cannot be empty'),
];

export const updateVendorAdminValidators = [
  body('vendorId').notEmpty().withMessage('Vendor Id cannot be empty'),
  body('firstName')
    .optional()
    .isLength({
      min: 1,
      max: 20,
    })
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .isLength({
      min: 1,
      max: 20,
    })
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('dob').optional().isDate().withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be one of "male", "female", or "other"'),
  body('alternativeMobile')
    .optional()
    .isLength({
      min: 10,
      max: 10,
    })
    .notEmpty()
    .withMessage('Alternative mobile number cannot be empty'),
];

export const updateVendorAdminAddressValidators = [
  body('vendorId').notEmpty().withMessage('Vendor Id cannot be empty'),
  body('add1').optional().notEmpty().withMessage('Address line 1 cannot be empty'),
  body('add2').optional().notEmpty().withMessage('Address line 2 cannot be empty'),
  body('area').optional().notEmpty().withMessage('Area cannot be empty'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().notEmpty().withMessage('State cannot be empty'),
  body('country').optional().notEmpty().withMessage('Country cannot be empty'),
  body('pincode').optional().notEmpty().withMessage('Pincode cannot be empty'),
  body('landmark').optional().notEmpty().withMessage('Landmark cannot be empty'),
  body('lat').optional().isNumeric().withMessage('Latitude must be a number'),
  body('lng').optional().isNumeric().withMessage('Longitude must be a number'),
  body('identityProofName').optional().notEmpty().withMessage('Identity proof name cannot be empty'),
  body('identityProofFileUrl').optional().notEmpty().withMessage('Identity proof file URL cannot be empty'),
];

export const sendOTPValidators = [
  body('mobile')
    .isLength({
      min: 10,
      max: 10,
    })
    .notEmpty()
    .withMessage('mobile no is required'),
];

export const loginOTPValidators = [
  body('mobile')
    .notEmpty()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('mobile no is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
];
