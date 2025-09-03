import { Request, Response } from "express";
import {  activeProduct, approveProduct,
   createAggregatorProduct,
   getAggregatorProductById,
   getAllAggregatorProduct,
   getAllAggregatorProductForAggregator,

   rejectProduct,updateAgggregatorProduct } from "../services/aggregatorProductService";
import { errorResponse, responseWithData,responseWithoutData } from "../utils/response";
import logger from "../utils/logger";
import { request } from "http";
import { CreateAggregatorProductDTO, UpdateAggregatorProductDTO } from "../dtos/aggregatorProductsDTO";
import mongoose from "mongoose";

export const createAggregatorProducthandler = async(req:Request, res:Response) =>{
    try {
        const aggregatorDto :CreateAggregatorProductDTO = req.body;
        const newAggregator = await createAggregatorProduct(aggregatorDto);
        responseWithData(res, 201, true ,'AggregatorProduct created successfull', newAggregator)
    } catch (error:any) {
        logger.error(`error Creating AggregatorProduct ${error.message}`)
        errorResponse(res, error.message || 'Failed to create AggregatorProduct')
    }
}


export const createAggregatorProductForAggregatorhandler = async(req:Request, res:Response) =>{
  try {
    const aggregatorId = req.user ? req.user._id : "";
    const aggregatorDto: CreateAggregatorProductDTO = {
      ...req.body,
      aggregatorId,
    };
    const newAggregator = await createAggregatorProduct(aggregatorDto);
      responseWithData(res, 201, true ,'Aggregator Product fro Aggregator created successfull', newAggregator)
  } catch (error:any) {
      logger.error(`error Creating AggregatorProduct ${error.message}`)
      errorResponse(res, error.message || 'Failed to create AggregatorProduct')
  }
}

export const getAllAggregatorProductForAggregatorhandler = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5, isPagination = true, categoryId, approvalStatus = '' } = req.query;
    const aggregatorId = req.user ? req.user._id : "";
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const categoryIdString = categoryId as string;
    
    const pagination = isPagination as string;
    const approvalStatusString = approvalStatus as string
    const aggregatorProduct = await getAllAggregatorProductForAggregator(pageNumber, limitNumber,aggregatorId, pagination, categoryIdString, approvalStatusString);

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: aggregatorProduct.total,
      aggregatorProducts: aggregatorProduct.products || []
    };

    responseWithData(res, 200, true, 'Aggregator Product retrieved successfully', response);
  } catch (error: any) {
    logger.error(`Error retrieving AggregatorProduct: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve AggregatorProduct.');
  }
};


export const getAllAggregatorProductForAggregatorhandlerv2 = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5, isPagination = true, categoryId, approvalStatus = '' } = req.query;
    const aggregatorId = req.user ? req?.merchant.aggregatorId : "";
    console.log( req?.merchant?.aggregatorId)
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const categoryIdString = categoryId as string;
    
    const pagination = isPagination as string;
    const approvalStatusString = approvalStatus as string
    const aggregatorProduct = await getAllAggregatorProductForAggregator(pageNumber, limitNumber,aggregatorId, pagination, categoryIdString, approvalStatusString);

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: aggregatorProduct.total,
      aggregatorProducts: aggregatorProduct.products || []
    };

    responseWithData(res, 200, true, 'Aggregator Product retrieved successfully', response);
  } catch (error: any) {
    logger.error(`Error retrieving AggregatorProduct: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve AggregatorProduct.');
  }
};



export const updateAgggregatorProductHandler = async (req: Request, res: Response) => {
    try {
      const aggregatorId = req.params.id;
      const aggregatorDto: UpdateAggregatorProductDTO = req.body;
      const updateaggregator = await updateAgggregatorProduct(aggregatorId, aggregatorDto);
      if (!updateaggregator) {
        return errorResponse(res, 'AgggregatorProduct not found', 404);
      }
      responseWithData(res, 200, true, 'AgggregatorProduct updated successfully', updateaggregator);
    } catch (error: any) {
      logger.error(`Error updating AgggregatorProduct: ${error.message}`);
      errorResponse(res, error.message || 'Failed to update AgggregatorProduct.');
    }
};


export const getAgggregatorProductById = async (req: Request, res: Response) => {
    try {
      const aggregatorId = req.params.id;
      const aggregatorproduct = await getAggregatorProductById(aggregatorId);
      if (!aggregatorproduct) {
        return errorResponse(res, 'AgggregatorProduct not found', 404);
      }
      responseWithData(res, 200, true, 'AgggregatorProduct retrieved successfully', aggregatorproduct);
    } catch (error: any) {
      logger.error(`Error retrieving AgggregatorProduct: ${error.message}`);
      errorResponse(res, error.message || 'Failed to retrieve AgggregatorProduct.');
    }
};

export const getAllAggregatorProductHandler = async (req: Request, res:Response) =>{
    try {
      const { page = 1, limit = 5, aggregatorId = '', isPagination = true, categoryId,  approvalStatus = '', merchantId } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const aggregatorIdString = aggregatorId as string;
      const categoryIdString = categoryId as string;
      const pagination = isPagination as string;
      const approvalStatusString = approvalStatus as string;
      const merchantIdString = merchantId as string
        const aggregatorproduct = await getAllAggregatorProduct(pageNumber, limitNumber, aggregatorIdString, pagination, categoryIdString, approvalStatusString,merchantIdString );
        const response = {
          isPagination: pagination,
          page: pageNumber,
          limit: limitNumber,
          total: aggregatorproduct.total,
          aggregatorproducts: aggregatorproduct.products || []
        };
        responseWithData(res, 200, true, 'Agggregator Product retrieved successfully', response);
    } catch (error: any) {
      logger.error(`Error retrieving AgggregatorProduct: ${error.message}`);
      errorResponse(res, error.message || 'Failed to retrieve AgggregatorProduct.');
    }
};

export const approveProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await approveProduct(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithData(res, 200, true, "Product approved successfully", product);
  } catch (error: any) {
    logger.error(`Error approving Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to Product vendor.");
  }
};

export const rejectProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await rejectProduct(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithoutData(res, 200, true, "Product rejected successfully");
  } catch (error: any) {
    logger.error(`Error rejecting Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to reject Product.");
  }
};

export const ActiveProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const { isActive } = req.body; 
    if (typeof isActive !== "boolean") {
      return errorResponse(res, "Invalid `isOpen` value provided. It must be a boolean.", 400);
    }
    const product = await activeProduct(productId, isActive);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      `Product has been ${isActive ? "Active" : "Inactive"} successfully.`,
      product
    );
  } catch (error: any) {
    logger.error(`Error toggling product status: ${error.message}`);
    errorResponse(res, error.message || "Failed to toggle product status.");
  }
};