import { Request, Response } from 'express';
import {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
  getAddressesByCustomerId,
} from '../services/addressService';
import { CreateAddressDTO, UpdateAddressDTO } from '../dtos/addressDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import { TokenUserId } from '../utils/customerAuthValues';

export const createAddressHandler = async (req: Request, res: Response) => {
  try {
    const addressDto: CreateAddressDTO = req.body;
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const customerId: any = await TokenUserId(token);

    if (!customerId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    addressDto.customerId = customerId;
    const newAddress = await createAddress(addressDto);
    responseWithData(res, 201, true, 'Address created successfully.', newAddress);
  } catch (error: any) {
    logger.error(`Error creating address: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create address.');
  }
};

export const getAllCustomerAddressesHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }
    const customerId: any = await TokenUserId(token);
    if (!customerId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const addresses = await getAddressesByCustomerId(customerId);
    responseWithData(res, 200, true, 'Addresses retrieved successfully.', addresses);
  } catch (error: any) {
    logger.error(`Error retrieving addresses: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve addresses.');
  }
};

export const getAddressByIdHandler = async (req: Request, res: Response) => {
  try {
    const addressid = req.params.id;
    const address = await getAddressById(addressid);
    if (!address) {
      return errorResponse(res, 'Category not found', 404);
    }
    responseWithData(res, 200, true, 'Category retrieved successfully', address);
  } catch (error: any) {
    logger.error(`Error retrieving category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve category.');
  }
};

export const updateAddressHandler = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    const addressDto: UpdateAddressDTO = req.body;
    const updatedAddress = await updateAddress(addressId, addressDto);
    if (!updatedAddress) {
      return errorResponse(res, 'address not found', 404);
    }
    responseWithData(res, 200, true, 'Category updated successfully', updatedAddress);
  } catch (error: any) {
    logger.error(`Error updating address: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update address.');
  }
};

export const deleteAddressHandler = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    await deleteAddress(addressId);
    responseWithoutData(res, 200, true, 'address deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting address: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete address.');
  }
};
