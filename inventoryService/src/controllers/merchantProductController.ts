import {
  CreateMerchantProductDTO,
  UpdateMerchantProductDTO,
  VariantDTO,
} from "../dtos/merchantProductDto";
import {
  addAddOnToProduct,
  addVariantToProduct,
  approveMerchantProduct,
  createMerchantProduct,
  deleteVariantFromProduct,
  getAllMerchantProduct,
  getAllProductsForUser,
  getAllProductsForUserWithFilter,
  getMerchantProductById,
  getMerchantsProductsBymerchantId,
  getMerchantsProductsBymerchantIdV2,
  getMerchantsWithProductsByCategory,
  removeAddOnFromProduct,
  setMerchantProductActiveStatus,
  updateMerchantProduct,
  updateVariantInProduct,
} from "../services/merchantProductService";

import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from "../utils/response";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { getMerchantDetails } from "../kafka/handdlers/getMerchantDetails";
import mongoose from "mongoose";

export const createMerchantProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantproductDto: CreateMerchantProductDTO = req.body;
    const newmerchantProduct = await createMerchantProduct(merchantproductDto);
    responseWithData(
      res,
      201,
      true,
      "merchantProduct created successfully.",
      newmerchantProduct
    );
  } catch (error: any) {
    logger.error(`Error creating merchantProduct: ${error.message}`);
    errorResponse(res, error.message || "Failed to create merchantProduct.");
  }
};

export const updateMerchantProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantproductId = req.params.id;
    const merchantproductDto: UpdateMerchantProductDTO = req.body;
    const updatedmechantProduct = await updateMerchantProduct(
      merchantproductId,
      merchantproductDto
    );
    if (!updatedmechantProduct) {
      return errorResponse(res, "merchantProduct not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "merchantProduct updated successfully",
      updatedmechantProduct
    );
  } catch (error: any) {
    logger.error(`Error updating merchantProduct: ${error.message}`);
    errorResponse(res, error.message || "Failed to update merchantProduct.");
  }
};

export const getMerchantProductByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantproductId = req.params.id;
    const merchantProduct = await getMerchantProductById(merchantproductId);
    if (!merchantProduct) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "merchantProduct get successfully",
      merchantProduct
    );
  } catch (error: any) {
    logger.error(`Error getting merchantProduct: ${error.message}`);
    errorResponse(res, error.message || "Failed to retivive merchantProduct.");
  }
};

export const getAllMerchantProductsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPagination = true,
      merchantId,
      categoryId,
      subCategoryId,
      foodType,
      title,
      isAddOn
    } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const merchantIdString = merchantId as string;
    const categoryIdString = categoryId as string;
    const subCategoryString = subCategoryId as string;
    const foodTypeString = foodType as string;
    const titleString = title as string;
    const pagination = isPagination as string;
    const isAddOnString = isAddOn as string;
    const merchantProduct = await getAllMerchantProduct(
      pageNumber,
      limitNumber,
      pagination,
      merchantIdString,
      categoryIdString,
      subCategoryString,
      foodTypeString,
      titleString,
      isAddOnString
    );
    responseWithData(
      res,
      200,
      true,
      "merchantProduct retrieved successfully",
      merchantProduct
    );
  } catch (error: any) {
    logger.error(`Error retrieving merchantProduct: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve merchantProduct.");
  }
};

export const getAllMerchantProductForUserHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPagination = true,
      merchantId,
      categoryId,
      subCategoryId,
      foodType,
      title,
    } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const merchantIdString = merchantId as string;
    const categoryIdString = categoryId as string;
    const subCategoryString = subCategoryId as string;
    const foodTypeString = foodType as string;
    const titleString = title as string;
    let customerId = req.customer ? req.customer._id : "";
    const pagination = isPagination as string;
    const productList = await getAllProductsForUser(
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

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: productList.total,
      products: productList.data,
    };

    responseWithData(
      res,
      200,
      true,
      "Product retrieved successfully",
      response
    );
  } catch (error: any) {
    logger.error(`Error retrieving Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve Product.");
  }
};

export const getAllMerchantProductForUserWithFilterHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPagination = true,
      merchantId,
      categoryId,
      subCategoryId,
      foodType,
      title,
      minPrice,
      maxPrice,
      sort,
      filters
    } = req.body;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const merchantIdString = merchantId as string;
    const categoryIdString = categoryId as string;
    const subCategoryString = subCategoryId as string;
    const foodTypeString = foodType as string;
    const titleString = title as string;
    let customerId = req.customer ? req.customer._id : "";
    const pagination = isPagination as string;
    const productList = await getAllProductsForUserWithFilter(
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

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: productList.total,
      products: productList.data,
    };

    responseWithData(
      res,
      200,
      true,
      "Product retrieved successfully",
      response
    );
  } catch (error: any) {
    logger.error(`Error retrieving Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve Product.");
  }
};

export const getMerchantsProductsBymerchantIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPagination = true,
      merchantId,
      categoryId,
      subCategoryId,
      foodType,
      title,
    } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const merchantIdString = merchantId as string;
    const categoryIdString = categoryId as string;
    const subCategoryString = subCategoryId as string;
    const foodTypeString = foodType as string;
    const titleString = title as string;
    let customerId: string = "";
    const pagination = isPagination as string;
    const productList = await getMerchantsProductsBymerchantId(
      merchantIdString,
      categoryIdString,
      customerId
    );
    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: productList.total,
      products: productList.data,
    };

    responseWithData(
      res,
      200,
      true,
      "Product retrieved successfully",
      response
    );
  } catch (error: any) {
    logger.error(`Error retrieving Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve Product.");
  }
};

export const getMerchantsByCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryId } = req.query;
    const categoryIdString = categoryId as string;
    const products = await getMerchantsWithProductsByCategory(categoryIdString);
    const merchantIds = [
      ...new Set(products.map((product: any) => product.merchantId)),
    ];
    const merchants = await Promise.all(
      merchantIds.map(async (merchantId: any) => {
        const merchantDetails = await getMerchantDetails(merchantId);
        return {
          merchantId,
          merchantDetails,
          products: products.filter(
            (product: any) => product.merchantId.toString() === merchantId
          ),
        };
      })
    );
    res.status(200).json({
      success: true,
      data: merchants,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addVariantToProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const variant: VariantDTO = req.body;
    const updatedProduct = await addVariantToProduct(productId, variant);
    if (!updatedProduct) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "Variant added to product successfully",
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error adding variant to product: ${error.message}`);
    errorResponse(res, error.message || "Failed to add variant to product.");
  }
};

export const updateVariantInProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const variantId = req.params.variantId;
    const variantData: Partial<VariantDTO> = req.body;
    const updatedProduct = await updateVariantInProduct(
      productId,
      variantId,
      variantData
    );
    if (!updatedProduct) {
      return errorResponse(res, "Product or variant not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "Variant updated successfully",
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error updating variant in product: ${error.message}`);
    errorResponse(res, error.message || "Failed to update variant in product.");
  }
};

export const deleteVariantFromProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const variantId = req.params.variantId;
    const updatedProduct = await deleteVariantFromProduct(productId, variantId);
    if (!updatedProduct) {
      return errorResponse(res, "Product or variant not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "Variant deleted successfully",
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error deleting variant from product: ${error.message}`);
    errorResponse(
      res,
      error.message || "Failed to delete variant from product."
    );
  }
};

export const addAddOnToProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const addOnId = req.body.addOnId;
    const updatedProduct = await addAddOnToProduct(productId, addOnId);

    if (!updatedProduct) {
      return errorResponse(res, "Product not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "AddOn added successfully",
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error adding AddOn to product: ${error.message}`);
    errorResponse(res, error.message || "Failed to add AddOn to product.");
  }
};

export const removeAddOnFromProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const addOnId = req.params.addOnId;
    if (!addOnId) {
      return errorResponse(res, "AddOnId is required", 400);
    }

    const updatedProduct = await removeAddOnFromProduct(productId, addOnId);

    if (!updatedProduct) {
      return errorResponse(res, "Product or AddOn not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "AddOn removed successfully",
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error removing AddOn from product: ${error.message}`);
    errorResponse(res, error.message || "Failed to remove AddOn from product.");
  }
};

export const addTagsToProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const tagsId = req.body.tagsId;
    const updatedTags = await addAddOnToProduct(productId, tagsId);

    if (!updatedTags) {
      return errorResponse(res, "tags not found", 404);
    }
    responseWithData(res, 200, true, "tags added successfully", updatedTags);
  } catch (error: any) {
    logger.error(`Error adding tags to product: ${error.message}`);
    errorResponse(res, error.message || "Failed to add tags to product.");
  }
};

export const removeTagsFromProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const tagsId = req.params.tagsId;
    if (!tagsId) {
      return errorResponse(res, "tagsId is required", 400);
    }

    const updatedTags = await removeAddOnFromProduct(productId, tagsId);

    if (!updatedTags) {
      return errorResponse(res, "tags  not found", 404);
    }
    responseWithData(res, 200, true, "tags removed successfully", updatedTags);
  } catch (error: any) {
    logger.error(`Error removing tags from product: ${error.message}`);
    errorResponse(res, error.message || "Failed to remove tags from product.");
  }
};

export const getMerchantsProductsBymerchantIdHandlerV2 = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPagination = true,
      categoryId,
      subCategoryId,
      foodType,
      title,
      isAddon,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const merchantIdString = req?.merchant?._id;
    const categoryIdString = categoryId as string;
    const subCategoryString = subCategoryId as string;
    const foodTypeString = foodType as string;
    const titleString = title as string;
    const isAddonBoolean = isAddon === "true";

    const pagination = isPagination === "true";
    let customerId: string = "";

    const productList = await getMerchantsProductsBymerchantIdV2(
      merchantIdString,
      categoryIdString,
      customerId,
      isAddonBoolean
    );

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: productList.length,
      products: productList,
    };

    responseWithData(
      res,
      200,
      true,
      "Product retrieved successfully",
      response
    );
  } catch (error: any) {
    logger.error(`Error retrieving Product: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve Product.");
  }
};

export const createMerchantProductForMerchantHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantIdString = req?.merchant?._id;

    const merchantproductDto: CreateMerchantProductDTO = {
      ...req.body,
      merchantId: merchantIdString,
    };
    const newmerchantProduct = await createMerchantProduct(merchantproductDto);
    responseWithData(
      res,
      201,
      true,
      "merchantProduct created successfully.",
      newmerchantProduct
    );
  } catch (error: any) {
    logger.error(`Error creating merchantProduct: ${error.message}`);
    errorResponse(res, error.message || "Failed to create merchantProduct.");
  }
};

export const setMerchantProductActiveStatusHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantproductId = req.params.id;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return errorResponse(
        res,
        "Invalid value for isActive, must be a boolean.",
        400
      );
    }

    const updatedProduct = await setMerchantProductActiveStatus(
      merchantproductId,
      isActive
    );

    if (!updatedProduct) {
      return errorResponse(res, "Product not found", 404);
    }

    responseWithData(
      res,
      200,
      true,
      `Product ${isActive ? "activated" : "deactivated"} successfully`,
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error updating product status: ${error.message}`);
    errorResponse(res, error.message || "Failed to update product status.");
  }
};

export const approveMerchantProductHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const merchantproductId = req.params.id;
    const { approvalStatus } = req.body;
    const updatedProduct = await approveMerchantProduct(
      merchantproductId,
      approvedByAdmin
    );
    if (!updatedProduct) {
      return errorResponse(res, "Product not found", 404);
    }

    responseWithData(
      res,
      200,
      true,
      `Product status updated to ${approvedByAdmin} successfully`,
      updatedProduct
    );
  } catch (error: any) {
    logger.error(`Error updating product status: ${error.message}`);
    errorResponse(res, error.message || "Failed to update product status.");
  }
};
