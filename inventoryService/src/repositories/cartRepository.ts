import mongoose, { Types } from "mongoose";
import { Cart, CartDoc } from "../models/Cart";
import { AddOnDTO, AddToCartDTO, UpdateCartItemDTO } from "../dtos/cartDTO";

class CartRepository {
  async findByCustomerId(customerId: string): Promise<any> {
    const cart = await Cart.aggregate([
      {
        $match: {
          customerId: new mongoose.Types.ObjectId(customerId),
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "merchantproducts",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $lookup: {
          from: "addonmetadatas",
          localField: "items.addons.groupId",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      {
        $lookup: {
          from: "merchantproducts",
          localField: "items.addons.choiceId",
          foreignField: "_id",
          as: "choiceDetails",
        },
      },
      {
        $lookup: {
          from: "addonmetadatas",
          localField: "productDetails.addOns",
          foreignField: "_id",
          as: "addOnDetails",
        },
      },
      {
        $lookup: {
          from: "merchantproducts",
          localField: "addOnDetails.addon",
          foreignField: "_id",
          as: "addonChoices",
        },
      },
      {
        $addFields: {
          selectedVariant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$productDetails.variants",
                  as: "variant",
                  cond: {
                    $eq: ["$$variant._id", "$items.variantId"],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          customerId: { $first: "$customerId" },
          merchantId: { $first: "$merchantId" },
          items: {
            $push: {
              product: {
                $mergeObjects: [
                  "$productDetails",
                  {
                    addOns: {
                      $map: {
                        input: {
                          $cond: {
                            if: { $isArray: "$productDetails.addOns" },
                            then: "$productDetails.addOns",
                            else: [],
                          },
                        },
                        as: "addOns",
                        in: {
                          $mergeObjects: [
                            {
                              $arrayElemAt: ["$addOnDetails", 0],
                            },
                            {
                              choices: {
                                $map: {
                                  input: "$addonChoices",
                                  as: "choice",
                                  in: {
                                    _id: "$$choice._id",
                                    productTitle: "$$choice.productTitle",
                                    actualPrice: "$$choice.actualPrice",
                                    sellingPrice: "$$choice.sellingPrice",
                                    productImageUrl: "$$choice.productImageUrl",
                                    foodType: "$$choice.foodType",
                                  },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
              quantity: "$items.quantity",
              selectedVariant: "$selectedVariant",
              selectedAddOns: {
                $map: {
                  input: {
                    $cond: {
                      if: { $isArray: "$items.addons" },
                      then: "$items.addons",
                      else: [],
                    },
                  },
                  as: "selectedAddOns",
                  in: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$groupDetails", 0] },
                      {
                        choices: {
                          $map: {
                            input: "$choiceDetails",
                            as: "choice",
                            in: {
                              _id: "$$choice._id",
                              productTitle: "$$choice.productTitle",
                              actualPrice: "$$choice.actualPrice",
                              sellingPrice: "$$choice.sellingPrice",
                              productImageUrl: "$$choice.productImageUrl",
                              foodType: "$$choice.foodType",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $unset: [
          "items.product.addOns.group.addon",
          "items.product.addOns.group.createdAt",
          "items.product.addOns.group.updatedAt",
          "items.addons.group.addon",
          "items.addons.group.createdAt",
          "items.addons.group.updatedAt",
        ],
      },
      {
        $project: {
          _id: 1,
          customerId: 1,
          merchantId: 1,
          items: 1,
        },
      },
    ]);

    if (!cart || cart.length === 0) {
      return null;
    }

    return cart[0];
  }

  async findByCustomerIdV2(customerId: string): Promise<any> {
    const cart = await Cart.findOne({ customerId })
      .exec();

    if (!cart) {
      return null;
    }
    return cart;
  }

  async findByCustomerIdAndMerchantId(
    customerId: string,
    merchantId: string
  ): Promise<any> {
    return await Cart.findOne({ customerId, merchantId });
  }

  async findById(cartId: string): Promise<any> {
    return await Cart.findById(cartId).populate("items.productId").exec();
  }

  async createCart(
    customerId: string,
    merchantId: string,
    deliveryType: string
  ): Promise<CartDoc> {
    const newCart = new Cart({
      customerId,
      merchantId,
      items: [],
      deliveryType,
    });
    return await newCart.save();
  }

  async addItemToCart(
    customerId: string,
    item: { productId: string; quantity: number; variantId?: string; addons?: Array<{ choiceId: string; groupId: string; name: string; price: number }> }
  ): Promise<CartDoc | null> {
    const cart = await Cart.findOne({ customerId }).exec();
  
    if (!cart) {
      return await Cart.create({ customerId, items: [{ ...item, addons: item.addons || [] }] });
    }
  
    const productId = new Types.ObjectId(item.productId);
    const variantId = item.variantId ? new Types.ObjectId(item.variantId) : null;
    const addons = item.addons ?? [];
  
    const existingItemIndex = cart.items.findIndex((cartItem) => {
      const isSameProduct = cartItem.productId.toString() === productId.toString();
      const isSameVariant = variantId
        ? cartItem.variantId?.toString() === variantId.toString()
        : !cartItem.variantId;
  
      const isSameAddons =
        addons.length === cartItem.addons?.length &&
        addons.every((addon, idx) => {
          const cartAddon = cartItem.addons?.[idx];
          return (
            cartAddon &&
            addon.choiceId.toString() === cartAddon.choiceId.toString() &&
            addon.groupId.toString() === cartAddon.groupId.toString()
          );
        });
  
      return isSameProduct && isSameVariant && isSameAddons;
    });
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity; 
    } else {
      const newItem: any = {
        productId: productId,
        variantId: variantId ?? null,
        quantity: item.quantity,
        addons: addons.map((addon) => ({
          choiceId: new Types.ObjectId(addon.choiceId),
          groupId: new Types.ObjectId(addon.groupId),
          name: addon.name,
          price: addon.price,
        })),
      };
      cart.items.push(newItem);
    }
    await cart.save();
    return cart;
  }
  
  

  async updateCartItem(
    customerId: string,
    item: UpdateCartItemDTO
  ): Promise<{ cart: CartDoc | null; message?: string }> {
    console.log("Updating item:", item);
  
    const cart = await Cart.findOne({ customerId }).exec();
  
    if (!cart) {
      return { cart: null, message: `Cart not found for customer: ${customerId}` };
    }
  
    const productId = new Types.ObjectId(item.productId);
    const variantId = item.variantId ? new Types.ObjectId(item.variantId) : null;
    const addons = item.addons ?? [];
    let hasDifferentAddons = false;
  
    const existingItemIndex = cart.items.findIndex((cartItem) => {
      const isSameProduct = cartItem.productId.toString() === productId.toString();
      const isSameVariant = variantId
        ? cartItem.variantId?.toString() === variantId.toString()
        : !cartItem.variantId;
  
      const isSameAddons =
        addons.length === cartItem.addons?.length &&
        addons.every((addon, idx) => {
          const cartAddon = cartItem.addons?.[idx];
          return (
            cartAddon &&
            addon.choiceId.toString() === cartAddon.choiceId.toString() &&
            addon.groupId.toString() === cartAddon.groupId.toString()
          );
        });
  
      if (isSameProduct && isSameVariant && !isSameAddons) {
        hasDifferentAddons = true;
      }
  
      return isSameProduct && isSameVariant && isSameAddons;
    });
  
    if (existingItemIndex > -1) {
      const existingItem = cart.items[existingItemIndex];
  
      if (item.quantity < existingItem.quantity && hasDifferentAddons) {
        return {
          cart,
          message: `Removal not allowed: Different add-ons or variants detected for this product in your cart.`,
        };
      }
  
      existingItem.quantity += item.quantity;
    } else {
      const newItem: any = {
        productId: productId,
        variantId: variantId ?? null,
        quantity: item.quantity,
        addons: addons.map((addon) => ({
          choiceId: new Types.ObjectId(addon.choiceId),
          groupId: new Types.ObjectId(addon.groupId),
          name: addon.name,
          price: addon.price,
        })),
      };
      cart.items.push(newItem);
    }
  
    await cart.save();
    return { cart };
  }
  

  async removeItemFromCart(
    customerId: string,
    productId: string,
    variantId?: string,
    addons?: AddOnDTO[]
  ): Promise<any> {
    const cartUpdateQuery: any = {
      customerId,
    };

    const pullCriteria: any = { productId };
    if (variantId) {
      pullCriteria.variantId = variantId;
    }

    if (addons && addons.length > 0) {
      pullCriteria.addons = {
        $elemMatch: {
          choiceId: {
            $in: addons.map((addon) => new Types.ObjectId(addon.choiceId)),
          },
          groupId: {
            $in: addons.map((addon) => new Types.ObjectId(addon.groupId)),
          },
        },
      };
    }

    const updatedCart = await Cart.findOneAndUpdate(
      cartUpdateQuery,
      { $pull: { items: pullCriteria } },
      { new: true }
    ).exec();

    if (updatedCart && updatedCart.items.length === 0) {
      await Cart.findOneAndDelete({ customerId }).exec();
      return null;
    }

    return updatedCart;
  }
  async clearCart(customerId: string): Promise<CartDoc | null> {
    const updatedCart = await Cart.findOneAndUpdate(
      { customerId },
      { $set: { items: [] } },
      { new: true }
    ).exec();
    if (updatedCart && updatedCart.items.length === 0) {
      await Cart.findOneAndDelete({ customerId }).exec();
      return null;
    }

    return updatedCart;
  }
  async deleteCartByUserId(
    userId: string | mongoose.Types.ObjectId
  ): Promise<CartDoc | null> {
    const userIdQuery = mongoose.Types.ObjectId.isValid(userId as string)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const deletedCart = await Cart.findOneAndDelete({
      userId: userIdQuery,
    }).exec();
    return deletedCart;
  }
}

export const cartRepository = new CartRepository();
