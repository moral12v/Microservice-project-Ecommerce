import { Request, Response } from "express";
import { CreateWishListDTO } from "../dtos/wishListDto";
import {
  errorResponse,
  responseWithData,
  responseWithoutData,
} from "../utils/response";
import logger from "../utils/logger";
import {
  createWishList,
  DeleteWishList,
  getWishListByCustomerId,
} from "../services/wishlistService";


export const createWishListHandler = async (req: Request, res: Response) => {
  try {
    const wishlistDto: CreateWishListDTO = req.body;
    if (req.customer) {
      wishlistDto.customerId = req.customer._id;
    } else {
      throw new Error("Customer information is missing.");
    }

    const newWishlist = await createWishList(wishlistDto);
    responseWithData(
      res,
      201,
      true,
      "WishList created successfully.",
      newWishlist
    );
    logger.info(`WishList created: ${newWishlist}`);
  } catch (error: any) {
    logger.error(`Error creating WishList: ${error.message}`);
    errorResponse(res, error.message || "Failed to create WishList.");
  }
};

export const getWishListByCustomerIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    let customerId = req.customer ? req.customer._id : "";
    const wishlist = await getWishListByCustomerId(customerId);
    if (!wishlist) {
      return errorResponse(res, "WishList not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "WishList retrieved successfully",
      wishlist
    );
  } catch (error: any) {
    logger.error(`Error retrieving WishList: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve WishList.");
  }
};

export const deleteWishListHandler = async (req: Request, res: Response) => {
  try {
    const wishlistId = req.params.id;
    await DeleteWishList(wishlistId);
    responseWithoutData(res, 200, true, "WishList deleted successfully");
    logger.info(`WishList deleted: ${wishlistId}`);
  } catch (error: any) {
    logger.error(`Error deleting WishList: ${error.message}`);
    errorResponse(res, error.message || "Failed to delete WishList.");
  }
};
