import { aggregatorProductRepository } from "../repositories/AggregatorRepository";
import { AggregatorProductDoc } from "../models/aggregatorProduct";
import { CreateAggregatorProductDTO, UpdateAggregatorProductDTO } from "../dtos/aggregatorProductsDTO";
import mongoose from "mongoose";


export const createAggregatorProduct = async(AggregatorDto: CreateAggregatorProductDTO): Promise <AggregatorProductDoc> => {
    return await aggregatorProductRepository.createAggregatorProduct(AggregatorDto);
}

export const updateAgggregatorProduct = async(aggregatorId: string, AggregatorDto:UpdateAggregatorProductDTO ): Promise<AggregatorProductDoc | null>=>{
    return await aggregatorProductRepository.UpdateAggregatorProduct(aggregatorId,AggregatorDto);
}

export const getAggregatorProductById = async(aggregatorId: string): Promise<AggregatorProductDoc | null>=>{
    return await aggregatorProductRepository.getAggregatorProductById(aggregatorId);
}


export const getAllAggregatorProduct =async (page: number,
    limit: number,
    aggregatorId: string,
    isPagination:string,
    categoryId:string,
    approvalStatusString:string,
    merchantIdString:string): Promise<any> =>  {
    return await aggregatorProductRepository.getAllAggregatorProduct(page, limit, aggregatorId, isPagination, categoryId,approvalStatusString, merchantIdString);
};

export const getAllAggregatorProductForAggregator = async (
    page: number,
    limit: number,
    aggregatorId:string, 
    isPagination: string,
    categoryId: string,
    approvalStatusString: string
  ): Promise<any> => {
    return await aggregatorProductRepository.getAllAggregatorProductForAggregator(
      page,
      limit,
      aggregatorId,  
      isPagination,
      categoryId,
      approvalStatusString
    );
  };

export const approveProduct = async (vendorId: string): Promise<AggregatorProductDoc | null> => {
    return await aggregatorProductRepository.approveProduct(vendorId);
};
  
export const rejectProduct = async (vendorId: string): Promise<AggregatorProductDoc | null> => {
    return await aggregatorProductRepository.rejectProduct(vendorId);
};
  
export const activeProduct = async (productId: string, isActive: boolean): Promise<AggregatorProductDoc | null> => {
    return await aggregatorProductRepository.activeProduct(productId, isActive);
};
