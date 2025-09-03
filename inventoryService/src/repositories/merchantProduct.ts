import mongoose, { Types } from "mongoose";
import MerchantProduct, {
  ApprovalStatus,
  MerchantProductDoc,
} from "../models/MerchantProduct";
import { VariantDTO } from "../dtos/merchantProductDto";

export class MerchantProductRepository {
  async createMerchantProduct(merchantData: any): Promise<MerchantProductDoc> {
    const merchantProduct = new MerchantProduct(merchantData);
    return await merchantProduct.save();
  }

  async getMerchantProductById(
    merchantproductId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findById(merchantproductId).exec();
  }

  async getAverageSellingPrice(merchantId: string): Promise<number | null> {
    const result = await MerchantProduct.aggregate([
      { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
      { $unwind: "$sellingPrices" },
      {
        $group: {
          _id: null,
          averageSellingPrice: { $avg: "$sellingPrices.price" },
        },
      },
    ]);

    return result.length > 0 ? result[0].averageSellingPrice : null;
  }

  async getAllMerchantProduct(
    pageNumber: number,
    limitNumber: number,
    pagination: string,
    merchantIdString: string,
    categoryIdString: string,
    subCategoryString: string,
    foodTypeString: string,
    titleString: string,
    isAddOn: string
  ): Promise<{
    total: number;
    pages: number;
    page: number;
    limit: number;
    data: MerchantProductDoc[];
  }> {
    const query: any = {};

    if (merchantIdString && Types.ObjectId.isValid(merchantIdString)) {
      query.merchantId = new Types.ObjectId(merchantIdString);
    }

    if (categoryIdString && Types.ObjectId.isValid(categoryIdString)) {
      query.categoryId = new Types.ObjectId(categoryIdString);
    }

    if (subCategoryString && Types.ObjectId.isValid(subCategoryString)) {
      query.subCategoryId = new Types.ObjectId(subCategoryString);
    }

    if (foodTypeString) {
      query.foodType = foodTypeString;
    }

    if (titleString) {
      query.productTitle = { $regex: new RegExp(titleString, "i") };
    }

    if (isAddOn) {
      query.isAddon = isAddOn;
    }
    let products: MerchantProductDoc[] = [];
    let formattedProducts: any[] = [];
    let total = 0;
    let pages = 1;
    let page = pageNumber > 0 ? pageNumber : 1;
    let limit = 10;

    if (pagination !== "false") {
      limit = limitNumber > 0 ? limitNumber : 10;
      const skip = (page - 1) * limit;
      products = await MerchantProduct.find(query)
        .populate("categoryId", "name")
        .populate("subCategoryId", "name")
        .skip(skip)
        .limit(limit)
        .exec();
      formattedProducts = products.map((product) => ({
        ...product.toObject(),
        categoryId: product.categoryId || {},
        subCategoryId: product.subCategoryId || {},
      }));

      total = await MerchantProduct.countDocuments(query).exec();
      pages = Math.ceil(total / limit);
    } else {
      products = await MerchantProduct.find(query)
        .populate("categoryId", "name")
        .populate("subCategoryId", "name")
        .exec();
      total = products.length;
      limit = total;
      formattedProducts = products.map((product) => ({
        ...product.toObject(),
        categoryId: product.categoryId || {},
        subCategoryId: product.subCategoryId || {},
      }));
    }

    return {
      total,
      pages,
      page,
      limit,
      data: formattedProducts,
    };
  }

  async updateMerchantProduct(
    merchantproductId: string,
    updateData: any
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      merchantproductId,
      updateData,
      { new: true }
    ).exec();
  }

  async getAllProductsForUser(
    pageNumber: number,
    limitNumber: number,
    pagination: string,
    merchantIdString: string,
    categoryIdString: string,
    subCategoryString: string,
    foodTypeString: string,
    titleString: string,
    customerId?: string,
    minPrice?: number,
    maxPrice?: number,
    sort?: string[],
    filters?: any
  ): Promise<any> {
    const query: any = {};
    if (merchantIdString && Types.ObjectId.isValid(merchantIdString)) {
      query.merchantId = new Types.ObjectId(merchantIdString);
    }

    if (categoryIdString && Types.ObjectId.isValid(categoryIdString)) {
      query.categoryId = new Types.ObjectId(categoryIdString);
    }

    if (subCategoryString && Types.ObjectId.isValid(subCategoryString)) {
      query.subCategoryId = new Types.ObjectId(subCategoryString);
    }

    if (foodTypeString) {
      query.foodType = foodTypeString;
    }

    if (titleString) {
      query.productTitle = { $regex: new RegExp(titleString, "i") };
    }

    if (minPrice && maxPrice) {
      query.sellingPrice = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.sellingPrice = { $gte: minPrice };
    } else if (maxPrice) {
      query.sellingPrice = { $lte: maxPrice };
    }

    if (filters && typeof filters === "object") {
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          const filterValue = filters[key];
          if (Array.isArray(filterValue)) {
            query[key] = { $in: filterValue };
          } else {
            query[key] = filterValue;
          }
        }
      }
    }

    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    } as const;
    const currentTime = new Intl.DateTimeFormat("en-US", options).format(now);
    query.$or = [
      { hasTime: false },
      {
        hasTime: true,
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
      },
    ];
    query.approved = "completed";
    query.approvedByAdmin = "completed";
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "wishlists",
          let: {
            productId: "$_id",
            customerId: customerId ? customerId : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productId"] },
                    customerId
                      ? { $eq: ["$customerId", "$$customerId"] }
                      : { $eq: [1, 0] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "wishlistItems",
        },
      },
      {
        $addFields: {
          isWishlist: { $gt: [{ $size: "$wishlistItems" }, 0] },
        },
      },
      { $unset: "wishlistItems" },

      {
        $lookup: {
          from: "carts",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $in: ["$$productId", "$items.productId"] },
                  ],
                },
              },
            },
            {
              $project: {
                items: {
                  $filter: {
                    input: "$items",
                    as: "item",
                    cond: { $eq: ["$$item.productId", "$$productId"] },
                  },
                },
              },
            },
          ],
          as: "cartItems",
        },
      },
      {
        $addFields: {
          cartQuantity: {
            $cond: {
              if: { $gt: [{ $size: "$cartItems" }, 0] },
              then: {
                $sum: {
                  $map: {
                    input: "$cartItems",
                    as: "cartItem",
                    in: { $sum: "$$cartItem.items.quantity" },
                  },
                },
              },
              else: 0,
            },
          },
          selectedVariant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$variants",
                  as: "variant",
                  cond: {
                    $eq: [
                      { $arrayElemAt: ["$cartItems.items.variantId", 0] },
                      ["$$variant._id"],
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      { $unset: "cartItems" },
      {
        $lookup: {
          from: "addonmetadatas",
          localField: "addOns",
          foreignField: "_id",
          as: "addOnDetails",
        },
      },
      {
        $lookup: {
          from: "merchantproducts",
          localField: "addOnDetails.addon",
          foreignField: "_id",
          as: "resolvedAddons",
        },
      },
      {
        $addFields: {
          addOns: {
            $map: {
              input: "$addOnDetails",
              as: "addonDetail",
              in: {
                _id: "$$addonDetail._id",
                groupName: "$$addonDetail.groupName",
                minSelection: "$$addonDetail.minSelection",
                maxSelection: "$$addonDetail.maxSelection",
                createdAt: "$$addonDetail.createdAt",
                updatedAt: "$$addonDetail.updatedAt",
                choices: {
                  $filter: {
                    input: "$resolvedAddons",
                    as: "addon",
                    cond: {
                      $in: ["$$addon._id", "$$addonDetail.addon"],
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $unset: "addOnDetails" },
      { $unset: "resolvedAddons" },
      {
        $lookup: {
          from: "carts",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$customerId", "$$customerId"] },
              },
            },
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.productId", "$$productId"] },
              },
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
              $project: {
                selectedAddOns: {
                  $map: {
                    input: "$groupDetails",
                    as: "group",
                    in: {
                      _id: "$$group._id",
                      groupName: "$$group.groupName",
                      minSelection: "$$group.minSelection",
                      maxSelection: "$$group.maxSelection",
                      createdAt: "$$group.createdAt",
                      updatedAt: "$$group.updatedAt",
                      choices: {
                        $map: {
                          input: "$items.addons",
                          as: "addon",
                          in: {
                            $arrayElemAt: ["$choiceDetails", 0],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            // {
            //   $addFields: {
            //     // Get the last selected addon from the array of selected addons
            //     lastSelectedAddon: { $arrayElemAt: ["$selectedAddOns", -1] },
            //   },
            // },
            // {
            //   $project: {
            //     // Return only the last selected addon
            //     selectedAddOns: "$lastSelectedAddon",
            //   },
            // },
          ],
          as: "selectedAddOns",
        },
      }
      ,
      {
        $lookup: {
          from: "productcategorymetadata",
          localField: "tags",
          foreignField: "_id",
          as: "productCategoryMetaDataDetails",
        },
      },
      {
        $addFields: {
          selectedAddOns: {
            $arrayElemAt: ["$selectedAddOns.selectedAddOns", 0],
          },
        },
      },
    ];

    if (Array.isArray(sort)) {
      const sortCriteria: any = {};
      sort.forEach((sortField) => {
        const [field, direction] = sortField.split("_");
        sortCriteria[field] = direction === "asc" ? 1 : -1;
      });
      pipeline.push({ $sort: sortCriteria });
    }
    if (pagination !== "false") {
      const page = pageNumber > 0 ? pageNumber : 1;
      const limit = limitNumber > 0 ? limitNumber : 10;
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }
    const products = await MerchantProduct.aggregate(pipeline).exec();
    const total = await MerchantProduct.countDocuments(query).exec();
    const pages = Math.ceil(total / (limitNumber > 0 ? limitNumber : 10));
    const page = pageNumber > 0 ? pageNumber : 1;

    return {
      total,
      pages,
      page,
      limit: pagination === "false" ? products.length : limitNumber,
      data: products,
    };
  }

  async getMerchantProductByCategory(
    categoryId: string
  ): Promise<MerchantProductDoc[]> {
    return await MerchantProduct.find({ categoryId });
  }

  async getMerchantsProductsBymerchantId(
    merchantId: string,
    categoryId: string,
    customerId: string,
    isAddon: boolean
  ): Promise<MerchantProductDoc[]> {
    const query: any = {};

    if (merchantId && Types.ObjectId.isValid(merchantId)) {
      query.merchantId = new Types.ObjectId(merchantId);
    }

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new Types.ObjectId(categoryId);
    }

    if (isAddon) {
      query.isAddon = isAddon;
    }

    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    } as const;
    const currentTime = new Intl.DateTimeFormat("en-US", options).format(now);

    query.$or = [
      { hasTime: false },
      {
        hasTime: true,
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
      },
    ];
    query.approved = "completed";
    query.approvedByAdmin = "completed"; // Ensure this matches the create logic

    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "aggregatorproducts",
          localField: "aggregatorProductId",
          foreignField: "_id",
          as: "aggregatorProductDetails",
        },
      },
      {
        $unwind: {
          path: "$aggregatorProductDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          aggregatorProductId: {
            _id: "$aggregatorProductDetails._id",
            name: "$aggregatorProductDetails.productTitle",
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          categoryId: {
            _id: "$categoryDetails._id",
            name: "$categoryDetails.name",
          },
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategories",
        },
      },
      { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          subCategoryId: {
            _id: "$subCategories._id",
            name: "$subCategories.name",
          },
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productId"] },
                    customerId
                      ? { $eq: ["$customerId", "$$customerId"] }
                      : { $eq: [1, 0] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "wishlistItems",
        },
      },
      { $addFields: { isWishlist: { $gt: [{ $size: "$wishlistItems" }, 0] } } },
      { $unset: "wishlistItems" },
      {
        $lookup: {
          from: "carts",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $in: ["$$productId", "$items.productId"] },
                  ],
                },
              },
            },
            {
              $project: {
                items: {
                  $filter: {
                    input: "$items",
                    as: "item",
                    cond: { $eq: ["$$item.productId", "$$productId"] },
                  },
                },
              },
            },
          ],
          as: "cartItems",
        },
      },
      {
        $addFields: {
          cartQuantity: {
            $cond: {
              if: { $gt: [{ $size: "$cartItems" }, 0] },
              then: {
                $sum: {
                  $map: {
                    input: "$cartItems",
                    as: "cartItem",
                    in: { $sum: "$$cartItem.items.quantity" },
                  },
                },
              },
              else: 0,
            },
          },
        },
      },
      { $unset: "cartItems" },
    ];

    return await MerchantProduct.aggregate(pipeline).exec();
  }

  async getMerchantsProductsBymerchantIdv2(
    merchantId: string,
    categoryId: string,
    customerId: string,
    isAddon: boolean
  ): Promise<MerchantProductDoc[]> {
    const query: any = {};

    if (merchantId && Types.ObjectId.isValid(merchantId)) {
      query.merchantId = new Types.ObjectId(merchantId);
    }

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new Types.ObjectId(categoryId);
    }

    if (isAddon) {
      query.isAddon = isAddon;
    }

    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    } as const;
    const currentTime = new Intl.DateTimeFormat("en-US", options).format(now);

    query.$or = [
      { hasTime: false },
      {
        hasTime: true,
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
      },
    ];

    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "aggregatorproducts",
          localField: "aggregatorProductId",
          foreignField: "_id",
          as: "aggregatorProductDetails",
        },
      },
      {
        $unwind: {
          path: "$aggregatorProductDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          aggregatorProductId: {
            _id: "$aggregatorProductDetails._id",
            name: "$aggregatorProductDetails.productTitle",
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          categoryId: {
            _id: "$categoryDetails._id",
            name: "$categoryDetails.name",
          },
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategories",
        },
      },
      { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          subCategoryId: {
            _id: "$subCategories._id",
            name: "$subCategories.name",
          },
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productId"] },
                    customerId
                      ? { $eq: ["$customerId", "$$customerId"] }
                      : { $eq: [1, 0] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "wishlistItems",
        },
      },
      { $addFields: { isWishlist: { $gt: [{ $size: "$wishlistItems" }, 0] } } },
      { $unset: "wishlistItems" },
      {
        $lookup: {
          from: "carts",
          let: {
            productId: "$_id",
            customerId: customerId ? new Types.ObjectId(customerId) : null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $in: ["$$productId", "$items.productId"] },
                  ],
                },
              },
            },
            {
              $project: {
                items: {
                  $filter: {
                    input: "$items",
                    as: "item",
                    cond: { $eq: ["$$item.productId", "$$productId"] },
                  },
                },
              },
            },
          ],
          as: "cartItems",
        },
      },
      {
        $addFields: {
          cartQuantity: {
            $cond: {
              if: { $gt: [{ $size: "$cartItems" }, 0] },
              then: {
                $sum: {
                  $map: {
                    input: "$cartItems",
                    as: "cartItem",
                    in: { $sum: "$$cartItem.items.quantity" },
                  },
                },
              },
              else: 0,
            },
          },
        },
      },

      { $unset: "cartItems" },
    ];

    return await MerchantProduct.aggregate(pipeline).exec();
  }
  async addVariantToProduct(
    productId: string,
    variant: VariantDTO
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $push: { variants: variant } },
      { new: true }
    ).exec();
  }

  async updateVariantInProduct(
    productId: string,
    variantId: string,
    variantData: Partial<VariantDTO>
  ): Promise<MerchantProductDoc | null> {
    const updateFields = Object.keys(variantData).reduce((acc, key) => {
      acc[`variants.$.${key}`] = (variantData as any)[key];
      return acc;
    }, {} as any);
    return await MerchantProduct.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $set: updateFields },
      { new: true }
    ).exec();
  }

  async deleteVariantFromProduct(
    productId: string,
    variantId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $pull: { variants: { _id: variantId } } },
      { new: true }
    ).exec();
  }

  async addAddOnToProduct(
    productId: string,
    addOnId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $push: { addOns: addOnId } },
      { new: true }
    ).exec();
  }

  async removeAddOnFromProduct(
    productId: string,
    addOnId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $pull: { addOns: addOnId } },
      { new: true }
    ).exec();
  }

  async addTagsToProduct(
    productId: string,
    tagsId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $push: { tags: tagsId } },
      { new: true }
    ).exec();
  }

  async removeTagsFromProduct(
    productId: string,
    tagsId: string
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      productId,
      { $pull: { tags: tagsId } },
      { new: true }
    ).exec();
  }

  async setMerchantProductActiveStatus(
    merchantproductId: string,
    isActive: boolean
  ): Promise<MerchantProductDoc | null> {
    return await MerchantProduct.findByIdAndUpdate(
      merchantproductId,
      { isActive },
      { new: true }
    ).exec();
  }

  async approveMerchantProduct(
    merchantproductId: string,
    approvedByAdmin: ApprovalStatus
  ): Promise<MerchantProductDoc | null> {
    const id = Types.ObjectId.isValid(merchantproductId)
      ? new Types.ObjectId(merchantproductId)
      : null;
    if (!id) {
      throw new Error("Invalid merchant product ID");
    }
    const existingProduct = await MerchantProduct.findById(id);
    if (!existingProduct) {
      throw new Error("Merchant product not found");
    }
    return await MerchantProduct.findByIdAndUpdate(
<<<<<<< HEAD
      merchantproductId,
      { approvedByAdmin },  
=======
      id,
      { approvedByAdmin: approvalStatus },
>>>>>>> 9314af80bd8f9afe1df85255d67cff3700af1fd0
      { new: true }
    ).exec();
  }
}

export const merchantproductRepository = new MerchantProductRepository();
