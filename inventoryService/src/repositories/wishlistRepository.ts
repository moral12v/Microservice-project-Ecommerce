import { Types } from "mongoose";
import Wishlist, { WishListDoc } from "../models/wishlist";

export class WishlistRepository {
  async createWishList(
    wishlistData: Partial<WishListDoc>
  ): Promise<WishListDoc> {
    const wishlist = new Wishlist(wishlistData);
    return await wishlist.save();
  }

  async getWishListByCustomerId(customerId: string): Promise<WishListDoc[]> {
    return await Wishlist.find({ customerId }).populate("productId").exec();
  }

  async deleteWishList(wishlistId: string): Promise<WishListDoc | null> {
    return await Wishlist.findByIdAndDelete(wishlistId).exec();
  }

  async getWishListByProductId(
    productId: Types.ObjectId
  ): Promise<WishListDoc | null> {
    return await Wishlist.findOne({ productId }).exec();
  }
}

export const wishlistRepository = new WishlistRepository();
