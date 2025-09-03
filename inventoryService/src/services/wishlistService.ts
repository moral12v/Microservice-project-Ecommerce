import mongoose from "mongoose";
import { CreateWishListDTO} from "../dtos/wishListDto";
import { WishListDoc } from "../models/wishlist";
import { wishlistRepository } from "../repositories/wishlistRepository";

export const createWishList = async (wishlistDto: CreateWishListDTO): Promise<WishListDoc | null> => {
    if (wishlistDto?.isWishList) {
        return await wishlistRepository.createWishList(wishlistDto);
    } else {
        const productId = new mongoose.Types.ObjectId(wishlistDto?.productId);
        const wishList = await wishlistRepository.getWishListByProductId(productId);
        if (wishList) {
            return await wishlistRepository.deleteWishList(wishList._id.toString());
        } else {
            throw new Error("Wishlist not found for the given product.");
        }
    }
};

export const getWishListByCustomerId = async (customerId: string): Promise<WishListDoc[] | null> => {
      return await wishlistRepository.getWishListByCustomerId(customerId);
  };

export const DeleteWishList = async(wishlistId: string) : Promise<WishListDoc | null>=>{
    return await wishlistRepository.deleteWishList(wishlistId)
}