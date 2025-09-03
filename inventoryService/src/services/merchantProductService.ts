import {
  CreateMerchantProductDTO,
  UpdateMerchantProductDTO,
} from "../dtos/merchantProductDto";
import { ApprovalStatus, MerchantProductDoc } from "../models/MerchantProduct";
import { VariantDTO } from "../dtos/merchantProductDto";
import mongoose from "mongoose";
import { merchantproductRepository } from "../repositories/merchantProduct";
import { sendProductCreatedEvent } from "../kafka/handdlers/productCreated";
import { subcategoryRepository } from "../repositories/subcategoryRepository";

export const createMerchantProduct = async (
  merchantproductDto: CreateMerchantProductDTO
): Promise<MerchantProductDoc> => {
  const createdProduct = await merchantproductRepository.createMerchantProduct(
    merchantproductDto
  );

  if (
    createdProduct &&
    createdProduct.subCategoryId &&
    createdProduct.subCategoryId.length > 0
  ) {
    const subCategoryDetails = await Promise.all(
      createdProduct.subCategoryId.map(
        async (subCategoryId: mongoose.Types.ObjectId) => {
          return await subcategoryRepository.getSubcategoryById(
            subCategoryId.toString()
          );
        }
      )
    );
    subCategoryDetails.forEach((subCategoryDetail) => {
      sendProductCreatedEvent(createdProduct.merchantId, subCategoryDetail);
    });
  } else {
    console.warn("Product created without subcategory details.");
  }

  return createdProduct;
};

export const getMerchantProductById = async (
  merchantproductId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.getMerchantProductById(
    merchantproductId
  );
};

export const getAllMerchantProduct = async (
  pageNumber: number,
  limitNumber: number,
  pagination: string,
  merchantIdString: string,
  categoryIdString: string,
  subCategoryString: string,
  foodTypeString: string,
  titleString: string,
  isAddOn: string
) => {
  return await merchantproductRepository.getAllMerchantProduct(
    pageNumber,
    limitNumber,
    pagination,
    merchantIdString,
    categoryIdString,
    subCategoryString,
    foodTypeString,
    titleString,
    isAddOn
  );
};

export const updateMerchantProduct = async (
  merchantproductId: string,
  merchantproductDto: UpdateMerchantProductDTO
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.updateMerchantProduct(
    merchantproductId,
    merchantproductDto
  );
};

export const getAllProductsForUser = async (
  pageNumber: number,
  limitNumber: number,
  pagination: string,
  merchantIdString: string,
  categoryIdString: string,
  subCategoryString: string,
  foodTypeString: string,
  titleString: string,
  customerId: string
): Promise<any> => {
  return await merchantproductRepository.getAllProductsForUser(
    pageNumber,
    limitNumber,
    pagination,
    merchantIdString,
    categoryIdString,
    subCategoryString,
    foodTypeString,
    titleString,
    customerId
  );
};

export const getAllProductsForUserWithFilter = async (
  pageNumber: number,
  limitNumber: number,
  pagination: string,
  merchantIdString: string,
  categoryIdString: string,
  subCategoryString: string,
  foodTypeString: string,
  titleString: string,
  customerId: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: string[],
  filters?: any
): Promise<any> => {
  return await merchantproductRepository.getAllProductsForUser(
    pageNumber,
    limitNumber,
    pagination,
    merchantIdString,
    categoryIdString,
    subCategoryString,
    foodTypeString,
    titleString,
    customerId,
    minPrice,
    maxPrice,
    sort,
    filters
  );
};

export const getMerchantsWithProductsByCategory = async (
  categoryId: string
): Promise<any> => {
  const product = await merchantproductRepository.getMerchantProductByCategory(
    categoryId
  );
  return product;
};

export const getMerchantsProductsBymerchantId = async (
  merchantId: string,
  categoryId: string,
  customerId: string,
  isAddon: boolean = false
): Promise<any> => {
  return await merchantproductRepository.getMerchantsProductsBymerchantId(
    merchantId,
    categoryId,
    customerId,
    isAddon
  );
};

export const getMerchantsProductsBymerchantIdV2 = async (
  merchantId: string,
  categoryId: string,
  customerId: string,
  isAddon: boolean = false
): Promise<any> => {
  return await merchantproductRepository.getMerchantsProductsBymerchantIdv2(
    merchantId,
    categoryId,
    customerId,
    isAddon
  );
};
export const addVariantToProduct = async (
  productId: string,
  variant: VariantDTO
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.addVariantToProduct(
    productId,
    variant
  );
};

export const updateVariantInProduct = async (
  productId: string,
  variantId: string,
  variantData: Partial<VariantDTO>
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.updateVariantInProduct(
    productId,
    variantId,
    variantData
  );
};

export const deleteVariantFromProduct = async (
  productId: string,
  variantId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.deleteVariantFromProduct(
    productId,
    variantId
  );
};

export const addAddOnToProduct = async (
  productId: string,
  addOnId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.addAddOnToProduct(productId, addOnId);
};

export const removeAddOnFromProduct = async (
  productId: string,
  addOnId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.removeAddOnFromProduct(
    productId,
    addOnId
  );
};

export const addTagsToProduct = async (
  productId: string,
  tagsId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.addAddOnToProduct(productId, tagsId);
};

export const removeTagsFromProduct = async (
  productId: string,
  tagsId: string
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.removeAddOnFromProduct(
    productId,
    tagsId
  );
};

export const setMerchantProductActiveStatus = async (
  merchantproductId: string,
  isActive: boolean
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.setMerchantProductActiveStatus(
    merchantproductId,
    isActive
  );
};

export const approveMerchantProduct = async (
  merchantproductId: string,
  approvedByAdmin: ApprovalStatus
): Promise<MerchantProductDoc | null> => {
  return await merchantproductRepository.approveMerchantProduct(
    merchantproductId,
    approvedByAdmin
  );
};
